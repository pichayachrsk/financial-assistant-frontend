# FinBot AI - Financial Assistant Frontend

FinBot AI is a modern, web interface for interacting with a Financial AI Assistant. Built with Next.js 15, it provides real-time market insights and stock analysis

## 🚀 Features

- **Direct Market Data:** Real-time integration with financial APIs (Finnhub, FRED) to show stock prices, treasury yields, and more.
- **Deep Tool Integration:** Displays raw data from AI tool calls in a clean, structured format within the chat.
- **Full-Screen Chat UI:** Optimized layout for deep financial research and long conversations.
- **Persistent Conversations:** Full sidebar management for chat history and organization.
- **Modern Tech Stack:** React Query for state management, Tailwind CSS for styling, and Lucide icons.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [TanStack Query (React Query) v5](https://tanstack.com/query)
- **Icons:** [Lucide React](https://lucide.dev/)
- **API Client:** Axios

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- Backend API running (see backend repository)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://your-backend-api-url
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to start your financial analysis.

## 📂 Project Structure

- `src/app`: Next.js pages and layouts.
- `src/components`: Reusable UI components (Chat, Sidebar, Providers).
- `src/hooks`: Custom React hooks for auth, chat, and data fetching.
- `src/lib`: API clients and server actions.
- `src/types`: TypeScript interfaces and definitions.

---
