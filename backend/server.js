const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { createRule, combineRulesWithHeuristic, evaluateRule, validParanthesis } = require('./utils/ruleEngine');
const {encrypt} =require("./utils/encryption");
const Rule = require('./models/rule');
const Users = require('./models/user');
const cors= require('cors');
require('dotenv').config();

// Initialize Express
const app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: '*', 
    credentials: true,               
}));
const mstring = process.env.MONGO_STRING;
// Connect to MongoDB
mongoose.connect(mstring, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


// Create rule
app.post('/create_rule', async (req, res) => {
    const { ruleString } = req.body;
    const{userid} =req.body;
    try {
        if(!validParanthesis(ruleString)){
            console.log("hi");
            return res.status(400).send({error : "Invalid Paranthesis"});
        }
        const ast = createRule(ruleString);
        const rule = new Rule({ userid ,ruleString, ast });
        await rule.save();
        res.status(201).send({ message: 'Rule created', ast });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.post('/webhook/create', async(req,res)=>{
    const {data} =req.body;
    const {token} = req.headers;
    try{
        if(token!=process.env.SECRET_TOKEN){
            return res.status(400).send({ error: "Invalid Token" });
        }
        const userId= encrypt(data.id);
        const Email =data.email_addresses[0].email_address;
        const user=new Users({email: Email, userid: userId});
        await user.save();
        res.status(201).send({ message: 'User created' });
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.post('/api/get', async(req, res)=> {
    const {userid} = req.body;
    try{
        const encrypteduserid= encrypt(userid);
        const user= await Users.find({userid:encrypteduserid});
        if(!user){
            return res.status(404).send({ message: "Invalid User" });
        }
        const rules = await Rule.find({userid : userid});  
        if (!rules) {
            return res.status(404).send({ message: "Rule not found" });  // Handling if rule is not found
        }
        res.status(201).send({rules});
    }
    catch(error){
        res.status(400).send({ error: error.message });
    }
});


app.post('api/ast/get', async(req, res)=> {
    const {id} = req.body;
    try{
        const rule = await Rule.findById({id});  // Using findById for clarity
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
// Combine rules and save as a new rule
app.post('/combine_rules', async (req, res) => {
    const { ruleIds, userid } = req.body;
    try {
        // Fetch the rules from the database by their IDs
        const rules = await Rule.find({ _id: { $in: ruleIds } });
        
        // If no rules found, send error
        if (rules.length === 0) {
            return res.status(404).send({ message: 'Rules not found' });
        }
        const asts = rules.map(rule => rule.ast);
        const ruleStrings = rules.map(rule => rule.ruleString);
        const combined= combineRulesWithHeuristic(asts);
        const combinedAst = combined[0];
        const mostFrequentOperator=combined[1];
        const combinedRuleString = ruleStrings.join(mostFrequentOperator);
        const newRule = new Rule({ userid, ruleString: combinedRuleString, ast: combinedAst });
        await newRule.save();

        // Send response with the combined AST and new rule details
        res.status(201).send({ message: 'Rules combined and saved', combinedRule: newRule });
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
