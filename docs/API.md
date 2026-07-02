# SkillSync AI — API Reference (v1)

> **Version:** 1.0.0
> **Base URL:** `/api/v1`
> **Status:** MVP — Active
> **Last Updated:** 2026-07-02
> **Companion Documents:** [DATABASE.md](./DATABASE.md) · [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Table of Contents

1. [Conventions](#1-conventions)
2. [Authentication](#2-authentication)
3. [DSA Tracker](#3-dsa-tracker)
4. [Resume](#4-resume)
5. [Job Tracker](#5-job-tracker)
6. [Notes](#6-notes)
7. [API Folder Structure](#7-api-folder-structure)

---

## 1. Conventions

**Base URL:** All endpoints are prefixed with `/api/v1`.

**Auth header:** Protected routes require `Authorization: Bearer <accessToken>` on every request.

**Response envelope:**

| Outcome | Shape |
|---------|-------|
| Success | `{ "success": true, "data": { } }` |
| List | `{ "success": true, "data": [ ], "pagination": { } }` |
| Error | `{ "success": false, "message": "..." }` |

**HTTP status codes:**

| Code | Meaning |
|------|---------|
| `200` | Successful GET or PATCH |
| `201` | Successful POST — resource created |
| `400` | Validation failure |
| `401` | Missing or invalid access token |
| `403` | Token valid but resource belongs to another user |
| `404` | Resource not found |
| `409` | Conflict — e.g. duplicate email |
| `500` | Unhandled server error |

---

## 2. Authentication

Handles account creation, login, and profile retrieval. Register and login are the only public endpoints in the entire API — every other route requires a valid access token.

---

### POST `/api/v1/auth/register`

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **Route** | `/api/v1/auth/register` |
| **Purpose** | Creates a new student account and returns an access token on success. |
| **Auth Required** | No |

---

### POST `/api/v1/auth/login`

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **Route** | `/api/v1/auth/login` |
| **Purpose** | Validates email and password credentials and returns a new access token. |
| **Auth Required** | No |

---

### GET `/api/v1/auth/profile`

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **Route** | `/api/v1/auth/profile` |
| **Purpose** | Returns the profile data of the currently authenticated user. |
| **Auth Required** | Yes |

---

## 3. DSA Tracker

Manages the user's personal DSA problem log. Every endpoint is scoped to the authenticated user — no user can access or modify another user's records.

---

### GET `/api/v1/dsa`

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **Route** | `/api/v1/dsa` |
| **Purpose** | Returns a paginated list of the user's DSA entries, filterable by topic, difficulty, platform, and status. |
| **Auth Required** | Yes |

---

### POST `/api/v1/dsa`

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **Route** | `/api/v1/dsa` |
| **Purpose** | Logs a new DSA problem entry for the authenticated user. |
| **Auth Required** | Yes |

---

### PATCH `/api/v1/dsa/:id`

| Property | Value |
|----------|-------|
| **Method** | `PATCH` |
| **Route** | `/api/v1/dsa/:id` |
| **Purpose** | Updates one or more fields of a specific DSA entry by its ID. |
| **Auth Required** | Yes |

---

## 4. Resume

Manages the user's resume versions. All resume content — personal info, education, projects, skills, and certifications — is stored within a single resume document and returned together on fetch.

---

### GET `/api/v1/resume`

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **Route** | `/api/v1/resume` |
| **Purpose** | Returns all saved resume versions belonging to the authenticated user. |
| **Auth Required** | Yes |

---

### POST `/api/v1/resume`

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **Route** | `/api/v1/resume` |
| **Purpose** | Creates a new resume version for the authenticated user. |
| **Auth Required** | Yes |

---

### PATCH `/api/v1/resume`

| Property | Value |
|----------|-------|
| **Method** | `PATCH` |
| **Route** | `/api/v1/resume` |
| **Purpose** | Updates the content or metadata of the user's default resume, or a specified resume version. |
| **Auth Required** | Yes |

---

## 5. Job Tracker

Manages the user's job application pipeline. Each application carries a company, role, and an append-only status history that records every stage transition from Applied through to Offer or Rejection.

---

### GET `/api/v1/jobs`

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **Route** | `/api/v1/jobs` |
| **Purpose** | Returns all job applications for the authenticated user, filterable by pipeline status. |
| **Auth Required** | Yes |

---

### POST `/api/v1/jobs`

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **Route** | `/api/v1/jobs` |
| **Purpose** | Creates a new job application entry with an initial status of Applied. |
| **Auth Required** | Yes |

---

### PATCH `/api/v1/jobs/:id`

| Property | Value |
|----------|-------|
| **Method** | `PATCH` |
| **Route** | `/api/v1/jobs/:id` |
| **Purpose** | Updates a specific job application; any status change is appended to the application's status history. |
| **Auth Required** | Yes |

---

## 6. Notes

Manages the user's notes. A note can be standalone or linked to a DSA entry, job application, or interview session via a polymorphic entity reference stored on the note itself.

---

### GET `/api/v1/notes`

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **Route** | `/api/v1/notes` |
| **Purpose** | Returns all notes for the authenticated user, with pinned notes sorted to the top. |
| **Auth Required** | Yes |

---

### POST `/api/v1/notes`

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **Route** | `/api/v1/notes` |
| **Purpose** | Creates a new note, optionally linked to a DSA entry, job application, or interview session. |
| **Auth Required** | Yes |

---

### PATCH `/api/v1/notes/:id`

| Property | Value |
|----------|-------|
| **Method** | `PATCH` |
| **Route** | `/api/v1/notes/:id` |
| **Purpose** | Updates the title, content, tags, pin status, or color of a specific note by ID. |
| **Auth Required** | Yes |

---

### DELETE `/api/v1/notes/:id`

| Property | Value |
|----------|-------|
| **Method** | `DELETE` |
| **Route** | `/api/v1/notes/:id` |
| **Purpose** | Permanently deletes a specific note belonging to the authenticated user. |
| **Auth Required** | Yes |

---

## 7. API Folder Structure

```
server/src/
├── routes/
│   ├── auth.routes.js
│   ├── dsa.routes.js
│   ├── resume.routes.js
│   ├── jobs.routes.js
│   └── notes.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── dsa.controller.js
│   ├── resume.controller.js
│   ├── jobs.controller.js
│   └── notes.controller.js
├── services/
│   ├── auth.service.js
│   ├── dsa.service.js
│   ├── resume.service.js
│   ├── jobs.service.js
│   └── notes.service.js
├── models/
│   ├── User.model.js
│   ├── DsaProblem.model.js
│   ├── Resume.model.js
│   ├── JobApplication.model.js
│   └── Note.model.js
├── middleware/
│   ├── auth.middleware.js
│   ├── validate.middleware.js
│   └── error.middleware.js
└── app.js
```

Each module owns a dedicated route file, controller, and service — all wired together in `app.js` under the `/api/v1` prefix. Route files declare only the HTTP method, path, and middleware chain before handing off to the controller; controllers handle the request-response cycle and pass work to the service; services contain all business logic and are the only layer that interacts with Mongoose models directly. The `middleware/` directory holds the three shared concerns applied across every protected route — the auth guard that verifies the Bearer token, the `express-validator` validation chains that reject malformed input before it reaches a controller, and the global error handler that converts every thrown error into a consistent response envelope.

---

*This document covers Version 1 endpoints only. For the full database schema see [DATABASE.md](./DATABASE.md). For system design context see [ARCHITECTURE.md](./ARCHITECTURE.md).*
