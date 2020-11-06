const express = require("express");
const Router = express.Router();

//@route get api/users
//@desc Fetch all users
//@access Private admin - all access, User - restricted access

Router.get("/", (req, res) => {
  res.send("Users route loaded");
});

//@route post api/users
//@desc Create a user
//@access Admin
Router.post("/", (req, res) => {
  res.send("Users post route loaded");
});
module.exports = Router;
