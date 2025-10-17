import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <Button
            onClick={onToggleSidebar}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              ClassTrack
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2">
            <ApperIcon name="Bell" className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <ApperIcon name="Settings" className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;