const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Rule schema
const ruleSchema = new Schema({
    ruleString: { type: String, required: true },
    ast: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create and export the Rule model
module.exports = mongoose.model('Rule', ruleSchema);
