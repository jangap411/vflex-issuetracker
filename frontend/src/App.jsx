import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidebarNav from "./components/SidebarNav";
import TopAppBar from "./components/TopAppBar";
import BoardPage from "./pages/BoardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [defaultColumnForCreate, setDefaultColumnForCreate] =
    useState("backlog");

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleOpenCreateTask = (columnId = "backlog") => {
    setDefaultColumnForCreate(
      typeof columnId === "string" ? columnId : "backlog",
    );
    setIsCreateModalOpen(true);
  };

  return (
    <>
      <Router>
        <Routes>
          {/* Auth Page */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Main Page */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-surface text-on-surface flex">
                {/* Side Nav */}
                <SidebarNav />

                {/* top nav */}
                <TopAppBar />

                {/* Main Content area*/}
                <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
                  <main className="flex-1 overflow-x-hidden">
                    <Routes>
                      <Route path="/" element={<BoardPage />} />
                      <Route path="/tasks" element={<BoardPage />} />
                    </Routes>
                  </main>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
