# SkillSync AI — Project Bible

> **Version:** 1.0.0
> **Status:** Active
> **Last Updated:** 2026-07-02
> **Author:** Lead Software Architect

---

## Table of Contents

1. [Project Vision](#1-project-vision)
2. [Project Mission](#2-project-mission)
3. [Core Objectives](#3-core-objectives)
4. [Target Users](#4-target-users)
5. [Tech Stack](#5-tech-stack)
6. [Development Principles](#6-development-principles)
7. [Coding Standards](#7-coding-standards)
8. [Folder Organization Philosophy](#8-folder-organization-philosophy)
9. [Git Workflow](#9-git-workflow)
10. [Branch Strategy](#10-branch-strategy)
11. [Commit Message Convention](#11-commit-message-convention)
12. [Project Milestones](#12-project-milestones)
13. [Future Scope](#13-future-scope)

---

## 1. Project Vision

SkillSync AI is the definitive AI-powered placement preparation platform for college students entering the software engineering job market.

We believe that placement success should not be determined by access to expensive coaching, luck, or informal networks. It should be earned through structured effort, intelligent guidance, and data-driven self-awareness.

SkillSync AI closes the gap between where a student is today and where they need to be to land their first software engineering role — by putting the right tools, feedback, and intelligence in one place.

---

## 2. Project Mission

To empower every college student with an AI-native, end-to-end placement toolkit — covering DSA mastery, resume crafting, mock interviews, and job tracking — so that preparation is deliberate, measurable, and effective regardless of college tier or prior access to resources.

---

## 3. Core Objectives

| # | Objective | Description |
|---|-----------|-------------|
| 1 | **DSA Progress Tracking** | Enable students to log, categorize, and track their Data Structures & Algorithms practice across difficulty levels and topics |
| 2 | **ATS-Optimized Resume Builder** | Provide a guided resume building experience that produces ATS-friendly output with AI-driven suggestions |
| 3 | **AI Interview Practice** | Simulate technical and behavioral interviews using the Gemini API, with real-time feedback and performance scoring |
| 4 | **Job Application Management** | Centralized pipeline to track applications, statuses, deadlines, and notes across multiple companies |
| 5 | **Analytics & Insights** | Surface meaningful metrics — streaks, topic coverage, weak areas, application conversion — through visual dashboards |
| 6 | **Progress Tracking** | Give students a longitudinal view of their growth over time to sustain motivation and guide effort |

---

## 4. Target Users

### Primary User

**The Placement-Seeking Engineering Student**

- Age range: 19–24
- Currently enrolled in a B.Tech / B.E. / MCA or equivalent program
- Preparing for internships (3rd year) or full-time placements (4th year)
- May or may not have prior structured DSA practice
- Likely familiar with LeetCode/GeeksForGeeks but lacks a unified preparation system
- Limited budget — expects a free-first or freemium model

### User Pain Points We Solve

| Pain Point | Our Solution |
|------------|--------------|
| Disorganized DSA practice across multiple platforms | Centralized DSA tracker with topic and difficulty filters |
| Resume rejected by ATS before reaching a recruiter | ATS-aware resume builder with scoring |
| No access to mock interview feedback | AI-powered interview simulation with actionable feedback |
| Applications scattered across emails and spreadsheets | Kanban-style job application pipeline |
| No way to measure real preparation progress | Analytics dashboard with streaks and coverage heatmaps |

---

## 5. Tech Stack

### Frontend

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | React.js 18 | Component-based UI, large ecosystem, team familiarity |
| Build Tool | Vite | Significantly faster HMR and build times than CRA |
| Styling | Tailwind CSS | Utility-first, consistent design system, no unused CSS in prod |
| State Management | Redux Toolkit | Predictable global state; RTK Query for server state caching |
| Charts | Chart.js + react-chartjs-2 | Lightweight, flexible, good React integration |
| Routing | React Router v6 | Industry-standard client-side routing |

### Backend

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Runtime | Node.js | JavaScript throughout the stack; async I/O well-suited to API workloads |
| Framework | Express.js | Minimal, flexible, well-documented; ideal for REST API construction |
| Authentication | JWT (JSON Web Tokens) | Stateless auth; scales without session store; refresh token pattern |
| Validation | express-validator | Declarative input validation at the route layer |
| Password Hashing | bcryptjs | Industry standard for credential security |

### Database & Storage

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Primary Database | MongoDB Atlas | Flexible schema suits evolving data models; managed cloud hosting |
| ODM | Mongoose | Schema enforcement, middleware hooks, and query builders for MongoDB |
| Image Storage | Cloudinary | CDN-backed media storage; handles upload, transformation, and delivery |

### AI

| Layer | Technology | Phase |
|-------|------------|-------|
| AI Engine | Google Gemini API | Phase 2+ — powers mock interviews and resume feedback |

### DevOps & Tooling

| Tool | Purpose |
|------|---------|
| ESLint | Static analysis and code consistency |
| Prettier | Opinionated code formatting |
| dotenv | Environment variable management |
| Postman / Thunder Client | API development and testing |
| Git + GitHub | Version control and collaboration |

---

## 6. Development Principles

These are non-negotiable. Every decision — architectural, feature, or cosmetic — must be weighed against these principles.

### 1. Simplicity First
Build the simplest thing that solves the problem correctly. No premature abstractions. No over-engineering for hypothetical scale that does not exist yet.

### 2. Feature Completeness Over Feature Count
A fully working, well-tested feature is worth more than five half-built ones. Each milestone must ship working, end-to-end features — not skeletons.

### 3. Consistency Is a Feature
Inconsistent APIs, inconsistent UI patterns, and inconsistent naming are bugs. Treat them as such. Establish a pattern once, then follow it everywhere.

### 4. Security Is Not Optional
Authentication, authorization, input validation, and secret management are first-class requirements from day one — not retrofits after launch.

### 5. Data Integrity Over Convenience
Never trust client-sent data. Always validate on the server. Schema constraints in Mongoose are the last line of defense, not the only one.

### 6. Fail Loudly in Development, Gracefully in Production
Development errors should be verbose and informative. Production errors should be caught, logged, and returned as clean, non-leaking error responses.

### 7. Environment Parity
Dev, staging, and production environments must behave identically. No "it works on my machine" excuses. Environment variables govern all differences.

---

## 7. Coding Standards

### General

- Use **ES6+** syntax throughout (arrow functions, destructuring, optional chaining, nullish coalescing)
- No `var`. Use `const` by default, `let` only when reassignment is necessary
- No commented-out dead code committed to the repository
- All async operations use `async/await` — no raw `.then().catch()` chains
- All errors must be explicitly caught and handled — no silent swallows

### Naming Conventions

| Context | Convention | Example |
|---------|------------|---------|
| Variables & Functions | camelCase | `getUserById`, `isAuthenticated` |
| React Components | PascalCase | `ResumeBuilder`, `DsaTrackerCard` |
| Constants / Env Keys | UPPER_SNAKE_CASE | `JWT_SECRET`, `MAX_RETRY_COUNT` |
| Database Collections | camelCase (Mongoose model name singular) | `User`, `DsaProblem` |
| CSS Classes (Tailwind) | Utility-first; no custom class names unless required | `flex items-center gap-4` |
| File Names — Components | PascalCase | `InterviewPanel.jsx` |
| File Names — Utilities / Hooks | camelCase | `useAuth.js`, `formatDate.js` |
| API Routes | kebab-case, noun-first, plural | `/api/dsa-problems`, `/api/job-applications` |

### React Standards

- One component per file. No exceptions
- Props must be destructured in the function signature
- Avoid inline styles — use Tailwind utilities
- Co-locate component-specific logic in custom hooks under `hooks/`
- Global state only for truly global data (auth user, theme). Prefer local state by default
- Never call hooks conditionally

### Backend Standards

- All route handlers must be wrapped in a `try/catch` or use an async error wrapper middleware
- Controllers must not contain business logic — delegate to service layer
- Service layer must not contain database queries — delegate to model/repository layer
- Never log sensitive data (passwords, tokens, PII) to the console
- All responses follow a consistent envelope:

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "message": "Human-readable error", "error": "OPTIONAL_CODE" }
```

### Environment Variables

- All secrets live in `.env` files, never in source code
- `.env` is always in `.gitignore`
- `.env.example` is committed with all keys present but values empty
- Prefix client-side Vite env vars with `VITE_`

---

## 8. Folder Organization Philosophy

The folder structure follows a **feature-first** organization on the frontend and a **layer-first** organization on the backend. This keeps related code together as the codebase grows, and avoids deeply nested cross-cutting imports.

### Frontend — `client/`

```
client/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Images, icons, fonts
│   ├── components/             # Shared, reusable UI components
│   │   └── ui/                 # Primitives: Button, Input, Modal, Card
│   ├── features/               # Feature modules (self-contained)
│   │   ├── auth/               # Login, Register, auth slice
│   │   ├── dsa/                # DSA Tracker pages, components, slice
│   │   ├── resume/             # Resume Builder pages, components, slice
│   │   ├── interview/          # AI Interview pages, components, slice
│   │   ├── jobs/               # Job Applications pages, components, slice
│   │   └── analytics/          # Dashboard pages, components
│   ├── hooks/                  # Shared custom React hooks
│   ├── layouts/                # Page layout wrappers (AuthLayout, AppLayout)
│   ├── pages/                  # Top-level route page components
│   ├── routes/                 # React Router config and protected route logic
│   ├── services/               # Axios instance, API call functions
│   ├── store/                  # Redux store configuration
│   ├── styles/                 # Global CSS, Tailwind base overrides
│   ├── utils/                  # Pure utility functions (formatters, validators)
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .env.example
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

### Backend — `server/`

```
server/
├── src/
│   ├── config/                 # DB connection, Cloudinary config, env validation
│   ├── controllers/            # Route handlers — request/response only
│   │   ├── auth.controller.js
│   │   ├── dsa.controller.js
│   │   ├── resume.controller.js
│   │   ├── jobs.controller.js
│   │   └── interview.controller.js
│   ├── middleware/             # Auth guard, error handler, request logger
│   ├── models/                 # Mongoose schemas and models
│   │   ├── User.model.js
│   │   ├── DsaProblem.model.js
│   │   ├── Resume.model.js
│   │   ├── JobApplication.model.js
│   │   └── InterviewSession.model.js
│   ├── routes/                 # Express route definitions
│   │   ├── auth.routes.js
│   │   ├── dsa.routes.js
│   │   ├── resume.routes.js
│   │   ├── jobs.routes.js
│   │   └── interview.routes.js
│   ├── services/               # Business logic layer
│   │   ├── auth.service.js
│   │   ├── dsa.service.js
│   │   └── ai.service.js
│   ├── utils/                  # Helpers: token generation, response formatter
│   └── app.js                  # Express app setup
├── server.js                   # Entry point
├── .env
├── .env.example
└── package.json
```

### Philosophy Rules

1. **Feature cohesion on the frontend** — everything belonging to DSA lives under `features/dsa/`. No spreading feature files across multiple top-level folders
2. **Strict layer separation on the backend** — a controller never talks to a model directly; it goes through a service
3. **Shared vs. feature-specific** — if a component or hook is used by more than one feature, it belongs in `components/` or `hooks/`. If it belongs to one feature, it lives inside that feature's folder
4. **No barrel file abuse** — `index.js` re-exports are allowed but should not become a reason to create circular dependencies

---

## 9. Git Workflow

SkillSync AI follows a **trunk-based development** workflow with short-lived feature branches.

### Rules

1. **No one pushes directly to `main`** — ever. All changes enter via Pull Request
2. **No one pushes directly to `dev`** — feature branches are always branched from `dev` and merged back via PR
3. Pull Requests require at least one reviewer approval before merging
4. All branches must be up-to-date with `dev` before a PR can be merged (rebase preferred over merge commit)
5. Delete feature branches after they are merged
6. Never force-push to `main` or `dev`
7. PR descriptions must include: what changed, why it changed, and how to test it

### Daily Workflow

```
1. Pull latest dev:         git checkout dev && git pull origin dev
2. Create feature branch:   git checkout -b feat/dsa-problem-crud
3. Make small, focused commits as you work
4. Push branch:             git push origin feat/dsa-problem-crud
5. Open a Pull Request → dev
6. Address review comments
7. Merge (squash merge preferred to keep dev history clean)
8. Delete the branch
```

---

## 10. Branch Strategy

| Branch | Purpose | Merges Into | Protected |
|--------|---------|-------------|-----------|
| `main` | Production-ready code only. Reflects what is live | — | Yes |
| `dev` | Integration branch. All features merge here first | `main` | Yes |
| `feat/<name>` | New feature development | `dev` | No |
| `fix/<name>` | Bug fixes | `dev` | No |
| `hotfix/<name>` | Critical production fixes | `main` + `dev` | No |
| `chore/<name>` | Tooling, config, dependency updates | `dev` | No |
| `docs/<name>` | Documentation changes only | `dev` | No |
| `refactor/<name>` | Code restructuring with no behavior change | `dev` | No |

### Branch Naming Rules

- Always lowercase, hyphen-separated
- Be specific — `feat/dsa-add-problem-form` is better than `feat/dsa`
- Maximum 50 characters

---

## 11. Commit Message Convention

SkillSync AI follows the **Conventional Commits 1.0.0** specification.

### Format

```
<type>(<scope>): <short summary>

[optional body]

[optional footer]
```

### Types

| Type | When to Use |
|------|-------------|
| `feat` | A new feature or user-facing capability |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, whitespace — no logic change |
| `refactor` | Code restructure with no behavior change |
| `test` | Adding or updating tests |
| `chore` | Build process, dependency updates, tooling |
| `perf` | Performance improvements |
| `ci` | CI/CD pipeline changes |
| `revert` | Reverting a previous commit |

### Scopes (Common)

`auth` · `dsa` · `resume` · `jobs` · `interview` · `analytics` · `ui` · `api` · `db` · `config` · `store` · `routes`

### Examples

```
feat(dsa): add problem submission form with topic and difficulty filters

fix(auth): resolve JWT refresh token not being cleared on logout

docs(project): populate PROJECT_BIBLE.md with architecture and standards

chore(deps): upgrade react-router-dom to v6.24.0

refactor(jobs): extract application status logic into useApplicationStatus hook

style(ui): apply consistent spacing to Card component variants

feat(interview): integrate Gemini API for AI question generation
```

### Rules

- Summary line: max 72 characters
- Use imperative mood: "add feature" not "added feature" or "adds feature"
- Do not end the summary line with a period
- Reference issue numbers in the footer: `Closes #42`

---

## 12. Project Milestones

### Milestone 0 — Foundation ✦ `[Current]`
> **Goal:** Project scaffolding, documentation, and development environment

- [ ] Populate all documentation (`PROJECT_BIBLE.md`, `ARCHITECTURE.md`, `DATABASE.md`, `API.md`, `FEATURES.md`, `ROADMAP.md`)
- [ ] Initialize React + Vite frontend with Tailwind CSS
- [ ] Initialize Node.js + Express backend
- [ ] Configure MongoDB Atlas connection
- [ ] Set up ESLint, Prettier, and project-level `.gitignore`
- [ ] Establish folder structure for both client and server
- [ ] Configure environment variable management

---

### Milestone 1 — Authentication System
> **Goal:** Secure, working user authentication end-to-end

- [ ] User registration (name, email, password, college)
- [ ] User login with JWT access + refresh token pattern
- [ ] Protected route middleware on backend
- [ ] Protected routes on frontend with Redux auth state
- [ ] Persistent login via refresh token / localStorage
- [ ] Logout and token invalidation
- [ ] Basic user profile page

**Exit Criteria:** A user can register, log in, see their dashboard, and log out. Unauthenticated users are redirected.

---

### Milestone 2 — DSA Problem Tracker
> **Goal:** Core DSA logging and tracking functionality

- [ ] Add, edit, delete DSA problems
- [ ] Fields: title, platform, topic, difficulty, status, notes, link
- [ ] Filter by topic, difficulty, and status
- [ ] Problem list with pagination
- [ ] Topic-level progress summary
- [ ] Streak tracking (consecutive days with logged problems)

**Exit Criteria:** A user can manage their entire DSA practice log from the platform.

---

### Milestone 3 — Resume Builder
> **Goal:** ATS-friendly resume creation and export

- [ ] Guided multi-section resume form (Education, Skills, Experience, Projects, Certifications)
- [ ] Live resume preview
- [ ] ATS score indicator (keyword density, section completeness)
- [ ] PDF export
- [ ] Save multiple resume versions
- [ ] Cloudinary upload for profile photo

**Exit Criteria:** A user can build, preview, score, and export a resume to PDF.

---

### Milestone 4 — Job Application Tracker
> **Goal:** Centralized job pipeline management

- [ ] Add job applications (company, role, JD link, date applied)
- [ ] Kanban board view: Applied → OA → Interview → Offer → Rejected
- [ ] Status update with timestamp history
- [ ] Notes and follow-up reminders per application
- [ ] Application statistics (total applied, in-progress, conversion rate)

**Exit Criteria:** A user can manage their entire application pipeline without a spreadsheet.

---

### Milestone 5 — Analytics Dashboard
> **Goal:** Meaningful, visual progress insights

- [ ] DSA heatmap (problems solved per day — GitHub contribution graph style)
- [ ] Topic coverage chart (radar/spider chart)
- [ ] Difficulty distribution (pie chart)
- [ ] Application funnel visualization
- [ ] Weekly and monthly progress summaries
- [ ] Streak and consistency metrics

**Exit Criteria:** A user gets a clear, visual picture of their preparation health in under 10 seconds.

---

### Milestone 6 — AI Interview Practice *(Phase 2)*
> **Goal:** AI-powered mock interview with feedback

- [ ] Gemini API integration
- [ ] Select interview type: DSA, System Design, Behavioral, HR
- [ ] Timed question and answer session
- [ ] AI-generated follow-up questions based on answers
- [ ] Performance scoring and detailed feedback report
- [ ] Session history and progress over time

**Exit Criteria:** A user can complete a full mock interview session and receive actionable feedback.

---

## 13. Future Scope

The following capabilities are explicitly out of scope for the current build but represent the product's growth roadmap.

### Platform Expansion

| Feature | Description |
|---------|-------------|
| **Company-Specific Prep Packs** | Curated question sets, interview patterns, and salary data per company (Google, Amazon, etc.) |
| **Peer Comparison & Leaderboards** | Anonymous opt-in rankings by college, allowing healthy competitive motivation |
| **College-Level Admin Dashboard** | TPO/placement officer portal to view aggregate student readiness metrics |
| **Referral Network** | Connect students with alumni at target companies for referrals |

### AI Enhancements

| Feature | Description |
|---------|-------------|
| **AI Resume Feedback** | Gemini-powered line-by-line resume critique and rewrite suggestions |
| **Personalized Study Plans** | AI-generated day-by-day DSA preparation schedule based on target company and available time |
| **Weakness Detection** | Automatically identify topic gaps from practice patterns and surface focused problem sets |
| **Cover Letter Generator** | Role-specific cover letter generation from resume data and job description |

### Integrations

| Feature | Description |
|---------|-------------|
| **LeetCode Sync** | Auto-import solved problems from LeetCode via API |
| **LinkedIn Integration** | One-click job import from LinkedIn saved jobs |
| **Calendar Integration** | Sync interview schedules and OA deadlines to Google Calendar |
| **Notification System** | Email and push notifications for streaks, deadlines, and interview prep reminders |

### Monetization (Freemium Model)

| Tier | Access |
|------|--------|
| **Free** | DSA tracker, job tracker, basic analytics, 1 resume |
| **Pro** | Unlimited resumes, AI interview sessions, advanced analytics, company prep packs |
| **Campus** | College-wide license for TPOs; includes admin dashboard and aggregate reporting |

---

*This document is the single source of truth for project decisions. Any architectural change, technology addition, or scope modification must be reflected here before implementation begins.*
