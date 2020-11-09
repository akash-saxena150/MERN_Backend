const express = require("express");
const Router = express.Router();
const auth = require("../middleware/auth");
const notAdmin = require("../middleware/notAdmin");
const { getCollection } = require("../services");
//@route get api/user/:id
//@desc Show details of a user
//@access Private admin - all access, User - self profile access

Router.get("/:id", auth, notAdmin, async (req, res) => {
  try {
    const dbRefUser = getCollection("users");
    const userRef = await dbRefUser.where("win_id", "==", req.params.id).get();
    let userData = {};
    if (userRef.empty) {
      res.status(400).send("User not found");
    }
    userRef.forEach(user => {
      userData = user.data();
    });
    res.status(200).json({ userData });
  } catch (err) {
    console.log("Error", err);
    res.status(500).send("Server error");
  }
});

module.exports = Router;
