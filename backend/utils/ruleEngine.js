const { parse } = require('acorn');

// Define AST Node structure
class Node {
    constructor(type, left = null, right = null, value = null) {
        this.type = type;  // "operator" or "operand"
        this.left = left;
        this.right = right;
        this.value = value;
    }
}

function validParanthesis(ruleString) {
    let stack = [];
    for (let i = 0; i < ruleString.length; i++) {
        if (ruleString.charAt(i) === "(") {
            stack.push(ruleString.charAt(i));
        } else if (ruleString.charAt(i) === ")") {
            if (stack.length === 0) {
                return false;
            }
            stack.pop();
        }
    }
    return stack.length === 0;
}

function createRule(ruleString) {
    const tokens = tokenizeRule(ruleString);
    const ast = parseExpression(tokens);
    return ast;
}

// Tokenizes the input rule string into manageable components
function tokenizeRule(ruleString) {
    const regex = /\(|\)|\w+|'[^']+'|>=|<=|>|<|=|AND|OR|NOT/g;
    return ruleString.match(regex);
}

// Builds an AST from a tokenized rule expression
function parseExpression(tokens) {
    return parseOR(tokens);
}

function parseOR(tokens) {
    let left = parseAND(tokens);
    while (tokens.length > 0 && tokens[0] === 'OR') {
        tokens.shift(); // consume 'OR'
        const right = parseAND(tokens);
        left = new Node('operator', left, right, 'OR');
    }
    return left;
}

function parseAND(tokens) {
    let left = parseNOT(tokens);
    while (tokens.length > 0 && tokens[0] === 'AND') {
        tokens.shift(); // consume 'AND'
        const right = parseNOT(tokens);
        left = new Node('operator', left, right, 'AND');
    }
    return left;
}

function parseNOT(tokens) {
    if (tokens[0] === 'NOT') {
        tokens.shift(); // consume 'NOT'
        const operand = parseNOT(tokens); // NOT has higher precedence than comparison
        return new Node('operator', operand, null, 'NOT');
    }
    return parseComparison(tokens);
}

function parseComparison(tokens) {
    if (tokens[0] === '(') {
        tokens.shift();
        const result = parseOR(tokens);
        if (tokens[0] !== ')') throw new Error("Expected closing parenthesis");
        tokens.shift();
        return result;
    }

    const leftOperand = tokens.shift(); // e.g. 'age'
    const operator = tokens.shift(); // e.g. '>'
    const rightOperand = tokens.shift().replace(/'/g, ''); // e.g. '30' or 'Sales'

    // Now the operator is the root node, and the operands are its children
    return new Node('operator', new Node('operand', null, null, leftOperand), new Node('operand', null, null, rightOperand), operator);
}

// Helper function to count operators in an AST
function countOperators(ast) {
    let counts = { AND: 0, OR: 0 };

    function traverse(node) {
        if (node.type === 'operator') {
            if (node.value === 'AND' || node.value === 'OR') {
                counts[node.value]++;
            }
            traverse(node.left);
            traverse(node.right);
        }
    }

    traverse(ast);
    return counts;
}

// Combine rules based on most frequent operator heuristic
function combineRulesWithHeuristic(asts) {
    // Count operators in each AST
    let operatorCounts = { AND: 0, OR: 0 };
    asts.forEach(ast => {
        const counts = countOperators(ast);
        operatorCounts.AND += counts.AND;
        operatorCounts.OR += counts.OR;
    });

    // Find the most frequent operator
    const mostFrequentOperator = operatorCounts.AND >= operatorCounts.OR ? 'AND' : 'OR';

    // Combine ASTs using the most frequent operator
    let combinedAst = asts[0];
    for (let i = 1; i < asts.length; i++) {
        combinedAst = new Node('operator', combinedAst, asts[i], mostFrequentOperator);
    }

    return combinedAst;
}

// Evaluate a rule AST against user data
function evaluateRule(ast, data) {
    if (ast.type === 'operator') {
        if (ast.value === 'AND' || ast.value === 'OR') {
            const leftEval = evaluateRule(ast.left, data);
            const rightEval = evaluateRule(ast.right, data);

            if (ast.value === 'AND') {
                return leftEval && rightEval;
            } else if (ast.value === 'OR') {
                return leftEval || rightEval;
            }
        } else {
            // Handle comparison operators like >, <, =, etc.
            const leftOperand = ast.left.value;  // e.g., 'age'
            const rightOperand = ast.right.value; // e.g., '30'
            const operator = ast.value;
            const dataValue = data[leftOperand];

            if (operator === '>') return dataValue > rightOperand;
            if (operator === '<') return dataValue < rightOperand;
            if (operator === '>=') return dataValue >= rightOperand;
            if (operator === '<=') return dataValue <= rightOperand;
            if (operator === '=') return dataValue === rightOperand;
        }
    } else if (ast.type === 'operand') {
        return ast.value;
    }

    throw new Error('Invalid AST or data');
}

module.exports = { createRule, combineRulesWithHeuristic, evaluateRule, validParanthesis };
