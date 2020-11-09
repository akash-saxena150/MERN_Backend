const express = require("express");
const Router = express.Router();
const { check, validationResult } = require("express-validator");
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const generator = require("generate-password");
const auth = require("../middleware/auth");
const notAdmin = require("../middleware/notAdmin");
//@route get api/users
//@desc Fetch all users
//@access Private admin - all access, User - restricted access

Router.get("/", auth, async (req, res) => {
  try {
    const dbRefUser = db.collection("users");
    const usersRef = await dbRefUser.get();
    let usersArr = [];
    usersRef.forEach(user => {
      let data = {};
      let currUserData = user.data();
      if (req.user.isAdmin) {
        data = { ...currUserData, password: null };
      } else {
        data = {
          fName: currUserData.fName,
          lName: currUserData.lName,
          win_id: currUserData.win_id
        };
      }
      usersArr.push(data);
    });
    res.status(200).json({ userData: usersArr });
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});

//@route post api/users
//@desc Create a user
//@access Admin
Router.post(
  "/",
  [
    auth,
    notAdmin,
    check("fName", "First name should not be empty")
      .not()
      .isEmpty(),
    check("lName", "Last name should not be empty")
      .not()
      .isEmpty(),
    check("win_id", "Please enter a unique Windows id")
      .not()
      .isEmpty(),
    check("email", "Please enter a valid email").isEmail()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //Check if the user exists
      const {
        fName,
        lName,
        email,
        win_id,
        role_id,
        isAdmin,
        password
      } = req.body;
      const dbRefUser = db.collection("users");
      const userRef = dbRefUser.where("win_id", "==", win_id).get();
      const userEmailRef = dbRefUser.where("email", "==", email).get();
      const [userRefSnapshot, userEmailRefSnapshot] = await Promise.all([
        userRef,
        userEmailRef
      ]);
      // if (!(userRefSnapshot.empty && userEmailRefSnapshot.empty)) {
      //   return res.status(401).send("User already exists");
      // }
      //Generate a password
      const generatedPass = generator.generate({
        length: 10,
        numbers: true
      });
      let user = {
        fName,
        lName,
        email,
        win_id,
        role_id,
        isAdmin,
        created_date: new Date(),
        created_by: req.user.id
      };
      //Encrypt the password
      const salt = await bcrypt.genSalt(10);
      user.password =
        password && password.length > 0
          ? password
          : await bcrypt.hash(generatedPass, salt);
      //Upload on the server

      //ABSOLUTELY NOT REQUIRED IN PROD
      // let userIsAdmin = user.isAdmin || user.is_admin || false;
      // user.is_admin = userIsAdmin;
      // user.isAdmin = userIsAdmin;
      console.log("User data to be passed ---->", user);
      //NOT REQUIRED BLOCK ENDS

      const uploadUser = await db
        .collection("users")
        .doc(win_id)
        .set(user);
      //send the response - user email, user pass
      res.status(200).json({ data: { ...user, password } });
    } catch (err) {
      console.log("err", err);
      res.status(500).send("Server error");
    }
  }
);
module.exports = Router;
