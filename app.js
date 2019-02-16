const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");

const app = express();

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

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server start at port ${port}`));
