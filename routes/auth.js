const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const db = require("../config/db");
//@route GET api/auth
//@desc  test route
//@access  public route

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-pass");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

//@route POST api/auth
//@desc  test route
//@access  public route

router.post(
  "/",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password should be minimum 6 characters long").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      //   let user = await User.findOne({
      //     email
      //   });
      //   if (!user) {
      //     return res
      //       .status(400)
      //       .json({ errors: [{ msg: "Check the credentials mate!" }] });
      //   }
      const dbRefUser = db.collection("users");
      const userRef = await dbRefUser.where("email", "==", email).get();
      if (userRef.empty) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Check the credentials mate!" }] });
      }
      let user = {};
      userRef.forEach(doc => {
        user = doc.data();
      });

      //   Match Pass
      let isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Check the credentials mate!" }] });
      }
      //Return JSON webtoken
      // console.log(req.body);
      // res.send("User route");
      const payload = {
        user: {
          id: user.win_id
        }
      };
      jwt.sign(
        payload,
        config.get("jwtToken"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
