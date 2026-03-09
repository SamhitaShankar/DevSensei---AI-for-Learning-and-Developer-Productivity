# DevSensei

AI-powered code insights for modern developers. DevSensei acts as a virtual senior mentor, helping you understand complex codebases, debug logic, and improve architectural quality through direct GitHub integration.

## Technical Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Frontend**: React 19
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI (Radix UI)
- **Icons**: Lucide React
- **AI Integration**: Genkit (Custom provider integration for Lambda-based analysis)
- **Authentication**: Direct GitHub OAuth 2.0 via Next.js API Routes

## Local Development Setup

Follow these steps to run DevSensei on your local machine:

1.  **Install Node.js**: Download and install the "LTS" version of [Node.js](https://nodejs.org/) for your operating system. This includes `npm`.
2.  **Configure Environment**: Create a `.env` file in the root directory with your GitHub OAuth App credentials:
    ```env
    NEXT_PUBLIC_GITHUB_CLIENT_ID=your_client_id
    GITHUB_CLIENT_SECRET=your_client_secret
    ```
    *Note: The `NEXT_PUBLIC_` prefix on the client ID is required.*
3.  **Update GitHub OAuth App**: In your GitHub Developer settings for your OAuth App, ensure the **"Authorization callback URL"** is set to `http://localhost:9002/api/github/callback`.
4.  **Install Dependencies**: Open a terminal in the project root and run:
    ```bash
    npm install
    ```
5.  **Start the Development Server**: Run the following command to start the Next.js app:
    ```bash
    npm run dev
    ```
6.  **Access the App**: Navigate to **[http://localhost:9002](http://localhost:9002)** in your browser.

## Key Features
- **Code Explanation**: Deep-dive into selected code snippets.
- **Bug Detection**: Identify logic errors and security vulnerabilities.
- **Architectural Analysis**: Full-repository mapping of data flow and design patterns.
- **Improvement Suggestions**: Refactoring tips for performance and readability.

## Key Scripts
- `npm run dev`: Starts the Next.js development server on port 9002.
- `npm run build`: Creates an optimized production build for Next.js.
- `npm run start`: Starts the production Next.js server.

## Troubleshooting
- **Execution Policy Error**: If you see an error about "running scripts is disabled on this system" when running `npm`, open PowerShell as Administrator and run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`.
- **Port Busy**: If port 9002 is already in use, you can update the port in the `dev` script inside `package.json`.
