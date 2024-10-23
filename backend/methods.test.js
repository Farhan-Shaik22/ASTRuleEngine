const {
    createRule,
    evaluateRule,
} = require('./utils/ruleEngine'); 

describe('Rule Engine Tests', () => {
    
    test('should evaluate age >= 18 correctly (true)', () => {
        const ruleString = "age >= 18";
        const data = { age: 20 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should evaluate age >= 18 correctly (false)', () => {
        const ruleString = "age >= 18";
        const data = { age: 17 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(false);
    });

    test('should evaluate age >= 18 AND salary > 30000 correctly (true)', () => {
        const ruleString = "age >= 18 AND salary > 30000";
        const data = { age: 25, salary: 35000 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should evaluate age >= 18 AND salary > 30000 correctly (false)', () => {
        const ruleString = "age >= 18 AND salary > 30000";
        const data = { age: 17, salary: 35000 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(false);
    });

    test('should evaluate age < 18 OR spend > 1000 correctly (true)', () => {
        const ruleString = "age < 18 OR spend > 1000";
        const data = { age: 16, spend: 500 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should evaluate age < 18 OR spend > 1000 correctly (false)', () => {
        const ruleString = "age < 18 OR spend > 1000";
        const data = { age: 18, spend: 500 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(false);
    });

    test('should evaluate age >= 18 AND (salary > 30000 OR spend < 500) correctly (true)', () => {
        const ruleString = "age >= 18 AND (salary > 30000 OR spend < 500)";
        const data = { age: 30, salary: 25000, spend: 300 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should evaluate age >= 18 AND (salary > 30000 OR spend < 500) AND department = "IT" correctly (true)', () => {
        const ruleString = "age >= 18 AND (salary > 30000 OR spend < 500) AND department = 'IT'";
        const data = { age: 30, salary: 25000, spend: 300, department: 'IT' };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should evaluate NOT (department = "HR" AND salary < 40000) correctly (true)', () => {
        const ruleString = "NOT (department = 'HR' AND salary < 40000)";
        const data = { department: 'IT', salary: 35000 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should throw an error for an invalid attribute', () => {
        const ruleString = "age >= 18 AND invalid_attribute > 30000";
        const data = { age: 25 };
        
        expect(() => {
            const ast = createRule(ruleString);
            evaluateRule(ast, data);
        }).toThrow('Invalid attribute: invalid_attribute is not part of the attribute catalog');
    });

    test('should throw an error for unmatched parentheses', () => {
        const ruleString = "(age >= 18 AND salary > 30000";
        const data = { age: 25, salary: 35000 };

        expect(() => {
            createRule(ruleString);
        }).toThrow('Invalid rule: Unmatched parentheses');
    });

    test('should throw an error for invalid syntax (missing operator)', () => {
        const ruleString = "age >= 18 salary > 30000";
        const data = { age: 25, salary: 35000 };

        expect(() => {
            const ast = createRule(ruleString);
            evaluateRule(ast, data);
        }).toThrow('Invalid syntax: Missing operator between "18" and "salary"');
    });

    test('should throw an error for invalid syntax (adjacent operators)', () => {
        const ruleString = "age >= 18 AND OR salary > 30000";
        const data = { age: 25, salary: 35000 };

        expect(() => {
            const ast = createRule(ruleString);
            evaluateRule(ast, data);
        }).toThrow('Invalid syntax: Adjacent operators "AND" and "OR"');
    });

    test('should evaluate NOT (age < 18 OR spend > 1000) AND salary >= 30000 correctly (true)', () => {
        const ruleString = "NOT (age < 18 OR spend > 1000) AND salary >= 30000";
        const data = { age: 20, spend: 800, salary: 35000 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should evaluate age >= 18 AND salary > 30000 OR spend < 500 correctly (true)', () => {
        const ruleString = "age >= 18 AND salary > 30000 OR spend < 500";
        const data = { age: 30, salary: 35000, spend: 300 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should throw an error for empty rule string', () => {
        const ruleString = "";
        const data = { age: 25 };

        expect(() => {
            createRule(ruleString);
        }).toThrow('Invalid rule string: Unable to parse tokens');
    });

    test('should throw an error for unsupported characters', () => {
        const ruleString = "age >= 18 # AND salary > 30000";
        const data = { age: 25, salary: 35000 };

        expect(() => {
            const ast = createRule(ruleString);
            evaluateRule(ast, data);
        }).toThrow('Invalid rule string: Contains unsupported characters');
    });

    test('should handle whitespace correctly', () => {
        const ruleString = "    age     >=     18     ";
        const data = { age: 20 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should evaluate all comparison operators correctly (true)', () => {
        const ruleString = "age > 18 AND age < 30 AND age >= 25 AND age <= 29 AND age = 27";
        const data = { age: 27 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should evaluate age >= 18 correctly (true)', () => {
        const ruleString = "age >= 18";
        const data = { age: 20 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should evaluate age >= 18 correctly (false)', () => {
        const ruleString = "age >= 18";
        const data = { age: 17 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(false);
    });

    test('should evaluate age >= 18 AND salary > 30000 correctly (true)', () => {
        const ruleString = "age >= 18 AND salary > 30000";
        const data = { age: 25, salary: 35000 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should evaluate age >= 18 AND salary > 30000 correctly (false)', () => {
        const ruleString = "age >= 18 AND salary > 30000";
        const data = { age: 17, salary: 35000 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(false);
    });

    test('should evaluate age < 18 OR spend > 1000 correctly (true)', () => {
        const ruleString = "age < 18 OR spend > 1000";
        const data = { age: 16, spend: 500 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should evaluate age < 18 OR spend > 1000 correctly (false)', () => {
        const ruleString = "age < 18 OR spend > 1000";
        const data = { age: 18, spend: 500 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(false);
    });

    test('should evaluate age >= 18 AND (salary > 30000 OR spend < 500) correctly (true)', () => {
        const ruleString = "age >= 18 AND (salary > 30000 OR spend < 500)";
        const data = { age: 30, salary: 25000, spend: 300 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should evaluate age >= 18 AND (salary > 30000 OR spend < 500) AND department = "IT" correctly (true)', () => {
        const ruleString = "age >= 18 AND (salary > 30000 OR spend < 500) AND department = 'IT'";
        const data = { age: 30, salary: 25000, spend: 300, department: 'IT' };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should evaluate NOT (department = "HR" AND salary < 40000) correctly (true)', () => {
        const ruleString = "NOT (department = 'HR' AND salary < 40000)";
        const data = { department: 'IT', salary: 35000 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should throw an error for an invalid attribute', () => {
        const ruleString = "age >= 18 AND invalid_attribute > 30000";
        const data = { age: 25 };
        
        expect(() => {
            const ast = createRule(ruleString);
            evaluateRule(ast, data);
        }).toThrow('Invalid attribute: invalid_attribute is not part of the attribute catalog');
    });

    test('should throw an error for unmatched parentheses', () => {
        const ruleString = "(age >= 18 AND salary > 30000";
        const data = { age: 25, salary: 35000 };

        expect(() => {
            createRule(ruleString);
        }).toThrow('Invalid rule: Unmatched parentheses');
    });

    test('should throw an error for invalid syntax (missing operator)', () => {
        const ruleString = "age >= 18 salary > 30000";
        const data = { age: 25, salary: 35000 };

        expect(() => {
            const ast = createRule(ruleString);
            evaluateRule(ast, data);
        }).toThrow('Invalid syntax: Missing operator between "18" and "salary"');
    });

    test('should throw an error for invalid syntax (adjacent operators)', () => {
        const ruleString = "age >= 18 AND OR salary > 30000";
        const data = { age: 25, salary: 35000 };

        expect(() => {
            const ast = createRule(ruleString);
            evaluateRule(ast, data);
        }).toThrow('Invalid syntax: Adjacent operators "AND" and "OR"');
    });

    test('should evaluate NOT (age < 18 OR spend > 1000) AND salary >= 30000 correctly (true)', () => {
        const ruleString = "NOT (age < 18 OR spend > 1000) AND salary >= 30000";
        const data = { age: 20, spend: 800, salary: 35000 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should evaluate age >= 18 AND salary > 30000 OR spend < 500 correctly (true)', () => {
        const ruleString = "age >= 18 AND salary > 30000 OR spend < 500";
        const data = { age: 30, salary: 35000, spend: 300 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should throw an error for empty rule string', () => {
        const ruleString = "";
        const data = { age: 25 };

        expect(() => {
            createRule(ruleString);
        }).toThrow('Invalid rule string: Unable to parse tokens');
    });

    test('should throw an error for unsupported characters', () => {
        const ruleString = "age >= 18 # AND salary > 30000";
        const data = { age: 25, salary: 35000 };

        expect(() => {
            const ast = createRule(ruleString);
            evaluateRule(ast, data);
        }).toThrow('Invalid rule string: Contains unsupported characters');
    });

    test('should handle whitespace correctly', () => {
        const ruleString = "    age     >=     18     ";
        const data = { age: 20 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should evaluate all comparison operators correctly (true)', () => {
        const ruleString = "age > 18 AND age < 30 AND age >= 25 AND age <= 29 AND age = 27";
        const data = { age: 27 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should evaluate (age < 30 AND salary < 50000) OR (department = "Engineering" AND experience > 3)', () => {
        const ruleString = "(age < 30 AND salary < 50000) OR (department = 'Engineering' AND experience > 3)";
        const data = { age: 29, salary: 40000, department: 'Engineering', experience: 4 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(true);
    });

    test('should evaluate NOT (salary < 30000 OR experience < 2) correctly (false)', () => {
        const ruleString = "NOT (salary < 30000 OR experience < 2)";
        const data = { salary: 25000, experience: 1 };
        const ast = createRule(ruleString);
        const result = evaluateRule(ast, data);
        expect(result).toBe(false);
    });

});
