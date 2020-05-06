const express = require("express");
const path = require("path");
const root = path.dirname(require.main.filename); // /app
const router = express.Router();
const multer = require("multer");

var upload = multer({ dest: root + '/public/uploads' });

const registerController = require(root+'/controllers/create.controller.js')
const usersMiddleware = require(root + "/middleware/users-validate.js");


router.get('/', registerController.getCreate);

router.post('/', 
  upload.single('avatar'), 
  usersMiddleware.check, 
  registerController.postCreate
);

module.exports = router;
