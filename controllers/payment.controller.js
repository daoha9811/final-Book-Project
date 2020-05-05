const path = require("path");
const root = path.dirname(require.main.filename); // /app
const shortid = require("shortid");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");

const Session = require(root + "/models/sessions-model");
const Transaction = require(root+"/models/transactions-model");

module.exports.pay = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        let userSession = await Session.findById( userId );
        let carts = userSession.carts;
        if(carts) {
            let userTran = await Transaction.findOne({ userId });
            if(!userTran){
                await Transaction.create({
                    userId,
                    bookId:[]
                })
            }
            let userTrans = await Transaction.findOne({ userId });
            for(let i in carts){
                if( userTrans.bookId.indexOf(i) == -1 ) {
                    userTrans.bookId.push(i);
                }

            }
            await Transaction.update({ userId }, { $set: { bookId: userTrans.bookId } })
            await Session.update({ _id: userId }, { $set: { carts: { } } })
        }   
        res.redirect("/transactions");
    } catch (error) {
        next(error)
    }
}