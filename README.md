# TaskFlow — MERN Task Manager

A responsive task manager built with React + Vite, Node.js + Express, and MongoDB + Mongoose.

## Features
- Create, edit, delete, and view tasks
- Status: Pending, In Progress, Completed
- Priority: Low, Medium, High
- Due dates and overdue indicators
- Search, status/priority filters, and sorting
- Dashboard summary cards
- Responsive layout, loading/error/empty states
- Server-side validation and centralized error handling

## Requirements
- Node.js 18+
- MongoDB local instance or MongoDB Atlas connection string

## Run locally

### 1. Backend
```bash
cd server
cp .env.example .env
# Set MONGODB_URI in .env
npm install
npm run dev
```
API runs at `http://localhost:5000`; health check: `http://localhost:5000/api/health`.

### 2. Frontend (new terminal)
```bash
cd client
npm install
npm run dev
```
Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## Environment
`server/.env`
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

`client/.env` is optional. Default API URL is `http://localhost:5000/api`.
For a deployed frontend, set `VITE_API_URL` to your deployed API base ending in `/api`.

## API
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | List tasks; supports `search`, `status`, `priority`, `sort` |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/health` | API health |

## Suggested assessment walkthrough
1. Create a task with a title, priority, and due date.
2. Edit its details and change its status.
3. Search for it and filter by status/priority.
4. Mark a task completed and delete a sample task.
5. Show the responsive layout and dashboard counts.

## Assessment decisions / scope
- Reusable React components and a small API service layer keep UI and networking concerns separate.
- Mongoose schema validation and Express request validation protect persisted task data.
- Search/filter/sort are implemented through query parameters and MongoDB queries.
- Authentication, real-time collaboration, and notifications are intentionally out of scope for this single-user assessment build.
- Current limitation: there is no authentication or per-user data isolation. With one extra day, add JWT authentication, user ownership on tasks, and authorization middleware.

## Notes
This project is source code, not a hosted deployment. Configure MongoDB and run the two apps locally before recording the demo. Do not submit a video claiming features you have not personally tested.
