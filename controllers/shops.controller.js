const path = require("path");
const root = path.dirname(require.main.filename); // /app
const mongoose = require("mongoose");

const User = require(root + "/models/users-model");
const Shops = require(root + "/models/shops-model");
const Book = require(root + "/models/books-model");

module.exports.getShop = async (req, res, next) => {
    try {
        const userId = req.signedCookies.userId || "";
        const shops = await Shops.find({ userId }) || [] ;
    
        res.render('shops/shop', {
            shops
        })
    } catch (error) {
        next(error)
    }
}

module.exports.getCreateShop = (req, res, next) => {
    try {
        res.render('shops/shopCreate');
    } catch (error) {
        next(error);
    }
}

module.exports.postCreateShop = async (req, res, next) => {
    try {
        const shopName = req.body.name || "";
        const userId = req.signedCookies.userId || "";
        const user = await User.findOne({ _id: userId });
        const userName = user.name;

        if(shopName){
            const shop = {
                shopName,
                userId,
                userName,
                bookId: [ ]
            }
            await Shops.create(shop)
        }

        res.redirect('/shops')
    } catch (error) {
        next(error);
    }
}

module.exports.getUserControlShop = async (req, res, next) => {
    try {
        const shopId = req.params.id;
        const userId = req.signedCookies.userId;
        const shop = await Shops.findOne({ $and: [{ _id: shopId },{ userId }] });
        res.cookie('shopId',shopId, {
            signed: true
        })

        const configBooks = shop.bookId.map(async (bid) => {
            const book = await Book.findById(bid);
            const bookName = book.title;
            const bookCoverUrl = book.coverUrl;
            return {
                bid,
                bookName,
                bookCoverUrl
            }
        })

        const books = await Promise.all(configBooks);

        res.render('shops/userControlShop', {
            shop,
            books
        });
    } catch (error) {
        next(error);
    }
}