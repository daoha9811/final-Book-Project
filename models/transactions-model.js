const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId
  },
  bookId: [Schema.Types.ObjectId]
});

const Transaction = mongoose.model("transactions", transactionSchema);

module.exports = Transaction;
