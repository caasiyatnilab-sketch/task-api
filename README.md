# Task Manager API

[![CI](https://github.com/caasiyatnilab-sketch/task-api/actions/workflows/ci.yml/badge.svg)](https://github.com/caasiyatnilab-sketch/task-api/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)]()

Production-ready REST API for task management with JWT authentication, full CRUD, filtering, rate limiting, and Docker support.

## Features

- **JWT Authentication** -- register, login, protected routes
- **Full CRUD** -- create, read, update, delete tasks
- **Filtering** -- filter by status (`pending`, `in-progress`, `done`) and priority (`low`, `medium`, `high`)
- **Security** -- rate limiting, helmet headers, input validation
- **Docker** -- Dockerfile and docker-compose ready
- **Tests** -- automated test suite with CI pipeline

## Quick Start

```bash
git clone https://github.com/caasiyatnilab-sketch/task-api.git
cd task-api
npm install
cp .env.example .env    # Configure MongoDB URI + JWT secret
npm run dev
```

## Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskapi
JWT_SECRET=your-secret-here
NODE_ENV=development
```

## API Reference

### Authentication

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | `{ name, email, password }` | Create account |
| `POST` | `/api/auth/login` | `{ email, password }` | Get JWT token |
| `GET` | `/api/auth/me` | -- | Get current user (auth required) |

### Tasks (all require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | List all tasks (supports `?status=` and `?priority=` filters) |
| `POST` | `/api/tasks` | Create task `{ title, description, status, priority }` |
| `PUT` | `/api/tasks/:id` | Update task |
| `DELETE` | `/api/tasks/:id` | Delete task |

### Example Request

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Isaac","email":"isaac@example.com","password":"secret123"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"isaac@example.com","password":"secret123"}' | jq -r .token)

# Create task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Ship feature","priority":"high"}'

# List tasks
curl http://localhost:3000/api/tasks?status=pending \
  -H "Authorization: Bearer $TOKEN"
```

## Project Structure

```
task-api/
  src/
    index.js          # Express app, routes, middleware, MongoDB connection
  tests/
    api.test.js       # Integration tests
  .env.example        # Environment template
  Dockerfile          # Container build
  package.json        # Dependencies and scripts
```

## Testing

```bash
npm test
```

Tests run without a MongoDB connection (test mode skips DB).

## Deployment

| Platform | Command |
|----------|---------|
| **Docker** | `docker build -t task-api . && docker run -p 3000:3000 task-api` |
| **Railway** | `railway up` |
| **Render** | Connect repo at [render.com](https://render.com) |
| **Fly.io** | `fly deploy` |

## License

MIT -- see [LICENSE](LICENSE) for details.
