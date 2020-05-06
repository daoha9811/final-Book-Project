// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParse = require("cookie-parser");
var db = require("./db.model.js");
const mongoose = require("mongoose");

//connectdb;

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  dbName: process.env.BOOK_STORE,
  user: process.env.ATLAS_USER,
  pass: process.env.ATLAS_PASS,
  useCreateIndex: true
});

mongoose.connection
  .once("open", () => {
    console.log("connected");
  })
  .on("error", (error, data) => {
    if (error) console.warn(error);
  });

const Session = require("./models/sessions-model");

const _ = require("lodash");

const booksRouter = require("./routes/book.routes");
const usersRouter = require("./routes/users.routes");
const transactionsRouter = require("./routes/transactions.routes");
const loginRouter = require("./routes/login.routes");
const cartRouter = require("./routes/cart.routes");
const apiRouter = require("./api/routes/api");
const registerRouter = require("./routes/create.routes");

const loginMiddleware = require("./middleware/login-validate");
const sessionMiddleware = require("./middleware/sessionId");

const shortid = require("shortid");

db.defaults({ posts: [], user: {}, count: 0 }).write();

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(cookieParse(process.env.SECRET_COOKIE));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(sessionMiddleware.checkSession);

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.render("index");
});

//login
app.use("/login", loginRouter);

app.get("/logout", (req, res) => {
  res.cookie("userId", "");
  const id = mongoose.Types.ObjectId();
  res.cookie("sessionId", id, {
    signed: true
  });
  Session.create({ _id: id });
  res.redirect("/login");
});

//api
app.use("/api/", apiRouter);

//books router
app.use("/books", booksRouter);

//users router
app.use("/users", loginMiddleware.isLogin, usersRouter);

//
app.use("/register", registerRouter);

//transactions router
app.use("/transactions", loginMiddleware.isLogin, transactionsRouter);

//cart router
app.use("/carts", cartRouter);

//error handle middleware

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).render("error", {
      error: err.message
    });
  }
});

// app.get('/test', (req, res) => {
//   var data1 = {
//     id: '1a',
//     cart: {
//       'book1': 2,
//       'book2': 3
//     }
//   }
//   var data2 = {
//     id: '2a',
//     cart: {
//       'book1': 1,
//       'book2': 2,
//       'book3': 2
//     }
//   }

//   for(let i in data2.cart){
//     if(data1[i]){
//       data1.cart[i] += data2.cart[i]
//     } else {
//       data1.cart[i] = data2.cart[i]
//     }
//   }

//   res.json(data1);

// })

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
