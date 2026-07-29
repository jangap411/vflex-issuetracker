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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Main Application Shell */}
        <Route
          path="*"
          element={
            getSession() ? (
              <div className="min-h-screen bg-surface text-on-surface flex">
                {/* Sidebar Navigation */}
                <SidebarNav
                  isOpen={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
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
                          <h1 className="text-2xl font-bold text-on-surface">
                            Analytics page coming soon
                          </h1>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <h1 className="text-2xl font-bold text-on-surface">
                            Settings page coming soon
                          </h1>
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
