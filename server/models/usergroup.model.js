const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserGroupSchema = new Schema({
  users: String
});

module.exports = mongoose.model("UserGroup", UserGroupSchema);
