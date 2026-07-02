# SkillSync AI — Database Architecture

> **Version:** 1.0.0
> **Status:** Active
> **Last Updated:** 2026-07-02
> **Author:** Lead Software Architect
> **Companion Documents:** [PROJECT_BIBLE.md](./PROJECT_BIBLE.md) · [ARCHITECTURE.md](./ARCHITECTURE.md) · [API.md](./API.md)

---

## Table of Contents

1. [Database Overview](#1-database-overview)
2. [Collections](#2-collections)
   - 2.1 [users](#21-users)
   - 2.2 [resumes](#22-resumes)
   - 2.3 [dsa_progress](#23-dsa_progress)
   - 2.4 [interview_sessions](#24-interview_sessions)
   - 2.5 [interview_questions](#25-interview_questions)
   - 2.6 [job_applications](#26-job_applications)
   - 2.7 [notes](#27-notes)
   - 2.8 [analytics](#28-analytics)
3. [Relationships](#3-relationships)
4. [ER Diagram](#4-er-diagram)
5. [Scaling Considerations](#5-scaling-considerations)

---

## 1. Database Overview

### 1.1 Why MongoDB

SkillSync AI uses **MongoDB Atlas** as its primary database. The choice is deliberate and based on the nature of the data and the phase of the product.

| Factor | SQL (Relational) | MongoDB (Document) | SkillSync Decision |
|--------|-----------------|-------------------|-------------------|
| Schema flexibility | Rigid — migrations required for every change | Flexible — fields can vary per document | **MongoDB wins.** Feature iteration is rapid; locking into a strict schema too early is a liability |
| Data shape | Flat, normalized tables | Nested documents and arrays | **MongoDB wins.** Resume sections, status histories, and Q&A transcripts are naturally document-shaped, not row-shaped |
| Joins | First-class via foreign keys | Manual via `$lookup` (expensive) | **Neutral.** SkillSync minimizes cross-collection joins by embedding related data where appropriate |
| Scalability | Vertical (scale up) | Horizontal (scale out via sharding) | **MongoDB wins.** Atlas sharding is ready when needed |
| Hosting | Requires VM or managed DB | MongoDB Atlas — fully managed cloud | **MongoDB wins.** Atlas handles backups, replication, failover, and monitoring |
| Team familiarity | Requires SQL expertise | JSON-like documents — aligned with JS stack | **MongoDB wins.** Reduces cognitive context-switching in a full-stack JS team |

### 1.2 Core Design Principles

**Embed vs. Reference — The Decision Rule:**

```
Embed when:
  ✓ Data is always read together with its parent (e.g., resume sections with a resume)
  ✓ Data has no lifecycle independent of the parent
  ✓ The embedded array is bounded and will not grow unboundedly
  ✓ Relationship is one-to-few (not one-to-millions)

Reference when:
  ✓ Data has its own independent lifecycle (e.g., a DSA problem exists independently)
  ✓ Data is queried independently of its parent
  ✓ The relationship is one-to-many at scale (e.g., one user → many problems)
  ✓ The same data is referenced from multiple places
```

**Index-Driven Design:**
Every field used in a `find()` filter, `sort()`, or aggregation `$match` must have a supporting index. Indexes are planned alongside query patterns up front — not discovered after performance degrades.

**Intentional Denormalization:**
In specific cases (notably `interview_sessions.transcript`), data is deliberately duplicated from another collection to guarantee historical accuracy and eliminate joins on read. This is always an explicit, documented decision — not accidental redundancy.

**Write Amplification via Service Layer:**
The `analytics` collection is a pre-aggregated summary. It is upserted by the service layer on every write to `dsa_progress`, `job_applications`, and `interview_sessions`. This trades a small write overhead for dramatically faster analytics dashboard reads.

### 1.3 Collections Overview

| Collection | Purpose | Strategy | Estimated Growth |
|------------|---------|----------|-----------------|
| `users` | User accounts and profiles | Reference root | Low — one document per user |
| `resumes` | Resume versions with embedded sections | Embed sections | Low — few per user |
| `dsa_progress` | Individual DSA problem logs | Reference to user | High — daily writes per active user |
| `interview_sessions` | AI mock interview sessions with transcript | Embed transcript | Medium — weekly writes per active user |
| `interview_questions` | Question bank (system-seeded) | Standalone | Low — grows with seeding or AI generation |
| `job_applications` | Job pipeline entries | Reference to user | Medium — grows during placement season |
| `notes` | Rich standalone notes | Reference to user + polymorphic entity link | Medium — user-driven |
| `analytics` | Pre-aggregated daily activity snapshots | Upsert daily per user | High — one doc per user per active day |

### 1.4 Database Names

```
Production:   skillsync
Development:  skillsync_dev
Test:         skillsync_test
```

---

## 2. Collections

---

### 2.1 `users`

#### Purpose

The root entity of the entire data model. Every other collection references `users` via `userId`. Stores authentication credentials, profile information, and account metadata.

#### Fields

| Field | BSON Type | Required | Default | Description |
|-------|-----------|----------|---------|-------------|
| `_id` | ObjectId | Auto | — | MongoDB document identifier |
| `name` | String | Yes | — | User's full name |
| `email` | String | Yes | — | Unique login identifier |
| `password` | String | Yes | — | bcrypt hash of the password |
| `college` | String | Yes | — | Name of the institution |
| `branch` | String | No | — | Academic branch, e.g., "Computer Science" |
| `graduationYear` | Number | No | — | Expected graduation year, e.g., 2026 |
| `avatar` | Object | No | — | Cloudinary image metadata |
| `avatar.url` | String | No | — | CDN URL of the profile photo |
| `avatar.publicId` | String | No | — | Cloudinary public_id for deletion on update |
| `bio` | String | No | — | Short bio, max 200 characters |
| `linkedinUrl` | String | No | — | LinkedIn profile URL |
| `githubUrl` | String | No | — | GitHub profile URL |
| `role` | String | Yes | `"student"` | Account role |
| `refreshTokenHash` | String | No | — | Hashed refresh token for server-side invalidation |
| `isActive` | Boolean | Yes | `true` | Soft-delete flag; false = deactivated account |
| `lastLoginAt` | Date | No | — | Timestamp of most recent successful login |
| `createdAt` | Date | Auto | — | Set by Mongoose timestamps |
| `updatedAt` | Date | Auto | — | Set by Mongoose timestamps |

#### Required Fields
`name`, `email`, `password`, `college`, `role`, `isActive`

#### Optional Fields
`branch`, `graduationYear`, `avatar`, `bio`, `linkedinUrl`, `githubUrl`, `refreshTokenHash`, `lastLoginAt`

#### Enums

| Field | Allowed Values |
|-------|---------------|
| `role` | `student`, `admin` |

#### Indexes

| Index | Type | Reason |
|-------|------|--------|
| `{ email: 1 }` | Unique | Login lookup; enforces no duplicate accounts |
| `{ role: 1 }` | Standard | Admin queries filtering by role |

#### Validation Rules

| Field | Rule |
|-------|------|
| `name` | minLength: 2, maxLength: 80 |
| `email` | Valid RFC 5322 email format; unique across collection |
| `password` | Stored as bcrypt hash; raw input min 8 characters (validated before hashing, never stored raw) |
| `bio` | maxLength: 200 |
| `graduationYear` | min: 2020, max: 2035 |
| `avatar.url` | Must be a valid HTTPS URL when provided |
| `role` | Must be one of the defined enum values |

#### Example Document

```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Arjun Sharma",
  "email": "arjun.sharma@example.com",
  "password": "$2b$10$K8pQm1nT3vY5wX7zRqS0uOeJ4hLdFgCbNjMiWvUyPxZsAoDrE2tI",
  "college": "NIT Warangal",
  "branch": "Computer Science and Engineering",
  "graduationYear": 2026,
  "avatar": {
    "url": "https://res.cloudinary.com/skillsync/image/upload/v1234567890/avatars/arjun_sharma.webp",
    "publicId": "avatars/arjun_sharma"
  },
  "bio": "Aspiring SWE. Passionate about DSA, system design, and building products.",
  "linkedinUrl": "https://www.linkedin.com/in/arjunsharma",
  "githubUrl": "https://github.com/arjunsharma",
  "role": "student",
  "refreshTokenHash": "$2b$10$Lp9rQ2mU4wZ6vX8ySpT1uNfK5jMeGhDbOiLmVtRxQwBcAnEoF3sJ",
  "isActive": true,
  "lastLoginAt": "2026-07-02T09:30:00.000Z",
  "createdAt": "2026-01-15T10:00:00.000Z",
  "updatedAt": "2026-07-02T09:30:00.000Z"
}
```

---

### 2.2 `resumes`

#### Purpose

Stores complete resume documents with all sections embedded. Supports multiple resume versions per user. All sections are embedded (not referenced) because they are always read and written together in the context of their parent resume and have no independent lifecycle.

#### Fields

| Field | BSON Type | Required | Default | Description |
|-------|-----------|----------|---------|-------------|
| `_id` | ObjectId | Auto | — | Document identifier |
| `userId` | ObjectId | Yes | — | Reference to `users._id` |
| `title` | String | Yes | — | Resume version label |
| `isDefault` | Boolean | Yes | `false` | Marks the user's primary resume |
| `atsScore` | Number | No | — | Computed ATS compatibility score (0–100) |
| `targetRole` | String | No | — | Job role this resume is tailored for |
| `personalInfo` | Object | Yes | — | Contact and identity block |
| `personalInfo.fullName` | String | Yes | — | Full display name |
| `personalInfo.email` | String | Yes | — | Contact email |
| `personalInfo.phone` | String | No | — | Phone number |
| `personalInfo.location` | String | No | — | City, State or City, Country |
| `personalInfo.linkedinUrl` | String | No | — | LinkedIn URL |
| `personalInfo.githubUrl` | String | No | — | GitHub URL |
| `personalInfo.portfolioUrl` | String | No | — | Personal website or portfolio URL |
| `personalInfo.avatarUrl` | String | No | — | Cloudinary URL (synced from user avatar) |
| `summary` | String | No | — | Professional summary, max 300 chars |
| `education` | Array | Yes | `[]` | Education entries — at least 1 required |
| `education[].institution` | String | Yes | — | University or institution name |
| `education[].degree` | String | Yes | — | Degree and major |
| `education[].startYear` | Number | Yes | — | Enrollment year |
| `education[].endYear` | Number | No | — | Graduation year; null if currently enrolled |
| `education[].cgpa` | Number | No | — | CGPA on a 10-point scale |
| `education[].isCurrent` | Boolean | Yes | `false` | Currently enrolled flag |
| `workExperience` | Array | No | `[]` | Internship and work entries |
| `workExperience[].company` | String | Yes | — | Company name |
| `workExperience[].role` | String | Yes | — | Job title |
| `workExperience[].startDate` | Date | Yes | — | Employment start date |
| `workExperience[].endDate` | Date | No | — | Employment end date; null if current |
| `workExperience[].isCurrent` | Boolean | Yes | `false` | Currently active role flag |
| `workExperience[].location` | String | No | — | City or "Remote" |
| `workExperience[].bullets` | Array[String] | Yes | — | Achievement bullets (min 1, max 6) |
| `projects` | Array | No | `[]` | Project entries |
| `projects[].title` | String | Yes | — | Project name |
| `projects[].techStack` | Array[String] | Yes | — | Technologies used |
| `projects[].description` | String | Yes | — | Project summary, max 400 chars |
| `projects[].githubUrl` | String | No | — | Repository URL |
| `projects[].liveUrl` | String | No | — | Live or demo URL |
| `projects[].startDate` | Date | No | — | Project start date |
| `projects[].endDate` | Date | No | — | Project end date |
| `skills` | Object | No | — | Categorized skill lists |
| `skills.languages` | Array[String] | No | — | Programming languages |
| `skills.frameworks` | Array[String] | No | — | Frameworks and libraries |
| `skills.tools` | Array[String] | No | — | Developer tools and platforms |
| `skills.databases` | Array[String] | No | — | Database technologies |
| `skills.other` | Array[String] | No | — | Any additional skills |
| `certifications` | Array | No | `[]` | Certification entries |
| `certifications[].name` | String | Yes | — | Certification name |
| `certifications[].issuer` | String | Yes | — | Issuing organization |
| `certifications[].issueDate` | Date | No | — | Date awarded |
| `certifications[].url` | String | No | — | Verification URL |
| `achievements` | Array[String] | No | `[]` | Awards, honors, and recognition |
| `createdAt` | Date | Auto | — | Mongoose timestamps |
| `updatedAt` | Date | Auto | — | Mongoose timestamps |

#### Required Fields
`userId`, `title`, `isDefault`, `personalInfo`, `personalInfo.fullName`, `personalInfo.email`, `education`

#### Optional Fields
`atsScore`, `targetRole`, `summary`, `workExperience`, `projects`, `skills`, `certifications`, `achievements`

#### Indexes

| Index | Type | Reason |
|-------|------|--------|
| `{ userId: 1 }` | Standard | Fetch all resumes for a user |
| `{ userId: 1, isDefault: 1 }` | Compound | Fast lookup of the user's default resume |

#### Validation Rules

| Field | Rule |
|-------|------|
| `title` | minLength: 3, maxLength: 100 |
| `atsScore` | min: 0, max: 100 |
| `summary` | maxLength: 300 |
| `education` | At least 1 entry required |
| `education[].cgpa` | min: 0, max: 10 |
| `education[].startYear` | min: 2000, max: 2035 |
| `workExperience[].bullets` | min 1 item, max 6 items; each item maxLength: 200 |
| `projects[].description` | maxLength: 400 |
| `projects[].techStack` | min 1 item, max 10 items |
| `isDefault` uniqueness | Only one resume per user may have `isDefault: true` — enforced at service layer |

#### Example Document

```json
{
  "_id": "64f2b3c4d5e6f7a8b9c0d2e3",
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "title": "SDE Internship — Summer 2026",
  "isDefault": true,
  "atsScore": 82,
  "targetRole": "Software Development Engineer Intern",
  "personalInfo": {
    "fullName": "Arjun Sharma",
    "email": "arjun.sharma@example.com",
    "phone": "+91 98765 43210",
    "location": "Warangal, Telangana",
    "linkedinUrl": "https://linkedin.com/in/arjunsharma",
    "githubUrl": "https://github.com/arjunsharma",
    "portfolioUrl": "https://arjunsharma.dev",
    "avatarUrl": "https://res.cloudinary.com/skillsync/image/upload/v123/avatars/arjun_sharma.webp"
  },
  "summary": "Final year CS student at NIT Warangal with strong DSA fundamentals and experience building production full-stack applications.",
  "education": [
    {
      "institution": "NIT Warangal",
      "degree": "B.Tech Computer Science and Engineering",
      "startYear": 2022,
      "endYear": 2026,
      "cgpa": 8.7,
      "isCurrent": true
    }
  ],
  "workExperience": [],
  "projects": [
    {
      "title": "SkillSync AI",
      "techStack": ["React.js", "Node.js", "MongoDB", "Express.js", "Tailwind CSS"],
      "description": "AI-powered placement preparation platform for engineering students. Features DSA tracking, ATS resume builder, AI mock interviews, and job pipeline management.",
      "githubUrl": "https://github.com/arjunsharma/skillsync-ai",
      "liveUrl": "https://skillsync.vercel.app",
      "startDate": "2026-01-01T00:00:00.000Z",
      "endDate": null
    }
  ],
  "skills": {
    "languages": ["JavaScript", "Python", "C++", "Java"],
    "frameworks": ["React.js", "Node.js", "Express.js"],
    "tools": ["Git", "Postman", "VS Code", "Figma"],
    "databases": ["MongoDB", "MySQL"],
    "other": ["REST APIs", "Data Structures & Algorithms", "System Design Basics"]
  },
  "certifications": [
    {
      "name": "AWS Certified Cloud Practitioner",
      "issuer": "Amazon Web Services",
      "issueDate": "2025-11-01T00:00:00.000Z",
      "url": "https://www.credly.com/badges/example-badge-id"
    }
  ],
  "achievements": [
    "LeetCode Knight — Top 3.5% globally (Rating: 2004)",
    "Winner, Smart India Hackathon 2025 — Team Lead"
  ],
  "createdAt": "2026-06-01T08:00:00.000Z",
  "updatedAt": "2026-07-01T14:30:00.000Z"
}
```

---

### 2.3 `dsa_progress`

#### Purpose

Tracks individual DSA problem entries logged by a user. Each document is one problem attempt or solve entry. This collection is the primary data source for topic coverage, difficulty distribution, platform breakdown, and streak calculation — all of which are pre-aggregated into the `analytics` collection after each write.

#### Fields

| Field | BSON Type | Required | Default | Description |
|-------|-----------|----------|---------|-------------|
| `_id` | ObjectId | Auto | — | Document identifier |
| `userId` | ObjectId | Yes | — | Reference to `users._id` |
| `title` | String | Yes | — | Problem title |
| `platform` | String | Yes | — | Platform where the problem was found |
| `topic` | String | Yes | — | Primary DSA topic category |
| `difficulty` | String | Yes | — | Problem difficulty level |
| `status` | String | Yes | — | Current attempt status |
| `link` | String | No | — | Direct URL to the problem |
| `notes` | String | No | — | Quick inline annotation, max 500 chars |
| `timeSpent` | Number | No | — | Minutes spent on this problem |
| `attemptCount` | Number | Yes | `1` | Number of times this problem has been attempted |
| `tags` | Array[String] | No | `[]` | User-defined labels |
| `solvedAt` | Date | No | — | Timestamp when status was last set to `Solved` |
| `createdAt` | Date | Auto | — | Mongoose timestamps |
| `updatedAt` | Date | Auto | — | Mongoose timestamps |

#### Required Fields
`userId`, `title`, `platform`, `topic`, `difficulty`, `status`, `attemptCount`

#### Optional Fields
`link`, `notes`, `timeSpent`, `tags`, `solvedAt`

#### Enums

| Field | Allowed Values |
|-------|---------------|
| `platform` | `LeetCode`, `GeeksForGeeks`, `CodeForces`, `HackerRank`, `InterviewBit`, `CodeChef`, `Custom` |
| `difficulty` | `Easy`, `Medium`, `Hard` |
| `status` | `Solved`, `Attempted`, `Revisit`, `Bookmarked` |
| `topic` | `Arrays`, `Strings`, `Linked Lists`, `Stacks`, `Queues`, `Trees`, `Binary Search Trees`, `Heaps`, `Graphs`, `Dynamic Programming`, `Backtracking`, `Recursion`, `Sorting`, `Searching`, `Hashing`, `Two Pointers`, `Sliding Window`, `Greedy`, `Bit Manipulation`, `Math`, `Trie`, `Segment Trees`, `Union Find`, `Other` |

#### Indexes

| Index | Type | Reason |
|-------|------|--------|
| `{ userId: 1 }` | Standard | Fetch all problems for a user |
| `{ userId: 1, topic: 1 }` | Compound | Topic-filtered problem list |
| `{ userId: 1, difficulty: 1 }` | Compound | Difficulty-filtered problem list |
| `{ userId: 1, status: 1 }` | Compound | Status-filtered list, e.g., show only `Revisit` |
| `{ userId: 1, platform: 1 }` | Compound | Platform-filtered list |
| `{ userId: 1, solvedAt: 1 }` | Compound | Streak computation and heatmap date-range queries |

#### Validation Rules

| Field | Rule |
|-------|------|
| `title` | minLength: 2, maxLength: 200 |
| `timeSpent` | min: 0, max: 600 (capped at 10 hours) |
| `attemptCount` | min: 1 |
| `notes` | maxLength: 500 |
| `tags` | max 10 items; each item maxLength: 30 |
| `solvedAt` | Must be set when `status` is `Solved`; must be null otherwise — enforced at service layer |

#### Example Document

```json
{
  "_id": "64f3c4d5e6f7a8b9c0d3e4f5",
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "title": "Longest Substring Without Repeating Characters",
  "platform": "LeetCode",
  "topic": "Sliding Window",
  "difficulty": "Medium",
  "status": "Solved",
  "link": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  "notes": "Classic sliding window. Used a HashMap to track last seen index. Edge case: empty string returns 0.",
  "timeSpent": 25,
  "attemptCount": 2,
  "tags": ["interview-favourite", "google-tagged"],
  "solvedAt": "2026-07-02T11:45:00.000Z",
  "createdAt": "2026-07-02T11:20:00.000Z",
  "updatedAt": "2026-07-02T11:45:00.000Z"
}
```

---

### 2.4 `interview_sessions`

#### Purpose

Stores complete AI mock interview sessions. Each document captures the session configuration, the full Q&A transcript (embedded), per-answer AI evaluations, an overall feedback summary, and a performance score. The transcript is embedded to guarantee historical accuracy even if source questions are later modified.

#### Fields

| Field | BSON Type | Required | Default | Description |
|-------|-----------|----------|---------|-------------|
| `_id` | ObjectId | Auto | — | Document identifier |
| `userId` | ObjectId | Yes | — | Reference to `users._id` |
| `type` | String | Yes | — | Interview category |
| `difficulty` | String | Yes | — | Session difficulty level |
| `status` | String | Yes | `"active"` | Session lifecycle state |
| `totalQuestions` | Number | Yes | — | Number of questions selected for this session |
| `answeredCount` | Number | Yes | `0` | Questions answered so far |
| `score` | Number | No | — | Overall performance score (0–100), set on completion |
| `aiFeedback` | String | No | — | Gemini-generated holistic session feedback |
| `transcript` | Array | Yes | `[]` | Embedded Q&A exchange records |
| `transcript[].questionId` | ObjectId | Yes | — | Reference to `interview_questions._id` for traceability |
| `transcript[].questionText` | String | Yes | — | Snapshot of the question text at session creation time |
| `transcript[].userAnswer` | String | No | — | User's raw answer text |
| `transcript[].aiEvaluation` | String | No | — | Gemini-generated per-answer evaluation |
| `transcript[].answerScore` | Number | No | — | Per-answer score (0–10) |
| `transcript[].timeTaken` | Number | No | — | Seconds taken to submit this answer |
| `transcript[].answeredAt` | Date | No | — | Timestamp of answer submission |
| `startedAt` | Date | Yes | — | Session start timestamp |
| `completedAt` | Date | No | — | Session completion timestamp |
| `duration` | Number | No | — | Total session duration in seconds |
| `createdAt` | Date | Auto | — | Mongoose timestamps |
| `updatedAt` | Date | Auto | — | Mongoose timestamps |

#### Required Fields
`userId`, `type`, `difficulty`, `status`, `totalQuestions`, `answeredCount`, `startedAt`

#### Optional Fields
`score`, `aiFeedback`, `completedAt`, `duration`, and all per-entry transcript fields except `questionId` and `questionText`

#### Enums

| Field | Allowed Values |
|-------|---------------|
| `type` | `DSA`, `Behavioral`, `SystemDesign`, `HR` |
| `difficulty` | `Easy`, `Medium`, `Hard` |
| `status` | `active`, `completed`, `abandoned` |

#### Why `questionText` Is Snapshotted

`transcript[].questionId` is a reference kept for traceability and analytics. `transcript[].questionText` is a copy of the question text at the moment the session was created. If the source question in `interview_questions` is later edited or deleted, the session history still shows exactly what the user was asked. This is intentional denormalization for data integrity.

#### Status Transition Rules

```
active → completed    (user finishes all questions)
active → abandoned    (user exits mid-session or session times out)

completed → [no further transitions]
abandoned → [no further transitions]
```

Status never moves backward. Enforced at service layer.

#### Indexes

| Index | Type | Reason |
|-------|------|--------|
| `{ userId: 1 }` | Standard | All sessions for a user |
| `{ userId: 1, status: 1 }` | Compound | Filter active, completed, or abandoned sessions |
| `{ userId: 1, type: 1 }` | Compound | Filter sessions by interview category |
| `{ userId: 1, createdAt: -1 }` | Compound | Recent sessions first (default sort) |

#### Validation Rules

| Field | Rule |
|-------|------|
| `totalQuestions` | min: 1, max: 20 |
| `answeredCount` | min: 0; must not exceed `totalQuestions` |
| `score` | min: 0, max: 100 |
| `transcript[].answerScore` | min: 0, max: 10 |
| `completedAt` | Must be after `startedAt` — enforced at service layer |

#### Example Document

```json
{
  "_id": "64f4d5e6f7a8b9c0d4e5f6a7",
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "type": "DSA",
  "difficulty": "Medium",
  "status": "completed",
  "totalQuestions": 5,
  "answeredCount": 5,
  "score": 74,
  "aiFeedback": "Strong understanding of graph traversal and sliding window patterns. Space complexity analysis was weak in problems 3 and 5. Recommended focus: DP on trees and space optimization techniques.",
  "transcript": [
    {
      "questionId": "64f5e6f7a8b9c0d5e6f7a8b9",
      "questionText": "Find the number of connected components in an undirected graph. Explain your approach and analyze time and space complexity.",
      "userAnswer": "I would use Union-Find with path compression. Initialize each node as its own parent. For each edge, call union. Count distinct roots. Time: O(N α(N)), Space: O(N).",
      "aiEvaluation": "Correct approach with proper complexity analysis. Could have mentioned the BFS/DFS alternative. Minor deduction for not discussing the self-loop edge case.",
      "answerScore": 8,
      "timeTaken": 148,
      "answeredAt": "2026-07-02T15:02:28.000Z"
    }
  ],
  "startedAt": "2026-07-02T15:00:00.000Z",
  "completedAt": "2026-07-02T15:24:15.000Z",
  "duration": 1455,
  "createdAt": "2026-07-02T15:00:00.000Z",
  "updatedAt": "2026-07-02T15:24:15.000Z"
}
```

---

### 2.5 `interview_questions`

#### Purpose

The curated question bank from which interview sessions are generated. Questions are seeded by the system (admin-inserted) and can be augmented by Gemini AI. This collection is read-heavy and write-rare during normal platform operation.

#### Fields

| Field | BSON Type | Required | Default | Description |
|-------|-----------|----------|---------|-------------|
| `_id` | ObjectId | Auto | — | Document identifier |
| `text` | String | Yes | — | Full question text |
| `type` | String | Yes | — | Interview category |
| `topic` | String | Yes | — | Subject area within the category |
| `difficulty` | String | Yes | — | Question difficulty |
| `sampleAnswer` | String | No | — | Reference answer used as AI evaluator context |
| `followUpQuestions` | Array[String] | No | `[]` | Potential AI follow-up prompts (max 5) |
| `tags` | Array[String] | No | `[]` | Searchable keyword labels |
| `sourceType` | String | Yes | — | Origin of this question |
| `isActive` | Boolean | Yes | `true` | Available for session generation when true |
| `usageCount` | Number | Yes | `0` | Total sessions that have included this question |
| `createdAt` | Date | Auto | — | Mongoose timestamps |
| `updatedAt` | Date | Auto | — | Mongoose timestamps |

#### Required Fields
`text`, `type`, `topic`, `difficulty`, `sourceType`, `isActive`, `usageCount`

#### Optional Fields
`sampleAnswer`, `followUpQuestions`, `tags`

#### Enums

| Field | Allowed Values |
|-------|---------------|
| `type` | `DSA`, `Behavioral`, `SystemDesign`, `HR` |
| `difficulty` | `Easy`, `Medium`, `Hard` |
| `sourceType` | `system`, `ai-generated`, `community` |

#### Indexes

| Index | Type | Reason |
|-------|------|--------|
| `{ type: 1, difficulty: 1 }` | Compound | Primary session generation query — select questions by type and difficulty |
| `{ type: 1, topic: 1 }` | Compound | Topic-specific question selection |
| `{ isActive: 1 }` | Standard | Filter to available questions only |
| `{ tags: 1 }` | Multikey | Tag-based search |

#### Validation Rules

| Field | Rule |
|-------|------|
| `text` | minLength: 10, maxLength: 1,000 |
| `sampleAnswer` | maxLength: 3,000 |
| `followUpQuestions` | max 5 items; each item maxLength: 300 |
| `tags` | max 10 items; each item maxLength: 40 |
| `usageCount` | min: 0 |

#### Example Document

```json
{
  "_id": "64f5e6f7a8b9c0d5e6f7a8b9",
  "text": "Find the number of connected components in an undirected graph. Explain your approach and analyze the time and space complexity of your solution.",
  "type": "DSA",
  "topic": "Graphs",
  "difficulty": "Medium",
  "sampleAnswer": "Two valid approaches: (1) BFS/DFS — iterate all unvisited nodes, run traversal per unvisited node, increment counter once per traversal. Time: O(V+E), Space: O(V). (2) Union-Find with path compression and union by rank — Time: O(N α(N)), Space: O(N).",
  "followUpQuestions": [
    "What is the time complexity of Union-Find with both path compression and union by rank?",
    "How would your approach change for a directed graph?",
    "Can you solve this without extra space beyond the graph representation?"
  ],
  "tags": ["graphs", "union-find", "bfs", "dfs", "connectivity", "google-tagged"],
  "sourceType": "system",
  "isActive": true,
  "usageCount": 47,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-07-01T00:00:00.000Z"
}
```

---

### 2.6 `job_applications`

#### Purpose

Tracks a student's job application pipeline. Each document is one application to one company and role. The current stage is always in `status`. Every stage transition appends a new entry to `statusHistory`, which is append-only — giving a permanent audit trail for the Kanban timeline.

#### Fields

| Field | BSON Type | Required | Default | Description |
|-------|-----------|----------|---------|-------------|
| `_id` | ObjectId | Auto | — | Document identifier |
| `userId` | ObjectId | Yes | — | Reference to `users._id` |
| `company` | String | Yes | — | Company name |
| `role` | String | Yes | — | Job title applied for |
| `jobDescriptionUrl` | String | No | — | URL to the original job posting |
| `source` | String | No | — | Channel through which the job was found |
| `status` | String | Yes | `"Applied"` | Current pipeline stage |
| `statusHistory` | Array | Yes | — | Append-only log of all status transitions |
| `statusHistory[].status` | String | Yes | — | Pipeline stage at this point in time |
| `statusHistory[].note` | String | No | — | Context note for this transition |
| `statusHistory[].changedAt` | Date | Yes | — | Timestamp of this status change |
| `appliedAt` | Date | Yes | — | Date the application was submitted |
| `followUpDate` | Date | No | — | Scheduled follow-up date or round deadline |
| `salary` | Object | No | — | Compensation information |
| `salary.expected` | Number | No | — | Expected CTC in LPA |
| `salary.offered` | Number | No | — | Offered CTC in LPA (populated when Offer received) |
| `location` | String | No | — | Job location or "Remote" |
| `workType` | String | No | — | Work arrangement type |
| `contacts` | Array | No | `[]` | People at the company associated with this application |
| `contacts[].name` | String | Yes | — | Contact's full name |
| `contacts[].role` | String | No | — | Contact's designation |
| `contacts[].linkedinUrl` | String | No | — | Contact's LinkedIn URL |
| `tags` | Array[String] | No | `[]` | User-defined labels |
| `createdAt` | Date | Auto | — | Mongoose timestamps |
| `updatedAt` | Date | Auto | — | Mongoose timestamps |

#### Required Fields
`userId`, `company`, `role`, `status`, `statusHistory`, `appliedAt`

#### Optional Fields
`jobDescriptionUrl`, `source`, `followUpDate`, `salary`, `location`, `workType`, `contacts`, `tags`

#### Enums

| Field | Allowed Values |
|-------|---------------|
| `status` | `Applied`, `OA`, `Interview`, `Offer`, `Rejected`, `Withdrawn` |
| `source` | `LinkedIn`, `Company Website`, `Naukri`, `Internshala`, `Referral`, `Campus Drive`, `Other` |
| `workType` | `On-site`, `Remote`, `Hybrid` |

#### Design Note on Status History

`statusHistory` is append-only. When status changes, a new entry is pushed — existing entries are never modified or deleted. The top-level `status` field must always equal the `status` of the most recently appended `statusHistory` entry. The initial `Applied` history entry is auto-created by the service layer when the document is first inserted.

#### Indexes

| Index | Type | Reason |
|-------|------|--------|
| `{ userId: 1 }` | Standard | All applications for a user |
| `{ userId: 1, status: 1 }` | Compound | Kanban column rendering — filter by stage |
| `{ userId: 1, appliedAt: -1 }` | Compound | Date-sorted application list, most recent first |
| `{ userId: 1, company: 1 }` | Compound | Company-name search within a user's applications |

#### Validation Rules

| Field | Rule |
|-------|------|
| `company` | minLength: 2, maxLength: 100 |
| `role` | minLength: 2, maxLength: 100 |
| `salary.expected` | min: 0 |
| `salary.offered` | min: 0 |
| `tags` | max 10 items; each item maxLength: 30 |
| `contacts` | max 10 entries |
| `statusHistory` | At least 1 entry must always be present |

#### Example Document

```json
{
  "_id": "64f6f7a8b9c0d6e7f8a9b0c1",
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "company": "Google",
  "role": "Software Engineer Intern",
  "jobDescriptionUrl": "https://careers.google.com/jobs/results/12345",
  "source": "LinkedIn",
  "status": "Interview",
  "statusHistory": [
    {
      "status": "Applied",
      "note": "Applied through LinkedIn Easy Apply.",
      "changedAt": "2026-06-10T10:00:00.000Z"
    },
    {
      "status": "OA",
      "note": "Received OA link via email. 90 min, 3 coding questions.",
      "changedAt": "2026-06-18T14:00:00.000Z"
    },
    {
      "status": "Interview",
      "note": "OA cleared. Round 1 scheduled July 8, 10 AM IST.",
      "changedAt": "2026-06-25T09:00:00.000Z"
    }
  ],
  "appliedAt": "2026-06-10T10:00:00.000Z",
  "followUpDate": "2026-07-08T09:00:00.000Z",
  "salary": {
    "expected": 25,
    "offered": null
  },
  "location": "Bangalore, Karnataka",
  "workType": "On-site",
  "contacts": [
    {
      "name": "Priya Menon",
      "role": "University Recruiter",
      "linkedinUrl": "https://linkedin.com/in/priyamenon"
    }
  ],
  "tags": ["dream-company", "tier-1"],
  "createdAt": "2026-06-10T10:00:00.000Z",
  "updatedAt": "2026-06-25T09:00:00.000Z"
}
```

---

### 2.7 `notes`

#### Purpose

Stores rich, long-form notes. Notes may be standalone or linked to a specific entity — a DSA problem, a job application, or an interview session — using a polymorphic reference pattern (`entityType` + `entityId`). Linked notes surface in the detail view of their parent entity.

#### Fields

| Field | BSON Type | Required | Default | Description |
|-------|-----------|----------|---------|-------------|
| `_id` | ObjectId | Auto | — | Document identifier |
| `userId` | ObjectId | Yes | — | Reference to `users._id` |
| `title` | String | Yes | — | Note title |
| `content` | String | Yes | — | Note body; plain text or Markdown, max 10,000 chars |
| `entityType` | String | No | — | Type of the linked entity |
| `entityId` | ObjectId | No | — | `_id` of the linked entity document |
| `tags` | Array[String] | No | `[]` | User-defined labels |
| `isPinned` | Boolean | Yes | `false` | Pinned notes appear at the top of the list |
| `color` | String | No | `"default"` | UI color label for visual organization |
| `createdAt` | Date | Auto | — | Mongoose timestamps |
| `updatedAt` | Date | Auto | — | Mongoose timestamps |

#### Required Fields
`userId`, `title`, `content`, `isPinned`

#### Optional Fields
`entityType`, `entityId`, `tags`, `color`

#### Enums

| Field | Allowed Values |
|-------|---------------|
| `entityType` | `dsa`, `job`, `interview`, `general` |
| `color` | `default`, `yellow`, `green`, `blue`, `red`, `purple` |

#### Polymorphic Reference Pattern

`entityType` and `entityId` must always be set or unset together. One without the other is rejected at the service layer.

| `entityType` value | `entityId` points to |
|--------------------|----------------------|
| `dsa` | `dsa_progress._id` |
| `job` | `job_applications._id` |
| `interview` | `interview_sessions._id` |
| Absent or `general` | No linked entity |

MongoDB does not enforce cross-collection foreign key relationships. The service layer validates that the referenced `entityId` exists and belongs to the requesting user before each write.

#### Indexes

| Index | Type | Reason |
|-------|------|--------|
| `{ userId: 1 }` | Standard | All notes for a user |
| `{ userId: 1, isPinned: -1, updatedAt: -1 }` | Compound | Default sort: pinned first, then most recently updated |
| `{ userId: 1, entityType: 1, entityId: 1 }` | Compound | Notes linked to a specific entity |
| `{ userId: 1, tags: 1 }` | Compound Multikey | Tag-filtered note list |

#### Validation Rules

| Field | Rule |
|-------|------|
| `title` | minLength: 1, maxLength: 150 |
| `content` | minLength: 1, maxLength: 10,000 |
| `tags` | max 10 items; each item minLength: 1, maxLength: 30 |
| `entityType` + `entityId` | Must both be present or both absent — enforced at service layer |

#### Example Document

```json
{
  "_id": "64f7a8b9c0d7e8f9a0b1c2d3",
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "title": "Google Round 1 — Prep Notes",
  "content": "## Focus Areas\n- Graphs: BFS, DFS, Dijkstra, Union-Find\n- DP: grid DP, knapsack, LIS\n\n## Behaviorals to prepare\n- Describe a technically challenging project\n- Tell me about a time you disagreed with your team\n\n## Reminders\n- Think aloud\n- Ask clarifying questions before coding\n- Analyze complexity after every solution",
  "entityType": "job",
  "entityId": "64f6f7a8b9c0d6e7f8a9b0c1",
  "tags": ["google", "interview-prep", "round-1"],
  "isPinned": true,
  "color": "blue",
  "createdAt": "2026-06-26T10:00:00.000Z",
  "updatedAt": "2026-07-01T18:45:00.000Z"
}
```

---

### 2.8 `analytics`

#### Purpose

Stores pre-aggregated daily activity snapshots per user. This is the exclusive data source for the analytics dashboard — the heatmap, streak counter, topic coverage chart, difficulty distribution, and weekly summaries all read from here rather than from the raw activity collections.

**Why pre-aggregate?**
Real-time aggregation of `dsa_progress` for a user with 500+ problems over 6 months requires scanning hundreds of documents through an aggregation pipeline on every dashboard load. Pre-aggregating into one document per user per day turns that into a simple indexed range scan on a small, dense collection.

**How it is written:**
The service layer upserts the matching `(userId, date)` document on every write to `dsa_progress`, `job_applications`, or `interview_sessions`. The `date` field is always normalized to midnight UTC by the service before the upsert.

#### Fields

| Field | BSON Type | Required | Default | Description |
|-------|-----------|----------|---------|-------------|
| `_id` | ObjectId | Auto | — | Document identifier |
| `userId` | ObjectId | Yes | — | Reference to `users._id` |
| `date` | Date | Yes | — | Calendar date at midnight UTC |
| `dsa` | Object | Yes | — | DSA activity for this day |
| `dsa.totalSolved` | Number | Yes | `0` | Problems marked `Solved` on this date |
| `dsa.totalAttempted` | Number | Yes | `0` | Total problems logged (any status) on this date |
| `dsa.byTopic` | Object | No | `{}` | Map of topic → solved count e.g., `{ "Graphs": 2 }` |
| `dsa.byDifficulty` | Object | No | `{}` | Map of difficulty → solved count |
| `dsa.byPlatform` | Object | No | `{}` | Map of platform → solved count |
| `dsa.timeSpentMinutes` | Number | Yes | `0` | Total DSA time in minutes for this day |
| `jobs` | Object | Yes | — | Job application activity for this day |
| `jobs.applied` | Number | Yes | `0` | New applications created on this date |
| `jobs.statusUpdates` | Number | Yes | `0` | Status changes made on this date |
| `interviews` | Object | Yes | — | Interview activity for this day |
| `interviews.sessionsCompleted` | Number | Yes | `0` | Completed sessions on this date |
| `interviews.averageScore` | Number | No | — | Average score across completed sessions today |
| `streak` | Object | Yes | — | Streak state as of the end of this day |
| `streak.isActiveDay` | Boolean | Yes | `false` | True if user had any qualifying activity today |
| `streak.currentStreak` | Number | Yes | `0` | Consecutive active-day count as of this date |
| `createdAt` | Date | Auto | — | Mongoose timestamps |
| `updatedAt` | Date | Auto | — | Mongoose timestamps |

#### Required Fields
`userId`, `date`, `dsa`, `jobs`, `interviews`, `streak`

#### Optional Fields
`dsa.byTopic`, `dsa.byDifficulty`, `dsa.byPlatform`, `interviews.averageScore`

#### What Counts as an Active Day

`streak.isActiveDay` is set to `true` if the user did at least one of the following on this calendar date:
- Logged at least 1 DSA problem (any status)
- Completed at least 1 interview session
- Applied to at least 1 job

#### Indexes

| Index | Type | Reason |
|-------|------|--------|
| `{ userId: 1, date: -1 }` | Unique Compound | Primary access pattern; prevents duplicate entries per user per day; descending for recency |
| `{ userId: 1, date: 1 }` | Compound | Ascending range scan for heatmap — last 365 days |

#### Validation Rules

| Field | Rule |
|-------|------|
| `date` | Stored at midnight UTC — time component normalized by service layer before every write |
| `dsa.totalSolved`, `dsa.totalAttempted`, `dsa.timeSpentMinutes` | min: 0 |
| `jobs.applied`, `jobs.statusUpdates` | min: 0 |
| `interviews.sessionsCompleted` | min: 0 |
| `interviews.averageScore` | min: 0, max: 100 |
| `streak.currentStreak` | min: 0 |
| `(userId, date)` pair | Unique — enforced by the unique compound index |

#### Example Document

```json
{
  "_id": "64f8b9c0d8e9f0a1b2c3d4e5",
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "date": "2026-07-02T00:00:00.000Z",
  "dsa": {
    "totalSolved": 4,
    "totalAttempted": 5,
    "byTopic": {
      "Sliding Window": 2,
      "Graphs": 1,
      "Dynamic Programming": 1
    },
    "byDifficulty": {
      "Easy": 1,
      "Medium": 3
    },
    "byPlatform": {
      "LeetCode": 3,
      "GeeksForGeeks": 1
    },
    "timeSpentMinutes": 115
  },
  "jobs": {
    "applied": 2,
    "statusUpdates": 1
  },
  "interviews": {
    "sessionsCompleted": 1,
    "averageScore": 74
  },
  "streak": {
    "isActiveDay": true,
    "currentStreak": 12
  },
  "createdAt": "2026-07-02T11:20:00.000Z",
  "updatedAt": "2026-07-02T15:24:15.000Z"
}
```

---

## 3. Relationships

SkillSync AI uses a **hub-and-spoke reference model**. `users` is the hub. Every other collection holds a `userId` ObjectId field that spokes back to the owning user. There are no circular references and no many-to-many junction collections.

### 3.1 Relationship Map

| From | To | Type | Field | Nature |
|------|----|------|-------|--------|
| `users` | `resumes` | One-to-Many | `resumes.userId` | A user owns many resume versions |
| `users` | `dsa_progress` | One-to-Many | `dsa_progress.userId` | A user logs many DSA problems |
| `users` | `interview_sessions` | One-to-Many | `interview_sessions.userId` | A user has many interview sessions |
| `users` | `job_applications` | One-to-Many | `job_applications.userId` | A user tracks many job applications |
| `users` | `notes` | One-to-Many | `notes.userId` | A user writes many notes |
| `users` | `analytics` | One-to-Many | `analytics.userId` | One analytics snapshot per user per active day |
| `interview_sessions` | `interview_questions` | Many-to-Many (soft) | `transcript[].questionId` | Sessions reference source questions; questions appear in many sessions |
| `notes` | `dsa_progress` / `job_applications` / `interview_sessions` | Many-to-One (polymorphic) | `notes.entityId` + `notes.entityType` | A note may be linked to one entity of any supported type |

### 3.2 Relationship Details

**`users` → `resumes`**
A user may have multiple saved resume versions. Exactly one may be marked `isDefault: true`. On account deletion, all resumes are deleted (cascade enforced at service layer).

**`users` → `dsa_progress`**
Each DSA entry belongs to exactly one user. Problems are queried almost exclusively by `userId`, which is why every compound index on this collection starts with `userId`. Two users solving the same LeetCode problem each have their own independent `dsa_progress` document — there is no shared problem bank.

**`users` → `interview_sessions`**
Each session belongs to one user. Sessions are immutable after completion — only `status` may transition from `active` to `completed` or `abandoned`, and never backward.

**`interview_sessions` → `interview_questions`**
The only cross-collection relationship that is not a simple user-ownership link. At session creation, the service selects N questions from `interview_questions` based on `type` and `difficulty`. The `questionId` is stored in each transcript entry for traceability; `questionText` is snapshotted for permanent historical accuracy independent of future edits to the source question.

**`notes` → entities (polymorphic)**
A note may optionally be attached to any one document from `dsa_progress`, `job_applications`, or `interview_sessions`. The service resolves the correct collection from `entityType` and validates that the referenced `entityId` exists and belongs to the requesting user before writing.

**`users` → `analytics`**
The `analytics` collection has a unique constraint on `(userId, date)`. There is never more than one analytics document per user per calendar day. The service layer uses an atomic upsert operation — creating the record if it does not exist, incrementing counters if it does.

### 3.3 Cascade Delete Policy

When a user account is permanently deleted, the following must be purged in this order by the service layer:

```
1. notes              — all where userId matches
2. analytics          — all where userId matches
3. dsa_progress       — all where userId matches
4. job_applications   — all where userId matches
5. interview_sessions — all where userId matches
6. resumes            — all where userId matches
7. users              — the user document itself
```

MongoDB does not enforce cascading deletes. This sequence is entirely the responsibility of the account deletion method in `auth.service.js`.

---

## 4. ER Diagram

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                     SKILLSYNC AI — Entity Relationship Diagram              ║
╚══════════════════════════════════════════════════════════════════════════════╝

                        ┌──────────────────────┐
                        │        users         │
                        │──────────────────────│
                        │ _id           PK     │
                        │ name                 │
                        │ email         UNIQUE │
                        │ password             │
                        │ college              │
                        │ branch               │
                        │ graduationYear       │
                        │ avatar { url,        │
                        │         publicId }   │
                        │ role                 │
                        │ refreshTokenHash     │
                        │ isActive             │
                        │ lastLoginAt          │
                        └──────────┬───────────┘
                                   │ userId (FK)
        ┌──────────┬───────────────┼──────────────┬───────────────┐
        │ 1:many   │ 1:many        │ 1:many        │ 1:many        │ 1:many
        ▼          ▼               ▼               ▼               ▼

┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  ┌──────────────┐
│   resumes   │  │ dsa_progress │  │job_applications │  │    notes     │
│─────────────│  │──────────────│  │─────────────────│  │──────────────│
│ _id      PK │  │ _id      PK  │  │ _id         PK  │  │ _id      PK  │
│ userId   FK │  │ userId   FK  │  │ userId      FK  │  │ userId   FK  │
│ title       │  │ title        │  │ company         │  │ title        │
│ isDefault   │  │ platform     │  │ role            │  │ content      │
│ atsScore    │  │ topic        │  │ source          │  │ entityType ──┼──┐
│ targetRole  │  │ difficulty   │  │ status          │  │ entityId   ──┼──┤
│ personalInfo│  │ status       │  │ statusHistory   │  │ tags[]       │  │
│   { ... }   │  │ link         │  │  [ { status,   │  │ isPinned     │  │
│ summary     │  │ notes        │  │    note,        │  │ color        │  │
│ education   │  │ timeSpent    │  │    changedAt    │  └──────────────┘  │
│  [ { ... }] │  │ attemptCount │  │  } ]            │                   │
│ workExp     │  │ tags[]       │  │ appliedAt       │  Polymorphic ref   │
│  [ { ... }] │  │ solvedAt     │  │ followUpDate    │  resolves to one   │
│ projects    │  └──────────────┘  │ salary { }      │  of the three ────┘
│  [ { ... }] │                   │ location        │  collections below
│ skills { } │                   │ workType        │
│ certs [ ]  │                   │ contacts [ ]    │
│ achievements│                   │ tags[]          │
└─────────────┘                   └─────────────────┘

        ┌─────────────────────────────────────────────────┐
        │              interview_sessions                 │
        │─────────────────────────────────────────────────│
        │ _id              PK                             │
        │ userId           FK ──────────────────▶ users  │
        │ type                                            │
        │ difficulty                                      │
        │ status                                          │
        │ totalQuestions                                  │
        │ answeredCount                                   │
        │ score                                           │
        │ aiFeedback                                      │
        │ transcript [ {                                  │
        │   questionId  ──────────────────────────────┐  │
        │   questionText  (snapshot — immutable copy) │  │
        │   userAnswer                                │  │
        │   aiEvaluation                              │  │
        │   answerScore                               │  │
        │   timeTaken                                 │  │
        │   answeredAt                                │  │
        │ } ]                                         │  │
        │ startedAt                                   │  │
        │ completedAt                                 │  │
        │ duration                                    │  │
        └─────────────────────────────────────────────┘  │
                                                         │ soft ref
                                                         ▼
                        ┌──────────────────────────────────┐
                        │       interview_questions        │
                        │──────────────────────────────────│
                        │ _id            PK                │
                        │ text                             │
                        │ type                             │
                        │ topic                            │
                        │ difficulty                       │
                        │ sampleAnswer                     │
                        │ followUpQuestions []             │
                        │ tags []                          │
                        │ sourceType                       │
                        │ isActive                         │
                        │ usageCount                       │
                        └──────────────────────────────────┘

        ┌─────────────────────────────────────────────────┐
        │                   analytics                     │
        │─────────────────────────────────────────────────│
        │ _id              PK                             │
        │ userId           FK ──────────────────▶ users  │
        │ date             (midnight UTC)                 │
        │                  UNIQUE per (userId, date)      │
        │ dsa {                                           │
        │   totalSolved, totalAttempted,                  │
        │   byTopic {},   byDifficulty {},                │
        │   byPlatform {}, timeSpentMinutes               │
        │ }                                               │
        │ jobs {                                          │
        │   applied, statusUpdates                        │
        │ }                                               │
        │ interviews {                                    │
        │   sessionsCompleted, averageScore               │
        │ }                                               │
        │ streak {                                        │
        │   isActiveDay, currentStreak                    │
        │ }                                               │
        │                                                 │
        │  ▲ Upserted by service layer on every write to  │
        │    dsa_progress, job_applications,              │
        │    or interview_sessions                        │
        └─────────────────────────────────────────────────┘

─────────────────────────── LEGEND ────────────────────────────────

  FK       Foreign Key (ObjectId reference)
  PK       Primary Key (_id)
  ──▶      References via ObjectId
  [ { } ]  Embedded array of objects
  { }      Embedded object
  UNIQUE   Unique index constraint
  (snapshot)  Data copied at write time; immutable thereafter
```

---

## 5. Scaling Considerations

### 5.1 Current Scale Assumptions

The initial design targets the following load profile. No infrastructure beyond a standard MongoDB Atlas shared cluster is required at this scale.

| Metric | Assumption |
|--------|------------|
| Concurrent active users | < 1,000 |
| Active users per day | < 500 |
| DSA entries per active user per day | 3–10 |
| Documents in `dsa_progress` at 12 months | ~500,000 |
| Documents in `analytics` at 12 months | ~180,000 |
| Documents in `job_applications` at 12 months | ~50,000 |
| Total database size at 12 months | < 5 GB |

### 5.2 Index Maintenance

Each index adds overhead to insert and update operations. Existing indexes are minimal and targeted. The principle: add an index to solve a **measured** performance problem, not in anticipation of one. MongoDB Atlas Performance Advisor surfaces slow queries automatically — use it before adding new indexes.

### 5.3 `dsa_progress` — Highest-Growth Collection

This collection grows with every active user's daily practice. It is the first collection to require optimization at scale.

| Phase | Approach |
|-------|---------|
| Current | All indexes lead with `userId` — per-user queries are fast regardless of collection size |
| Medium-term | Introduce a **rolling archive** — entries older than 24 months move to `dsa_progress_archive`. The `analytics` snapshots preserve the aggregated historical record; raw entries beyond 24 months are rarely queried |
| Long-term | Shard on `{ userId: "hashed" }` — distributes documents uniformly; all queries for one user land on a single shard with no scatter-gather |

### 5.4 `analytics` — Write Amplification

Every write to `dsa_progress`, `job_applications`, or `interview_sessions` triggers an upsert on `analytics`. This is a 2× write amplification, which is negligible at current scale.

At higher scale (50,000+ active users per day), the evolution path is:

| Scale trigger | Response |
|---------------|---------|
| Upserts causing noticeable write latency | Buffer analytics updates in memory per user per request cycle; flush in a single bulk write at request end |
| Bulk writes still causing latency | Move analytics updates to an in-process queue drained asynchronously by a background worker |
| Multi-server deployment | Accumulate daily increments in Redis; a scheduled midnight job flushes Redis counters to MongoDB atomically |

### 5.5 `interview_sessions` — Document Size Ceiling

Each transcript entry is an embedded object. A session with 20 questions — each with a multi-paragraph `userAnswer` and AI `aiEvaluation` — can approach 10–20 KB per document. MongoDB's 16 MB document limit is not a practical concern, but verbose AI output in large sessions should be monitored.

**Safeguards already in place:**
- `totalQuestions` is capped at 20 (validation rule)
- `transcript[].userAnswer` should be capped at 5,000 characters at the API validation layer
- `transcript[].aiEvaluation` should be capped at 2,000 characters per entry

### 5.6 `interview_questions` — Caching Candidate

This collection changes infrequently and is read on every session start. It is the ideal candidate for application-level caching.

| Phase | Caching Strategy |
|-------|-----------------|
| Single-server | Cache question sets in-memory inside the Node.js process on first query. Invalidate every 30 minutes. |
| Multi-server | Introduce Redis as a shared cache. Questions are read from Redis; invalidated when any question is updated or deactivated. |

### 5.7 Sharding Strategy (When Needed)

| Collection | Shard Key | Reason |
|------------|-----------|--------|
| `dsa_progress` | `{ userId: "hashed" }` | Uniform distribution; all user queries hit one shard |
| `analytics` | `{ userId: "hashed" }` | Same pattern; dashboard queries are always single-user |
| `job_applications` | `{ userId: "hashed" }` | Same pattern |
| `interview_sessions` | `{ userId: "hashed" }` | Same pattern |
| `notes` | `{ userId: "hashed" }` | Same pattern |
| `users` | `{ _id: "hashed" }` | Uniform distribution of root documents |
| `interview_questions` | Not sharded initially | Small, read-heavy, fits in memory on any shard node |
| `resumes` | `{ userId: "hashed" }` | Same pattern; low volume but user-scoped |

### 5.8 Read Replicas for Analytics

MongoDB Atlas supports read preference routing. The analytics dashboard is read-only and can tolerate up to 60 seconds of eventual consistency. At higher read load, analytics endpoint queries can be routed to a secondary replica using `readPreference: "secondaryPreferred"`, offloading the primary node for write operations.

### 5.9 Data Retention Policy

| Collection | Active Retention | Archive Action |
|------------|-----------------|----------------|
| `users` | Indefinite while active | Soft-delete via `isActive: false`; hard-delete on explicit request |
| `dsa_progress` | 24 months | Move to `dsa_progress_archive` collection |
| `resumes` | Indefinite | User-controlled deletion only |
| `job_applications` | 24 months | Move to `job_applications_archive` collection |
| `interview_sessions` | 12 months | Move to `interview_sessions_archive` collection |
| `interview_questions` | Indefinite | Soft-delete via `isActive: false` |
| `notes` | Indefinite | User-controlled deletion only |
| `analytics` | 24 months rolling | Delete snapshots older than 24 months via scheduled monthly job |

A scheduled job running on the first day of each month handles archiving. Archive collections mirror the source schema. No data is permanently deleted without an explicit user-initiated account deletion request.

### 5.10 Future: Full-Text Search

When search functionality is added (search across DSA problem titles, note content, company names), Atlas Search (Lucene-based) can be enabled on MongoDB Atlas without additional infrastructure. Candidate fields for Atlas Search indexes:

- `dsa_progress.title`
- `notes.title` + `notes.content`
- `job_applications.company` + `job_applications.role`
- `interview_questions.text` + `interview_questions.tags`

---

*For the API endpoint contracts that read and write this data model, see [API.md](./API.md). For the overall system design that provides context for these decisions, see [ARCHITECTURE.md](./ARCHITECTURE.md).*
