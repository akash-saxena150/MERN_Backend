const express = require("express");
const routeConfig = require("./routeConfig");
const { BigQuery } = require("@google-cloud/bigquery");

const connBigQ = {
  keyFilename: "./config/mern-db-config.json",
  projectId: "mern-lowes"
};

const testBigQueryFn = async () => {
  const bigQueryConnection = new BigQuery(connBigQ);
  let query =
    "select committer.tz_offset from `bigquery-public-data.github_repos.sample_commits` where committer.time_sec>=1380553254";
  const queryOption = {
    query,
    location: "US"
  };
  try {
    const [job] = await bigQueryConnection.createQueryJob(queryOption);
    const [rows] = await job.getQueryResults();
    console.log(rows);
  } catch (err) {
    console.log("err", err);
  }
};
testBigQueryFn();
const app = express();

app.use(express.json({ extended: false }));
routeConfig(app);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
