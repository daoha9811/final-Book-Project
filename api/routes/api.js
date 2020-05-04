const express = require('express');
const router = express.Router();
const path = require('path');
const root = path.dirname(require.main.filename);


const loginApiController = require(root+ "/api/controllers/login-controller");
const transApiController = require(root+ "/api/controllers/transaction-controller");


router.get('/transaction', transApiController.getTrans);

router.post('/login', loginApiController.Login );

module.exports = router;