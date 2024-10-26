# Abstract Syntax Tree Technical Documentation

## Table of Contents

- [Steps to Run the Project](#steps-to-run-the-project)
- [Environment Variables](#environment-variables)
- [Things to Keep in Mind](#things-to-keep-in-mind)


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
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= Get this from the clerk website after configuring a project in it.
    CLERK_SECRET_KEY= Get this from the clerk website after configuring a project in it.
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
    NEXT_PUBLIC_API_URL= put the production backend url or localhost
   ```

## Things to Keep in Mind

-Predefined ATTRIBUTE_CATALOG: ['age', 'department', 'salary', 'spend', 'experience']
-Predefined Operators: [ AND, OR, < , > , = , >=, <= ]
-Only use these while creating rules
