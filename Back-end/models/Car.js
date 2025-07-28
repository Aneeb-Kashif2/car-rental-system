// models/Car.js
const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true
        },
        brand: {
            type: String,
            required: true,
        },
        rentPerDay: {
            type: Number,
            required: true
        },
        capacity: {
            type: Number,
            required: true
        },
        isAvailable: { // <<< ADD THIS FIELD
            type: Boolean,
            default: true,
        },
    }
);

const Car = mongoose.model('Car', carSchema);

module.exports = Car;