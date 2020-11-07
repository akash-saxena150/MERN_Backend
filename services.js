const db = require("./config/db");
const getCollection = col => db.collection(col);
const getCreatedData = req => ({
  created_date: new Date(),
  created_by: req.user.id
});
module.exports = { getCollection, getCreatedData };
