    const express = require("express");
        
    const { getAllCars }= require("../controller/carController")
    const routes = express.Router();

    routes.get("/" , getAllCars);

    module.exports = routes