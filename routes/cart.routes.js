const express = require("express");
const router = express.Router();
const path = require("path");
const root = path.dirname(require.main.filename); //app

const cartController = require(root + "/controllers/carts.controller");
const loginMiddleware = require(root + "/middleware/login-validate");
const paymentController = require(root + "/controllers/payment.controller");

router.get("/", cartController.getCart);

router.get("/addToCart/:id", cartController.getAddToCart);

router.get("/:id/delete", cartController.getDelete);

router.get("/pay/:userId",loginMiddleware.isLogin, paymentController.pay);

module.exports = router;
