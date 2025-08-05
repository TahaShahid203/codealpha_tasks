# TaskFlow Pro - Enhanced To-Do List Application

## Overview

TaskFlow Pro is a full-stack web application that provides an advanced task management system with modern features. The application extends beyond a basic to-do list by offering comprehensive task organization with categories, priorities, due dates, subtasks, search functionality, and drag-and-drop reordering. Built with a clean separation between frontend and backend, it uses React for a dynamic user interface and Express.js for the server-side API.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built using React with TypeScript and follows a component-based architecture:

- **UI Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: React Context API for global state (tasks, themes, filters) combined with TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build System**: Vite for fast development and optimized production builds

### Backend Architecture
The server follows a RESTful API design with Express.js:

- **Framework**: Express.js with TypeScript for the REST API
- **Database Layer**: Drizzle ORM configured for PostgreSQL with type-safe queries
- **Validation**: Zod schemas shared between client and server for consistent validation
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Design**: Relational data model with tasks, categories, and subtasks
- **Migrations**: Drizzle Kit for database schema management

### Component Structure
The application uses a modular component architecture:

- **UI Components**: Reusable shadcn/ui components for consistent interface elements
- **Feature Components**: Task-specific components (TaskItem, TaskList, TaskModal)
- **Layout Components**: Header, Sidebar, and ProgressBar for application structure
- **Context Providers**: Theme and Task contexts for global state management

### Key Features Implementation
- **Task Management**: CRUD operations with priority levels, categories, and due dates
- **Subtasks**: Nested task structure with individual completion tracking
- **Search & Filtering**: Real-time search with category and status filters
- **Drag & Drop**: Task reordering with optimistic updates
- **Responsive Design**: Mobile-first approach with glassmorphism UI effects
- **Dark Mode**: Theme switching with persistent preferences

## External Dependencies

### Database & ORM
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-kit**: Database schema management and migrations

### UI & Styling
- **@radix-ui/react-***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library for consistent iconography

### State Management & Data Fetching
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form state management and validation
- **@hookform/resolvers**: Form validation with Zod integration

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **tsx**: TypeScript execution for server development
- **wouter**: Lightweight routing library

### Date & Time
- **date-fns**: Date manipulation and formatting utilities

### Form Validation
- **zod**: Schema validation library
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation