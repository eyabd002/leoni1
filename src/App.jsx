import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import DormsPage from "./pages/DormsPage.jsx";
import MissionsPage from "./pages/MissionsPage.jsx";
import ContractsPage from "./pages/ContractsPage.jsx";
import "./App.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar isOpen={sidebarOpen} />
        <div className="app-main">
          <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
          <div className="app-content">
            <Routes>
              <Route path="/"          element={<HomePage />} />
              <Route path="/dorms"     element={<DormsPage />} />
              <Route path="/missions"  element={<MissionsPage />} />
              <Route path="/contracts" element={<ContractsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}