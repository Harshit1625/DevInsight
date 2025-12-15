
# DevInsight

DevInsight is a real-time log intelligence platform that ingests application logs, processes them asynchronously using a background worker, and enriches them with AI-generated summaries. The system provides live updates to the UI using WebSockets and is designed with a clean, scalable architecture that mirrors how modern observability tools work.

This project was built to demonstrate real-world backend architecture concepts: async processing, queues, workers, real-time communication, and CI/CD-driven deployment.

---

## ✨ Key Features

* **Real-time log ingestion** via REST API
* **Live UI updates** using Socket.IO
* **Asynchronous processing** with BullMQ + Redis
* **AI-powered log summarization**
* **Automatic error grouping** using fingerprinting
* **Graceful worker shutdown & retries**
* **Monorepo CI/CD pipeline** with GitHub Actions
* **Cloud deployment** on Render and Vercel

---

## 🧱 High-Level Architecture

```
Client (Frontend)
   │
   │  WebSocket updates
   ▼
Backend API (Express + MongoDB)
   │
   │  Job enqueue (BullMQ)
   ▼
Worker (BullMQ + AI Summarizer)
   │
   │  DB update + notify
   ▼
Backend → WebSocket → Frontend
```

---

## 🔁 Complete Workflow

1. A log is received on the backend via a `POST /` API route.
2. The backend stores the log in MongoDB.
3. The backend immediately emits a WebSocket event so the frontend can show the new log in real time.
4. A BullMQ job is created for asynchronous processing of the log.
5. The worker picks up the job and sends the log to the AI summarizer.
6. The worker generates a summary, fingerprints the log, and assigns it to an error group.
7. The processed log is updated in MongoDB with the summary and group metadata.
8. The worker notifies the backend that processing is complete.
9. The backend broadcasts a WebSocket event so the frontend updates the UI instantly.

---

## 🗂️ Project Structure

```
DevInsight/
├── backend/        # Express API + Socket.IO
├── worker/         # BullMQ worker + AI summarization
├── frontend/       # React + Tailwind dashboard
├── .github/
│   └── workflows/  # CI/CD pipeline (GitHub Actions)
└── README.md
```

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express
* MongoDB + Mongoose
* BullMQ
* Redis
* Socket.IO

### Worker

* BullMQ
* Redis
* AI Summarization (GEMINI API)

### Frontend

* React
* TailwindCSS
* Vite
* Socket.IO Client

### DevOps & Deployment

* GitHub Actions (CI/CD)
* Render (Backend & Worker)
* Vercel (Frontend)

---

## 🚀 Deployment Strategy

### Frontend

* Deployed on **Vercel**
* Automatic CI/CD on every push to `main`

### Backend & Worker

* Deployed on **Render**
* Deployment triggered via **Render Deploy Hooks**
* GitHub Actions validates the build before triggering deployment

---

## 🔄 CI/CD Pipeline

The CI/CD pipeline performs the following steps:

1. Runs on every push and pull request to `main`
2. Installs dependencies for backend, worker, and frontend
3. Builds all components to validate correctness
4. Triggers Render deploy hooks if validation succeeds

This ensures only healthy code reaches production.

---

## 🔐 Environment Variables

### Backend / Worker

* `MONGO_URI`
* `REDIS_URL`
* `QUEUE_NAME`
* `BACKEND_URL`
* `AI_API_KEY`

### CI/CD (GitHub Actions Secrets)

* `RENDER_BACKEND_DEPLOY_HOOK`
* `RENDER_WORKER_DEPLOY_HOOK`

---

## 🧠 Design Decisions

* **Queues over synchronous processing** to avoid blocking API requests
* **WebSockets instead of polling** for real-time UI updates
* **Worker isolation** for heavy AI processing
* **Optimistic UI updates** for better UX
* **Graceful shutdown handling** to prevent duplicate jobs

---

## 🎯 Why This Project Matters

DevInsight is not a CRUD demo. It demonstrates how real production systems handle:

* High-throughput logging
* Background job processing
* Event-driven architecture
* Real-time UI synchronization
* Cloud-native CI/CD workflows

This project was built to reflect how modern observability and monitoring platforms are designed.

---

## 👤 Author

**Harshit Srivastava**

Web Developer with a strong interest in backend systems, distributed architecture, and real-time applications.

