# CodeArena

A full-stack web application for practicing coding problems with real-time session collaboration, code execution, and submission tracking.

<!-- Add a strong CodeArena project screenshot here -->

## What is this?

CodeArena is a coding-practice platform where users solve problems, test code with immediate feedback, and track their progress. The application supports multiple programming languages (JavaScript, Python, Java) and lets users create or join practice sessions with video and chat to collaborate in real time.

## What can I do with it?

- **Browse and solve problems** — explore a curated library of coding challenges across difficulty levels
- **Write and run code** — edit code using Monaco Editor, execute it instantly to see output
- **Submit solutions** — persist submissions to track your progress over time
- **Create or join sessions** — invite others to practice together with synchronized video and chat
- **View your activity** — check submission history, review past solutions, and track acceptance status
- **Explore user profiles** — see public profiles of other users and their submission history

## How does it work?

1. **Sign in** using Clerk authentication
2. **Select a problem** from the problems page
3. **Write code** in the Monaco Editor
4. **Run code** to test against sample test cases (output compared with expected output stored in problem data)
5. **Submit your solution** to save it and track the result
6. **Create or join a session** to practice with others via video/chat

For collaborative sessions, users can create a new session, share a link with others to join, and communicate through Stream's video and chat SDKs while writing code independently.

## Architecture

### High-level diagram

```
                    React 19 + Vite 7
                    Frontend (Port 5173)
                          |
                          |
                 Express 5 Backend (Port 3000)
                    |      |      |      |
                    |      |      |      |
                 MongoDB  Clerk Judge0  Stream
                           |             |
                        Auth        Video/Chat
                                        |
                                    Inngest
                                (Event Processing)
```

### Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite 7 (build tool)
- React Router 7 (client-side routing)
- TanStack Query (data fetching and caching)
- Monaco Editor (code editing)
- Clerk (authentication)
- Stream Video/Chat SDKs
- Tailwind CSS 4 + DaisyUI 5
- Axios + Fetch API

**Backend:**
- Node.js with TypeScript
- Express 5 (HTTP server)
- MongoDB + Mongoose (database)
- Clerk (authentication and user sync)
- Stream Node SDK (video/chat provisioning)
- Judge0 (code compilation and execution)
- Inngest (event-driven workflows)

## Backend Architecture

### Entry Point

`backend/src/server.js` — initializes the Express server, connects to MongoDB, configures middleware, and mounts API routes. In production (`NODE_ENV=production`), it serves the built frontend from `frontend/dist`.

### Directory Organization

- **`backend/src/controllers/`** — business logic for each feature (sessions, submissions, chat, code execution, user profiles)
- **`backend/src/routes/`** — API route definitions and middleware bindings
- **`backend/src/models/`** — MongoDB/Mongoose schema definitions
- **`backend/src/middleware/`** — authentication and request processing middleware
- **`backend/src/lib/`** — utility functions, environment configuration, database connection, and Inngest setup

### Key Middleware

- **`clerkMiddleware()`** — authenticates requests and attaches user context
- **`protectRoute()`** — custom middleware that ensures routes are only accessible to signed-in users

## Database Models

### User

Stores user account information synced from Clerk.

```
{
  name: String (required)
  email: String (required, unique)
  profileImage: String (default: "")
  clerkId: String (required, unique)
  timestamps: { createdAt, updatedAt }
}
```

### Session

Represents a collaborative practice session between users.

```
{
  problem: String (required)           // problem name
  difficulty: String (enum: "easy", "moderate", "hard", required)
  host: ObjectId (ref: User, required)
  participant: ObjectId (ref: User, default: null)
  status: String (enum: "active", "completed", default: "active")
  callId: String (default: "")         // Stream call ID
  timestamps: { createdAt, updatedAt }
}
```

### Submission

Stores code submissions with execution results and metadata.

```
{
  user: ObjectId (ref: User, required, indexed)
  problemId: String (required, indexed)
  problemTitle: String
  session: ObjectId (ref: Session, default: null, indexed)
  battleId: String (default: null, indexed)
  sourceCode: String (required)
  language: String (enum: "javascript", "python", "java", required)
  judge0LanguageId: Number (required)
  status: String (enum: "pending", "processing", "accepted", 
                  "wrong_answer", "compilation_error", etc., indexed)
  executionTime: Number (milliseconds, default: null)
  memoryUsage: Number (bytes, default: null)
  compilerOutput: String
  stdout: String
  stderr: String
  passedTestCount: Number
  totalTestCount: Number
  submissionType: String (enum: "individual_practice", "session_battle", 
                          "contest", "interview", default: "individual_practice", indexed)
  isPublic: Boolean (default: false)
  isOfficial: Boolean (default: true)
  isAccepted: Boolean (default: false, indexed)
  submittedAt: Date (indexed)
  timestamps: { createdAt, updatedAt }
}
```

**Note:** Problem definitions are currently stored in `frontend/src/data/problems.js` — there is no database-backed Problem model.

## Frontend Routes

The frontend uses React Router and Clerk for authentication. Most routes require sign-in; the user profile route is public.

| Route | Component | Authentication | Purpose |
|-------|-----------|-----------------|---------|
| `/` | HomePage | Public, redirects if signed in | Landing page and login entry point |
| `/dashboard` | DashboardPage | Protected | User dashboard overview |
| `/problems` | ProblemsPage | Protected | Browse all coding problems |
| `/problem/:id` | ProblemPage | Protected | Solve a single problem with code editor |
| `/session/:id` | SessionPage | Protected | Collaborative session with video/chat |
| `/submissions` | SubmissionsPage | Protected | View all user submissions |
| `/submissions/:submissionId` | SubmissionDetailPage | Protected | View submission details and code |
| `/users/:userId` | UserProfilePage | Public | View public user profile and activity |

## API Overview

### Health Check
- **`GET /health`** — simple health check, returns `{ msg: "api is up and running" }`

### Code Execution
- **`POST /api/execute`** *(no auth required)* — execute code and return output
  - Submits code to Judge0 for compilation/execution
  - Frontend compares output with expected output from problem data
  - Used by "Run Code" feature on the problem page

### Submissions
- **`POST /api/submissions`** — create and execute a submission
  - Stores code and execution result in database
  - Triggers Judge0 execution
  - Used when user clicks "Submit"
- **`GET /api/submissions/me`** — get current user's submission history
- **`GET /api/submissions/:id`** — get a specific submission by ID

### Sessions
- **`POST /api/sessions`** — create a new practice session
  - Provisions a Stream call ID
- **`GET /api/sessions/active`** — fetch active sessions
- **`GET /api/sessions/my-recent`** — fetch user's recent sessions
- **`GET /api/sessions/:id`** — get session details
- **`POST /api/sessions/:id/join`** — join an existing session
- **`POST /api/sessions/:id/end`** — mark session as completed
- **`POST /api/sessions/cleanup-old`** — cleanup stale sessions (admin utility)

### Chat
- **`GET /api/chat/token`** — get a token for Stream Chat SDK to enable in-session messaging

### Users
- **`GET /api/users/:userId/profile`** — get public user profile
- **`GET /api/users/:userId/activity`** — get user's submission activity/stats

### Inngest
- **`POST /api/inngest`** — Inngest webhook endpoint for event-driven workflows
  - Syncs Clerk user creation events to database
  - Deletes user data when account is deleted

## Repository Structure

```
CodeArena/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Business logic
│   │   │   ├── judge0Controller.js
│   │   │   ├── sessionController.js
│   │   │   ├── submissionController.js
│   │   │   ├── chatController.js
│   │   ├── routes/             # API endpoints
│   │   │   ├── judge0Routes.js
│   │   │   ├── sessionRoutes.js
│   │   │   ├── submissionRoutes.js
│   │   │   ├── chatRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Session.js
│   │   │   └── Submission.js
│   │   ├── middleware/         # Authentication & protection
│   │   │   └── protectRoute.js
│   │   ├── lib/                # Utilities and config
│   │   │   ├── env.js          # environment variables
│   │   │   ├── db.js           # MongoDB connection
│   │   │   └── inngest.js      # event workflows
│   │   └── server.js           # Express app entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/              # Route components
│   │   │   ├── HomePage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProblemsPage.jsx
│   │   │   ├── ProblemPage.jsx
│   │   │   ├── SessionPage.jsx
│   │   │   ├── SubmissionsPage.jsx
│   │   │   ├── SubmissionDetailPage.jsx
│   │   │   └── UserProfilePage.jsx
│   │   ├── components/         # Reusable UI components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── api/                # API client functions
│   │   ├── lib/                # Frontend utilities
│   │   ├── data/
│   │   │   └── problems.js     # Problem definitions (not DB-backed)
│   │   ├── App.jsx             # Route definitions
│   │   └── main.jsx            # React entry point
│   └── package.json
├── docs/
│   └── submission-tracking-and-user-profile.md  # design/planning docs
├── package.json                # Root package (build scripts)
└── README.md
```

## Environment Configuration

### Backend (.env)

```
PORT=3000
DB_URL=mongodb://...
NODE_ENV=development
CLIENT_URL=http://localhost:5173

CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

STREAM_API_KEY=...
STREAM_API_SECRET=...

INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...
```

### Frontend (.env.local)

```
VITE_CLERK_PUBLISHABLE_KEY=pk_...
VITE_STREAM_API_KEY=...
VITE_API_URL=http://localhost:3000
```

**Important notes:**
- Only public/publishable keys should use `VITE_` prefix; secrets are never exposed to the browser
- `.env` files must not be committed to version control
- Currently, there is no `.env.example` file in the repository

## Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local instance or connection string)
- Clerk account and API keys
- Stream account and API credentials
- Judge0 API access (free or paid tier)
- Inngest account (for event workflows)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rishiraj029/CodeArena.git
   cd CodeArena
   ```

2. **Install root dependencies** (optional, some scripts run from subdirectories)
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   npm install --prefix backend
   ```

4. **Install frontend dependencies**
   ```bash
   npm install --prefix frontend
   ```

5. **Configure environment variables**
   - Create `backend/.env` with the required backend variables
   - Create `frontend/.env.local` with the required frontend variables

6. **Start the backend** (from root or backend directory)
   ```bash
   npm run dev --prefix backend
   ```
   Runs on `http://localhost:3000` by default.

7. **Start the frontend** (from root or frontend directory)
   ```bash
   npm run dev --prefix frontend
   ```
   Runs on `http://localhost:5173` by default.
   Vite automatically proxies `/api/*` requests to `http://localhost:3000`.

8. **Open your browser**
   ```
   http://localhost:5173
   ```

## Commands

### Root Level
- `npm run build` — installs dependencies in backend and frontend, builds the frontend (does NOT run backend TypeScript build)
- `npm start` — starts the backend server in production mode

### Backend
- `npm run dev --prefix backend` — start with hot reload (nodemon)
- `npm run typecheck --prefix backend` — type check TypeScript (if configured)
- `npm run build --prefix backend` — compile TypeScript to JavaScript
- `npm start --prefix backend` — start the backend server

### Frontend
- `npm run dev --prefix frontend` — start Vite dev server with hot reload
- `npm run typecheck --prefix frontend` — type check TypeScript
- `npm run build --prefix frontend` — build for production
- `npm run lint --prefix frontend` — lint code with ESLint
- `npm run preview --prefix frontend` — preview production build locally

## Current Limitations

CodeArena is actively developed. Please be aware of these current limitations:

1. **No hidden-test judging** — submissions are evaluated against visible problem examples only; there is no automated hidden-test suite on the backend
2. **Empty stdin** — code execution currently sends empty stdin to programs, limiting input-based problem support
3. **No synchronized code editing** — session participants cannot simultaneously edit the same file; code editing remains individual
4. **No battle/winner system** — sessions do not have competitive outcomes, rankings, or winner detection
5. **No automated tests** — the project has no test suite or test runner scripts
6. **Difficulty mismatch** — frontend session creation sends difficulty level `"medium"`, but the backend Session schema expects `"moderate"` as an enum value; this is a known implementation inconsistency
7. **User profile caveat** — the profile page passes `null` filters to the submissions API hook; this path is not fully validated and may behave unexpectedly
8. **Documentation status** — `docs/submission-tracking-and-user-profile.md` contains design and planning material; proposals in that document should not be assumed to be implemented features

## Project Documentation

- `docs/submission-tracking-and-user-profile.md` — design specifications and planning notes for submission tracking and user profiles

## Contributing

CodeArena welcomes contributions. Detailed contribution guidelines will be provided in `CONTRIBUTING.md`. For now, feel free to open issues or pull requests if you'd like to help improve the platform.

## License

This repository does not currently have a license file. Please check the repository for license details or reach out to the maintainer.

---

**Questions or issues?** Open an issue on [GitHub](https://github.com/Rishiraj029/CodeArena/issues).
