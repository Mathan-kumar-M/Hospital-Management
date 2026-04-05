import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope, Home, ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-3xl flex items-center justify-center text-green-600 mb-8 animate-bounce">
        <Stethoscope className="w-12 h-12" />
      </div>
      
      <h1 className="text-6xl font-bold text-slate-900 mb-4 tracking-tight">404</h1>
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">Page Not Found</h2>
      
      <p className="text-slate-600 max-w-md mb-10 leading-relaxed">
        Oops! It seems the page you are looking for has been moved or doesn't exist. 
        Let's get you back to safety.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 transition-all"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
