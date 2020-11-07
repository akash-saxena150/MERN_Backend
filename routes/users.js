const express = require("express");
const Router = express.Router();
const { check, validationResult } = require("express-validator");
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const generator = require("generate-password");
const auth = require("../middleware/auth");
//@route get api/users
//@desc Fetch all users
//@access Private admin - all access, User - restricted access

Router.get("/", (req, res) => {
  res.send("Users route loaded");
});

//@route post api/users
//@desc Create a user
//@access Admin
Router.post(
  "/",
  [
    auth,
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
      if (!req.user.isAdmin) res.status(400).send("Operation not allowed");
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }
      //Check if the user exists
      const { fName, lName, email, win_id, role_id } = req.body;
      const dbRefUser = db.collection("users");
      const userRef = dbRefUser.where("win_id", "==", win_id).get();
      const userEmailRef = dbRefUser.where("email", "==", email).get();
      const [userRefSnapshot, userEmailRefSnapshot] = await Promise.all([
        userRef,
        userEmailRef
      ]);
      if (!(userRefSnapshot.empty && userEmailRefSnapshot.empty)) {
        res.status(400).send("User already exists");
      }
      //Generate a password
      const password = generator.generate({
        length: 10,
        numbers: true
      });
      let user = { fName, lName, email, win_id, role_id };
      //Encrypt the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      //Upload on the server
      const uploadUser = await db
        .collection("users")
        .doc(win_id)
        .set(user);
      //send the response - user email, user pass
      res.status(200).json({ data: { ...user, password } });
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);
module.exports = Router;
