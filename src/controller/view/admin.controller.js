const express = require("express");
const router = express.Router();
const checkSessionMiddleware = require("../../utils/sessionMiddleware");

router.get(["/index", "/", ""], (req, res) => {
  if (req.cookies.topper) {
    req.session.user = {
      id: req.cookies.user,
    };
    return res.redirect("/admin/content_main");
  }
  if (req.session.user) {
    return res.redirect("/admin/content_main");
  }
  res.render("admin/index", { user: req.session.user });
});
router.get("/content_main", checkSessionMiddleware, (req, res) => {
  res.render("admin/content_main", { user: req.session.user });
});
router.get("/content_register", checkSessionMiddleware, (req, res) => {
  res.render("admin/content_register", { user: req.session.user });
});
router.get("/content_edit", checkSessionMiddleware, (req, res) => {
  res.render("admin/content_edit", { user: req.session.user });
});
router.get("/content_detail", checkSessionMiddleware, (req, res) => {
  res.render("admin/content_detail", { user: req.session.user });
});
router.get("/consultation_main", checkSessionMiddleware, (req, res) => {
  res.render("admin/consultation_main", { user: req.session.user });
});
router.get("/instagram_main", checkSessionMiddleware, (req, res) => {
  res.render("admin/instagram_main", { user: req.session.user });
});
router.get("/common/sidebar", checkSessionMiddleware, (req, res) => {
  res.render("admin/common/sidebar", { user: req.session.user });
});
router.get("/common/topbar", checkSessionMiddleware, (req, res) => {
  res.render("admin/common/topbar", { user: req.session.user });
});
router.get("/common/footer", checkSessionMiddleware, (req, res) => {
  res.render("admin/common/footer", { user: req.session.user });
});

module.exports = router;
