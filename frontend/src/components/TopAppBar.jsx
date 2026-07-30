import { useEffect, useRef } from "react";
import { Menu, Search, Plus, Bell, Sun, Moon, Sparkles, X } from "lucide-react";

const TopAppBar = ({
  searchQuery,
  setSearchQuery,
  onOpenCreateTask,
  onToggleSidebar,
  isDarkMode,
  setIsDarkMode,
}) => {
  const searchInputRef = useRef(null);

  useEffect(() => {
    const focusSearch = (event) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  return (
    <header className="sticky top-0 z-20 h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant px-4 lg:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          aria-label="Open Sidebar Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issues by title, tag, or assignee (Press '/' to focus)..."
            aria-label="Search issues"
            className="w-full pl-10 pr-10 py-2 text-sm rounded-xl bg-surface-container/60 border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-outline hover:bg-surface-container hover:text-on-surface"
              aria-label="Clear issue search"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary ring-2 ring-surface"></span>
          </button>
        </div>

        {/* AI Helper Badge */}
        <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary-fixed hover:bg-primary-fixed-dim rounded-xl transition-colors">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vflex AI Assist</span>
        </button>

        {/* Primary Create Task Button */}
        <button
          onClick={onOpenCreateTask}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-on-primary bg-primary hover:bg-primary/90 rounded-xl shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>
    </header>
  );
};

export default TopAppBar;
