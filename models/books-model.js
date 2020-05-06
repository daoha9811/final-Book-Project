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
  },
  shopId: {
    type: Schema.Types.ObjectId,
    default: "5ead433133eb251ac64fbe41"
  }
});

const Book = mongoose.model("books", bookSchema);

module.exports = Book;
