# AI Trading Assistant

An AI-powered cryptocurrency trading assistant built on Web3, providing natural language interaction, secure analysis, and intelligent trade execution.

## Environment Setup

### Frontend Setup

1.  **Create Environment Variables File**

    Create a file named `.env.local` in the project's root directory and add the following content:

    ```
    # API Configuration
    NEXT_PUBLIC_API_URL=[http://0.0.0.0:8000](http://0.0.0.0:8000)
    NEXT_PUBLIC_WS_URL=ws://0.0.0.0:8000/ws

    # Development Mode Configuration
    NEXT_PUBLIC_DEVELOPMENT_MODE=true
    ```

    In a production environment, `NEXT_PUBLIC_DEVELOPMENT_MODE` should be set to `false`.

2.  **Install Dependencies**

    ```bash
    npm install
    # or
    yarn
    ```

3.  **Start the Development Server**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

### Backend Setup

1.  **Install Python Dependencies**

    ```bash
    pip install -r requirements.txt
    ```

2.  **Start the Backend Server**

    ```bash
    python main.py
    ```

## Development Mode

In development mode, the frontend bypasses the agent creation process, allowing access to all pages even if the backend is not running.  This can be enabled by setting the environment variable `NEXT_PUBLIC_DEVELOPMENT_MODE=true`.

## API Routes

| Method | Route                       | Description                               |
| :----- | :-------------------------- | :---------------------------------------- |
| GET    | `/api/agent-status/:address` | Check the user's agent status.             |
| POST   | `/api/agent`                | Create a new AI agent.                    |
| GET    | `/api/messages`             | Get the user's message history.           |
| POST   | `/api/deploy-multisig`      | Deploy a multi-signature wallet.          |
| POST   | `/api/user-signature`       | User submits a transaction signature.     |
| POST   | `/api/user-reject-transaction` | User rejects a transaction.                |

## Project Structure

app/ # Next.js application pages
api/ # API route handlers
assets/ # Asset management page
daily-analysis/ # Daily analysis page
about/ # About page
components/ # React components
layout/ # Layout components
common/ # Common components
portfolio/ # Portfolio-related components
analysis/ # Analysis-related components
lib/ # Utility functions and API clients
public/ # Static assets
styles/ # Global styles
Or, if you prefer a bulleted list for project structure:

app/ (Next.js application pages)
api/ (API route handlers)
assets/ (Asset management page)
daily-analysis/ (Daily analysis page)
about/ (About page)
components/ (React components)
layout/ (Layout components)
common/ (Common components)
portfolio/ (Portfolio-related components)
analysis/ (Analysis-related components)
lib/ (Utility functions and API clients)
public/ (Static assets)
styles/ (Global styles)


## Troubleshooting

If you encounter API connection issues:

1.  Ensure the backend server is running.
2.  Check that the `NEXT_PUBLIC_API_URL` in `.env.local` is correct.
3.  Check the browser console for CORS errors.
4.  In development mode, you can set `NEXT_PUBLIC_DEVELOPMENT_MODE=true` to bypass API checks.

## Key Features

-   AI-powered conversational interface
-   Portfolio analysis and management
-   Daily market analysis
-   Secure trade execution based on Multi-sig Wallet with trading guard