import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-64">
          <Sidebar />
        </div>
        
        {/* Mobile Sidebar Overlay */}
        <div className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}>
          <div 
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className={`absolute left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}>
            <Sidebar onCloseSidebar={() => setSidebarOpen(false)} />
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="pt-16 lg:pt-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;