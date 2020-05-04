const jwt = require("jsonwebtoken");
const path = require("path");
const root = path.dirname(require.main.filename);
const bcrypt = require("bcrypt");

const Transaction = require(root + "/models/transactions-model");
const User = require(root + "/models/users-model");
const Book = require(root + "/models/books-model");
const Session = require(root + "/models/sessions-model");

module.exports.getTrans = async (req, res) => {
  const requestHeader = req.get('Authorization') || "" ;
  if(requestHeader) {
    const token = requestHeader.split(' ')[1];
    const decode = jwt.verify(token, process.env.TOKEN_SECRET);
    if(decode.priority) {
      let filterData = await Transaction.find();
      res.status(200).json({
        filterData,
        isAdmin: true
      });
    } else {
      let filterData = await Transaction.find({ userId: decode.id });
      res.status(200).json({
        filterData,
        isAdmin: false
      });
    }
  } else (
    res.json({
      Error: "Not have Authorization"
    })
  )
  
  
};
