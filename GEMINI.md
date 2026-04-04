# MediCore - Hospital Management Project Context

This document provides context for the Gemini model to understand the MediCore application.

## 🏥 Project Overview
MediCore is a comprehensive hospital management system featuring appointment booking, patient dashboards, and admin management with a modern green medical theme.

## 🎯 Target Audience
- **Patients:** Seeking medical care, booking appointments, and managing their health records.
- **Administrators:** Managing hospital operations, staff, and patient requests.

## 🛠️ Core Technologies
- React 18, Vite, Tailwind CSS, Motion.
- Firebase Authentication, Firestore Database.
- Lucide-React for iconography.

## 🔑 Key Workflows
- **Patient Onboarding:** Google Login -> Patient Dashboard.
- **Doctor Discovery:** Browse by department -> View Doctor Profile -> Book Slot.
- **Admin Oversight:** Admin Dashboard -> Pending Approvals -> Approve/Reject.
- **Medical Records:** Upload/Download reports securely.

## 🎨 Design Language
- **Primary Color:** `green-600` (Medical Green).
- **Secondary Color:** `slate-900` (Professional Navy).
- **Background:** `slate-50` (Clean/Clinical).
- **Feel:** Modern, trustworthy, accessible, and efficient.

## 📂 Project Structure
- `/src/pages/`: Main application views (Dashboard, AdminDashboard, DoctorProfile, etc.).
- `/src/components/`: Reusable UI components (FirebaseProvider, Navbar, etc.).
- `/src/services/`: Backend logic (seedService, etc.).
- `/src/types.ts`: Global TypeScript definitions.
- `/firestore.rules`: Security rules for data protection.

## 📜 Operational Rules
- **Appointment Status:** `pending` -> `confirmed` or `cancelled`.
- **Success Message:** "Appointment accepted, wait for approval."
- **Admin Role:** Hardcoded for `kumarmathan2206@gmail.com`.
