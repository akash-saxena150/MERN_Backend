const express = require("express");
const Router = express.Router();

//@route get api/modules
//@desc Show all modules
//@access Private admin - full access, user - permission based access

Router.get("/", (req, res) => {
  res.send("Modules route loaded");
});

module.exports = Router;
