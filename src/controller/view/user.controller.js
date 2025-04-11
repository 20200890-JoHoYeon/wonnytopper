const express = require("express");
const router = express.Router();

// router.get("/", (req, res) => {
//   res.render("test");
// });

router.get("/main", (req, res) => {
  res.render("main", { user: req.session.user });
});

//사용자 페이지
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/balloon", (req, res) => {
  res.render("balloon");
});

router.get("/print-balloon", (req, res) => {
  res.render("print-balloon");
});

router.get("/class/guide", (req, res) => {
  res.render("class-guide");
});

router.get("/lettering", (req, res) => {
  res.render("lettering");
});

router.get("/class", (req, res) => {
  res.render("class");
});

router.get("/facepainting", (req, res) => {
  res.render("facepainting");
});

router.get("/pierrot", (req, res) => {
  res.render("pierrot");
});

router.get("/topper", (req, res) => {
  res.render("topper");
});

router.get("/qna", (req, res) => {
  res.render("qna");
});

router.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(
    "User-agent: *\nAllow: /\nDisallow: /admin/ \nDisallow: /sitemap \nsitemap: https://web.wonnytopper.co.kr/sitemap.xml"
  );
});

router.get("/sitemap.xml", (req, res) => {
  res.type("text/plain");
  res.send(`<?xml version="1.0" encoding="utf-8" standalone="yes" ?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://web.wonnytopper.co.kr/</loc>
    </url>
    <url>
      <loc>https://web.wonnytopper.co.kr/balloon</loc>
    </url>
    <url>
      <loc>https://web.wonnytopper.co.kr/lettering</loc>
    </url>
    <url>
      <loc>https://web.wonnytopper.co.kr/print-balloon</loc>
    </url>
    <url>
      <loc>https://web.wonnytopper.co.kr/topper</loc>
    </url>
    <url>
      <loc>https://web.wonnytopper.co.kr/pierrot</loc>
    </url>
    <url>
      <loc>https://web.wonnytopper.co.kr/class</loc>
    </url>
    <url>
      <loc>https://web.wonnytopper.co.kr/qna</loc>
    </url>
  </urlset>`);
});

module.exports = router;
