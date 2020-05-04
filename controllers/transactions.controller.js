const path = require("path");
const root = path.dirname(require.main.filename); // /app
const shortid = require("shortid");
const cloneDeep = require("lodash").cloneDeep;
const mongoose = require("mongoose");
const axios = require("axios");

let db = require(root + "/db.model.js");
const User = require(root + "/models/users-model");
const Book = require(root + "/models/books-model");
const Session = require(root + "/models/sessions-model");
const Transaction = require(root + "/models/transactions-model");

module.exports.get = async (req, res) => {
  //call api
  const token = req.signedCookies.token;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  let trans = await axios.get(
    "https://ablaze-peppermint-parka.glitch.me/api/transaction"
  );

  let userId = req.signedCookies.userId;
  let sessionId = req.signedCookies.sessionId || "";
  //lay count de hien len views
  const currentSession = await Session.findById(sessionId);
  const sessionCart = currentSession.carts || {};
  let count =
    Object.values(sessionCart ? sessionCart : {}).reduce((a, b) => a + b, 0) ||
    0;
  //config lai data
  //isAdmin == true
  let currentUser = await User.findById(userId);
  let currentPage = parseInt(req.query.pages) || 1;
  let perpage = 3;
  let transUser = trans.data.filterData;
  let pages = Math.ceil(transUser.length / perpage);
  let start = (currentPage - 1) * perpage;
  let end = (currentPage - 1) * perpage + perpage;
  let next = currentPage + 1 < pages ? currentPage + 1 : pages;
  let previous = currentPage - 1 >= 1 ? currentPage - 1 : 1;
  let mapData = cloneDeep(transUser).map(async d => {
    let user = await User.findById(d.userId);
    d.userName = user.name;
    d.bookName = await Promise.all(
      d.bookId.map(async b => {
        let book = await Book.findById(b);
        return book.title;
      })
    );
    return d;
  });
  let filterData = await Promise.all(mapData);
  res.render("transactions/transaction", {
    data: filterData.slice(start, end),
    isAdmin: trans.data.isAdmin,
    currentPage,
    pages,
    next,
    previous,
    count
  });
};

module.exports.postCreate = async (req, res) => {
  let user = req.body.user;
  let book = req.body.book;
  let transChoosedUser = await Transaction.findOne({ userId: user });
  if (transChoosedUser) {
    if (checkBook(transChoosedUser.bookId, book)) {
      res.send("Da co sach roi");
    } else {
      let books = transChoosedUser.bookId;
      books.push(book);
      await Transaction.update({ userId: user }, { $set: { bookId: books } });
      res.redirect("/transactions");
    }
  } else {
    let id = mongoose.Types.ObjectId();
    await Transaction.create({
      _id: id,
      userId: user,
      bookId: [book],
      isComplete: false
    });
    res.redirect("/transactions");
  }
};

module.exports.getCreate = async (req, res) => {
  res.render("transactions/transaction-create", {
    users: await User.find(),
    books: await Book.find()
  });
};

module.exports.getBookDelete = async (req, res) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;
  let user = await Transaction.findOne({ userId });
  let books = user.bookId.filter(i => {
    return i != bookId; //i la object trong khi bookId laf string
  });

  await Transaction.update({ userId }, { $set: { bookId: books } });
  res.redirect("back");
};

function checkBook(books, book) {
  if (books.indexOf(book) !== -1) {
    return true;
  } else {
    return false;
  }
}
