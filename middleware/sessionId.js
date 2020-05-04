const path = require("path");
const root = path.dirname(require.main.filename);
const shortid = require("shortid");
const mongoose = require("mongoose");

let db = require(root + "/db.model.js");
const Session = require(root + "/models/sessions-model");

module.exports.checkSession = async (req, res, next) => {
  if (!req.signedCookies.sessionId) {
    const id = mongoose.Types.ObjectId();
    console.log(id);
    res.cookie("sessionId", id, {
      signed: true
    });
    await Session.create({ _id: id })
  }
  next();
};

