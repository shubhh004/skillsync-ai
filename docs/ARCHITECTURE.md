# SkillSync AI — System Architecture

> **Version:** 1.0.0
> **Status:** Active
> **Last Updated:** 2026-07-02
> **Author:** Lead Software Architect
> **Companion Documents:** [PROJECT_BIBLE.md](./PROJECT_BIBLE.md) · [DATABASE.md](./DATABASE.md) · [API.md](./API.md)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [System Topology](#2-system-topology)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Database Architecture](#5-database-architecture)
6. [Authentication Architecture](#6-authentication-architecture)
7. [State Management Architecture](#7-state-management-architecture)
8. [API Design Architecture](#8-api-design-architecture)
9. [Request Lifecycle](#9-request-lifecycle)
10. [Third-Party Integrations](#10-third-party-integrations)
11. [Error Handling Architecture](#11-error-handling-architecture)
12. [Security Architecture](#12-security-architecture)
13. [Environment Configuration](#13-environment-configuration)
14. [Scalability Considerations](#14-scalability-considerations)

---

## 1. Architecture Overview

SkillSync AI follows a **decoupled, three-tier architecture** organized as:

```
Presentation Tier  →  React SPA (client/)
Application Tier   →  Node.js + Express REST API (server/)
Data Tier          →  MongoDB Atlas + Cloudinary
```

The frontend and backend are **fully separated** — they communicate exclusively over HTTP via a versioned REST API. There is no server-side rendering, no template engine, and no shared runtime. This separation enforces clean interface contracts and allows each tier to evolve, scale, and deploy independently.

### Architectural Style

| Decision | Choice | Reason |
|----------|--------|--------|
| API Style | REST | Simplicity, broad tooling support, fits CRUD-heavy domain |
| Rendering | Client-Side Rendering (CSR) | SPA behavior required; no SEO requirement for authenticated pages |
| State Pattern | Centralized Redux + local React state | Predictable global state for auth/user; local state for form/UI |
| Data Fetching | Axios (manual) | Explicit control; RTK Query can be layered in later |
| Auth Mechanism | JWT (access + refresh tokens) | Stateless; no server-side session storage required |
| Database | Document-oriented (MongoDB) | Flexible schema; suits feature iteration without migrations |

---

## 2. System Topology

```
┌─────────────────────────────────────────────────────────────────────┐
│                            CLIENT BROWSER                           │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                    React SPA (Vite)                         │   │
│   │                                                             │   │
│   │   ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐ │   │
│   │   │  Redux   │  │ React Router │  │  Axios HTTP Client   │ │   │
│   │   │  Store   │  │   v6 (CSR)   │  │  (services/ layer)   │ │   │
│   │   └──────────┘  └──────────────┘  └──────────┬───────────┘ │   │
│   └─────────────────────────────────────────────┼─────────────┘   │
└─────────────────────────────────────────────────┼─────────────────┘
                                                   │ HTTPS / REST
                                                   │ JSON
┌─────────────────────────────────────────────────▼─────────────────┐
│                       NODE.JS + EXPRESS SERVER                     │
│                                                                    │
│   ┌────────────────────────────────────────────────────────────┐  │
│   │                    Middleware Pipeline                      │  │
│   │   CORS → Helmet → Rate Limit → Body Parser → Auth Guard    │  │
│   └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐  │
│   │   Routes     │──▶│ Controllers  │──▶│     Services         │  │
│   │  (Express)   │   │ (req / res)  │   │  (business logic)    │  │
│   └──────────────┘   └──────────────┘   └──────────┬───────────┘  │
│                                                     │              │
│   ┌──────────────────────────────────────────────── ▼ ──────────┐  │
│   │                     Mongoose ODM                            │  │
│   └──────────────────────────────┬──────────────────────────────┘  │
└─────────────────────────────────┼──────────────────────────────────┘
                                  │
          ┌───────────────────────┼────────────────────┐
          │                       │                    │
┌─────────▼──────────┐  ┌────────▼────────┐  ┌────────▼────────┐
│   MongoDB Atlas    │  │   Cloudinary    │  │  Gemini API     │
│   (Primary DB)     │  │ (Image Storage) │  │  (AI — Ph. 2)   │
└────────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 3. Frontend Architecture

### 3.1 Technology Layer Map

```
┌─────────────────────────────────────────────────────┐
│                      main.jsx                       │  Entry point
│         (React DOM render + Redux Provider)         │
└─────────────────────────┬───────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────┐
│                       App.jsx                       │  Router root
│              (React Router v6 BrowserRouter)        │
└─────────────────────────┬───────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
┌─────────▼──────┐ ┌──────▼──────┐ ┌─────▼────────────┐
│  AuthLayout    │ │  AppLayout  │ │  PublicRoutes    │
│ (Login/Reg.)   │ │ (Dashboard) │ │  (Landing page)  │
└────────────────┘ └──────┬──────┘ └──────────────────┘
                          │
          ┌───────────────┼───────────────────────┐
          │               │                       │
   ┌──────▼──────┐ ┌──────▼──────┐         ┌─────▼──────┐
   │  features/  │ │  features/  │   ...   │ features/  │
   │    dsa/     │ │   resume/   │         │ analytics/ │
   └─────────────┘ └─────────────┘         └────────────┘
```

### 3.2 Component Hierarchy

Components are organized into three tiers of specificity:

| Tier | Location | Description | Examples |
|------|----------|-------------|---------|
| **Primitives** | `components/ui/` | No business logic. Pure visual atoms | `Button`, `Input`, `Modal`, `Badge`, `Card` |
| **Shared Components** | `components/` | Reusable across features. May hold minor local state | `Navbar`, `Sidebar`, `PageHeader`, `LoadingSpinner` |
| **Feature Components** | `features/<name>/components/` | Specific to one feature. May connect to Redux | `DsaProblemCard`, `ResumeSection`, `KanbanColumn` |

**Rule:** Components only move up a tier (from feature → shared → primitive) when a second feature needs them. Never pre-promote.

### 3.3 Routing Architecture

React Router v6 is configured in `src/routes/` and enforces two access patterns:

```
/                          → Landing page (public)
/login                     → Login page (public, redirect if authed)
/register                  → Register page (public, redirect if authed)
/dashboard                 → Dashboard (protected)
/dsa                       → DSA Tracker (protected)
/dsa/:id                   → DSA Problem Detail (protected)
/resume                    → Resume Builder (protected)
/resume/:id                → Resume Editor (protected)
/jobs                      → Job Application Tracker (protected)
/interview                 → AI Interview Home (protected)
/interview/:sessionId      → Interview Session (protected)
/analytics                 → Analytics Dashboard (protected)
/profile                   → User Profile (protected)
```

**ProtectedRoute** — a wrapper component that reads the Redux auth slice. If `auth.isAuthenticated` is false, it redirects to `/login` with the original destination saved in location state for post-login redirect.

**PublicOnlyRoute** — wraps `/login` and `/register`. If the user is already authenticated, redirects to `/dashboard`.

### 3.4 Services Layer

All HTTP calls are centralized in `src/services/`. No component or Redux thunk makes raw `fetch` calls.

```
src/services/
├── api.js               # Axios instance with base URL, default headers, interceptors
├── auth.service.js      # register, login, logout, refreshToken
├── dsa.service.js       # getProblems, addProblem, updateProblem, deleteProblem
├── resume.service.js    # getResumes, createResume, updateResume, deleteResume
├── jobs.service.js      # getApplications, addApplication, updateStatus
├── interview.service.js # startSession, submitAnswer, getSessionResult
└── analytics.service.js # getDsaStats, getJobStats, getStreakData
```

**Axios Instance (`api.js`) responsibilities:**
- Sets `baseURL` from `VITE_API_BASE_URL`
- Attaches `Authorization: Bearer <accessToken>` header on every request via request interceptor
- Handles `401 Unauthorized` responses via response interceptor: automatically attempts a token refresh and retries the original request once before redirecting to login

---

## 4. Backend Architecture

### 4.1 Layer Responsibilities

The backend enforces a strict three-layer separation. Each layer has exactly one responsibility and must not cross into another layer's domain.

```
┌─────────────────────────────────────────────────────┐
│                     ROUTES LAYER                    │
│  src/routes/*.routes.js                             │
│  — Declares HTTP method + path                      │
│  — Applies middleware (auth guard, validators)      │
│  — Delegates to controller. Nothing else.           │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│                  CONTROLLER LAYER                   │
│  src/controllers/*.controller.js                    │
│  — Reads req (params, body, query, user)            │
│  — Calls service methods                            │
│  — Writes res (status + JSON envelope)              │
│  — try/catch → passes errors to next(err)           │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│                   SERVICE LAYER                     │
│  src/services/*.service.js                          │
│  — Contains all business logic                      │
│  — Calls Mongoose models for data access            │
│  — Calls external APIs (Cloudinary, Gemini)         │
│  — Throws structured errors for controller to catch │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│                    MODEL LAYER                      │
│  src/models/*.model.js                              │
│  — Mongoose schema definition                       │
│  — Schema-level validation and defaults             │
│  — Pre/post hooks (e.g., password hashing)          │
│  — Static and instance methods on documents         │
└─────────────────────────────────────────────────────┘
```

### 4.2 Middleware Pipeline

Every incoming request passes through the following middleware stack in order:

```
Incoming Request
       │
       ▼
┌──────────────────┐
│   CORS           │  Allows requests from VITE_CLIENT_URL only
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   Helmet         │  Sets secure HTTP response headers
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   Rate Limiter   │  100 requests / 15 min per IP (configurable)
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   Body Parser    │  express.json() — parses JSON request bodies
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   Request Logger │  Dev: morgan 'dev'. Prod: morgan 'combined'
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   API Router     │  /api/v1/* — routes to feature routers
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   Auth Guard     │  Verifies JWT on protected routes (per-route middleware)
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   Validator      │  express-validator rules (per-route middleware)
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   Controller     │  Handles request, calls service
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Global Error    │  Catches all next(err) calls; formats error response
│  Handler         │
└──────────────────┘
```

### 4.3 Express App Structure (`app.js`)

`app.js` wires up middleware and routes. It exports the configured Express app.
`server.js` imports `app.js`, connects to MongoDB, and starts listening on the port.

This separation allows `app.js` to be imported cleanly in tests without starting a live server.

---

## 5. Database Architecture

### 5.1 Design Philosophy

MongoDB is used as a **document store**, not a relational database. Schema design follows these rules:

1. **Embed for read performance** — data that is always read together should live together in one document (e.g., resume sections inside a Resume document)
2. **Reference for independent entities** — data with its own lifecycle, queried independently, uses ObjectId references (e.g., `userId` on DsaProblem)
3. **Avoid deep nesting** — maximum two levels of nested objects in a document before considering a separate collection
4. **Index for query patterns** — every field used in a filter or sort must have an index

### 5.2 Collections Overview

| Collection | Purpose | Key Relationships |
|------------|---------|-------------------|
| `users` | Account and profile data | Root entity; referenced by all others |
| `dsaproblems` | Individual DSA log entries per user | References `users` via `userId` |
| `resumes` | Resume documents with embedded sections | References `users` via `userId` |
| `jobapplications` | Job pipeline entries per user | References `users` via `userId` |
| `interviewsessions` | AI interview session records | References `users` via `userId` |

### 5.3 Entity Relationship Overview

```
users
  │
  ├──< dsaproblems        (one user → many DSA problems)
  │
  ├──< resumes            (one user → many resume versions)
  │     └── sections[]   (embedded: education, skills, projects, etc.)
  │
  ├──< jobapplications    (one user → many applications)
  │     └── statusHistory[] (embedded: timestamped status log)
  │
  └──< interviewsessions  (one user → many interview sessions)
        └── messages[]    (embedded: Q&A transcript)
```

### 5.4 Indexing Strategy

| Collection | Index | Type | Reason |
|------------|-------|------|--------|
| `users` | `email` | Unique | Login lookup |
| `dsaproblems` | `userId` | Standard | Filter all problems by owner |
| `dsaproblems` | `userId + topic` | Compound | Topic-filtered queries |
| `dsaproblems` | `userId + difficulty` | Compound | Difficulty-filtered queries |
| `dsaproblems` | `userId + solvedAt` | Compound | Streak and heatmap date queries |
| `resumes` | `userId` | Standard | List resumes by owner |
| `jobapplications` | `userId` | Standard | Pipeline query by owner |
| `jobapplications` | `userId + status` | Compound | Kanban column filtering |
| `interviewsessions` | `userId` | Standard | Session history by owner |

---

## 6. Authentication Architecture

### 6.1 Token Strategy

SkillSync AI uses a **dual-token JWT pattern**:

| Token | Storage | Expiry | Purpose |
|-------|---------|--------|---------|
| **Access Token** | Memory (Redux store) | 15 minutes | Authorizes API requests |
| **Refresh Token** | HTTP-only cookie | 7 days | Obtains new access tokens silently |

**Why this pattern:**
- The access token is short-lived; exposure window is small
- The refresh token is in an HTTP-only cookie — JavaScript cannot read it, mitigating XSS theft
- Storing the access token only in memory (not `localStorage`) eliminates another XSS vector

### 6.2 Registration Flow

```
Client                          Server                        DB
  │                               │                           │
  │── POST /api/v1/auth/register ▶│                           │
  │   { name, email, password,    │                           │
  │     college }                 │                           │
  │                               │── validate input          │
  │                               │── check email unique ───▶ │
  │                               │◀─ user not found          │
  │                               │── hash password (bcrypt)  │
  │                               │── create User document ──▶│
  │                               │◀─ saved user              │
  │                               │── generate accessToken    │
  │                               │── generate refreshToken   │
  │                               │── set refreshToken cookie │
  │◀─ 201 { success, data: {      │
  │         user, accessToken } } │
```

### 6.3 Login Flow

```
Client                          Server                        DB
  │                               │                           │
  │── POST /api/v1/auth/login ───▶│                           │
  │   { email, password }         │                           │
  │                               │── find user by email ───▶ │
  │                               │◀─ user document           │
  │                               │── bcrypt.compare()        │
  │                               │── generate accessToken    │
  │                               │── generate refreshToken   │
  │                               │── set refreshToken cookie │
  │◀─ 200 { success, data: {      │
  │         user, accessToken } } │
```

### 6.4 Authenticated Request Flow

```
Client                          Server
  │                               │
  │── GET /api/v1/dsa-problems ──▶│
  │   Authorization: Bearer       │
  │   <accessToken>               │
  │                               │── auth middleware:
  │                               │   jwt.verify(token, JWT_SECRET)
  │                               │   attaches req.user = { id, email }
  │                               │── controller executes
  │◀─ 200 { success, data: [...] }│
```

### 6.5 Token Refresh Flow

```
Client                          Server
  │                               │
  │  [Access token expires]       │
  │                               │
  │── POST /api/v1/auth/refresh ─▶│
  │   (refreshToken in cookie)    │── read cookie
  │                               │── jwt.verify(refreshToken)
  │                               │── generate new accessToken
  │◀─ 200 { accessToken }         │
  │                               │
  │  [Retry original request      │
  │   with new accessToken]       │
```

The Axios response interceptor handles the refresh silently. The user never sees a session interruption.

### 6.6 Logout Flow

```
Client                          Server
  │                               │
  │── POST /api/v1/auth/logout ──▶│── clear refreshToken cookie
  │                               │   (maxAge: 0, same attributes)
  │◀─ 200 { success: true }       │
  │                               │
  │  [Redux: clear auth state]    │
  │  [Axios: drop accessToken]    │
  │  [Redirect → /login]          │
```

### 6.7 Auth Guard Middleware

The `authenticate` middleware in `src/middleware/auth.middleware.js`:

1. Reads the `Authorization` header
2. Extracts the Bearer token
3. Calls `jwt.verify(token, process.env.JWT_SECRET)`
4. On success: attaches decoded payload to `req.user` and calls `next()`
5. On failure: calls `next(new AppError('Unauthorized', 401))`

Route-level authorization (ownership checks — "does this user own this resource?") is handled inside service methods, not in middleware.

---

## 7. State Management Architecture

### 7.1 Redux Store Structure

```
store/
├── index.js              # configureStore — combines all slices
└── slices/
    ├── authSlice.js       # user, accessToken, isAuthenticated, loading
    ├── dsaSlice.js        # problems[], filters, pagination, loading
    ├── resumeSlice.js     # resumes[], activeResume, loading
    ├── jobsSlice.js       # applications[], statusFilter, loading
    └── uiSlice.js         # theme, sidebarOpen, toasts
```

### 7.2 What Lives in Redux vs. Local State

| Data Type | Where | Reason |
|-----------|-------|--------|
| Authenticated user + token | Redux `authSlice` | Needed across entire app |
| Theme / sidebar state | Redux `uiSlice` | Needed across layouts |
| Feature list data (problems, resumes, etc.) | Redux feature slice | Needed across feature sub-pages |
| Form field values | Local (`useState`) | Ephemeral; no cross-component need |
| Modal open/close | Local (`useState`) | Ephemeral; scoped to one component |
| Chart render state | Local (`useState`) | Chart.js manages its own internal state |

### 7.3 Async Action Pattern

All API calls in Redux use `createAsyncThunk`. Each thunk:
1. Calls a function from `services/`
2. Returns the data on success — Redux Toolkit auto-dispatches `fulfilled`
3. Throws on error — Redux Toolkit auto-dispatches `rejected`

Each slice handles `pending`, `fulfilled`, and `rejected` states to drive loading spinners and error messages.

---

## 8. API Design Architecture

### 8.1 Base URL and Versioning

```
/api/v1/
```

All API routes are prefixed with `/api/v1/`. The version segment (`v1`) is part of the URL — not a header. When a breaking change requires a new contract, `/api/v2/` is introduced alongside, not replacing, v1. Consumers opt in.

### 8.2 Route Naming Convention

- Lowercase, hyphen-separated, plural nouns
- No verbs in the URL — the HTTP method is the verb
- Nested resources use shallow nesting (max one level deep)

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh

GET    /api/v1/users/me
PATCH  /api/v1/users/me

GET    /api/v1/dsa-problems
POST   /api/v1/dsa-problems
GET    /api/v1/dsa-problems/:id
PATCH  /api/v1/dsa-problems/:id
DELETE /api/v1/dsa-problems/:id

GET    /api/v1/resumes
POST   /api/v1/resumes
GET    /api/v1/resumes/:id
PATCH  /api/v1/resumes/:id
DELETE /api/v1/resumes/:id

GET    /api/v1/job-applications
POST   /api/v1/job-applications
GET    /api/v1/job-applications/:id
PATCH  /api/v1/job-applications/:id
DELETE /api/v1/job-applications/:id

GET    /api/v1/interview-sessions
POST   /api/v1/interview-sessions
GET    /api/v1/interview-sessions/:id
POST   /api/v1/interview-sessions/:id/answer

GET    /api/v1/analytics/dsa
GET    /api/v1/analytics/jobs
GET    /api/v1/analytics/streak
```

### 8.3 Response Envelope

Every API response — success or failure — uses the same envelope structure. No exceptions.

**Success:**
```json
{
  "success": true,
  "data": { }
}
```

**Success with pagination:**
```json
{
  "success": true,
  "data": [ ],
  "pagination": {
    "total": 120,
    "page": 2,
    "limit": 20,
    "totalPages": 6
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "A human-readable description of what went wrong",
  "errors": [ ]
}
```

The `errors` array is populated for validation failures, where each entry maps to a specific field. It is omitted for non-validation errors.

### 8.4 HTTP Status Code Usage

| Status | Meaning | When Used |
|--------|---------|-----------|
| `200 OK` | Success | GET, PATCH, DELETE successful |
| `201 Created` | Resource created | POST successful |
| `400 Bad Request` | Validation failure | express-validator errors |
| `401 Unauthorized` | Not authenticated | Missing or invalid JWT |
| `403 Forbidden` | Not authorized | Authenticated but accessing another user's resource |
| `404 Not Found` | Resource missing | Document not found in DB |
| `409 Conflict` | Duplicate resource | Email already registered |
| `429 Too Many Requests` | Rate limit exceeded | Rate limiter triggered |
| `500 Internal Server Error` | Unhandled server fault | Uncaught error, DB failure |

---

## 9. Request Lifecycle

A complete trace of a DSA problem creation request from button click to database write and back:

```
1. USER ACTION
   User fills out "Add Problem" form and clicks Submit.

2. COMPONENT
   DsaAddForm.jsx calls dispatch(addProblem(formData))
   from the Redux thunk in dsaSlice.js.

3. REDUX THUNK
   createAsyncThunk calls dsa.service.js → addProblem(data).

4. AXIOS (services/api.js)
   POST /api/v1/dsa-problems
   Headers: Authorization: Bearer <accessToken>
   Body: { title, platform, topic, difficulty, status, notes, link }

5. EXPRESS ROUTER (routes/dsa.routes.js)
   Route matches POST /api/v1/dsa-problems.
   Runs: [authenticate, validateProblemInput] middleware chain.

6. AUTH MIDDLEWARE
   Reads Authorization header.
   jwt.verify() → attaches req.user = { id: '...', email: '...' }

7. VALIDATOR MIDDLEWARE
   express-validator checks all fields.
   If invalid → next(validationError) → Global Error Handler → 400 response.

8. CONTROLLER (controllers/dsa.controller.js)
   Reads req.body and req.user.id.
   Calls DsaService.createProblem(req.user.id, req.body).
   Awaits result.

9. SERVICE (services/dsa.service.js)
   Constructs the document object.
   Calls DsaProblem.create({ userId: req.user.id, ...data }).

10. MONGOOSE MODEL
    Validates against schema.
    Writes document to MongoDB Atlas.
    Returns the saved document.

11. RESPONSE CHAIN (unwinding)
    Service → returns saved document to controller.
    Controller → res.status(201).json({ success: true, data: problem }).

12. AXIOS INTERCEPTOR
    Receives 201 response. Returns response.data.

13. REDUX THUNK
    createAsyncThunk receives fulfilled value.
    Auto-dispatches addProblem.fulfilled action.

14. REDUX SLICE
    dsaSlice extraReducers → pushes new problem into state.problems[].
    Sets loading: false.

15. COMPONENT RE-RENDER
    useSelector picks up new state.
    Problem list re-renders with new entry.
    Toast notification shown.
```

---

## 10. Third-Party Integrations

### 10.1 Cloudinary (Image Storage)

**Purpose:** Profile photo upload for the Resume Builder.

**Flow:**
1. User selects an image in the frontend
2. Client sends the file via `multipart/form-data` to `POST /api/v1/users/me/avatar`
3. Express uses `multer` middleware to receive the file buffer in memory (no disk write)
4. `auth.service.js` calls `cloudinary.uploader.upload_stream()` with the buffer
5. Cloudinary returns a secure URL and `public_id`
6. The URL is saved to the `User` document in MongoDB
7. The URL is returned to the client and stored in Redux auth state

**Configuration:** Cloudinary credentials (`CLOUD_NAME`, `API_KEY`, `API_SECRET`) are set in environment variables and initialized once in `src/config/cloudinary.js`.

**Image handling rules:**
- Max upload size: 2MB (enforced by multer)
- Allowed types: `image/jpeg`, `image/png`, `image/webp`
- Transformation applied on upload: resize to 400×400, auto-format, auto-quality
- Old image is deleted from Cloudinary when a new one is uploaded (using stored `public_id`)

### 10.2 Gemini API (Phase 2 — AI Interview)

**Purpose:** Powers the AI Interview Practice feature.

**Integration point:** `src/services/ai.service.js` on the backend. The Gemini API is **never called from the frontend** — the API key must remain server-side.

**Planned usage:**
- Generate interview questions based on type (DSA, Behavioral, System Design, HR) and difficulty
- Evaluate user answers and produce a structured feedback object
- Generate follow-up questions contextually based on prior answer quality

**Key constraint:** Gemini API calls are made server-side only. The client sends answers to the SkillSync API; the SkillSync backend calls Gemini and returns processed results. The Gemini API key is never exposed to the browser.

---

## 11. Error Handling Architecture

### 11.1 AppError Class

A custom `AppError` class in `src/utils/AppError.js` is the only error type thrown by services. It carries:
- `message` — human-readable description
- `statusCode` — HTTP status code to respond with
- `isOperational` — `true` for expected errors (404, 401, 400); `false` for programmer errors

### 11.2 Global Error Handler

A single Express error-handling middleware (`src/middleware/error.middleware.js`) catches all errors passed via `next(err)`. It:

1. Checks `err.isOperational`
2. For **operational errors** — responds with `err.statusCode` and `err.message`
3. For **programmer errors** in production — responds with `500` and a generic "Something went wrong" message (never leaks stack traces)
4. For **programmer errors** in development — responds with `500`, full stack trace, and error message

### 11.3 Unhandled Rejections and Exceptions

`server.js` registers:
- `process.on('unhandledRejection')` — logs the error, shuts down the server gracefully
- `process.on('uncaughtException')` — logs the error, shuts down immediately (the process state is now unreliable)

In production, a process manager (e.g., PM2) restarts the server automatically.

### 11.4 Frontend Error Handling

- Axios response interceptor catches all HTTP errors centrally
- `401` errors trigger a token refresh attempt, then redirect to `/login` if refresh also fails
- `4xx` errors dispatch a toast notification with the `message` field from the error envelope
- `5xx` errors display a generic "Something went wrong. Please try again." toast
- Component-level error boundaries (React `ErrorBoundary`) catch rendering errors and display a fallback UI

---

## 12. Security Architecture

### 12.1 Security Controls by Layer

| Layer | Control | Implementation |
|-------|---------|---------------|
| **Network** | HTTPS only | Enforced at hosting/reverse proxy level |
| **HTTP Headers** | Secure headers | `helmet` middleware |
| **API** | Rate limiting | `express-rate-limit` — 100 req/15 min per IP |
| **API** | CORS policy | Whitelist of allowed origins only |
| **Input** | Request validation | `express-validator` on every mutation route |
| **Auth** | Password storage | `bcryptjs` with salt rounds ≥ 10 |
| **Auth** | Access token | JWT, 15-min expiry, signed with `JWT_SECRET` |
| **Auth** | Refresh token | JWT, 7-day expiry, HTTP-only cookie, `Secure`, `SameSite=Strict` |
| **Auth** | Route protection | `authenticate` middleware on all non-public routes |
| **Authorization** | Resource ownership | Service layer checks `document.userId === req.user.id` |
| **Data** | NoSQL injection | Mongoose sanitizes inputs; avoid raw `$where` queries |
| **Secrets** | Env var management | `.env` never committed; `.env.example` has no values |
| **Frontend** | XSS prevention | React escapes JSX by default; no `dangerouslySetInnerHTML` |

### 12.2 What Is Never Done

- Storing passwords in plaintext or with reversible encryption
- Logging tokens, passwords, or PII to the console
- Returning stack traces or internal error details in production responses
- Calling the Gemini API or Cloudinary from the frontend (API keys stay server-side)
- Trusting `req.body` without validation
- Using `eval()` or dynamic `require()` with user-provided input

---

## 13. Environment Configuration

### 13.1 Server Environment Variables

```
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/skillsync

# JWT
JWT_SECRET=<minimum 64-character random string>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_SECRET=<different minimum 64-character random string>
JWT_REFRESH_EXPIRY=7d

# Cookie
COOKIE_SECRET=<random string>

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# AI (Phase 2)
GEMINI_API_KEY=

# CORS
CLIENT_URL=http://localhost:5173
```

### 13.2 Client Environment Variables

```
# Vite client-side (must be prefixed VITE_)
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### 13.3 Environment Rules

- `NODE_ENV=development` — verbose logging, full error stacks in responses, morgan 'dev'
- `NODE_ENV=production` — morgan 'combined', generic error messages, no stack traces in responses
- The `config/` module validates that all required environment variables are set at startup and throws a descriptive error if any are missing, preventing a silent misconfigured deployment

---

## 14. Scalability Considerations

These are architectural decisions made today that will support growth — without over-engineering for scale that does not yet exist.

### What Scales Well With This Architecture

| Area | Current Design | Why It Scales |
|------|---------------|---------------|
| **Auth** | Stateless JWT | No session store needed; any server instance can verify any token |
| **Database** | MongoDB Atlas | Horizontally scalable; Atlas handles replica sets and sharding |
| **File Storage** | Cloudinary | CDN-backed; zero storage burden on the application server |
| **API** | Versioned REST | `/api/v2/` can run alongside v1 without breaking existing clients |
| **Frontend** | Vite build + static hosting | Static files served from CDN; no server required for the SPA |

### Planned Scaling Path (When Needed)

| Trigger | Response |
|---------|----------|
| High API request volume | Add a reverse proxy (Nginx) + horizontal Node.js scaling behind a load balancer |
| Slow analytics queries | Add MongoDB aggregation pipeline caching or a dedicated read replica |
| AI feature load | Move Gemini API calls to a dedicated microservice or queue with a worker pool |
| Email notifications (future) | Add a background job queue (Bull + Redis) separate from the main API process |

### Current Non-Goals

The following are explicitly deferred until there is evidence of need:

- Microservices architecture
- GraphQL
- WebSockets (real-time features)
- Redis caching layer
- Kubernetes or container orchestration
- CDN for API responses

These are not rejected — they are queued. The monolithic REST API is the correct architecture for this stage.

---

*For database schema details, see [DATABASE.md](./DATABASE.md). For full API endpoint contracts, see [API.md](./API.md).*
