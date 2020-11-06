const express = require("express");
const Router = express.Router();

//@route get api/domains
//@desc Show all domains
//@access Private admin - full access, user - permission based access

Router.get("/", (req, res) => {
  res.send("Domains route loaded");
});

module.exports = Router;
