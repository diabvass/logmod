const db = require("../database")
const express = require("express");
const Router = express.Router();
const users = require("./users");
const {connected} = require("../middlewares")
const login = require("./login.js");

Router.use("/login", connected, login(db));
// deconnecte
Router.get("/logout", (__req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });

  res.json({
    success: true,
    message: "Déconnexion réussie"
  });
});


// users routes
Router.use("/users", users);

module.exports = Router;