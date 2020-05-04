const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  carts: { },
});

const Session = mongoose.model("sessions", sessionSchema);

module.exports = Session;
