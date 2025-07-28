// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    age: { // <<< CHANGE TO NUMBER TYPE
        type: Number,
        required: true,
        min: [18, 'Must be at least 18 years old.'], // Schema-level validation for age
    },
    cnic: { // <<< ADD CNIC FIELD
        type: String,
        required: true,
        unique: true,
        match: [/^\d{13}$/, 'CNIC must be exactly 13 digits.'],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;