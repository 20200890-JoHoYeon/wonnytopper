const sendMail = require("../utils/mail");
const { executeQuery } = require("../repository");

const counselService = {
  select: async (req, res) => { // 조회, 검색
    try {
      const { counsel_id } = req.params;
      const { purpose, search_word, sort, page, pageSize, answer_yn } = req.body;
      let { from_date, to_date } = req.body;
      const offset = (page - 1) * pageSize; // OFFSET 값 계산
      let sql, sql2;
      
      let response;
      let result;
      if (counsel_id == null) {
        sql2 = `SELECT COUNT(*) AS count FROM (`;
        sql = `
          SELECT 
            cs.*,
            if(aw.answer_id IS NOT NULL, 'Y', 'N') AS answer_yn,
            if(aw.answer_id IS NOT NULL, aw.reg_date, NULL) AS answer_date
          FROM tbl_counsel cs
          LEFT JOIN tbl_answer aw
          ON aw.counsel_id = cs.counsel_id
          WHERE cs.del_yn = 'N'
        `;

        if(answer_yn != null) {
          sql += `AND if(aw.answer_id IS NOT NULL, 'Y', 'N') IN (`;
          for(i = 0;  i < answer_yn.length; i++) {
            sql += `'` + answer_yn[i] + `'`;
            if(i+1 < answer_yn.length) {
              sql += `, `;
            }
          }
          sql += `) `;
        }

        if(from_date != null && to_date != null) {
          from_date += ' 00:00:00';
          to_date += ' 23:59:59';
          sql += `AND cs.reg_date BETWEEN '${from_date}' AND '${to_date}' `;
        }

        if(purpose != null) {
          sql += `AND cs.purpose IN (`;
          for(i = 0;  i < purpose.length; i++) {
            sql += purpose[i];
            if(i+1 < purpose.length) {
              sql += `, `;
            }
          }
          sql += `) `;
        }
        if(search_word != null) {
          sql += `AND (cs.detail LIKE '%${search_word}%' `;
          sql += `OR cs.name LIKE '%${search_word}%') `;
        }
        
        sql += `ORDER BY cs.reg_date ${sort} `;
        sql2 += sql + `) a`;
        sql += `LIMIT ${pageSize} OFFSET ${offset}`;

        response = await executeQuery(sql);
        const count = await executeQuery(sql2);
        result = {'counsel': response, 'count': count[0].count};
      } else {
        sql = `
          SELECT 
            cs.*,
            fl2.origin_name AS counsel_file_origin_name,
            fl2.url AS counsel_file_url,
            if(aw.answer_id IS NOT NULL, 'Y', 'N') AS answer_yn,
            if(aw.answer_id IS NOT NULL, aw.reg_date, NULL) AS answer_date,
            aw.answer_id,
            aw.file_id AS answer_file_id,
            aw.detail AS answer_detail,
            ct.title AS content_title,
            fl1.origin_name AS answer_file_origin_name,
            fl1.url AS answer_file_url
          FROM tbl_counsel cs
          LEFT JOIN tbl_answer aw ON aw.counsel_id = cs.counsel_id
          LEFT JOIN tbl_content ct ON ct.content_id = cs.content_id
          LEFT JOIN tbl_file fl1 ON fl1.file_id = aw.file_id AND fl1.del_yn = 'N'
          LEFT JOIN tbl_file fl2 ON fl2.file_id = ct.file_main_id AND fl2.del_yn = 'N'
          WHERE cs.del_yn = 'N'
          AND cs.counsel_id = ?
        `;
        result = await executeQuery(sql, [counsel_id]);
      }

      res.status(200).json({
        code: 200,
        message: "상담 조회에 성공하였습니다.",
        data: result,
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
  insertCounsel: async (req, res) => { // 등록
    try {
      const data = {
        name: req.body.name,
        phone_num: req.body.phone_num,
        email: req.body.email,
        location: req.body.location,
        budget: req.body.budget,
        purpose: req.body.purpose,
        detail: req.body.detail,
        agree: req.body.agree
      };

      if(req.body.content_id != undefined && req.body.content_id != '' && req.body.content_id != null) {
        data.content_id = req.body.content_id;
      }

      if(req.body.purpose == 6) {
        if(req.body.purpose_m != undefined && req.body.purpose_m != ''&& req.body.purpose_m != null) {
          data.purpose_m = req.body.purpose_m;
        }
      }

      let sql = "INSERT INTO tbl_counsel SET ?";
      let response = await executeQuery(sql, data);

      let purpose;
      if(data.purpose == 1) {
        purpose = '풍선장식';
      } else if(data.purpose == 2) {
        purpose = '메세지토퍼';
      } else if(data.purpose == 3) {
        purpose = '부스체험(토퍼, 풍선)';
      } else if(data.purpose == 4) {
        purpose = '삐에로';
      } else if(data.purpose == 5) {
        purpose = '페이스페인팅';
      } else if(data.purpose == 6) {
        purpose = '클래스';

        if(data.purpose_m == 1) {
          purpose += ' - 클래스 안내';
        } else if(data.purpose_m == 2) {
          purpose += ' - 클래스 현황';
        }
      } else if(data.purpose == 7) {
        purpose = '레터링풍선';
      } else if(data.purpose == 8) {
        purpose = '인쇄풍선';
      }

      let attachments = [];
      let mailText = '<div style="color: black;">이름 : ' + data.name;
      mailText += '<br><br>휴대폰번호 : ' + data.phone_num;
      mailText += '<br><br>이메일 : ' + data.email;
      mailText += '<br><br>장소 : ' + data.location;
      mailText += '<br><br>예산 : ' + data.budget + ' 만원';
      mailText += '<br><br>의뢰목적 : ' + purpose;


      // 해당 컨텐츠의 이미지, 제목, 카테고리
      if(data.content_id != null) {
        sql = `
          SELECT 
            ct.title, ct.file_main_id, fl.origin_name, fl.url 
          FROM tbl_content ct 
          LEFT JOIN tbl_file fl
          ON fl.file_id = ct.file_main_id
          AND fl.del_yn = 'N'
          WHERE ct.content_id = ? AND ct.del_yn = 'N'
        `;
        response = await executeQuery(sql, [data.content_id]);
      
        let setDirname = __dirname.replace(/\\/g, '/');
        setDirname = setDirname.replace('src/service', '');

        let url = response[0].url.replace(/\\/g, '/');
        
        if(response[0]) {
          mailText += '<br><br>관련컨텐츠 : ' + response[0].title;
          mailText += '<br><br>상담내용 : ' + data.detail + '</div>';
          attachments[0] = { path: url, filename: response[0].origin_name};
        } else {
          mailText += '<br><br>관련컨텐츠 : 삭제된 컨텐츠';
          mailText += '<br><br>상담내용 : ' + data.detail + '</div>';
        }
      } else {
        mailText += '<br><br>관련컨텐츠 : 없음';
        mailText += '<br><br>상담내용 : ' + data.detail + '</div>';
      }

      await sendMail(process.env.MAIL_EMAIL, '[워니토퍼] ' + data.name + '님의 문의가 도착했습니다.', mailText, attachments);

      res.status(200).json({
        code: 200,
        message: "상담문의 등록에 성공하였습니다.",
        data: true,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },
  insertAnswer: async (req, res) => {
    try {
      const data = {
        admin_id: req.session.user.id,
        counsel_id: req.body.counsel_id,
        file_id: req.body.file_id,
        detail: req.body.detail
      };

      let sql = `INSERT INTO tbl_answer SET ?`;
      let response = await executeQuery(sql, data);

      // 상담문의 내용, 관련컨텐츠, 상담답변 이미지 가져오기
      sql = `
        SELECT
          cs.purpose,
          cs.purpose_m,
          cs.detail,
          ct.title,
          fl1.origin_name,
          fl1.url,
          fl2.origin_name AS answer_origin_name,
          fl2.url AS answer_url
        FROM tbl_counsel cs

        LEFT JOIN tbl_answer aw 
        ON aw.admin_id = ?
        AND aw.answer_id = ?

        LEFT JOIN tbl_content ct
        ON ct.content_id = cs.content_id
        AND ct.del_yn = 'N'

        LEFT JOIN tbl_file fl1
        ON fl1.file_id = ct.file_main_id
        AND fl1.del_yn = 'N'

        LEFT JOIN tbl_file fl2
        ON fl2.file_id = aw.file_id
        AND fl2.del_yn = 'N'

        WHERE cs.counsel_id = aw.counsel_id
        AND cs.del_yn = 'N';
      `;
      response = await executeQuery(sql, [data.admin_id, response.insertId]);

      let purpose;
      if(response[0].purpose == 1) {
        purpose = '풍선장식';
      } else if(response[0].purpose == 2) {
        purpose = '메세지토퍼';
      } else if(response[0].purpose == 3) {
        purpose = '부스체험(토퍼, 풍선)';
      } else if(response[0].purpose == 4) {
        purpose = '삐에로';
      } else if(response[0].purpose == 5) {
        purpose = '페이스페인팅';
      } else if(response[0].purpose == 6) {
        purpose = '클래스';
        
        if(response[0].purpose_m == 1) {
          purpose += ' - 클래스 안내';
        } else if(response[0].purpose_m == 2) {
          purpose += ' - 클래스 현황';
        }
      } else if(response[0].purpose == 7) {
        purpose = '레터링풍선';
      } else if(response[0].purpose == 8) {
        purpose = '인쇄풍선';
      }

      const { detail, title, origin_name, answer_origin_name, answer_url } = response[0];
      let { url } = response[0];
      let cid;
      let attachments = [];
      
      let setDirname = __dirname.replace(/\\/g, '/');
      setDirname = setDirname.replace('src/service', '');

      if(url != undefined && url != ''&& url != null) {
        url = url.replace(/\\/g, '/');
      }

      let setDetail = '<div style="color: black;">[문의 주신 상담 내용]';
      setDetail += '<br><br>의뢰목적 : ' + purpose;

      if(title != null) { // 컨텐츠 존재
        if(origin_name != null && url != null) { // 컨텐츠 이미지 존재
          cid = 'unique@nodemailer.com';
          setDetail += '<br><br><img src="cid:unique@nodemailer.com" style="height: 300px" />';
          setDetail += '<br><br>관련컨텐츠 : ' + title;
          attachments[0] = { path: setDirname + url, filename: origin_name, cid: cid };
        } else {
          setDetail += '<br><br>관련컨텐츠 : ' + title;
        }
      } else { // 컨텐츠 미존재
        setDetail += '<br><br>관련컨텐츠 : 없음';
      }

      setDetail += '<br><br>상담내용 : ' + detail;
      setDetail += '<br><br><br>--<br><br><br>[답변 내용]';
      setDetail += '<br><br>' + data.detail + '</div>';
      
      if(answer_url != null && answer_origin_name != null) { // 문의답변 이미지 존재
        if(attachments.length > 0) {
          attachments[1] = { path: setDirname + answer_url, filename: answer_origin_name};
        } else {
          attachments[0] = { path: setDirname + answer_url, filename: answer_origin_name};
        }
      }

      await sendMail(req.body.email, "[워니토퍼] 안녕하세요! 문의 주셔서 감사합니다.", setDetail, attachments);
      res.status(200).json({
        code: 200,
        message: "답변 등록에 성공하였습니다.",
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
};

module.exports = counselService;
