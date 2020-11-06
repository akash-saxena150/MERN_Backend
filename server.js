const express = require("express");
const routeConfig = require("./routeConfig");

const app = express();

app.use(express.json({ extended: false }));
routeConfig(app);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
