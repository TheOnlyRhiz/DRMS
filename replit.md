# DRMS - Department Resource Management System

## Overview

DRMS is a full-stack web application for managing academic resources, equipment bookings, and user interactions within a university department. The system provides role-based access for students, faculty, and administrators, with features for file uploads, resource sharing, equipment management, and analytics.

## System Architecture

The application follows a modern full-stack architecture:

- **Frontend**: React with TypeScript, using Vite for development and build tooling
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **File Handling**: Multer for file uploads with local storage in uploads directory

## Key Components

### Frontend Architecture
- **React Router**: Using Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system and CSS variables
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Express.js**: RESTful API server with middleware for authentication and file uploads
- **Database Layer**: Drizzle ORM with Neon serverless PostgreSQL connection
- **Session Management**: PostgreSQL session store with connect-pg-simple
- **File Uploads**: Multer with file type validation and size limits (50MB)
- **Authentication**: Passport.js with OpenID Connect strategy

### Database Schema
Core entities include:
- **Users**: Role-based user management (student/faculty/admin)
- **Resources**: Academic file sharing with approval workflow
- **Equipment**: Bookable department equipment with availability tracking
- **Bookings**: Equipment reservation system with time slots
- **Downloads**: Usage analytics and tracking
- **Sessions**: Secure session storage for authentication

## Data Flow

1. **Authentication**: Users authenticate via Replit Auth (OIDC)
2. **Role-based Access**: Different dashboard views based on user role
3. **Resource Management**: File upload → approval workflow → public sharing
4. **Equipment Booking**: Real-time availability → reservation → confirmation
5. **Analytics**: Usage tracking for downloads and system metrics

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **passport**: Authentication middleware
- **multer**: File upload handling
- **connect-pg-simple**: PostgreSQL session store

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **wouter**: Lightweight React router

## Deployment Strategy

The application is configured for deployment on Replit with:

- **Development**: `npm run dev` - Runs both client and server in development mode
- **Production Build**: `npm run build` - Builds client assets and bundles server
- **Production Start**: `npm run start` - Serves production build
- **Database**: Configured for PostgreSQL with automatic migration support
- **Environment**: Uses Replit modules for Node.js, web hosting, and PostgreSQL

### Configuration Files
- **Vite**: Configured for React with TypeScript and path aliases
- **Tailwind**: Custom design system with CSS variables for theming
- **Drizzle**: PostgreSQL dialect with migration support
- **TypeScript**: Strict mode with path mapping for clean imports

## Changelog
- June 26, 2025: Initial setup with Replit Auth
- June 26, 2025: Implemented JWT authentication system replacing Replit Auth

## Recent Changes
- **Complete Mobile Responsiveness**: Redesigned entire application for mobile-first approach
- **Improved Sidebar Navigation**: Built mobile-friendly sidebar with slide-out menu and overlay
- **Landing Page Creation**: Professional landing page showcasing DRMS features and use cases
- **Enhanced Routing Flow**: Landing Page -> Login -> Dashboard with proper logout to landing page
- **Mobile Dashboard Optimization**: Responsive layouts for all dashboard pages and components
- **Authentication Performance**: Optimized JWT token caching for sub-second login performance
- **Role System Simplification**: Streamlined from 3 roles to 2 roles (Student and Admin only)
- **Student Upload Capability**: Students can now upload resources just like Admins
- **Enhanced Authentication Flow**: Fixed routing with automatic role-based dashboard redirection
- **Upload Modal Integration**: Both Student and Admin dashboards include full upload functionality
- **Complete Dashboard Restructure**: Rebuilt all dashboards with distinct functionality for each navigation item
- **Enhanced Resource Upload**: File upload with progress tracking, validation, and 50MB limit
- **Advanced Search & Filtering**: Comprehensive search with real-time filtering and file type filters
- **Role-Specific Features**: 
  - Student: Dashboard overview, resource uploading/downloading, equipment booking, profile management
  - Admin: System administration, resource management, user management, system settings, analytics
- **Modal Integration**: Upload, resource library, equipment, and booking modals integrated across dashboards
- **Complete JWT Authentication System**: Full JWT-based authentication with proper token management
- **Database Integration**: PostgreSQL with Drizzle ORM fully operational for all entities
- **File Upload System**: Multer integration with comprehensive validation and progress tracking
- **Password Reset System**: Students can change passwords through Profile settings with current password verification
- **User Status Management**: Admin can activate/deactivate user accounts with login restrictions for disabled users
- **Equipment Management System**: Full CRUD operations for equipment with admin controls and student booking capabilities
- **Equipment Navigation Placement**: Equipment pages positioned after Resource Management in both student and admin dashboards
- **Equipment Status Management**: Three-state status system (available/booked/unavailable) with real-time updates
- **Booking Workflow**: Complete booking system with admin approval process and status tracking
- **Authentication Fix for Equipment**: Resolved JWT token authentication for all equipment operations (June 30, 2025)
- **Equipment Filtering System**: Comprehensive search and status filtering for both admin and student dashboards with real-time filtering (June 30, 2025)
- **Complete Booking System Integration**: Students can now book equipment with automatic status updates, proper datetime handling, and full workflow (June 30, 2025)

## User Preferences

Preferred communication style: Simple, everyday language.