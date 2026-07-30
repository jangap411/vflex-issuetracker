import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SidebarNav from "./components/SidebarNav";
import TopAppBar from "./components/TopAppBar";
import BoardPage from "./pages/BoardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { getSession } from "./services/auth";

const App = () => {
  const [session, setSession] = useState(() => getSession());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [defaultColumnForCreate, setDefaultColumnForCreate] = useState("todo");

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleOpenCreateTask = (columnId = "todo") => {
    setDefaultColumnForCreate(typeof columnId === "string" ? columnId : "todo");
    setIsCreateModalOpen(true);
  };

  return (
    <Router>
      <Routes>
        {/* Auth Pages without App Shell */}
        <Route
          path="/login"
          element={
            session ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage onAuthenticated={setSession} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            session ? (
              <Navigate to="/" replace />
            ) : (
              <SignupPage onAuthenticated={setSession} />
            )
          }
        />

        {/* Main Application Shell */}
        <Route
          path="*"
          element={
            session ? (
              <div className="min-h-screen bg-surface text-on-surface flex">
                {/* Sidebar Navigation */}
                <SidebarNav
                  isOpen={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
                  onLogout={() => setSession(null)}
                  user={session.user}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
                  <TopAppBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onOpenCreateTask={handleOpenCreateTask}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                  />

                  <main className="flex-1 overflow-x-hidden">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <BoardPage
                            searchQuery={searchQuery}
                            onOpenCreateTask={handleOpenCreateTask}
                            isCreateModalOpen={isCreateModalOpen}
                            setIsCreateModalOpen={setIsCreateModalOpen}
                            defaultColumnForCreate={defaultColumnForCreate}
                          />
                        }
                      />
                      <Route
                        path="/tasks"
                        element={
                          <BoardPage
                            searchQuery={searchQuery}
                            onOpenCreateTask={handleOpenCreateTask}
                            isCreateModalOpen={isCreateModalOpen}
                            setIsCreateModalOpen={setIsCreateModalOpen}
                            defaultColumnForCreate={defaultColumnForCreate}
                          />
                        }
                      />
                      <Route
                        path="/analytics"
                        element={
                          <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-on-primary mb-3"></div>
                            <h1 className="text-2xl font-bold text-on-surface">
                              Analytics coming soon
                            </h1>
                          </div>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-on-primary mb-3"></div>
                            <h1 className="text-2xl font-bold text-on-surface">
                              Settings coming soon
                            </h1>
                          </div>
                        }
                      />
                    </Routes>
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
