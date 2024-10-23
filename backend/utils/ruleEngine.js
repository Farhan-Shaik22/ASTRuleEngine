const { parse } = require('acorn');

// Class representing a node in the Abstract Syntax Tree (AST)
class Node {
    constructor(type, left = null, right = null, value = null) {
        this.type = type;  // Type of the node (operator or operand)
        this.left = left;  // Left child node
        this.right = right; // Right child node
        this.value = value; // Value of the node (operator or operand value)
    }
}

// Operators and attributes used in rule validation
const OPERATORS = {
    COMPARISON: ['>', '<', '>=', '<=', '='], // Comparison operators
    LOGICAL: ['AND', 'OR', 'NOT'] // Logical operators
};

// Catalog of valid attributes
const ATTRIBUTE_CATALOG = ['age', 'department', 'salary', 'spend', 'experience']; 

// Combine all operators into a single array for easier validation
const ALL_OPERATORS = [...OPERATORS.COMPARISON, ...OPERATORS.LOGICAL];

// Function to validate matching parentheses in the rule string
function validateParentheses(ruleString) {
    const stack = []; // Stack to track opening parentheses
    
    for (const char of ruleString) {
        if (char === '(') {
            stack.push(char); // Push opening parenthesis onto stack
        } else if (char === ')') {
            if (stack.length === 0) {
                return false; // Return false if there is a closing parenthesis without a matching opening
            }
            stack.pop(); // Pop the matching opening parenthesis
        }
    }
    
    return stack.length === 0; // Return true if stack is empty (all parentheses matched)
}

// Function to validate the syntax of the tokens generated from the rule string
function validateRuleSyntax(tokens) {
    if (!tokens || tokens.length === 0) return false; // Check for empty tokens

    // Check for adjacent operands without operators
    for (let i = 0; i < tokens.length - 1; i++) {
        const current = tokens[i];
        const next = tokens[i + 1];

        // Check for missing operator between expressions
        if (current === ')' && next === '(') {
            throw new Error('Invalid syntax: Missing logical operator (AND/OR) between expressions');
        }

        // Check for adjacent operands
        if (!ALL_OPERATORS.includes(current) && !ALL_OPERATORS.includes(next) &&
            current !== '(' && next !== ')' && 
            current !== ')' && next !== '(') {
            throw new Error(`Invalid syntax: Missing operator between "${current}" and "${next}"`);
        }

        // Check for adjacent operators
        if (ALL_OPERATORS.includes(current) && ALL_OPERATORS.includes(next)) {
            throw new Error(`Invalid syntax: Adjacent operators "${current}" and "${next}"`);
        }
    }

    // Check for valid operator placement
    let openParenCount = 0; // Count of open parentheses
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        
        if (token === '(') {
            openParenCount++; // Increment for every opening parenthesis
        } else if (token === ')') {
            openParenCount--; // Decrement for every closing parenthesis
            if (openParenCount < 0) {
                throw new Error('Invalid syntax: Unmatched closing parenthesis'); // Unmatched closing parenthesis
            }
        }

        // Check if comparison operator is properly surrounded by operands
        if (OPERATORS.COMPARISON.includes(token)) {
            if (i === 0 || i === tokens.length - 1) {
                throw new Error(`Invalid syntax: Comparison operator "${token}" at invalid position`); // Invalid position
            }
            const prev = tokens[i - 1];
            const next = tokens[i + 1];
            if (ALL_OPERATORS.includes(prev) || ALL_OPERATORS.includes(next)) {
                throw new Error(`Invalid syntax: Comparison operator "${token}" must be between operands`); // Invalid surrounding
            }
        }

        // Check if logical operator is properly placed
        if (OPERATORS.LOGICAL.includes(token) && token !== 'NOT') {
            if (i === 0 || i === tokens.length - 1) {
                throw new Error(`Invalid syntax: Logical operator "${token}" at invalid position`); // Invalid position for logical operator
            }
        }
    }

    if (openParenCount !== 0) {
        throw new Error('Invalid syntax: Unmatched opening parenthesis'); // Unmatched opening parenthesis
    }

    return true; // Syntax is valid
}

// Function to tokenize the rule string into manageable parts
function tokenizeRule(ruleString) {
    if (typeof ruleString !== 'string') {
        throw new TypeError('Rule must be a string'); // Ensure input is a string
    }

    // Regular expression to match tokens (operands, operators, parentheses)
    const regex = /('(?:[^'\\]|\\.)*'|\(|\)|\w+|>=|<=|>|<|=|AND|OR|NOT)/g;
    const tokens = ruleString.match(regex); // Extract tokens based on regex

    if (!tokens) {
        throw new Error('Invalid rule string: Unable to parse tokens'); // Failed to parse tokens
    }

    // Check for invalid characters
    const cleanedString = ruleString.replace(/\s+/g, ''); // Remove whitespace
    const joinedTokens = tokens.join(''); // Join tokens back into a string
    if (cleanedString !== joinedTokens) {
        throw new Error('Invalid rule string: Contains unsupported characters'); // Unsupported characters found
    }

    // Validate syntax of the tokens
    validateRuleSyntax(tokens);

    return tokens; // Return the valid tokens
}

// Function to create a rule and parse it into an AST
function createRule(ruleString) {
    if (!validateParentheses(ruleString)) {
        throw new Error('Invalid rule: Unmatched parentheses'); // Check for unmatched parentheses
    }

    const tokens = tokenizeRule(ruleString); // Tokenize the rule string
    return parseExpression(tokens); // Parse the tokens into an expression
}

// Function to parse tokens starting from the OR level
function parseExpression(tokens) {
    if (!Array.isArray(tokens) || tokens.length === 0) {
        throw new Error('Invalid tokens: Expected non-empty array'); // Ensure tokens are valid
    }
    return parseOR(tokens); // Start parsing at the OR level
}

// Function to parse tokens at the OR level
function parseOR(tokens) {
    let left = parseAND(tokens); // Parse the left-hand side as AND

    // Loop to handle multiple OR conditions
    while (tokens.length > 0 && tokens[0] === 'OR') {
        tokens.shift(); // Consume 'OR'
        if (tokens.length === 0) {
            throw new Error('Invalid rule: OR operator missing right operand'); // Check for right operand
        }
        const right = parseAND(tokens); // Parse the right-hand side as AND
        left = new Node('operator', left, right, 'OR'); // Create a new OR node in the AST
    }
    
    return left; // Return the resulting AST
}

// Function to parse tokens at the AND level
function parseAND(tokens) {
    let left = parseNOT(tokens); // Parse the left-hand side as NOT
    
    // Loop to handle multiple AND conditions
    while (tokens.length > 0 && tokens[0] === 'AND') {
        tokens.shift(); // Consume 'AND'
        if (tokens.length === 0) {
            throw new Error('Invalid rule: AND operator missing right operand'); // Check for right operand
        }
        const right = parseNOT(tokens); // Parse the right-hand side as NOT
        left = new Node('operator', left, right, 'AND'); // Create a new AND node in the AST
    }
    
    return left; // Return the resulting AST
}

// Function to parse tokens at the NOT level
function parseNOT(tokens) {
    if (tokens[0] === 'NOT') {
        tokens.shift(); // Consume 'NOT'
        if (tokens.length === 0) {
            throw new Error('Invalid rule: NOT operator missing operand'); // Check for operand
        }
        const operand = parseNOT(tokens); // Recursively parse the operand
        return new Node('operator', operand, null, 'NOT'); // Create a NOT node in the AST
    }
    return parseComparison(tokens); // Otherwise, parse as comparison
}

// Function to parse comparison expressions
function parseComparison(tokens) {
    if (tokens.length < 3) {
        throw new Error('Invalid comparison: Expected format "operand operator operand"'); // Ensure valid comparison format
    }

    // Check for parentheses around expressions
    if (tokens[0] === '(') {
        tokens.shift(); // Consume '('
        const result = parseOR(tokens); // Parse the inner expression
        if (tokens[0] !== ')') {
            throw new Error('Invalid rule: Missing closing parenthesis'); // Check for closing parenthesis
        }
        tokens.shift(); // Consume ')'
        return result; // Return the result of the inner expression
    }

    const leftValue = tokens.shift(); // Get the left operand

    // Validate that the left operand is part of the attribute catalog
    if (!ATTRIBUTE_CATALOG.includes(leftValue.toLowerCase())) {
        throw new Error(`Invalid attribute: ${leftValue} is not part of the attribute catalog`); // Invalid attribute
    }

    const operator = tokens.shift(); // Get the comparison operator
    // Validate the operator
    if (!OPERATORS.COMPARISON.includes(operator)) {
        throw new Error(`Invalid operator: ${operator}. Expected one of ${OPERATORS.COMPARISON.join(', ')}`); // Invalid operator
    }

    const rightValue = tokens.shift()?.replace(/^'|'$/g, ''); // Get and clean the right operand
    if (!rightValue) {
        throw new Error('Invalid comparison: Missing right operand'); // Check for right operand
    }

    // Create a comparison node in the AST
    return new Node(
        'operator',
        new Node('operand', null, null, leftValue),
        new Node('operand', null, null, rightValue),
        operator
    );
}

// Function to count the number of AND and OR operators in the AST
function countOperators(ast) {
    if (!ast || typeof ast !== 'object') {
        throw new TypeError('Invalid AST: Expected object'); // Ensure valid AST
    }

    const counts = { AND: 0, OR: 0 }; // Initialize operator counts

    // Recursive function to traverse the AST
    function traverse(node) {
        if (node?.type === 'operator') {
            if (node.value === 'AND' || node.value === 'OR') {
                counts[node.value]++; // Increment count for AND/OR operators
            }
            if (node.left) traverse(node.left); // Traverse left subtree
            if (node.right) traverse(node.right); // Traverse right subtree
        }
    }

    traverse(ast); // Start traversing from the root
    return counts; // Return the counts of operators
}

// Function to combine multiple ASTs based on a heuristic
function combineRulesWithHeuristic(asts) {
    if (!Array.isArray(asts) || asts.length === 0) {
        throw new Error('Invalid input: Expected non-empty array of ASTs'); // Validate input
    }

    const operatorCounts = { AND: 0, OR: 0 }; // Initialize operator counts
    
    asts.forEach(ast => {
        const counts = countOperators(ast); // Count operators in each AST
        operatorCounts.AND += counts.AND; // Aggregate AND counts
        operatorCounts.OR += counts.OR; // Aggregate OR counts
    });

    // Determine the most frequent operator
    const mostFrequentOperator = operatorCounts.AND >= operatorCounts.OR ? 'AND' : 'OR';
    
    // Combine ASTs using the most frequent operator
    return [asts.reduce((combined, ast) => 
        new Node('operator', combined, ast, mostFrequentOperator)
    ), mostFrequentOperator];
}

// Function to evaluate a rule based on its AST and provided data
function evaluateRule(ast, data) {
    if (!ast || typeof ast !== 'object') {
        throw new TypeError('Invalid AST: Expected object'); // Ensure valid AST
    }

    if (!data || typeof data !== 'object') {
        throw new TypeError('Invalid data: Expected object'); // Ensure valid data
    }

    if (ast.type === 'operator') {
        switch (ast.value) {
            case 'AND':
            case 'OR': {
                // Evaluate both sides of the operator
                const leftEval = evaluateRule(ast.left, data);
                const rightEval = evaluateRule(ast.right, data);
                return ast.value === 'AND' ? leftEval && rightEval : leftEval || rightEval; // Return result based on operator
            }
            case 'NOT':
                return !evaluateRule(ast.left, data); // Negate the evaluation of the left operand
            default: {
                const leftOperand = ast.left.value; // Get the left operand's value
                if (!(leftOperand in data)) {
                    throw new Error(`Missing data for operand: ${leftOperand}`); // Check for missing data
                }

                const dataValue = data[leftOperand]; // Get the value from data
                const rightOperand = ast.right.value; // Get the right operand's value

                // Perform the appropriate comparison based on the operator
                switch (ast.value) {
                    case '>': return Number(dataValue) > Number(rightOperand);
                    case '<': return Number(dataValue) < Number(rightOperand);
                    case '>=': return Number(dataValue) >= Number(rightOperand);
                    case '<=': return Number(dataValue) <= Number(rightOperand);
                    case '=': return String(dataValue).trim().toLowerCase() === 
                                    String(rightOperand).trim().toLowerCase();
                    default:
                        throw new Error(`Unsupported operator: ${ast.value}`); // Handle unsupported operators
                }
            }
        }
    } else if (ast.type === 'operand') {
        return ast.value; // Return the operand's value
    }

    throw new Error('Invalid AST structure'); // Handle invalid AST structure
}

// Exporting functions and constants for use in other modules
module.exports = {
    createRule,
    combineRulesWithHeuristic,
    evaluateRule,
    validateParentheses,
    validateRuleSyntax,
    tokenizeRule,
    parseExpression,
    Node,
    OPERATORS,
    ALL_OPERATORS
};
