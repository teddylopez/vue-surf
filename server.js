var express = require("express");
var path = require("path");
var serveStatic = require("serve-static");
const cors = require("cors");
const app = express();
// app.use(serveStatic(__dirname + "/dist"));
const buildLocation = "dist";
app.use(express.static(`${buildLocation}`));
app.use((req, res, next) => {
  if (!req.originalUrl.includes(buildLocation)) {
    res.sendFile(`${__dirname}/${buildLocation}/index.html`);
  } else {
    next();
  }
});

var port = process.env.PORT || 5000;
app.listen(port);
console.log("server started " + port);
