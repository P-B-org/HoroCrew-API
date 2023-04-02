require("dotenv").config();
require("../config/db.config");

const mongoose = require("mongoose");
const Sign = require("../models/Sign.model");

const signs = require("../signs.json");

mongoose.connection.once("open", () => {
  console.info(
    `*** Connected to the database ${mongoose.connection.db.databaseName} ***`
  );

  mongoose.connection.db
    .dropDatabase()
    .then(() => {
      console.info("DB has been cleared");

      return Sign.create(signs);
    })
    .then((createdSigns) => {
      console.log("Signs created on DB");
    })
    .catch((err) => console.error(err))
    .finally(() => {
      mongoose.connection.close().then(function () {
        console.log("Mongoose disconnected");
        process.exit(0);
      });
    });
});
