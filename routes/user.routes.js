let express = require("express"),
  multer = require("multer"),
  mongoose = require("mongoose"),
  uuidv4 = require("uuid/v4"),
  router = express.Router();

const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    cb(null, uuidv4() + "-" + fileName);
  }
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
    // if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
    //     cb(null, true);
    // } else {
    //     cb(null, false);
    //     return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    // }
  }
});

// User model
let User = require("../models/User");

router.post("/deleteFolderContent", (req, res) => {
  User.deleteMany({ ruta: req.body.slug }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });
});

router.post("/user-profile", upload.single("profileImg"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name: req.file.filename,
    size: req.file.size,
    type: req.file.mimetype,
    title: req.body.title,
    ruta: req.body.ruta,
    date: req.body.fecha,
    description: req.body.description,
    original: req.file.originalname,
    profileImg: url + "/public/" + req.file.filename
  });
  user
    .save()
    .then(result => {
      res.status(201).json({
        message: "Document registered successfully!",
        userCreated: {
          _id: result._id,
          name: result.name,
          profileImg: result.profileImg,
          title: result.title,
          date: result.fecha,
          description: result.description
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/", (req, res, next) => {
  User.find().then(data => {
    res.status(200).json({
      message: "File list retrieved successfully!",
      users: data
    });
  });
});

router.post("/files_by_ruta", (req, res) => {
  User.find({ ruta: req.body.params.ruta }).then(data => {
    res.status(200).json({
      message: "File list retrieved successfully!",
      users: data
    });
  });
});
router.get("/download", function(req, res) {
  const file = `${__dirname}./../public/${req.query.ruta}`;
  res.download(file); // Set disposition and send it.
});

router.get("/itworks", (req, res, next) => {
  res.status(200).json({
    message: "true"
  });
});

router.delete("/del_doc", (req, res) => {
  User.deleteOne({ _id: req.body.id }, function(err, result) {
    if (err) {
      console.log("error query");
    } else {
      console.log(result);
    }
  }).then(data => {
    res.status(200).json({
      message: "File deleted successfully!"
    });
  });
});

router.post("/GetNombreBackend", (req, res) => {
  User.find({
    ruta: req.body.params.ruta,
    original: req.body.params.nombre
  }).then(data => {
    res.status(200).json({
      message: "The file exist!",
      name: data[0].name
    });
  });
});

module.exports = router;
