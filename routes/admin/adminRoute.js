const router = require("express").Router();
const {check, validationResult} = require('express-validator')
const db = require('../../dbConnection/Conenction')
const user = require('../../models/users')
const bcrypt = require('bcryptjs');
const passport = require("passport");
const {ensureAuthenticated} = require('../../auth/authenticate')


router.get("/", (req, res) => {
  if(req.isAuthenticated()){
    res.redirect('/main')
  }else{
     res.render("index");
  }
 
});

router.get("/main", ensureAuthenticated,(req,res) => {
  res.render("admin/dashboard",{user:req.user})
})

router.get("/topics",ensureAuthenticated, async (req, res) => {
  
  res.render("admin/topics", {user:req.user});
});

router.get("/subtopics", ensureAuthenticated, async (req, res) => {
      res.render("admin/subtopic", {user:req.user});
});

router.get('/employees', ensureAuthenticated,(req,res) => {
  res.render("admin/employees", { user: req.user });
})

router.get("/questions", ensureAuthenticated, (req, res) => {
  res.render("admin/questions", { user: req.user });
});

router.get("/login", (req, res) => {
  res.render("login")
})

router.get('/users',ensureAuthenticated, (req,res) => {
  user.find().then((users) =>{
    res.render("users", { user: req.user,users });
  }).catch((error) => {

  })
  
})
router.post(
  "/users",
  [
    check("firstname")
      .not()
      .isEmpty()
      .withMessage("Firstname is required")
      .trim()
      .escape(),
    check("lastname")
      .not()
      .isEmpty()
      .withMessage("Lastname is required")
      .trim()
      .escape(),
    check("email")
      .not()
      .isEmpty()
      .withMessage("Please Provide an Email")
      .trim()
      .escape(),
    check("username")
      .not()
      .isEmpty()
      .withMessage("Please Provide a username")
      .trim()
      .escape()
      .isLength({ min: 6, max: 15 })
      .withMessage("Username must be between 6-15 characters long"),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Please provide your password.")
      .isLength({ min: 6, max: 50 })
      .withMessage("Password must be between 6-50 characters long"),
    check("password2")
      .not()
      .isEmpty()
      .withMessage("Enter confirm password")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req).array();
      const newUser = new user( {
        firstname: req.body.firstname.trim(),
        lastname:req.body.lastname.trim(),
        username: req.body.username.trim(),
        email: req.body.email.trim(),
        password: req.body.password,
      });
      if (errors.length > 0) {
        res.render("users", {
          errors,
          user: newUser,
        });
      }else{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(newUser.password, salt)
        newUser.password = hashedPass;
        newUser.save().then((doc) => {
          req.flash("success", "Successfully Added User");
          res.redirect('/users')
        }).catch((err) => {
          console.log(err);
           req.flash("err_msg", "Error adding user try again.");
           res.redirect("/users");
        })
      }
    } catch (error) {
      console.log(error);
    }
  
  });

  //delete user
router.get('/users/d/:id', (req, res) => {
    const {id} = req.params;
    user.findByIdAndDelete(id).then(doc => {
       req.flash("success", "User deleted successfully");
       res.redirect("/users");
    })
    console.log(id);
})


router.post(
  "/login",
  [
    check("email")
      .not()
      .isEmpty()
      .withMessage("Please Provide an Email")
      .trim()
      .escape(),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Please provide your password."),
  ],
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res, next) => {
    const errors = validationResult(req).array();
    const { email, password } = req.body;
    if (errors.length > 0) {
      console.log(errors);
      return res.render("login", { errors, email, password });
    } else {
      const user = req.user;
      if (user) {
        res.render("admin/dashboard",{user});
      } else{
        res.redirect('/login')
      }
    }
  }
);

router.get('/reset', (req,res) => {
  res.render('reset')
})

router.get('/logout', (req,res) => {
  req.logOut();
  req.flash("success", "Successfully Logged Out");
  res.redirect("/login");
})
module.exports = router;
