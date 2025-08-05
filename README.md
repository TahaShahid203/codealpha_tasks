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

### Option 1: Using cross-env (Recommended)
The project includes `cross-env` for cross-platform compatibility:
```bash
npm run dev
```

### Option 2: Windows-specific commands
If you encounter environment variable issues on Windows:

**PowerShell:**
```powershell
$env:NODE_ENV="development"; npx tsx server/index.ts
```

**Command Prompt:**
```cmd
set NODE_ENV=development && npx tsx server/index.ts
```

### Option 3: Create a Windows batch file
Create `start-dev.bat` in the project root:
```batch
@echo off
set NODE_ENV=development
npx tsx server/index.ts
```

Then run:
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

## Database Setup

The application uses in-memory storage by default for development. For production with PostgreSQL:

1. Set up a PostgreSQL database
2. Configure environment variables:
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/taskflow
```
3. Run migrations:
```bash
npm run db:push
```

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/taskflow
PORT=5000
```

## Troubleshooting

### Windows PATH Issues
If you get "command not found" errors:
1. Ensure Node.js is in your PATH
2. Use `npx` prefix for commands: `npx tsx server/index.ts`
3. Install tsx globally: `npm install -g tsx`

### Port Already in Use
If port 5000 is busy:
1. Kill the process: `npx kill-port 5000`
2. Or change the port in `server/index.ts`

### Build Issues
Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

Windows:
```cmd
rmdir /s node_modules
del package-lock.json
npm install
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.