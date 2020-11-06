const express = require("express");
const Router = express.Router();

//@route get api/layouts
//@desc Show all layouts
//@access Private admin - full access, user - permission based access

Router.get("/", (req, res) => {
  res.send("Layout route loaded");
});

module.exports = Router;
