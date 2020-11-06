const express = require("express");
const Router = express.Router();

//@route get api/user
//@desc Show details of a user
//@access Private admin - all access, User - self profile access

Router.get("/", (req, res) => {
  res.send("User detail route loaded");
});

module.exports = Router;
