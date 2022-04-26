// Connect to mongodb

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost", {
    dbName: "DiabetesHome@SugarFree",
}).then(() => console.log("Connected To Mongoose"))
  .catch((error) => console.log(error, "\nFailed To Connect To Mongo"));