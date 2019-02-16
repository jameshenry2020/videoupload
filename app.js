const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");

const app = express();

//setting the ejs view engine
app.set("view engine", "ejs");
// set the static folder
app.use(express.static(path.join(__dirname, "public")));
// database setup and connection
let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  passward: "",
  database: "fileupload"
});

db.connect(err => {
  if (err) {
    console.log(err);
  } else {
    console.log("connection established successfully");
  }
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/upload", (req, res) => {
  res.render("upload");
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server start at port ${port}`));
