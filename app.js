const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }
}).single("myVideo");

//setting the ejs view engine
app.set("view engine", "ejs");
// set the static folder
app.use(express.static(path.join(__dirname, "public")));
// database setup and connection
app.use(bodyParser.urlencoded({ extended: false }));
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

app.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("upload", {
        msg: err
      });
    } else {
      const title = req.body.title;
      console.log(req.file);
      console.log(title);
      res.send("its working");
    }
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server start at port ${port}`));
