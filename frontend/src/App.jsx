import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BoardPage from "./pages/BoardPage";
import SidebarNav from "./components/SidebarNav";
import TopAppBar from "./components/TopAppBar";

function App() {
  const [count, setCount] = useState(0);

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
}

export default App;
