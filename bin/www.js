// const express = require("express");
// const https = require("https");
// const fs = require("fs");
// const app = require("../index");
// // app.get("/index", function (req, res) {});
// const httpsOptions = {
//   key: fs.readFileSync("./certification/cert.key"),
//   cert: fs.readFileSync("./certification/cert.pem"),
// };
// const PORT = 3000;
// const port = 3000;
// https.createServer(httpsOptions, app).listen(port);
// console.log(`Running on ${PORT}`);

"ues strict";

const app = require("../index");

const port = 3000;

app.listen(port, () => {
  //console.log(`express server running on port ${port}`);
});
