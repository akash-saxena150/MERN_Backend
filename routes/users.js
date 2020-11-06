const express = require("express");
const Router = express.Router();
const { check, validationResult } = require("express-validator");
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
    console.log("Req body", req.body);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }

      res.send("Users post route loaded");
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);
module.exports = Router;
