const path = require("path");
const root = path.dirname(require.main.filename);

let db = require(root + "/db.model.js");

const User = require(root + "/models/users-model");
const Session = require(root + "/models/sessions-model");
const Transaction = require(root + "/models/transactions-model");

module.exports.check = async (req, res, next) => {
  let userName = req.body.name;
  let userGmail = req.body.gmail;
  let errors = [];

  if (userName.length >= 30) {
    errors.push("Name phai nho hon 30 ky tu");
    res.render("users/user-create", { Errors: errors });
    return;
  }

  if (
    await User.find({ gmail: userGmail })
  ) {
    errors.push("Gmail da duoc dang ky");
    res.render("users/user-create", { Errors: errors });
    return;
  }

  next();
};

module.exports.checkDetail = async (req, res, next) => {
  let userName = req.body.name;
  let userGmail = req.body.gmail;
  let userPassword = req.body.password;
  let errors = [];

  if (userName.length >= 30) {
    errors.push("Name phai nho hon 30 ky tu");
    res.render("users/user-detail", { Errors: errors });
    return;
  }

  if (
    await User.find({ gmail: userGmail })
  ) {
    errors.push("Gmail da duoc dang ky");
    res.render("users/user-detail", {
      Errors: errors,
      data: {
        name: userName,
        gmail: userGmail,
        password: userPassword,
        id: req.body.id
      }
    });
    return;
  }

  next();
};
