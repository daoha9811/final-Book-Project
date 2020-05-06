const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShopSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        require: true,
    },
    bookId: [Schema.Types.ObjectId],
    shopName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('shops', ShopSchema)