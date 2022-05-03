const mongoose = require('mongoose') 
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    secret: { type: String, required: true },
})
