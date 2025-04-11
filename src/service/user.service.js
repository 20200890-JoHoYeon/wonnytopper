const bcrypt = require("bcrypt");
const { executeQuery } = require("../repository");

const userService = {
  logout: (req, res) => {
    req.session.destroy();
    res.clearCookie("topper");
    res.redirect("/admin/index");
  },
  register: async (req, res) => {
    try {
      const { id, pwd, name } = req.body;

      const findUser = await executeQuery(
        "SELECT * FROM tbl_admin WHERE id = ?",
        id
      );
      if (findUser.length > 0) {
        res.status(400).json({
          code: 400,
          message: "이미 존재하는 ID 입니다.",
          data: false,
        });
        return;
      }

      const hash = await bcrypt.hash(pwd, 10);

      await executeQuery(
        "INSERT INTO tbl_admin(id, pwd, name) VALUES(?,?,?)",
        [id, hash, name]
      );

      res.status(200).json({
        code: 200,
        message: "회원가입 성공",
        data: true,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        code: 500,
        message: "회원가입 실패",
        data: false,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { id, pwd, isAuto } = req.body;

      const findUser = await executeQuery(
        "SELECT * FROM tbl_admin WHERE id = ?",
        id
      );

      if (findUser.length < 1) {
        res.status(400).json({
          code: 400,
          message: "유저를 찾을 수 없습니다.",
          data: false
        });

        return;
      }

      const result = await bcrypt.compare(pwd, findUser[0].pwd);
      if (!result) {
        res.status(400).json({
          code: 400,
          message: "패스워드가 틀립니다.",
          data: false
        });
        return;
      }

      req.session.user = {
        id: findUser[0].admin_id,
      };

      if (isAuto) {
        res.cookie("topper", findUser[0].admin_id, { maxAge: 60 * 60 * 24 * 14 });
      } else {
        req.session.cookie.expires = new Date(Date.now() + 60 * 60 * 1000); // 1시간
      }

      res.status(200).json({
        code: 200,
        message: "로그인 성공",
        data: {
          admin_id: findUser[0].admin_id,
          id: findUser[0].id,
          name: findUser[0].name
        },
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "에러가 발생하였습니다.", data: err, code: 500 });
    }
  },
};

module.exports = userService;
