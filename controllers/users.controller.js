const path = require("path");
const root = path.dirname(require.main.filename); // /app
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const salt = 10;
const cloudinary = require("cloudinary").v2;

const User = require(root + "/models/users-model");
const Session = require(root + "/models/sessions-model");
const Transaction = require(root + "/models/transactions-model");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

let db = require(root + "/db.model.js");

module.exports.get = async (req, res) => {
  let sessionId = req.signedCookies.sessionId || "";
  //lay count de hien len views
  const currentSession = await Session.findById(sessionId);
  const sessionCart = currentSession.carts || {}
  let count =
    Object.values(
     sessionCart
        ? sessionCart
        : {}
    ).reduce((a, b) => a + b, 0) || 0;
  let filterData = await User.find();
  let q = req.query.q || "";
  let currentPage = parseInt(req.query.pages) || 1;
  let perpage = 3;
  let pages = Math.ceil(filterData.length / perpage);
  let start = (currentPage - 1) * perpage;
  let end = (currentPage - 1) * perpage + perpage;
  let next = currentPage + 1 < pages ? currentPage + 1 : pages;
  let previous = currentPage - 1 >= 1 ? currentPage - 1 : 1;
  res.render("users/users", {
    data: filterData.slice(start, end),
    currentPage,
    pages,
    previous,
    next,
    count
  });
};

module.exports.getSearch = async (req, res) => {
  let q = req.query.q || "";
  let filterData = await User.find({ name: new RegExp(q, "i") });
  let currentPage = parseInt(req.query.pages) || 1;
  let perpage = 3;
  let pages = Math.ceil(filterData.length / perpage);
  let start = (currentPage - 1) * perpage;
  let end = (currentPage - 1) * perpage + perpage;
  let next = currentPage + 1 < pages ? currentPage + 1 : pages;
  let previous = currentPage - 1 >= 1 ? currentPage - 1 : 1;
  res.render("users/user-search", {
    data: filterData.slice(start, end),
    currentPage,
    pages,
    previous,
    next,
    q
  });
};

module.exports.getCreate = (req, res) => {
  res.render("users/user-create", {
    Errors: []
  });
};

module.exports.postCreate = (req, res) => {
  let { name, gmail, password } = req.body;
  //neu khong co file gui len thi imgUrl = mac dinh
  if (!req.file) {
    if (name) {
      bcrypt.hash(password, salt, async (err, hash) => {
        try {
          const newUser = new User({
            name,
            gmail,
            password: hash,
            isAdmin: false
          });
          await newUser.save();
          //newUser.create();
        } catch (error) {
          console.warn(error);
        }
      });
    }
  } else {
    //neu co file thi luu len cloudinary
    const id = mongoose.Types.ObjectId();
    const path = req.file.path;
    cloudinary.uploader.upload(
      path,
      { public_id: `userTest/${id}`, width: 100, height: 100 },
      (err, result) => {
        if (err) {
          console.warn(err);
        }
        if (name) {
          bcrypt.hash(password, salt, async (err, hash) => {
            try {
              await User.create({
                _id: id,
                name,
                gmail,
                password: hash,
                imgUrl: result.url,
                isAdmin: false
              });
            } catch (err) {
              console.warn(err);
            }
          });
        }
      }
    );
  }
  res.redirect("/users");
};

module.exports.getDelete = async (req, res) => {
  let params = req.params.id;
  await User.deleteOne({ _id: params });
  await Transaction.deleteOne({ userId: params });
  res.redirect("back");
};

module.exports.getUpdate = async (req, res) => {
  let params = req.params.id;
  res.render("users/user-detail", {
    data: await User.findById(params),
    Errors: []
  });
};

module.exports.postUpdate = async (req, res) => {
  let params = req.params.id;
  let { name, password, gmail } = req.body;
  const hash = bcrypt.hashSync(password, salt);
  if (!req.file) {
    await User.update({ _id: params }, { $set: { name, password: hash, gmail } });
  } else {
    const path = req.file.path;
    await cloudinary.uploader.upload(
      path,
      { public_id: `userTest/${params}`, width: 100, height: 100 },
      async (err, result) => {
        if (err) {
          console.warn(err);
        }
        await User.update({ _id: params }, { $set: { name, password: hash, gmail, imgUrl: result.url } });
      }
    );
  }
  res.redirect("/users");
};
