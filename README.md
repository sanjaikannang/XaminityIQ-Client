# 📘 XaminityIQ – Online Examination Platform

XaminityIQ is a secure and scalable online examination system designed for universities and colleges.  
It provides role-based access for **Super Admin**, **Faculty**, and **Students**, enabling efficient management of batches, courses, departments, and sections.

---

## 🚀 Tech Stack

### **Frontend**
- React.js (Vite)
- Redux Toolkit (RTK + RTK Query)
- Tailwind CSS
- React Router v6
- Formik
- Axios
- TypeScript

---

## ⚙️ Installation

### Clone the project
```sh
git clone https://github.com/sanjaikannang/XaminityIQ-Client.git

npm install

create .env file

npm run dev

## 📁 Project Folder Structure

```bash
src/
├── app/
│     ├── store/
│     │      ├── rootReducer.ts
│     │      └── store.ts
│     │
│     ├── routes/
│     │      ├── AppRoutes.tsx
│     │      ├── ProtectedRoute.tsx
│     │      ├── RoleGuard.tsx
│     │      └── route-types.ts
│     │
│     └── providers/
│            ├── AppProvider.tsx
│ 
├── api/
│     ├── auth.api.ts
│     ├── user.api.ts
│     ├── course.api.ts
│     └── index.ts
│
├── state/
│     ├── reducers/
│     │      ├── auth.slice.ts
│     │      └── user.slice.ts
│     │
│     └── services/
│            ├── axios-instance.ts
│            ├── base-query.ts
│            ├── api-instance.ts
│            └── endpoints/
│                   ├── auth.ts
│                   ├── user.ts
│                   ├── course.ts
│                   └── dashboard.ts
│
├── layouts/
│     ├── super-admin/
│     │      ├── SuperAdminLayout.tsx
│     │      └── index.ts
│     │
│     ├── faculty/
│     │      ├── FacultyLayout.tsx
│     │      └── index.ts
│     │
│     ├── student/
│     │      ├── StudentLayout.tsx
│     │      └── index.ts
│     │
│     └── auth/
│            └── AuthLayout.tsx
│
├── features/
│     ├── super-admin/
│     │      ├── dashboard/
│     │      │      ├── pages/
│     │      │      │      └── Dashboard.page.tsx
│     │      │      ├── components/
│     │      │      │      ├── StatsCard.tsx
│     │      │      │      └── AnalyticsPanel.tsx
│     │      │      ├── hooks/
│     │      │      ├── utils/
│     │      │      ├── types/
│     │      │      ├── validation/
│     │      │      └── index.ts
│     │      │
│     │      ├── users/
│     │      │      ├── pages/
│     │      │      │      └── ManageUsers.page.tsx
│     │      │      ├── components/
│     │      │      │      ├── UserTable.tsx
│     │      │      │      └── UserForm.tsx
│     │      │      ├── hooks/
│     │      │      ├── utils/
│     │      │      ├── types/
│     │      │      ├── validation/
│     │      │      └── index.ts
│     │      │
│     │      └── routes/
│     │             └── admin.routes.tsx
│     │
│     ├── faculty/
│     │      ├── dashboard/
│     │      └── routes/
│     │             └── faculty.routes.tsx
│     │
│     └── student/
│            ├── dashboard/
│            └── routes/
│                   └── student.routes.tsx
│
├── common/
│     ├── ui/
│     │      ├── Button.tsx
│     │      ├── Modal.tsx
│     │      ├── Input.tsx
│     │      └── Select.tsx
│     │
│     ├── loaders/
│     └── Spinner.tsx
│
├── hooks/
│     ├── useAuth.ts
│     ├── useRole.ts
│     └── useDebounce.ts
│
├── utils/
│     ├── date.ts
│     ├── storage.ts
│     ├── permissions.ts
│     └── constants.ts
│
├── types/
│     ├── api.types.ts
│     ├── auth.types.ts
│     └── user.types.ts
│
├── assets/
│     ├── images/
│     ├── icons/
│     └── fonts/
│
└── index.tsx
