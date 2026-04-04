# MediCore - Hospital Management Platform Guidelines

This document outlines the core principles, design patterns, and operational rules for the MediCore application.

## 🎨 Design Philosophy
- **Theme:** Clean, modern **Green Medical Theme**.
- **Colors:** Primary: `green-600`, Secondary: `slate-900`, Background: `slate-50`.
- **Typography:** Sans-serif (Inter/Outfit) for clarity and professionalism.
- **UI Components:** Use rounded corners (`rounded-2xl`, `rounded-[3rem]`) and soft shadows (`shadow-xl shadow-slate-200/50`) for a friendly, modern feel.
- **Icons:** Always use `lucide-react`.

## 🏗️ Architecture & State
- **Frontend:** React with functional components and hooks.
- **Backend:** Firebase (Auth & Firestore).
- **Real-time:** Use `onSnapshot` for all critical data (appointments, reports, doctors).
- **Authentication:** Google Login only.

## 🔐 Role-Based Access Control (RBAC)
- **Patient:** Can book appointments, view their own reports, and manage their profile.
- **Admin:** Full access to manage doctors, departments, and approve/reject appointments.
- **Default Admin:** `kumarmathan2206@gmail.com`.

## 📅 Appointment Flow
1. **Booking:** Patient selects a doctor, date, and slot.
2. **Pending State:** Status is set to `pending`. Success message: **"Appointment accepted, wait for approval."**
3. **Approval:** Admin reviews pending requests in the Admin Dashboard and approves (`confirmed`) or rejects (`cancelled`).
4. **Feedback:** Patient sees status updates in real-time on their dashboard.

## 📂 Data Structure (Firestore)
- `/users/{uid}`: Profile information and roles.
- `/doctors/{doctorId}`: Specialist profiles and availability.
- `/departments/{deptId}`: Hospital departments.
- `/appointments/{appId}`: Booking records.
- `/reports/{reportId}`: Patient medical records.

## 🧪 Development Rules
- **Seed Data:** Use `seedDatabase()` in `seedService.ts` to populate initial data.
- **Error Handling:** Use `handleFirestoreError` for all Firestore operations to ensure proper logging and system diagnosis.
- **Permissions:** Always verify `isAdmin` before allowing access to `/admin` routes.
