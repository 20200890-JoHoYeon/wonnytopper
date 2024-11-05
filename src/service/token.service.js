const { executeQuery } = require("../repository");
const fs = require('fs');

const tokenService = {
  select: async (req, res) => { // 조회
    try {
      const { token_kind } = req.params;

      let sql;
      if (token_kind == null) {
        sql = `SELECT * FROM tbl_token`;
      } else {
        sql = `SELECT * FROM tbl_token WHERE token_kind = ?`;
      }
      
      const response = await executeQuery(sql, [token_kind]);

      res.status(200).json({
        code: 200,
        message: "토큰 조회에 성공하였습니다.",
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
      let data = {};

      if(req.body.token != undefined && req.body.token != ''&& req.body.token != null) {
        data.token = req.body.token;
      } else {
        throw error;
      }

      if(req.body.token_kind != undefined && req.body.token_kind != ''&& req.body.token_kind != null) {
        data.token_kind = req.body.token_kind;
      } else {
        throw error;
      }

      const sql = `INSERT INTO tbl_token SET ?`;
      const saveAnswer = await executeQuery(sql, data);
      
      res.status(200).json({
        code: 200,
        message: "토큰 등록에 성공하였습니다.",
        data: true,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },
  update: async (req, res) => { // 수정
    try {
      let data = {};

      if(req.body.token != undefined && req.body.token != ''&& req.body.token != null) {
        data.token = req.body.token;
      } else {
        throw error;
      }

      if(req.body.token_kind != undefined && req.body.token_kind != ''&& req.body.token_kind != null) {
        data.token_kind = req.body.token_kind;
      } else {
        throw error;
      }

      let sql = `UPDATE tbl_token SET token = ? WHERE token_kind = ?`;

      const saveAnswer = await executeQuery(sql, [
        data.token,
        data.token_kind
      ]);

      res.status(200).json({
        code: 200,
        message: "토큰 수정에 성공하였습니다.",
        data: saveAnswer,
      });
    } catch (err) {
        console.error(err);
        res
          .status(500)
          .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
      }
  },
};

module.exports = tokenService;
