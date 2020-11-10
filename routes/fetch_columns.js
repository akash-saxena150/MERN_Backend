const express = require("express");
const Router = express.Router();
const auth = require("../middleware/auth");
const notAdmin = require("../middleware/notAdmin");
const bigQueryConnection = require("../config/big-query-config");

//@route get api/tables
//@desc Show all tables
//@access Private admin - full access

Router.get("/:table_id", auth, notAdmin, async (req, res) => {
  try {
    let query = `SELECT * FROM bigquery-public-data.github_repos.INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${req.params.table_id}'`;
    console.log("Query", query);
    // let query = "show * from `bigquery-public-data.github_repos.sample_commits`";
    const queryOption = {
      query,
      location: "US"
    };
    const [job] = await bigQueryConnection.createQueryJob(queryOption);
    const [rows] = await job.getQueryResults();
    res.status(200).json({ rows });
  } catch (err) {
    console.log("Error", err);
    res.status(500).send("Internal server error");
  }
});
module.exports = Router;
