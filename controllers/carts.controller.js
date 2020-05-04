const path = require("path");
const root = path.dirname(require.main.filename);
const toPairs = require("lodash").toPairs;

const db = require(root + "/db.model.js");
const Session = require(root + "/models/sessions-model");
const User = require(root + "/models/users-model");
const Book = require(root + "/models/books-model");
const _ = require('lodash');

module.exports.getCart = async (req, res) => {
  let sessionId = req.signedCookies.sessionId || "";
  //lay count de hien len views
  const currentSession = await Session.findById(sessionId);
  const sessionCart = currentSession.carts || {}
  let count =
    Object.values(
     sessionCart
        ? sessionCart
        : {}
    ).reduce((a, b) => a + b, 0) || 0;

  //config data

  const obj =
   sessionCart || {};

  //   const arrayKeys = [];

  //   for(let i in obj) {
  //     arrayKeys.push({
  //       [i]: obj[i]
  //     })
  //   }
  const arrayKeys = toPairs(obj);

  const mapData = arrayKeys.map(async key => {
    let bookFilter = await Book.findById(key[0]);
    return {
      bookFilter,
      slg: key[1]
    };
  });
  
  const filterData = await Promise.all(mapData);
  
  

  let currentPage = parseInt(req.query.pages) || 1;
  let perpage = 3;
  let pages = Math.ceil(filterData.length / perpage);
  let start = (currentPage - 1) * perpage;
  let end = (currentPage - 1) * perpage + perpage;
  let next = currentPage + 1 < pages ? currentPage + 1 : pages;
  let previous = currentPage - 1 >= 1 ? currentPage - 1 : 1;

  res.render("carts/cart", {
    data: filterData.slice(start, end),
    count,
    pages,
    currentPage,
    next,
    previous,
    count
  });
};

module.exports.getAddToCart = async (req, res) => {
  const bookId = req.params.id;
  const sessionId = req.signedCookies.sessionId;
  const sessionCurrent = await Session.findById(sessionId);

  const count = _.get(sessionCurrent, `carts.${bookId}`, 0);
  const setObj = _.set( sessionCurrent , `carts.${bookId}`, count + 1)
  
  console.log(setObj);
  
  await Session.update({ _id: sessionId }, { $set: setObj })
  
  res.redirect("/books");
};

module.exports.getDelete = async (req, res) => {
  let bookId = req.params.id;
  let sessionId = req.signedCookies.sessionId || "";
  const currentSession = await Session.findById(sessionId);
  const carts = currentSession.carts || {}
  delete carts[bookId];
  console.log(carts);
  await Session.updateOne({ _id: sessionId }, { $set: { carts } });
  res.redirect("back");
};

module.exports.getPay = (req, res) => {
  res.send('da vao trang pay')
}