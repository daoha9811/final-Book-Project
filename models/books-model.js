const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  coverUrl: {
    type: String,
    default:
      "https://res.cloudinary.com/daoha/image/upload/v1588146078/userTest/download_btdqvy.jpg"
  }
});

const Book = mongoose.model("books", bookSchema);

module.exports = Book;
