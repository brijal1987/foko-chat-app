const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserGroupHistorySchema = new Schema({
  groupID: String,
  date: String,
  fromID: String,
  message: String
});

module.exports = mongoose.model("UserGroupHistory", UserGroupHistorySchema);
