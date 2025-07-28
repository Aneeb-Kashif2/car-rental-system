// Assuming this is in a file like 'controller/carController.js'
// or if it's part of adminController, ensure it's imported correctly.
const Car = require("../models/Car");

const getAllCars = async (req , res) =>{
    try{
       const cars = await Car.find();
       res.status(200).json(cars);
    }
    catch(err){ // <<< FIX: changed 'error' to 'err'
       console.error("Failed to fetch cars:", err); // Log the actual error
       res.status(500).json({ message: 'Failed to fetch cars', error: err.message }); // Send error message
    }
};

module.exports = {
    getAllCars
};