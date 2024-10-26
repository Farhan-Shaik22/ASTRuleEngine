# Abstract Syntax Tree Technical Documentation

## Deployed Link

### [Click Here](https://ast-rule-engine-livid.vercel.app/)

## Table of Contents

- [Steps to Run the Project](#steps-to-run-the-project)
- [Environment Variables](#environment-variables)
- [Things to Keep in Mind](#things-to-keep-in-mind)
- [Functionalities Implemented](#functionalities-implemented)
- [Tech Stack](#tech-stack)

## Steps to Run the Project

1. Clone the repository:

   ```bash
   git clone https://github.com/Farhan-Shaik22/ASTRuleEngine.git
   ```

2. Install dependencies:

   ```bash
   cd backend
   npm install
   ```
    ```bash
   cd frontend
   npm install
   ```

3. Run the Frontend Development Server:

   ```bash
   cd frontend
   npm run dev
   ```
4. Run the Backend Server:

   ```bash
   cd backend
   npm start
   ```

## Environment Variables

1.Backend .env file
   ```bash
  AES_SECRET_KEY=put a secret key of your choice
  SECRET_TOKEN = put a secret token of your choice
  MONGO_STRING= Put your MongoDb string
   ```
1.Backend .env.local file
   ```bash
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= Get this from the [clerk website](https://clerk.com/) after configuring a project for next js.
    CLERK_SECRET_KEY= Get this from the [clerk website](https://clerk.com/) after configuring a project for next js.
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
    NEXT_PUBLIC_API_URL= put the production backend url or localhost
   ```

## Things to Keep in Mind

1. Predefined ATTRIBUTE_CATALOG: ['age', 'department', 'salary', 'spend', 'experience']
2. Predefined Operators: [ AND, OR, < , > , = , >=, <= ]
3. Only use these while creating rules
4. Change the cors configuration in the server.js while using it in local.
5. Create a webhook in the clerk project settings with production server link/webhook/create and also set the token in custom headers 
 in advanced settings and set it as your SECRET_TOKEN set as your environment variable. Select the user.created event.
 ![image](https://github.com/user-attachments/assets/1159c4fd-df28-4ebb-ad0f-ea8214b9a2d0)

## Tech Stack 
- **Frontend**: Next.js with TailwindCSS
- **Backend**: Node.js
- **Database**: MongoDB

## Functionalities Implemented
1. Authorization of users using Clerk.
2. User-based storage of records.
3. Creating a Rule (with Attribute catalog).
4. Combining Rules.
5. Evaluation of rules using a JSON file or object with variables and values.
6. Visualization of the rules as the formed AST trees.

## Creation of a Rule
The process of adding a rule involves several sophisticated steps:

### Initial Rule Creation (createRule function):
- Takes a rule string as input.
- Validates parentheses using `validateParentheses`.
- Tokenizes the rule string using `tokenizeRule`.
- Parses the tokens into an Abstract Syntax Tree (AST).

### Tokenization Process (tokenizeRule function):
- Uses regex `/('(?:[^'\\]|\\.)*'|\(|\)|\w+|>=|<=|>|<|=|AND|OR|NOT)/g` to break the rule into tokens.
- Validates input is a string.
- Checks for invalid characters.
- Validates syntax using `validateRuleSyntax`.

### Syntax Validation (validateRuleSyntax function):
Checks for:
- Adjacent operands without operators.
- Missing logical operators between expressions.
- Adjacent operators.
- Valid operator placement.
- Proper parentheses matching.
- Valid comparison operator placement.

### AST Construction (Parsing functions):
Uses recursive descent parsing with precedence levels:
- `parseExpression`: Entry point.
- `parseOR`: Handles OR operations.
- `parseAND`: Handles AND operations.
- `parseNOT`: Handles NOT operations.
- `parseComparison`: Handles basic comparisons.

### Node Creation:
Uses Node class to create tree nodes. Each node contains:
- `type`: 'operator' or 'operand'.
- `left`: Left child node.
- `right`: Right child node.
- `value`: Operator or operand value.

The system supports various operators:
- **Comparison**: `>`, `<`, `>=`, `<=`, `=`.
- **Logical**: `AND`, `OR`, `NOT`.

And validates against a predefined `ATTRIBUTE_CATALOG`: `['age', 'department', 'salary', 'spend', 'experience']`.

## Combining Rules
The `combineRulesWithHeuristic` function implements a smart way to combine multiple rules:
- Takes an array of ASTs as input.
- Counts the frequency of AND and OR operators in all ASTs using `countOperators`.
- Determines the most frequent operator (AND or OR).
- Combines all ASTs using the most frequent operator as the joining operator.
- Returns both the combined AST and the operator used for combination. This ensures that rules are combined in a way that matches the dominant logical pattern in the existing rules.

## Evaluation of Rules
The `evaluateRule` function handles the evaluation of rules against provided data:
- Takes an AST and a data object containing variable values.
- Recursively traverses the AST.
- For operators (AND, OR, NOT), evaluates both sides and applies the logical operation.
- For comparisons, retrieves values from the data object and performs the comparison.
- Supports numeric comparisons (`>`, `<`, `>=`, `<=`) and string equality (`=`).
- Throws errors for missing data or invalid operations.
- Returns a boolean indicating whether the rule conditions are met.

## User Authentication
Used Clerk to manage user authentication in the frontend using middleware and to store the users into a database. Configured a webhook that is triggered whenever a user is created for our app.

## Tree Visualization
The application includes a visual representation system for Abstract Syntax Trees (AST). Each rule within the system generates a corresponding AST, which is then rendered as an interactive tree diagram, allowing users to better understand and analyze the rule structure and relationships between different components.

