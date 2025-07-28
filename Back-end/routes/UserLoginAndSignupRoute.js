const express = require("express");
const {handleUserSignup} = require("../controller/handleUserSignup");
const {handleUserLogin} = require("../controller/handleUserLogin")
const routes = express.Router();

routes.post("/signup" , handleUserSignup)
routes.post("/login" , handleUserLogin)

module.exports = routes;