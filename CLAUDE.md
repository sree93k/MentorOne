# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MentorOne is a comprehensive MERN stack mentoring platform with separate backend and frontend applications. The platform connects mentors and mentees with advanced features including AI chatbot, booking system, payments, real-time communication, and digital products.

## Development Commands

### Backend (Node.js/TypeScript)
```bash
cd Backend
npm run dev        # Start development server with hot reload
npm run build      # Build TypeScript to JavaScript
npm run start      # Start production server
npm run seed:chatbot  # Seed chatbot data
```

### Frontend (React/Vite/TypeScript)
```bash
cd Frontend
npm run dev        # Start development server
npm run build      # Build for production (includes TypeScript compilation)
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## Architecture Overview

### Backend Structure (Enhanced Clean Architecture)
- **Clean Architecture**: Repository pattern with strict interface segregation
- **Dependency Injection**: Using Inversify for IoC container
- **Layers**: Controllers → Services → Repositories → Models
- **Advanced Features**:
  - AI Services (Google Generative AI, OpenAI)
  - Background Jobs with Bull Queue
  - Real-time features with Socket.IO and Redis adapter
  - Comprehensive caching with Redis and IoRedis
  - Job scheduling with node-cron and node-schedule
  - File processing with Sharp and FFmpeg

### Frontend Structure (Modern React Architecture)
- **React 19** with TypeScript and Vite
- **Advanced State Management**: Redux Toolkit with Redux Persist
- **Modern UI Stack**: Radix UI primitives, Tailwind CSS, shadcn/ui
- **Data Fetching**: TanStack React Query for server state
- **Enhanced Features**:
  - Real-time communication (Socket.IO, PeerJS)
  - Advanced animations (Framer Motion, Lottie)
  - Rich text editing (EditorJS, Quill)
  - Data visualization (Chart.js, Recharts)
  - Map integration (Leaflet, React Leaflet)

### Key Business Domains
- **Authentication**: Multi-role JWT-based auth (Admin, User, Mentor, Mentee)
- **Mentoring**: Session booking, scheduling, video calls
- **Payments**: Stripe integration with webhooks
- **Communication**: Real-time chat, notifications, video calls
- **Content**: Digital products, video tutorials, testimonials
- **AI Features**: Chatbot, automated responses, content generation
- **Administration**: User management, appeals, blocking system

## Key Technologies & Integrations

### Backend Stack
- **Core**: Express.js, TypeScript, MongoDB + Mongoose
- **Real-time**: Socket.IO with Redis adapter
- **Queue Management**: Bull + Bull Board dashboard
- **AI/ML**: Google Generative AI, OpenAI
- **Storage**: AWS S3, Cloudinary, local uploads
- **Caching**: Redis, IoRedis
- **Payments**: Stripe with webhook handling
- **Security**: JWT, bcrypt, rate limiting
- **Validation**: Joi, Zod, Yup

### Frontend Stack
- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI, shadcn/ui
- **State**: Redux Toolkit, TanStack React Query
- **Real-time**: Socket.IO client, PeerJS
- **Media**: FFmpeg, Chart.js, Leaflet
- **Forms**: React Hook Form with validation
- **Payments**: Stripe React components

## Important Configuration

### Environment Variables (Backend)
Required environment variables include database connections, API keys, and service configurations for:
- MongoDB, Redis connections
- AWS S3, Cloudinary credentials
- Stripe keys, AI service keys
- JWT secrets, email service config

### File Structure Notes
- **Backend**: Organized by domain with clear separation of concerns
- **DTOs**: Data Transfer Objects for API contracts
- **Entities**: Business domain models
- **Inversify**: Dependency injection configuration
- **Jobs**: Background job processing
- **Queue**: Job queue management and monitoring

## Development Workflow

1. **Prerequisites**: MongoDB, Redis, Node.js
2. **Environment Setup**: Configure `.env` files for both backend and frontend
3. **Database Seeding**: Use chatbot seeding script for initial data
4. **Development**: Run both backend and frontend dev servers
5. **Background Services**: Monitor Bull dashboard for job processing
6. **Testing**: Use built-in validation and error handling

## API Structure

- **Admin Routes**: `/admin/*` - User management, system administration
- **User Routes**: `/user/*` - Authentication, profile management
- **Mentor Routes**: `/expert/*` - Mentor-specific functionality
- **Mentee Routes**: `/seeker/*` - Mentee-specific functionality
- **Media Routes**: Secure file handling and uploads
- **Webhook Routes**: `/stripe/api/*` - Payment processing
- **Chatbot Routes**: AI-powered conversation handling

## Special Features

- **AI Chatbot**: Integrated conversational AI with rate limiting
- **Appeal System**: User appeal and blocking management
- **Secure Media**: Protected file access with authentication
- **Background Jobs**: Automated reminders, cleanup tasks
- **Real-time Notifications**: Socket.IO based notification system
- **Advanced Caching**: Multi-layer caching strategy with Redis