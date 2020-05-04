const path = require("path");
const root = path.dirname(require.main.filename); // /app
const shortid = require("shortid");


const User = require(root + "/models/users-model");
const Book = require(root + "/models/books-model");
let db = require(root + "/db.model.js");

module.exports.checkId = async (req, res, next) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;

  if (
    await User.findById(userId) &&
    await Book.findById(bookId)
  ) {
    next();
  } else {
    res.redirect("/transactions");
  }
};
