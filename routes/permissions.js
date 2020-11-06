const express = require("express");
const Router = express.Router();

//@route get api/permissions
//@desc Show all permissions of logged in user
//@access Private

Router.get("/", (req, res) => {
  res.send("Permissions route loaded");
});

module.exports = Router;
