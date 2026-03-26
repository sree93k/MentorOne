# MentorOne
A full-stack mentorship platform connecting mentors and mentees — built for real learning, real growth.

📌 Overview
MentorOne is a comprehensive mentorship marketplace platform that bridges the gap between experienced mentors and motivated mentees. The platform supports multiple mentor service types, real-time communication, scheduling, and dedicated dashboards for three distinct user roles: Admin, Mentor, and Mentee.
Built with a clean architecture mindset and SOLID principles at its core, MentorOne is designed to scale gracefully while remaining maintainable.

✨ Features
👤 Authentication

Email + OTP-based registration & login
Google OAuth integration
LinkedIn OAuth integration
JWT-based session management

🧑‍🏫 Mentor Services

Online Services — Live 1:1 sessions
Digital Products — Downloadable resources & guides
Video Tutorials — Pre-recorded course content
Service listing, pricing, and availability management

📅 Scheduling

Weekly availability setup with multiple time slots per day
Booking management for both mentors and mentees
Calendar-style session overview

💬 Communication

Multi-tab real-time chat system
Video meeting integration with a dedicated landing page

📊 Dashboards

Admin Dashboard — User management, mentor approval, booking & service analytics
Mentor Dashboard — Service management, earnings, session history, availability
Mentee Dashboard — Booked sessions, saved mentors, learning progress

📝 Additional Features

Blog / knowledge-sharing module
Ratings & reviews for mentors
Notification system
Dual-role support (a user can be both mentor and mentee)


🛠 Tech Stack
Frontend
TechPurposeReact + TypeScriptComponent-based UIMaterial UI (MUI)Design system & componentsTailwind CSSUtility-first stylingShadCN-style UI componentsMinimal, modern UI patterns
Backend
TechPurposeNode.js + Express + TypeScriptRESTful API serverMongoDB + MongoosePrimary databaseInversifyDependency injection (IoC container)Socket.IOReal-time communicationJWTAuthentication & authorizationNodemailerOTP & notification emails
Architecture

Clean Architecture with clear separation of concerns
SOLID Principles enforced across services and repositories
BaseRepository Pattern for consistent data access layer
DTO (Data Transfer Objects) for validated, typed data flow between layers
Inversify DI for decoupled, testable service composition


🏗 Project Structure
mentorone/
├── client/                     # React + TypeScript frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route-level page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API service calls
│   │   ├── store/              # State management
│   │   └── types/              # TypeScript interfaces & types
│   └── public/
│
└── server/                     # Express + TypeScript backend
    ├── src/
    │   ├── controllers/        # Request handlers
    │   ├── services/           # Business logic layer
    │   ├── repositories/       # Data access layer (BaseRepository pattern)
    │   ├── models/             # Mongoose schemas
    │   ├── dtos/               # Data Transfer Objects
    │   ├── middlewares/        # Auth, error handling, validation
    │   ├── config/             # App configuration & DI container
    │   └── utils/              # Helpers & utilities
    └── inversify.config.ts     # Dependency injection bindings

🚀 Getting Started
Prerequisites

Node.js v18+
MongoDB (local or Atlas)
npm or yarn

Installation
bash# Clone the repository
git clone https://github.com/your-username/mentorone.git
cd mentorone

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
Environment Variables
Create a .env file in the server/ directory:
envPORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Email (OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Client URL
CLIENT_URL=http://localhost:5173
Create a .env file in the client/ directory:
envVITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
Running the App
bash# Run backend (from /server)
npm run dev

# Run frontend (from /client)
npm run dev
Frontend runs on http://localhost:5173 | Backend on http://localhost:5000

📐 Architecture Highlights
BaseRepository Pattern
All data repositories extend a BaseRepository<T> generic class, providing consistent CRUD operations and reducing boilerplate across MentorRepository, ServiceRepository, DigitalProductRepository, OnlineServiceRepository, and VideoTutorialRepository.
Dependency Injection with Inversify
Services, repositories, and controllers are bound via an Inversify IoC container, enabling clean separation, easy testability, and scalable composition without tight coupling.
DTO Layer
All data flowing between the controller and service layers is validated and shaped using TypeScript DTOs — ensuring type safety and clear API contracts throughout the application.

🎯 User Roles
RoleCapabilitiesAdminApprove mentors, manage users, view platform analyticsMentorCreate services, set availability, manage bookings, chatMenteeBrowse mentors, book sessions, chat, rate & review

A single user account can hold both Mentor and Mentee roles simultaneously.


📸 Screenshots

(Coming soon — UI walkthrough of dashboards, booking flow, and chat system)


🛣 Roadmap

 Payment gateway integration
 Mobile-responsive PWA support
 AI-powered mentor recommendations
 Group session / cohort support
 Analytics dashboard for mentors (earnings, engagement)


🤝 Contributing
Contributions are welcome! Please open an issue first to discuss what you'd like to change.
bash# Fork the repo, create your feature branch
git checkout -b feature/your-feature-name

# Commit your changes
git commit -m "feat: add your feature"

# Push and open a PR
git push origin feature/your-feature-name

👨‍💻 Author
Sreekuttan N. (Srii)
Fullstack Developer — MERN Stack
LinkedIn • GitHub • Portfolio
