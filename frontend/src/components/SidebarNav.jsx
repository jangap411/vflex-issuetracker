import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  FolderKanban,
} from "lucide-react";
import { logout } from "../services/auth";

const SidebarNav = ({ isOpen, onClose, onLogout, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const displayName = user?.fullName || user?.name || "User";
  const displayDetail = user?.role || user?.email || "Member";
  const initials = displayName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const navItems = [
    { label: "Kanban Board", path: "/", icon: LayoutDashboard },
    { label: "All Issues", path: "/tasks", icon: CheckSquare },
    { label: "Analytics", path: "/analytics", icon: BarChart3 },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    onLogout();
    onClose();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
        fixed top-0 left-0 z-40 h-full w-64 flex flex-col p-4 bg-surface-container-low dark:bg-surface-dim 
        border-r border-outline-variant transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Brand Header */}
        <div className="mb-6 flex items-center gap-3 px-2">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <FolderKanban className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-on-surface">
                IssueTracker
              </h1>
              <p className="text-xs text-on-surface-variant">
                Modern Board v2.4
              </p>
            </div>
          </Link>
        </div>

        {/* Workspace Selector */}
        <div className="mb-6 px-2">
          <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/60 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-semibold text-on-surface">
                {user?.workspaceName || "Workspace"}
              </span>
            </div>
            <span className="material-symbols-outlined text-sm text-on-surface-variant">
              unfold_more
            </span>
          </div>
        </div>

        {/* Primary Navigation */}
        <div className="flex-1 space-y-1">
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-outline">
            Core Apps
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-primary text-on-primary shadow-sm shadow-primary/20"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="px-3 mt-6 mb-2 text-[11px] font-bold uppercase tracking-wider text-outline">
            Authentication
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-on-surface-variant transition-all hover:bg-surface-container hover:text-on-surface"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>

        {/* User Footer Profile */}
        <div className="pt-4 border-t border-outline-variant/60">
          <div className="p-2.5 rounded-xl bg-surface-container/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${displayName}'s avatar`}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary ring-2 ring-primary/20">
                  {initials}
                </div>
              )}
              <div className="text-left">
                <p className="text-xs font-semibold text-on-surface leading-tight">
                  {displayName}
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  {displayDetail}
                </p>
              </div>
            </div>
            <button className="text-on-surface-variant hover:text-primary p-1 rounded-lg">
              <Shield className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarNav;
