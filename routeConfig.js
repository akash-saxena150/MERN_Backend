// const express = require("express");

// const app = express();

module.exports = app => {
  app.use("/api/users", require("./routes/users"));
  app.use("/api/user", require("./routes/user"));
  app.use("/api/auth", require("./routes/auth"));
  app.use("/api/roles", require("./routes/roles"));
  app.use("/api/permissions", require("./routes/permissions"));
  app.use("/api/layouts", require("./routes/layouts"));
  app.use("/api/domains", require("./routes/domains"));
  app.use("/api/tables", require("./routes/fetch_tables"));
  app.use("/api/columns", require("./routes/fetch_columns"));
  app.use("/api/modules", require("./routes/modules"));
};
