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
  limits: { fileSize: 10000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("myVideo");

function checkFileType(file, cb) {
  const fileTypes = /mp4|avi/;

  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype = fileTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: videos only");
  }
}

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
  let sql = "SELECT * FROM uploads";
  db.query(sql, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { files });
    }
  });
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
      if (req.file == undefined) {
        res.render("upload", {
          msg: "Error: no file selected"
        });
      } else {
        const title = req.body.title;
        let { filename, path } = req.file;
        const post = {
          title: title,
          filename: filename,
          filepath: path
        };
        let sql = "INSERT INTO uploads SET ?";
        let query = db.query(sql, post, (err, result) => {
          if (err) {
            res.render("upload", {
              msg: err
            });
          } else {
            console.log(result);
            res.render("index", { msg: "video uploaded successfully" });
          }
        });
      }
    }
  });
});
app.get("/watch/:video_id", (req, res) => {
  const id = req.params.video_id;
  let sql = `SELECT * FROM uploads WHERE id = ${id}`;
  let query = db.query(sql, (err, file) => {
    if (err) {
      console.log(err);
    } else {
      res.render("video", {
        file
      });
    }
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server start at port ${port}`));
