import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import {
  FolderKanban,
  Lock,
  Mail,
  ArrowRight,
} from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("lead@issueboard.dev");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      // Save the API token before sending the user to protected screens.
      await login({ email, password });
      navigate("/");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface dark:bg-surface-dim relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-primary-fixed/30 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-secondary-container/40 rounded-full blur-3xl opacity-60"></div>
      <main className="w-full max-w-md bg-surface-container-lowest dark:bg-surface-container-high rounded-2xl shadow-xl border border-outline-variant p-8 relative z-10">
        {/* Branding Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/30 mb-3">
            <FolderKanban className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Welcome Back</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Sign in to your IssueTracker workspace
          </p>
        </div>
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p>}
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface placeholder:text-outline text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider">
                Password
              </label>
              <a
                href="#"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface placeholder:text-outline text-sm"
              />
            </div>
          </div>

          {/* remember checkbox */}
          <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-outline-variant text-primary focus:ring-primary/20"
              />
              <span>Remember this device</span>
            </label>
          </div>
          {/* login button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-on-primary font-semibold text-sm rounded-xl shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <span>{isSubmitting ? "Signing In..." : "Sign In"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-outline-variant/60"></div>
          <span className="absolute bg-surface-container-lowest dark:bg-surface-container-high px-3 text-xs text-outline font-medium">
            OR
          </span>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-on-surface-variant mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-primary hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </main>
    </div>
  );
};

export default LoginPage;
