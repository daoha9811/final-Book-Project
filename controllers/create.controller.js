const path = require("path");
const root = path.dirname(require.main.filename);
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const salt = 10;
const cloudinary = require("cloudinary").v2;

const User = require(root + "/models/users-model");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });


module.exports.getCreate = (req, res) => {
    res.render("users/user-create", {
      Errors: []
    });
  };
  
  module.exports.postCreate = (req, res) => {
    let { name, gmail, password } = req.body;
    //neu khong co file gui len thi imgUrl = mac dinh
    if (!req.file) {
      if (name) {
        bcrypt.hash(password, salt, async (err, hash) => {
          try {
            const newUser = new User({
              name,
              gmail,
              password: hash,
              isAdmin: false
            });
            await newUser.save();
            //newUser.create();
          } catch (error) {
            console.warn(error);
          }
        });
      }
    } else {
      //neu co file thi luu len cloudinary
      const id = mongoose.Types.ObjectId();
      const path = req.file.path;
      cloudinary.uploader.upload(
        path,
        { public_id: `userTest/${id}`, width: 100, height: 100 },
        (err, result) => {
          if (err) {
            console.warn(err);
          }
          if (name) {
            bcrypt.hash(password, salt, async (err, hash) => {
              try {
                await User.create({
                  _id: id,
                  name,
                  gmail,
                  password: hash,
                  imgUrl: result.url,
                  isAdmin: false
                });
              } catch (err) {
                console.warn(err);
              }
            });
          }
        }
      );
    }
    res.redirect("/login");
  };