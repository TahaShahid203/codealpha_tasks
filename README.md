# TaskFlow Pro - Enhanced To-Do List Application

A modern, responsive task management application with advanced UI/UX features, built to provide an intuitive and visually engaging task tracking experience.

## Features

- ✅ **Beautiful UI** - Gradient-rich design with glassmorphism effects
- 📱 **Responsive Design** - Works seamlessly across all devices
- 🗂️ **Task Organization** - Categories, priorities, due dates, and subtasks
- 🔍 **Smart Search** - Real-time search and filtering
- 🎯 **Drag & Drop** - Intuitive task reordering
- 🌙 **Dark/Light Mode** - Theme switching with persistent preferences
- 📅 **Calendar Integration** - Visual date picker for due dates
- 🔄 **Recurring Tasks** - Support for daily, weekly, and monthly repeats

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context + TanStack Query
- **Build Tools**: Vite + esbuild

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to `http://localhost:5000`

## Windows Development Setup


run:
```bash
start-dev.bat
```

## Build for Production

```bash
npm run build
npm start
```

For Windows:
```powershell
npm run build
$env:NODE_ENV="production"; node dist/index.js
```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities
│   │   └── pages/          # Route components
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data layer
├── shared/                # Shared types & schemas
└── dist/                  # Production build
```




## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
