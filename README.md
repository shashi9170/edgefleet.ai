# 🚀 EdgeFleet Project Tracker

A secure, assessment-ready full-stack Project Management application built with NestJS (backend), MongoDB (database), and React + TypeScript (frontend).  
Designed for the EdgeFleet.ai Full-Stack assessment — follows clean architecture, modular design, and solid authentication/authorization patterns.

This README intentionally omits code samples; it provides clear, copy-paste-friendly instructions and descriptions so you can implement the project without inlined snippets.

---

## 📌 Table of Contents

- Project Overview
- What’s Included
- Tech Stack
- System Architecture
- Project Structure (layout)
- Quick Start (Backend & Frontend) — commands described in plain text
- Environment Variables
- Authentication & Authorization (including recommended refresh-token flow)
- API Reference (endpoints and descriptions)
- Database Design (MongoDB schemas described)
- Testing
- Deployment Notes
- Security Considerations
- Assessment Checklist
- Extras (optional)
- Author

---

## 🧠 Project Overview

EdgeFleet Project Tracker lets authenticated users create and manage projects with full CRUD support. Each user sees only their own projects. The backend is implemented in NestJS using modules, controllers, services, DTOs, guards and Mongoose for MongoDB persistence. The frontend is a React + TypeScript application designed to consume the REST API securely and efficiently.

This README focuses on architecture, operational steps, and security recommendations without embedding inlined code examples.

---

## ✅ What’s Included

- Modular NestJS backend (auth, users, projects, common utilities)
- Mongoose models and validation patterns
- JWT-based authentication with recommended refresh-token strategy
- React + TypeScript frontend scaffold intended for Vite
- RTK Query (recommended) or alternative API client guide for refresh handling
- Environment and deployment guidance
- Assessment-ready checklist and security best practices

---

## 🧰 Tech Stack

Backend:
- NestJS (modules, controllers, services)
- TypeScript
- MongoDB with Mongoose
- Passport-JWT and bcrypt for auth
- class-validator for DTO validation
- Jest and Supertest for testing

Frontend:
- React + TypeScript
- Vite
- Redux Toolkit / RTK Query (recommended)
- React Router
- Axios (optional)

---

## 🏗 System Architecture

Client (React) → API client (RTK Query recommended) → REST API (NestJS) → Auth Guard (JWT) → Services → MongoDB (Mongoose)

Core responsibilities:
- Frontend: authentication flows, protected routes, token management
- Backend: secure auth endpoints, resource ownership checks, DTO validation, persistence

---

## 📂 Project Structure

Top-level directories:
- backend: NestJS application source, modules (auth, users, projects), DTOs, guards, app bootstrap
- frontend: React app with store, API clients, pages, components
- README.md, .env.example, deployment/config files

Within backend:
- src/auth: controller, service, strategies, DTOs
- src/users: controller, service, schema
- src/projects: controller, service, schema
- src/common: guards, decorators, filters
- main.ts and app.module.ts to wire modules and middleware

Within frontend:
- src/store: base API client, store setup, auth slice
- src/pages and src/components: auth pages, dashboard, project forms
- configuration for environment variables (VITE_API_URL)

---

## 🔧 Quick Start (Backend)

1. Open a terminal and change into the backend directory.
2. Install dependencies using your package manager (npm or yarn).
3. Create environment variables file from the provided example and populate with local values.
4. Start the NestJS application in development mode (watch mode suggested).
5. Backend will expose REST endpoints (default port suggested in env).

Notes:
- Ensure MongoDB is running locally or use a managed instance (e.g., MongoDB Atlas).
- Enable CORS and credentials if frontend and backend run on different origins.

---

## ⚡ Quick Start (Frontend)

1. Change into the frontend directory.
2. Install dependencies.
3. Ensure environment variable pointing to backend API (VITE_API_URL) is set to your backend URL.
4. Start the frontend dev server (Vite).
5. Open the frontend URL in a browser and test authentication flows.

Notes:
- For refresh-token flows using httpOnly cookies, the browser must send credentials; configure the API client to include credentials.

---

## 🧾 Environment Variables 

Backend environment variables to configure (examples):
- PORT — port where NestJS will run (e.g., 4000)
- MONGO_URI — MongoDB connection string (e.g., mongodb://localhost:27017/edgefleet)
- JWT_SECRET — secret used to sign access tokens
- JWT_EXPIRES_IN — short-lived access token lifetime (e.g., 15m)
- REFRESH_TOKEN_EXPIRES_IN — refresh token lifetime (e.g., 7d)
- BCRYPT_SALT_ROUNDS — bcrypt salt rounds (e.g., 10)
- NODE_ENV — development or production

Frontend environment variable:
- VITE_API_URL — base URL for API calls (e.g., http://localhost:4000)

Keep production secrets in a secure secret manager; never commit them to the repo.

---

## 🔐 Authentication & Authorization

Authentication flow overview:
- Signup: user registers with email and password. Backend hashes the password using bcrypt before storing.
- Login: user posts credentials; backend verifies credentials and issues a short-lived access token (JWT). Backend also issues a refresh token for long-lived sessions; the recommended approach is to set the refresh token as an httpOnly, secure cookie.
- Protected requests: frontend attaches access token to Authorization header. Backend uses JwtAuthGuard (Passport-JWT strategy) to validate tokens.
- Authorization: each project document includes a userId; backend checks ownership in controllers/services to ensure users only access their own resources.
- Keep access tokens in memory or lightweight client state for Authorization header use.
- Keep refresh tokens in httpOnly secure cookies to prevent JavaScript access and mitigate XSS risk.
- Implement a server-side refresh endpoint that issues a new access token when a valid refresh cookie is presented.
- Consider rotating refresh tokens on use and store refresh token state server-side for revocation support.

---

## Refresh-Token Flow (high-level)

- When a request fails due to an expired access token, the frontend client should call the refresh endpoint with credentials included so the browser sends the refresh cookie.
- If the refresh succeeds, the server issues a new access token (and optionally rotates the refresh cookie). The client should update its stored access token and retry the original request.
- If the refresh fails, the client should clear any auth state and redirect the user to the login screen.

Operational:
- Avoid sending refresh tokens in localStorage/sessionStorage.
- Use an API client strategy to serialize refresh attempts so multiple concurrent calls do not produce multiple refresh requests (mutex or queue pattern).
- Return clear HTTP error codes (401 for unauthorized, 403 for forbidden) and descriptive messages for client handling.

---

## 📡 API Reference (endpoints and descriptions)

Authentication endpoints:
- POST /auth/signup — register a new user (email, password)
- POST /auth/login — authenticate user; expected to return access token and set refresh cookie
- POST /auth/refresh — exchange valid refresh cookie for a new access token (use credentials: include)
- GET /auth/me — retrieve current authenticated user info (protected)

Projects endpoints (protected; use Authorization header with access token):
- GET /projects — list all projects for the authenticated user
- POST /projects — create a new project for the authenticated user
- GET /projects/:id — return project details if the authenticated user is the owner
- PUT /projects/:id — update project if authenticated user is the owner
- DELETE /projects/:id — delete project if authenticated user is the owner

Notes:
- All project endpoints must validate that the requesting user's id matches the project's userId.
- Use DTO validation for incoming request bodies to enforce required fields and types.

---

## 🗄 Database Design (MongoDB schemas described)

User document shape:
- _id: ObjectId
- email: string (unique, normalized)
- password: string (hashed)
- createdAt, updatedAt: timestamps

Project document shape:
- _id: ObjectId
- title: string (required)
- description: string (optional)
- userId: ObjectId (reference to user, required)
- createdAt, updatedAt: timestamps

Implementation notes:
- Use Mongoose schemas and models with timestamps enabled.
- Add unique index on email field for users.
- Validate ObjectId inputs on endpoints to avoid injection or malformed queries.

---

## 🧪 Testing

Backend:
- Unit tests with Jest for services and utility functions.
- Integration/e2e tests with Supertest; use an in-memory MongoDB instance (mongodb-memory-server) or a test database for isolation.
- Recommended test scripts: unit, e2e, and coverage runs.

Frontend:
- Component and unit tests with Vitest and React Testing Library.
- Mock API responses for client-side test scenarios, or run against a test backend.

Testing tips:
- Seed test DB with deterministic fixtures and ensure teardown between tests.
- Simulate cookie behavior when testing refresh-token flows, or test against an integration server that issues cookies.

---

## 🚀 Deployment Notes

Backend:
- Deploy on a managed platform (Render, Railway, Heroku, AWS, GCP).
- Use managed MongoDB (MongoDB Atlas recommended).
- Configure environment variables via the platform's secret configuration.
- Ensure CORS is configured with explicit origins and credentials enabled when using cookie-based refresh.

Frontend:
- Deploy to Vercel, Netlify, or similar.
- Ensure VITE_API_URL points to the production backend.
- If using cookie-based refresh, confirm the backend sets SameSite and domain appropriately for the chosen hosting domains.

Security tips for production:
- Set refresh cookies with httpOnly and secure flags; choose SameSite policy that fits your app flow.
- Use HTTPS for all traffic.
- Harden server headers with Helmet and enable rate-limiting on auth endpoints.

---

## 🔒 Security Considerations

- Hash passwords with bcrypt using an appropriate salt rounds configuration.
- Store JWT secrets and database credentials in secure environment variables or a secrets manager.
- Use httpOnly, secure cookies for refresh tokens and keep access tokens ephemeral.
- Validate and sanitize all inputs; use class-validator for DTOs.
- Protect endpoints against brute-force attempts via rate-limiting.
- Rotate and revoke refresh tokens when logout or suspicious activity occurs.
- Validate MongoDB ObjectIds before querying to mitigate injection risks.
- Implement Content Security Policy and other hardening measures on the frontend.

---

## ✅ Assessment Checklist

Use this checklist to confirm the repository meets assessment requirements:
- NestJS backend is modular and organized (auth, users, projects).
- Authentication with signup and login is implemented.
- Authorization enforces user-only access to projects (resource ownership).
- Full CRUD operations for projects exist and are protected.
- MongoDB + Mongoose models are in place and validated.
- TypeScript used consistently across backend and frontend.
- Input validation via DTOs and class-validator.
- Basic tests included (unit and e2e).
- Documentation and environment setup are present.

---

## 🔁 Extras (optional / suggested)

- Add Swagger/OpenAPI documentation for backend and expose it in non-production environments.
- Implement refresh-token rotation and server-side revocation storage (DB or Redis).
- Provide an importable Postman or Insomnia collection for API flows.
- Add GitHub Actions pipeline to run tests and lints on PRs.
