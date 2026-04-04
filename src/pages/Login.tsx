import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Stethoscope, Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        const isAdminEmail = user.email?.toLowerCase() === "kumarmathan2206@gmail.com";
        // Create new user profile
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: user.displayName || "New User",
          email: user.email,
          role: isAdminEmail ? "admin" : "patient",
          photo: user.photoURL,
          createdAt: new Date()
        });
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-green-200">
              <Stethoscope className="w-7 h-7" />
            </div>
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              Medi<span className="text-green-600">Core</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500">Enter your credentials to access your account</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 p-10 border border-slate-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-start space-x-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-2xl transition-all outline-none text-slate-900 font-medium"
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <Link to="#" className="text-xs font-bold text-green-600 hover:text-green-700">Forgot Password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  {...register("password")}
                  type="password"
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-2xl transition-all outline-none text-slate-900 font-medium"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500 ml-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-200 hover:bg-green-700 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center space-x-3"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            <span>Sign in with Google</span>
          </button>

          <p className="mt-10 text-center text-slate-500 font-medium">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-600 font-bold hover:text-green-700">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
