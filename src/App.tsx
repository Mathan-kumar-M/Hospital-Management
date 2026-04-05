import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { FirebaseProvider, useAuth } from "./components/FirebaseProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import { seedDatabase } from "./services/seedService";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

// Pages
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import Departments from "./pages/Departments";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" />;

  return <>{children}</>;
};

const AutoSeed: React.FC = () => {
  const { isAdmin, loading } = useAuth();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (loading || !isAdmin || hasChecked) return;

    const unsubscribe = onSnapshot(collection(db, "departments"), (snapshot) => {
      if (snapshot.empty) {
        console.log("Database empty, auto-seeding...");
        seedDatabase();
      }
      setHasChecked(true);
      unsubscribe();
    });

    return () => unsubscribe();
  }, [isAdmin, loading, hasChecked]);

  return null;
};

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <Router>
          <AutoSeed />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctors/:id" element={<DoctorProfile />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
