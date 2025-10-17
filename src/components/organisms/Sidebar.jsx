import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ onCloseSidebar }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Grades", href: "/grades", icon: "BookOpen" },
    { name: "Attendance", href: "/attendance", icon: "Calendar" },
    { name: "Classes", href: "/classes", icon: "School" },
  ];

  return (
    <aside className="h-screen bg-gradient-to-b from-white to-gray-50/50 border-r border-gray-200 shadow-lg backdrop-blur-md">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center space-x-3 px-6 py-6 border-b border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-info rounded-xl flex items-center justify-center shadow-lg">
            <ApperIcon name="GraduationCap" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              ClassTrack
            </h1>
            <p className="text-xs text-gray-500">Student Management</p>
          </div>
          {onCloseSidebar && (
            <button
              onClick={onCloseSidebar}
              className="lg:hidden ml-auto p-1 hover:bg-gray-100 rounded"
            >
              <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onCloseSidebar}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-[1.02]",
                  isActive
                    ? "bg-gradient-to-r from-primary to-info text-white shadow-lg"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-primary/10 hover:to-info/10 hover:shadow-md"
                )
              }
            >
              <ApperIcon name={item.icon} className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Ms. Johnson</p>
              <p className="text-xs text-gray-500">Mathematics Teacher</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;