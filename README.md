# 📘 XaminityIQ – Online Examination Platform

XaminityIQ is a secure, proctored online examination system for universities and colleges. This repository is the
frontend — a React + TypeScript single-page app that provides role-based experiences for **Super Admin**,
**Faculty**, and **Students**: academic setup, exam authoring, live proctored exam-taking (via LiveKit), answer
evaluation, and results.

The companion backend lives at [XaminityIQ-Server](https://github.com/sanjaikannang/XaminityIQ-Server), which also
includes a complete technical architecture document (system design, full API reference, database schema,
diagrams, security model) at `docs/XaminityIQ-Technical-Documentation.pdf` in that repository.

---

## 🚀 Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + Vite 6, TypeScript |
| Routing | React Router v7 |
| State / data-fetching | Redux Toolkit — used almost entirely as the host for RTK Query's cache; app state itself lives mostly in local component state / `localStorage` |
| Styling | Tailwind CSS v4 |
| Forms &amp; validation | Formik + Yup |
| HTTP | Axios |
| Real-time proctoring | `livekit-client` (WebRTC — camera/mic/screen-share, data-channel chat) |
| Rich text | Tiptap (`@tiptap/react`, `starter-kit`) — used for Typing-question answers |
| Data viz | ECharts (`echarts`) — admin dashboards |
| Bulk data | PapaParse (CSV import/export) |
| Misc UI | `lucide-react` (icons), `react-select` + `react-select-async-paginate`, `react-hot-toast`, `qrcode`, DOMPurify |

---

## ⚙️ Installation

### 1. Clone the project
```bash
git clone https://github.com/sanjaikannang/XaminityIQ-Client.git
cd XaminityIQ-Client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```env
VITE_BACKEND_BASE_URL=""
```

This is the **only** environment variable the app reads (see `src/config/env.ts`) — it should point at the
running XaminityIQ-Server instance, e.g. `http://localhost:8004` for local development.

### 4. Run the development server
```bash
npm run dev
```

### Other scripts
```bash
npm run build      # production build
npm run lint        # ESLint
npm run preview     # preview a production build locally
```

---

## 🔐 User Roles

- **Super Admin** — Academic setup (batches/courses/departments/sections/subjects), user onboarding, exam
  authoring &amp; publishing, room formation, result publication
- **Faculty** — Subject ownership, live proctoring &amp; invigilation, answer evaluation
- **Students** — Profile completion, exam taking (self-paced or proctored), viewing results

---

## 📁 Project Folder Structure

```
src/
├── api/                    # RTK Query endpoint definitions (one file per domain — auth, admin, faculty,
│                            #  student, academic, exam, evaluation, proctoring, dashboard, etc.)
├── app/                     # Root app shell / route composition
├── assets/                  # Static images, icons
├── common/                  # Shared UI primitives and components reused across roles
├── config/                  # env.ts — the single environment-variable access point
├── features/                # Feature-first, role-partitioned application code
│   ├── auth/                 # Login, forgot/reset password
│   ├── common/                # Shared cross-role feature code
│   ├── faculty/                # Subjects, exam proctoring dashboard, evaluation queue, profile
│   ├── public/                 # Unauthenticated QR-based mobile written-answer capture flow
│   ├── student/                 # My exams, exam room / live-proctoring UI, results, profile
│   └── super-admin/              # Academic hierarchy, user management, exam authoring, room formation, dashboard
├── hoc/                      # withAuthGuard / withGuestGuard / withScreenGuard higher-order components
├── layouts/                   # Per-role page shells (sidebar/topbar) and the public landing page layout
├── state/                      # Redux store setup (RTK Query cache host; no meaningful app-state slices)
├── types/                       # Shared TypeScript types
├── utils/                        # Formatting, storage, and misc helpers
├── main.tsx                       # Entry point
└── App.tsx                         # Root component — route tree, providers
```

Auth state is not kept in Redux — the app decodes/stores the JWT in `localStorage` and gates routes via the
`hoc/` guards and a `RoleGuard` component rather than a global auth slice.

---

## 📚 Full Documentation

For system architecture, the complete API reference, database schema, diagrams, and security model, see
[`docs/XaminityIQ-Technical-Documentation.pdf`](https://github.com/sanjaikannang/XaminityIQ-Server/blob/main/docs/XaminityIQ-Technical-Documentation.pdf)
in the server repository.

---

## 🔗 Related Repository

- Backend: [XaminityIQ-Server](https://github.com/sanjaikannang/XaminityIQ-Server)
