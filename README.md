# Abstract Syntax Tree Technical Documentation

[Deployed Link](https://ast-rule-engine-livid.vercel.app/)
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


