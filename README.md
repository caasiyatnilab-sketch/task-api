# 📋 Task Manager API

Full-stack REST API with authentication, CRUD operations, and MongoDB.

## Features
- 🔐 JWT Authentication (register, login, protect routes)
- 📝 CRUD for tasks (create, read, update, delete)
- 🏷️ Task filtering (status, priority)
- 🔒 Rate limiting & security headers
- 🐳 Docker ready
- ✅ Tests included

## Quick Start
```bash
npm install
cp .env.example .env
npm run dev
```

## API Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register user |
| POST | /api/auth/login | No | Login user |
| GET | /api/auth/me | Yes | Get current user |
| GET | /api/tasks | Yes | List tasks |
| POST | /api/tasks | Yes | Create task |
| PUT | /api/tasks/:id | Yes | Update task |
| DELETE | /api/tasks/:id | Yes | Delete task |

## Deploy Free
- Railway: `railway up`
- Render: Connect repo
- Fly.io: `fly deploy`

---
Built with ❤️ | © 2026
