const admin = require("firebase-admin");
const config = require("config");
const serviceAccount = require(config.get("firestoreConfig"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;
