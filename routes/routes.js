const express = require("express");
const router = express.Router();
const Student = require("../models/students");
const multer = require("multer");
const fs = require("fs");

// Image upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({ storage: storage }).single("image");

// Insert Student into the database
// router.post("/add", upload, (req, res) => {
//   const student = new Student({
//     name: req.body.name,
//     age: req.body.age,
//     email: req.body.email,
//     std_class: req.body.std_class,
//     image: req.file.filename,
//   });
//   // student.save((err) => {
//   //   if (err) {
//   //     res.json({ message: err.message, type: "danger" });
//   //   } else {
//   //     req.session.message = {
//   //       type: "success",
//   //       message: "Student added successfully",
//   //     };
//   //     res.redirect("/");
//   //   }
//   // });

// });
// Insert Student into the database
router.post("/add", upload, async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded", type: "danger" });
      return;
    }

    const student = new Student({
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
      std_class: req.body.std_class,
      image: req.file.filename,
    });

    await student.save();
    req.session.message = {
      type: "success",
      message: "Student added successfully",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

// Get all the students
// router.get("/", (req, res) => {
//   Student.find().exec((err, students) => {
//     if (err) {
//       res.json({ message: err.message});
//     } else {
//       res.render("index", { title: "Students", students: students });
//     }
//   })
// });
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.render("index", { title: "Students", students: students });
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.get("/add", (req, res) => {
  res.render("add_students", { title: "Add Students" });
});

// Update students route
// router.get("/edit/:id", (req, res) => {
//   let id = req.params.id;
//   Student.findById(id, (err, student) => {
//     if (err) {
//       res.redirect("/")
//     }
//     else{
//       if(Student == null) {
//         res.redirect("/")
//       }else{
//         res.render("edit_students", { title: "Edit Students", student: student })
//       }
//     }
//   })
// });
router.get("/edit/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const student = await Student.findById(id);
    if (!student) {
      return res.redirect("/");
    }
    res.render("edit_students", { title: "Edit Students", student: student });
  } catch (err) {
    res.redirect("/");
  }
});

// Update student route
// router.post("/edit/:id", (req, res) => {
//   let id = req.params.id;
//   let new_image = "";

//   if (req.files) {
//     new_image = req.files.image.filename;
//     try {
//       fs.unlinkSync("./uploads/" + req.body.old_image);
//     } catch (error) {
//       if(error){
//         console.log(error)
//       }
//     }
//   } else {
//     new_image = req.body.old_image;
//   }

//   Student.findByIdAndUpdate(id, {
//     name: req.body.name,
//     age: req.body.age,
//     email: req.body.email,
//     std_class: req.body.std_class,
//     image: new_image,
//   }, (error, result)=>{
//     if (error) {
//       res.json({ message: error.message, type: "danger" });
//     } else {
//       req.session.message = {
//         type: "success",
//         message: "Student updated successfully",
//       };
//       res.redirect("/");
//     }
//   })

// });
// Update student route
router.post("/edit/:id", upload, async (req, res) => {
  let id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./uploads/" + req.body.old_image);
    } catch (error) {
      if(error){
        console.log(error)
      }
    }
  } else {
    new_image = req.body.old_image;
  }

  try {
    await Student.findByIdAndUpdate(id, {
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
      std_class: req.body.std_class,
      image: new_image,
    });

    req.session.message = {
      type: "success",
      message: "Student updated successfully",
    };
    res.redirect("/");
  } catch (error) {
    res.json({ message: error.message, type: "danger" });
  }
});

// Delete student route
// router.get("/delete/:id", (req, res) => {
//   let id = req.params.id;
//   Student.findByIdAndDelete(id, (err, result) => {
//     if(result.image != ''){
//       try{
//         fs.unlinkSync("./uploads/" + result.image);
//       }catch(err){
//         console.log(err)
//       };
//     }

//     if(err){
//       res.json({ message: err.message, type: "danger" });
//     }else{
//       req.session.message = {
//         type: "success",
//         message: "Student deleted successfully",
//       };
//       res.redirect("/");
//     }

//   });
// });
// Delete student route
router.get("/delete/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const result = await Student.findByIdAndDelete(id);
    if (result && result.image != '') {
      try {
        fs.unlinkSync("./uploads/" + result.image);
      } catch (err) {
        console.log(err);
      }
    }

    req.session.message = {
      type: "success",
      message: "Student deleted successfully",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});



module.exports = router;
