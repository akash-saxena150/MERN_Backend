const { BigQuery } = require("@google-cloud/bigquery");

const connBigQ = {
  keyFilename: `./config/mern-db-config.json`,
  projectId: "mern-lowes"
};

module.exports = new BigQuery(connBigQ);
