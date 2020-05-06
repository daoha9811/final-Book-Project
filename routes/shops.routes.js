const express = require("express");
const path = require("path");
const root = path.dirname(require.main.filename); // /app
const router = express.Router();

const shopController = require(root+"/controllers/shops.controller");

router.get('/', shopController.getShop);

router.get('/create', shopController.getCreateShop);

router.post('/create', shopController.postCreateShop);

router.get('/userControl/:id', shopController.getUserControlShop )

module.exports = router;