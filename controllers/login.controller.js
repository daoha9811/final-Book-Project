const path = require("path");
const root = path.dirname(require.main.filename);

const db = require(root + "/db.model.js");

const User = require(root + "/models/users-model");
const Session = require(root + "/models/sessions-model");

module.exports.getLogin = async (req, res) => {
  let sessionId = req.signedCookies.sessionId || "";
  //lay count de hien len views
  const currentSession = await Session.findById(sessionId);
  const sessionCart = currentSession.carts || {}
  let count =
    Object.values(sessionCart ? sessionCart : {}).reduce((a, b) => a + b, 0) ||
    0;

  res.render("authen/login", { Errors: [], count });
};

module.exports.postLogin = async (req, res) => {
  const guestSSID = req.signedCookies.sessionId;
  const user = await User.findOne({ gmail: req.body.gmail });
  const id = user._id;
  res.cookie("userId", id, {
    signed: true
  });
  const currentSession = await Session.findById(id);
  //check xem trong database da co session cua user nay chua
  if (!currentSession) {
    await Session.create({ _id: id });
  }
  //logic xu ly exchange du lieu giua guest va user
  if (guestSSID && guestSSID != id) {
    //exchange du lieu
    let guestSessions = await Session.findById(guestSSID);
    let userSessions = await Session.findById(id);

    if (guestSessions.carts) {
      for (let i in guestSessions.carts) {
        if (userSessions["carts"][i]) {
          userSessions["carts"][i] += guestSessions["carts"][i];
        } else {
          userSessions["carts"][i] = guestSessions["carts"][i];
        }
      }
    }
    //write lai trong db
    Session.update({ _id: id }, { $set: { carts: userSessions["carts"] } });
  }
  res.cookie("sessionId", id, {
    signed: true
  });

  res.redirect("/users");
};
