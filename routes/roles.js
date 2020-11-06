const express = require("express");
const Router = express.Router();

//@route get api/roles
//@desc Show all roles
//@access Private

Router.get("/", (req, res) => {
  res.send("Roles route loaded");
});

module.exports = Router;
