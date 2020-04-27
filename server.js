// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const env = require("dotenv").config();

const apiRoutes = require("./routes/api.js");

const app = express();

app.use("/public", express.static(process.cwd() + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static("public"));

app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

apiRoutes(app);

// send the default array of dreams to the webpage
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

// tao random port
// const listener = app.listen(process.env.PORT, () => {
//   console.log("Your app is listening on port " + listener.address().port);
// });

//create fixed port
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
});

module.exports = app;
