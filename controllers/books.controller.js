const path = require("path");
const root = path.dirname(require.main.filename); // /app
const shortid = require("shortid");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const User = require(root + "/models/users-model");
const Book = require(root + "/models/books-model");
const Session = require(root + "/models/sessions-model");
let db = require(root + "/db.model.js");

module.exports.get = async (req, res) => {
  let q = req.query.q || "";
  let isAdmin = false;
  let sessionId = req.signedCookies.sessionId || "";
  //lay count de hien len views
  const currentSession = await Session.findById(sessionId);
  const sessionCart = currentSession.carts || {}
  let count =
    Object.values(sessionCart ? sessionCart : {}).reduce((a, b) => a + b, 0) ||
    0;
  //logic kiem tra xem co phai admin khong
  const userId = req.signedCookies.userId || "";
  if (userId) {
    let userCurrent = await User.findById(userId);
    if (userCurrent.isAdmin) {
      isAdmin = true;
    }
  }
  let filterData = await Book.find();

  let currentPage = parseInt(req.query.pages) || 1;
  let perpage = 6;
  let pages = Math.ceil(filterData.length / perpage);
  let start = (currentPage - 1) * perpage;
  let end = (currentPage - 1) * perpage + perpage;
  let next = currentPage + 1 < pages ? currentPage + 1 : pages;
  let previous = currentPage - 1 >= 1 ? currentPage - 1 : 1;
  res.render("books/books", {
    data: filterData.slice(start, end),
    pages,
    currentPage,
    next,
    previous,
    isAdmin,
    count
  });
};

module.exports.getSearch = async (req, res) => {
  let sessionId = req.signedCookies.sessionId || "";
  //lay count de hien len views
  const currentSession = await Session.findById(sessionId);
  const sessionCart = currentSession.carts || {}
  let count =
    Object.values(sessionCart ? sessionCart : {}).reduce((a, b) => a + b, 0) ||
    0;
  let q = req.query.q || "";
  let isAdmin = false;
  //logic kiem tra xem co phai admin khong
  const userId = req.signedCookies.userId || "";
  if (userId) {
    let userCurrent = await User.findById(userId);
    if (userCurrent.isAdmin) {
      isAdmin = true;
    }
  }
  let currentPage = parseInt(req.query.pages) || 1;
  let filterData = await Book.find({ title: new RegExp(q, "i") });
  let perpage = 3;
  let pages = Math.ceil(filterData.length / perpage);
  let start = (currentPage - 1) * perpage;
  let end = (currentPage - 1) * perpage + perpage;
  let next = currentPage + 1 < pages ? currentPage + 1 : pages;
  let previous = currentPage - 1 >= 1 ? currentPage - 1 : 1;
  res.render("books/book-search", {
    data: filterData.slice(start, end),
    pages,
    currentPage,
    next,
    previous,
    q,
    isAdmin,
    count
  });
};

module.exports.getCreate = (req, res) => {
  res.render("books/book-create");
};

module.exports.postCreate = async (req, res) => {
  let { title, description } = req.body;
  if (!req.file) {
    if (title) {
      await Book.create({
        title,
        description,
        coverUrl:
          "https://res.cloudinary.com/daoha/image/upload/v1588146078/userTest/download_btdqvy.jpg"
      }).write();
    }
  } else {
    const id = mongoose.Types.ObjectId();
    const path = req.file.path;
    await cloudinary.uploader.upload(
      path,
      { public_id: `booksTest/${id}`, width: 300, height: 300 },
      async (err, result) => {
        if (err) {
          console.warn(err);
        }
        await Book.create({ id: id, title, description, coverUrl: result.url });
      }
    );
  }
  res.redirect("/books");
};

module.exports.getDelete = async (req, res) => {
  let params = req.params.id;
  await Book.deleteOne({ _id: params });
  res.redirect("back");
};

module.exports.getUpdate = async (req, res) => {
  let params = req.params.id;
  res.render("books/book-detail", {
    data: await Book.findById({ _id: params })
  });
};

module.exports.postUpdate = async (req, res) => {
  let params = req.params.id;
  let { title, description } = req.body;
  if (!req.file) {
    await Book.update({ _id: params }, { $set: { title, description } });
  } else {
    const path = req.file.path;
    await cloudinary.uploader.upload(
      path,
      { public_id: `booksTest/${params}`, width: 300, height: 300 },
      async (err, result) => {
        if (err) {
          console.warn(err);
        }
        await Book.update(
          { _id: params },
          { $set: { title, description, coverUrl: result.url } }
        )
      }
    );
  }
  res.redirect("/books");
};
