const express = require("express");
const Router = express.Router();
const db = require("../../database");
const {auth} = require("../../middlewares");
const createUser = require("./create.js");
const select = require("./select.js");

Router.post("/created", auth(["admin"]), createUser(db));
Router.get("/all", auth(["admin"]), select.all(db));
Router.get("/:id", auth(["admin", "gerant"]), select.one(db)); 

module.exports = Router;