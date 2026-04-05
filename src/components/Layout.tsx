import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./FirebaseProvider";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Stethoscope, User as UserIcon, LogOut, Menu, X, ShieldCheck } from "lucide-react";
import { cn } from "../lib/utils";
import AIAssistant from "./AIAssistant";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Departments", path: "/departments" },
    { name: "Doctors", path: "/doctors" },
  ];

  if (user) {
    navLinks.push({ name: "My Dashboard", path: "/dashboard" });
    if (isAdmin) {
      navLinks.push({ name: "Admin Panel", path: "/admin" });
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold text-slate-900 tracking-tight">
                  Maddy <span className="text-green-600">Medicore</span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-slate-600 hover:text-green-600 font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              {!loading && (
                user ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                      <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 overflow-hidden">
                        {user.photo ? (
                          <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="w-5 h-5" />
                        )}
                      </div>
                      <span className="text-sm font-semibold text-green-800">{user.name.split(' ')[0]}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/login"
                      className="text-slate-600 hover:text-green-600 font-medium px-4 py-2"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 transition-all"
                    >
                      Sign Up
                    </Link>
                  </div>
                )
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-green-100 animate-in slide-in-from-top duration-300">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {!loading && !user && (
                <div className="pt-4 grid grid-cols-2 gap-4">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex justify-center items-center px-4 py-3 text-base font-medium text-slate-600 bg-slate-50 rounded-xl"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex justify-center items-center px-4 py-3 text-base font-medium text-white bg-green-600 rounded-xl shadow-lg shadow-green-100"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <AIAssistant />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Maddy <span className="text-green-500">Medicore</span>
                </span>
              </Link>
              <p className="text-slate-400 leading-relaxed mb-6">
                Providing world-class healthcare with compassion and innovation. Your health is our priority.
              </p>
              <div className="flex space-x-4">
                {/* Social icons could go here */}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li><Link to="/departments" className="hover:text-green-500 transition-colors">Departments</Link></li>
                <li><Link to="/doctors" className="hover:text-green-500 transition-colors">Find a Doctor</Link></li>
                <li><Link to="/signup" className="hover:text-green-500 transition-colors">Book Appointment</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-6">Departments</h3>
              <ul className="space-y-4">
                <li><Link to="/departments" className="hover:text-green-500 transition-colors">Cardiology</Link></li>
                <li><Link to="/departments" className="hover:text-green-500 transition-colors">Neurology</Link></li>
                <li><Link to="/departments" className="hover:text-green-500 transition-colors">Orthopedics</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-6">Contact Us</h3>
              <ul className="space-y-4 text-slate-400">
                <li>123 Medical Plaza, Health City</li>
                <li>+1 (555) 000-1234</li>
                <li>contact@medicore.com</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Maddy Medicore. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-slate-300">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
