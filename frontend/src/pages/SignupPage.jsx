import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/auth";
import {
  FolderKanban,
  User,
  Mail,
  Lock,
  Users,
  ArrowRight,
} from "lucide-react";

const SignupPage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex@issueboard.dev");
  const [password, setPassword] = useState("password123");
  const [teamName, setTeamName] = useState("Engineering Team");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await register({ fullName, email, password });
      navigate("/");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface dark:bg-surface-dim relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-primary-fixed/30 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-tertiary-fixed/30 rounded-full blur-3xl opacity-60"></div>

      {/* main */}
      <main className="w-full max-w-md bg-surface-container-lowest dark:bg-surface-container-high rounded-2xl shadow-xl border border-outline-variant p-8 relative z-10">
        {/* Branding Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/30 mb-3">
            <FolderKanban className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface">
            Create Your Account
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Get started with modern issue tracking
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p>}
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface text-sm"
              />
            </div>
          </div>

          {/* Work space */}

          <div>
            <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider mb-1.5">
              Team / Workspace Name
            </label>
            <div className="relative">
              <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Engineering Team"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-on-surface uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Must be at least 8 chars"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface text-sm"
              />
            </div>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-on-primary font-semibold text-sm rounded-xl shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <span>{isSubmitting ? "Creating..." : "Create Workspace"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-on-surface-variant mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>
      </main>
    </div>
  );
};

export default SignupPage;
