module.exports = (req, res, next) => {
  if (!req.user.isAdmin) res.status(400).send("Operation not allowed");
  else next();
};
