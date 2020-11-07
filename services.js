const db = require("./config/db");
const notAdmin = (req, res) => {
  if (!req.user.isAdmin) res.status(400).send("Operation not allowed");
};
const getCollection = col => db.collection(col);
const getCreatedData = req => ({
  created_date: new Date(),
  created_by: req.user.id
});
module.exports = { notAdmin, getCollection, getCreatedData };
