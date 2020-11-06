const express = require("express");

const app = express();

app.use(express.json({ extended: false }));

app.use("/api/users", require("./routes/users"));
app.use("/api/user", require("./routes/user"));
app.use("/api/roles", require("./routes/roles"));
app.use("/api/permissions", require("./routes/permissions"));
app.use("/api/layouts", require("./routes/layouts"));
app.use("/api/domains", require("./routes/domains"));
app.use("/api/modules", require("./routes/modules"));

module.exports = app;
