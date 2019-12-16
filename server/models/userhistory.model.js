const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserHistorySchema = new Schema({
  fromID: String,
  toID: String,
  date: String,
  message: String
});

module.exports = mongoose.model("UserHistory", UserHistorySchema);
