const jwt = require("jsonwebtoken");
const path = require("path");
const root = path.dirname(require.main.filename);
const bcrypt = require("bcrypt");

const User = require(root + "/models/users-model");
const Session = require(root + "/models/sessions-model");

module.exports.Login = async (req, res) => {
  const email = req.body.gmail;
  const password = req.body.password;
  const queryEmail = await User.findOne({ gmail: email });
  
  if (!queryEmail || !bcrypt.compareSync(password, queryEmail.password)) {
    const message = {
      message: "Validation Error",
      Error: "Wrong email or password"
    };
    res.json(message);
  } else {
    const priority = queryEmail.isAdmin;
    const id = queryEmail.id;
    const token = jwt.sign({ email, password, priority, id }, process.env.TOKEN_SECRET);
    const responseData = {
      token: {
        tokenType: "bearer",
        accessToken: token
      },
      userId: queryEmail.id
    };
    res.status(200).json(responseData);
  }
};
