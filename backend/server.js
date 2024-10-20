const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { createRule, combineRulesWithHeuristic, evaluateRule, validParanthesis } = require('./utils/ruleEngine');
const Rule = require('./models/rule');
const cors= require('cors');


// Initialize Express
const app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000', // Allow only this origin
    credentials: true,               // If you are using cookies or auth headers
}));

// Connect to MongoDB
mongoose.connect('mongodb+srv://farhan2262003:we9jNupRKBPAVgb9@devtesting.hu6xu.mongodb.net/?retryWrites=true&w=majority&appName=DevTesting', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Create rule
app.post('/create_rule', async (req, res) => {
    const { ruleString } = req.body;
    try {
        if(!validParanthesis(ruleString)){
            return res.status(400).send({error : "Invalid Paranthesis"});
        }
        const ast = createRule(ruleString);
        const rule = new Rule({ ruleString, ast });
        await rule.save();
        res.status(201).send({ message: 'Rule created', ast });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.post('/get', async(req, res)=> {
    const {id} = req.body;
    try{
        const rule = await Rule.findById(id);  // Using findById for clarity
        if (!rule) {
            return res.status(404).send({ message: "Rule not found" });  // Handling if rule is not found
        }
        const ast = rule.ast;
        res.status(201).send({ast});
    }
    catch(error){
        res.status(400).send({ error: error.message });
    }
});

// Combine rules
app.post('/combine_rules', async (req, res) => {
    const { ruleIds } = req.body;
    try {
        const rules = await Rule.find({ _id: { $in: ruleIds } });
        const asts = rules.map(rule => rule.ast);
        const combinedAst = combineRulesWithHeuristic(asts);
        res.status(200).send({ message: 'Rules combined', combinedAst });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Evaluate rule
app.post('/evaluate_rule', async (req, res) => {
    const { ruleId, data } = req.body;
    try {
        const rule = await Rule.findById(ruleId);
        const result = evaluateRule(rule.ast, data);
        res.status(200).send({ result });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
