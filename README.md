# Birdie (Лелека) - Pregnancy Companion Application

> A modern, AI-powered pregnancy companion platform designed to support expecting mothers throughout their journey with personalized insights, daily tips, and comprehensive tracking tools.

## 🎯 Overview

Birdie (Лелека) is a comprehensive pregnancy companion application that helps expecting mothers track their journey, manage daily tasks, maintain a personal diary, and receive AI-powered insights tailored to their pregnancy week. The application provides a seamless, user-friendly experience with both authenticated and guest access modes.

### Key Objectives

- **Personalized Experience**: Week-by-week pregnancy journey tracking with customized content
- **Daily Support**: Daily tips, baby development information, and emotional wellness tracking
- **Task Management**: Organize and track pregnancy-related tasks and reminders
- **AI Assistance**: Google Gemini AI integration for intelligent support and insights
- **Privacy-First**: Secure authentication with session management and protected routes

## 🛠 Tech Stack

### Core Framework

- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety and developer experience

### State Management & Data Fetching

- **Zustand 5.0.8** - Lightweight state management
- **TanStack Query 5.87.4** - Server state management and caching
- **Axios 1.11.0** - HTTP client with interceptors

### Forms & Validation

- **Formik 2.4.6** - Form management
- **Yup 1.7.0** - Schema validation

### AI & External Services

- **@google/generative-ai 0.24.1** - Google Gemini AI integration

### UI & Styling

- **CSS Modules** - Scoped styling
- **Radix UI** - Accessible component primitives
- **React Hot Toast 2.6.0** - Toast notifications
- **Flatpickr 4.6.13** - Date picker component

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Turbopack** - Fast bundler for development

## 🏗 Architecture

### Application Structure

The application follows Next.js 15 App Router conventions with a clear separation of concerns:

```
birdie/
├── app/                    # Next.js App Router pages and API routes
│   ├── (auth routes)/     # Authentication pages (login, register)
│   ├── (sidebar routes)/  # Main application pages (dashboard, diary, journey, profile)
│   └── api/               # Next.js API routes (proxies to backend)
├── components/            # Reusable React components
├── lib/                   # Utilities, hooks, and shared logic
├── services/              # External service integrations
├── types/                 # TypeScript type definitions
└── styles/                # Global styles and theme tokens
```

### Routing Strategy

- **Public Routes**: `/auth/*` - Authentication pages
- **Protected Routes**: `/diary`, `/journey`, `/profile` - Require authentication
- **Public Dashboard**: `/` - Accessible to all users with limited features

### Authentication Flow

1. **Session Management**: Cookie-based authentication with access and refresh tokens
2. **Middleware Protection**: Route-level authentication via Next.js middleware
3. **Token Refresh**: Automatic token refresh on 401 responses
4. **State Synchronization**: Zustand store for client-side auth state

### Data Fetching Strategy

- **Server Components**: Initial data fetching with React Query prefetching
- **Client Components**: Real-time updates and mutations
- **Caching**: TanStack Query for intelligent caching and background refetching
- **Optimistic Updates**: Enhanced UX with optimistic UI updates

## ✨ Features

### 🏠 Dashboard

- Personalized greeting based on user profile
- Daily baby development information
- Pregnancy tips and advice
- Task reminders and management
- Emotional wellness check-in

### 📅 Journey Tracker

- Week-by-week pregnancy progression
- Detailed information for each pregnancy week
- Visual journey timeline
- Personalized content based on due date

### 📔 Diary

- Create and manage diary entries
- Tag-based organization
- Search and filter functionality
- Emotion tracking integration
- Rich text support

### ✅ Task Management

- Create, update, and complete tasks
- Date-based task scheduling
- Task reminders
- Integration with dashboard

### 🤖 AI Assistant (Beta)

- Google Gemini AI-powered assistant
- Context-aware responses based on pregnancy week
- Multiple interaction modes:
  - Chat interface
  - Insights and recommendations
  - Reminder suggestions
  - Diary entry assistance
  - Task management help
- Draggable floating interface

### 👤 Profile Management

- User profile editing
- Avatar upload and management
- Pregnancy information tracking
- Account settings

### 🔐 Authentication

- Secure registration and login
- Session persistence
- Protected route access
- Guest mode with limited features

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or compatible package manager
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd birdie
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   See [Environment Variables](#environment-variables) for required configuration.

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

### Key Directories

#### `/app`

Next.js App Router structure:

- `(auth routes)/auth/` - Authentication pages
- `(sidebar routes)/` - Main application pages
  - `page.tsx` - Dashboard
  - `diary/` - Diary pages
  - `journey/[weekNumber]/` - Journey pages
  - `profile/` - Profile pages
- `api/` - API route handlers (proxies to backend)

#### `/components`

Reusable React components organized by feature:

- `AuthProvider/` - Authentication context
- `GeminiAssistant/` - AI assistant component
- `DiaryEntryCard/`, `DiaryList/` - Diary components
- `TasksReminderCard/`, `AddTaskForm/` - Task components
- `SideBar/`, `Header/` - Navigation components
- And many more...

#### `/lib`

Shared utilities and configurations:

- `api/` - API client functions (server and client)
- `hooks/` - Custom React hooks
- `store/` - Zustand stores (auth, UI state)
- `pregnancy/` - Pregnancy calculation utilities
- `axios.ts` - Axios instance with interceptors

#### `/services`

External service integrations:

- `gemini-ai.service.ts` - Google Gemini AI service
- `emotionsService.ts` - Emotion tracking service

#### `/types`

TypeScript type definitions for:

- User, Baby, Diary, Task, Week, Tip, and Gemini AI types

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Backend API Configuration
API_BASE_URL=https://lehlehka.b.goit.study
NEXT_PUBLIC_API_URL=http://localhost:3000

# Google Gemini AI (Optional - for AI Assistant feature)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### Environment Variable Notes

- `API_BASE_URL`: Backend API base URL (used in server-side API routes)
- `NEXT_PUBLIC_API_URL`: Public API URL (used in client-side requests)
- `NEXT_PUBLIC_GEMINI_API_KEY`: Required for AI Assistant functionality (optional)

## 📝 Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled, prefer explicit types
- **Components**: Use functional components with TypeScript
- **Styling**: CSS Modules for component-scoped styles
- **Naming**: PascalCase for components, camelCase for functions/variables

### Component Organization

```typescript
// Component structure example
export default function ComponentName() {
  // 1. Hooks and state
  // 2. Data fetching
  // 3. Event handlers
  // 4. Render
}
```

### State Management

- **Zustand**: Global application state (auth, UI)
- **TanStack Query**: Server state and caching
- **Local State**: React useState for component-specific state

### API Integration

- **Server Components**: Use `lib/api/serverApi.ts` functions
- **Client Components**: Use `lib/api/clientApi.ts` functions
- **API Routes**: Proxy pattern in `app/api/` directory
- **Error Handling**: Consistent error handling with axios interceptors

### Accessibility

- Use semantic HTML elements
- Include ARIA labels where appropriate
- Ensure keyboard navigation support
- Test with screen readers

### Performance

- Leverage Next.js Image optimization
- Use React Query caching strategies
- Implement code splitting where appropriate
- Optimize bundle size with dynamic imports

## 🔌 API Integration

### Backend API

The application connects to a backend API at `https://lehlehka.b.goit.study`. All API communication is proxied through Next.js API routes for security and cookie handling.

### API Routes

The application provides the following API endpoints:

- `/api/auth/*` - Authentication (login, register, logout, session)
- `/api/users/*` - User management
- `/api/diary/*` - Diary entries
- `/api/tasks/*` - Task management
- `/api/notes/*` - Notes management
- `/api/emotions/*` - Emotion tracking
- `/api/weeks/*` - Pregnancy week information

### Authentication Flow

1. User credentials sent to `/api/auth/login`
2. Backend returns access and refresh tokens (cookies)
3. Tokens stored in HTTP-only cookies
4. Middleware validates tokens for protected routes
5. Automatic token refresh on expiration

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Google Gemini AI](https://ai.google.dev/docs)

### Project-Specific Notes

- **Pregnancy Calculations**: Week calculations based on due date in `lib/pregnancy/week.ts`
- **Theme System**: CSS custom properties in `styles/theme-tokens.css`
- **Icon System**: SVG sprite system in `components/Icon/`
- **Logo System**: Brand logo components in `components/Logo/`
