const { executeQuery } = require("../repository");
const fs = require('fs');

const contentService = {
  search: async (req, res) => { // 검색
    try {
      const { category, search_word, sort, exposure_yn, page, pageSize, category_m } = req.body;
      let { from_date, to_date } = req.body;
      const offset = (page - 1) * pageSize; // OFFSET 값 계산
      let sql, sql2;
      sql2 = `SELECT COUNT(*) AS count FROM (`;
      sql = `
        SELECT 
          ct.*
        FROM tbl_content ct
        WHERE ct.del_yn = 'N'
      `;
      
      if(from_date != null && to_date != null) {
        from_date += ' 00:00:00';
        to_date += ' 23:59:59';
        sql += `AND ct.reg_date BETWEEN '${from_date}' AND '${to_date}' `;
      }
      
      if(category != null) {
        sql += `AND ct.category IN (`;
        for(i = 0;  i < category.length; i++) {
          sql += category[i];
          if(i+1 < category.length) {
            sql += `, `;
          }
        }
        sql += `) `;
      }
      
      if(category_m != null && category_m.length > 0) {
        sql += `AND ct.category_m IN (`;
        for(i = 0;  i < category_m.length; i++) {
          sql += category_m[i];
          if(i+1 < category_m.length) {
            sql += `, `;
          }
        }
        sql += `) `;
      }

      if(search_word != null) {
        sql += `AND ct.title LIKE '%${search_word}%' `;
      }

      if(exposure_yn != null) {
        sql += `AND ct.exposure_yn IN (`;
        for(i = 0;  i < exposure_yn.length; i++) {
          sql += `'` + exposure_yn[i];
          if(i+1 < exposure_yn.length) {
            sql += `', `;
          }
        }
        sql += `') `;
      }

      sql += `ORDER BY ct.reg_date ${sort}, ct.content_id DESC `;
      sql2 += sql + `) a`;
      sql += `LIMIT ${pageSize} OFFSET ${offset}`;
      
      const response = await executeQuery(sql);
      const count = await executeQuery(sql2);
      let result = {'content': response, 'count': count[0].count};

      res.status(200).json({
        code: 200,
        message: "컨텐츠 검색에 성공하였습니다.",
        data: result,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },
  select: async (req, res) => { // 조회
    try {
      const { content_id } = req.params;

      let sql;
      if (content_id == null) {
        sql = `SELECT * FROM tbl_content WHERE del_yn = 'N'`;
      } else {
        sql = `
          SELECT 
            ct.*,
            fl1.url AS file_main_id_url,
            fl2.url AS file_1_id_url,
            fl3.url AS file_2_id_url,
            fl4.url AS file_3_id_url,
            fl5.url AS file_4_id_url,
            fl1.origin_name AS file_main_id_origin_name,
            fl2.origin_name AS file_1_id_origin_name,
            fl3.origin_name AS file_2_id_origin_name,
            fl4.origin_name AS file_3_id_origin_name,
            fl5.origin_name AS file_4_id_origin_name
          FROM tbl_content ct
          LEFT JOIN tbl_file fl1 ON fl1.file_id = ct.file_main_id AND fl1.del_yn = 'N'
          LEFT JOIN tbl_file fl2 ON fl2.file_id = ct.file_1_id AND fl2.del_yn = 'N'
          LEFT JOIN tbl_file fl3 ON fl3.file_id = ct.file_2_id AND fl3.del_yn = 'N'
          LEFT JOIN tbl_file fl4 ON fl4.file_id = ct.file_3_id AND fl4.del_yn = 'N'
          LEFT JOIN tbl_file fl5 ON fl5.file_id = ct.file_4_id AND fl5.del_yn = 'N'
          WHERE ct.del_yn = 'N' AND ct.content_id = ?;
        `;
      }
      
      const response = await executeQuery(sql, [content_id]);

      res.status(200).json({
        code: 200,
        message: "컨텐츠 조회에 성공하였습니다.",
        data: response,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },
  insert: async (req, res) => { // 등록
    try {
      const data = {
        admin_id: req.session.user.id,
        file_main_id: req.body.file_main_id,
        file_1_id: req.body.file_1_id,
        file_2_id: req.body.file_2_id,
        file_3_id: req.body.file_3_id,
        file_4_id: req.body.file_4_id,
        category: req.body.category,
        title: req.body.title,
        note: req.body.note,
        exposure_yn: req.body.exposure_yn
      };

      if(req.body.reg_date != undefined && req.body.reg_date != ''&& req.body.reg_date != null) {
        data.reg_date = req.body.reg_date;
      }

      if(req.body.category == 1) {
        if(req.body.category_m != undefined && req.body.category_m != ''&& req.body.category_m != null) {
          data.category_m = req.body.category_m;
        }
      }

      const sql = `INSERT INTO tbl_content SET ?`;
      const saveAnswer = await executeQuery(sql, data);
      
      res.status(200).json({
        code: 200,
        message: "컨텐츠 등록에 성공하였습니다.",
        data: true,
      });
    } catch (err) {
      let message;

      if(req.session.user == undefined) {
        message = "유저 세션이 존재하지 않습니다."
      } else {
        message = "에러가 발생하였습니다.";
      }

      console.error(err);
      res
        .status(500)
        .json({ message: message, data: err, code: 500 });
    }
  },
  update: async (req, res) => { // 수정
    try {
      // 수정
      const data = {
        admin_id: req.session.user.id,
        content_id: req.body.content_id,
        file_main_id: req.body.file_main_id,
        file_1_id: req.body.file_1_id,
        file_2_id: req.body.file_2_id,
        file_3_id: req.body.file_3_id,
        file_4_id: req.body.file_4_id,
        category: req.body.category,
        title: req.body.title,
        note: req.body.note,
        exposure_yn: req.body.exposure_yn,
        reg_date : req.body.reg_date,
        category_m: req.body.category_m
      };

      let sql = `UPDATE tbl_content SET category = ?, title = ?, note = ?`;
      if(data.reg_date != null) {
        sql += `, reg_date = '${data.reg_date}' `;
      }
      
      if(data.exposure_yn != null) {
        sql += `, exposure_yn = '${data.exposure_yn}' `;
      }

      if(data.category == 1) {
        if(data.category_m != null) {
          sql += `, category_m = '${data.category_m}' `;
        } else {
          sql += `, category_m = null `;
        }
      } else {
        sql += `, category_m = null `;
      }

      sql += ` 
        , file_main_id = ?, file_1_id = ?, file_2_id = ?, file_3_id = ?, file_4_id = ?
        WHERE content_id = ? AND admin_id = ? AND del_yn = 'N'
      `;

      const saveAnswer = await executeQuery(sql, [
        data.category,
        data.title,
        data.note,
        data.file_main_id,
        data.file_1_id,
        data.file_2_id,
        data.file_3_id,
        data.file_4_id,
        data.content_id,
        data.admin_id,
      ]);

      res.status(200).json({
        code: 200,
        message: "컨텐츠 수정에 성공하였습니다.",
        data: saveAnswer,
      });
    } catch (err) {
      let message;

      if(req.session.user == undefined) {
        message = "유저 세션이 존재하지 않습니다."
      } else {
        message = "에러가 발생하였습니다.";
      }

      console.error(err);
      res
        .status(500)
        .json({ message: message, data: err, code: 500 });
    }
  },
  delete: async (req, res) => { // 삭제
    try {
      const data = {
        admin_id: req.session.user.id,
        content_id: req.body.content_id
      };

      let sql = `UPDATE tbl_content SET del_yn = 'Y' WHERE admin_id = ? `;

      if(data.content_id != null) {
        sql += `AND content_id IN (`;
        for(i = 0;  i < data.content_id.length; i++) {
          sql += data.content_id[i];
          if(i+1 < data.content_id.length) {
            sql += `, `;
          }
        }
        sql += `) `;
      }

      let response = await executeQuery(sql,[data.admin_id]);

      sql = `UPDATE tbl_file fl LEFT JOIN tbl_content ct ON ct.admin_id = ? `;
      sql += `AND ct.content_id IN (`;
      for(i = 0;  i < data.content_id.length; i++) {
        sql += data.content_id[i];
        if(i+1 < data.content_id.length) {
          sql += `, `;
        }
      }
      sql += `
        ) SET fl.del_yn = 'Y'
        WHERE fl.file_id IN (ct.file_main_id, ct.file_1_id, ct.file_2_id, ct.file_3_id, ct.file_4_id)
      `;
      response = await executeQuery(sql,[data.admin_id]);

      sql = `
        SELECT 
          fl.file_id,
          fl.url
        FROM tbl_file fl 
        JOIN tbl_content ct 
        ON ct.admin_id = 1
        AND ct.content_id IN (
      `;
      for(i = 0;  i < data.content_id.length; i++) {
        sql += data.content_id[i];
        if(i+1 < data.content_id.length) {
          sql += `, `;
        }
      }
      sql += `
        ) WHERE fl.file_id IN (ct.file_main_id, ct.file_1_id, ct.file_2_id, ct.file_3_id, ct.file_4_id)
      `;
      response = await executeQuery(sql);

      let filePath;
      if (response[0]) { // 이미지 존재 여부 확인
        try {
          for (let i = 0; i < response.length; i++) {
            filePath = response[i].url;
      
            // 파일 삭제
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(err);
              }
            });
          }
          res.status(200).json({
            code: 200,
            message: '컨텐츠 삭제 성공',
            data: response
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({
            code: 500,
            message: '이미지 삭제 실패',
            data: err
          });
        }
      } else {
        res.status(200).json({
          code: 200,
          message: '컨텐츠 삭제 성공',
          data: true
        });
      }
    } catch (err) {
      let message;

      if(req.session.user == undefined) {
        message = "유저 세션이 존재하지 않습니다."
      } else {
        message = "에러가 발생하였습니다.";
      }

      console.error(err);
      res
        .status(500)
        .json({ message: message, data: err, code: 500 });
    }
  },
  findGallery: async (req, res) => {
    try {
      const { page, pageSize, category, category_m } = req.body;
      const offset = (page - 1) * pageSize; // OFFSET 값 계산

      let sql = `
        SELECT 
          ct.content_id, 
          ct.title, 
          fl1.url AS file_main_id_url
        FROM tbl_content ct
        LEFT JOIN tbl_file fl1 ON fl1.file_id = ct.file_main_id AND fl1.del_yn = 'N'
        WHERE ct.del_yn = 'N'
        AND ct.exposure_yn = 'Y'
      `;

      if(category != null) {
        sql += `AND ct.category IN (`;
        for(i = 0;  i < category.length; i++) {
          sql += category[i];
          if(i+1 < category.length) {
            sql += `, `;
          }
        }
        sql += `) `;
      }

      if(category == 1) {
        if(category_m != null && category_m.length > 0) {
          sql += `AND ct.category_m IN (`;
          for(i = 0;  i < category_m.length; i++) {
            sql += category_m[i];
            if(i+1 < category_m.length) {
              sql += `, `;
            }
          }
          sql += `) `;
        }
      }
      
      sql += `ORDER BY ct.reg_date DESC `;

      if(pageSize != null && page != null) {
        sql += `LIMIT ${pageSize} OFFSET ${offset};`;
      }
      const response = await executeQuery(sql);

      res.status(200).json({
        code: 200,
        message: "조회에 성공하였습니다.",
        data: response,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },
};

module.exports = contentService;
