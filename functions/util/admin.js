const admin = require("firebase-admin");
const serviceAccount = require("../admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialapp-9a192.firebaseio.com",
});

const db = admin.firestore();

module.exports = { admin, db };
