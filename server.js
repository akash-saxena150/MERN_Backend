const express = require("express");
const routeConfig = require("./routeConfig");

// async function listDatasets() {
//   // Lists all datasets in current GCP project.

//   // Lists all datasets in the specified project
//   const [datasets] = await bigQueryConnection.getDatasets();
//   console.log("Datasets:");
//   datasets.forEach(dataset => console.log(dataset.id));
// }
// listDatasets();
const app = express();

app.use(express.json({ extended: false }));
routeConfig(app);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
