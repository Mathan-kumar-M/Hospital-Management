<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# MediCore - Hospital Management Platform

MediCore is a modern, production-grade hospital management system designed for efficiency, accessibility, and a seamless user experience. Built with a clean **Green Medical Theme**, it provides a comprehensive suite of tools for both patients and healthcare administrators.

View your app in AI Studio: [https://ai.studio/apps/cbe046f2-67f5-41f3-a241-8886acff2e9e](https://ai.studio/apps/cbe046f2-67f5-41f3-a241-8886acff2e9e)

## 🏥 Key Features

### **For Patients**
- **Doctor Discovery:** Browse specialists across various departments (Cardiology, Pediatrics, Neurology, etc.) with detailed profiles and ratings.
- **Smart Appointment Booking:** Real-time slot selection with instant feedback.
- **Personal Dashboard:** Track upcoming appointments, view past medical history, and manage your health profile.
- **Medical Reports:** Securely upload and access medical prescriptions and lab results.
- **Real-time Notifications:** Get instant updates on appointment approvals or status changes.

### **For Administrators**
- **Centralized Control Panel:** Overview of hospital operations with key statistics (Total Patients, Doctors, Appointments).
- **Appointment Management:** Review and approve/reject pending appointment requests with one click.
- **Staff Management:** Add, edit, or remove doctor profiles and manage department information.
- **Patient Records:** Access and manage patient information securely.

## 🛠️ Tech Stack

- **Frontend:** React 18 with Vite
- **Styling:** Tailwind CSS (Utility-first, responsive design)
- **Animations:** Motion (Framer Motion) for smooth UI transitions
- **Icons:** Lucide React
- **Backend & Database:** Firebase (Auth & Firestore)
- **Real-time:** Firestore `onSnapshot` for live data synchronization

## 🚀 Getting Started Locally

**Prerequisites:** Node.js (v18+)

1. **Clone the repository** and navigate to the project folder.
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment Setup:**
   - Create a `.env.local` file.
   - Set your `GEMINI_API_KEY` and Firebase configuration variables as documented in `.env.example`.
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Build for production:**
   ```bash
   npm run build
   ```

## 🔐 Security & Permissions

- **Role-Based Access Control (RBAC):** Secure Firestore rules ensure patients can only access their own data, while administrators have full operational oversight.
- **Authentication:** Secure Google Login integration via Firebase Auth.
- **Data Integrity:** Strict validation for all medical records and appointment bookings.

---

*Developed with ❤️ for modern healthcare.*
