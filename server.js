const express = require("express");

const app = express();

const PORT = process.env.PORT || 5000;

app.use("/api/users", require("./routes/users"));
app.use("/api/user", require("./routes/user"));
app.use("/api/roles", require("./routes/roles"));
app.use("/api/permissions", require("./routes/permissions"));
app.use("/api/layouts", require("./routes/layouts"));
app.use("/api/domains", require("./routes/domains"));
app.use("/api/modules", require("./routes/modules"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
