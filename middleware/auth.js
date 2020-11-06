const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  const authToken = req.header("x-auth-token");
  if (!authToken) {
    res.status(401).json({ msg: "Duh! No token found. Trying to trick us?" });
  }
  try {
    const decoded = jwt.verify(authToken, config.get("jwtToken"));
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log("err", err);
    res.status(401).json({
      msg: "Your token ain't valid. Looks like someone doesn't like you"
    });
  }
};
