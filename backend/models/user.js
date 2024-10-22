const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Rule schema
const userSchema = new Schema({
    userid:{ type: String, required: true},
    email: { type: String, required: true },
});

// Create and export the Rule model
module.exports = mongoose.model('Users', userSchema);