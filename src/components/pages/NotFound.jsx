import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center bg-gradient-to-br from-white to-gray-50/50">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-info/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="AlertTriangle" className="h-10 w-10 text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8">
          Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/")}
            variant="gradient"
            className="w-full"
          >
            <ApperIcon name="Home" className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <Button 
            onClick={() => navigate(-1)}
            variant="ghost"
            className="w-full"
          >
            <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Need help finding what you're looking for?
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <button 
              onClick={() => navigate("/students")}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Students
            </button>
            <button 
              onClick={() => navigate("/grades")}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Grades
            </button>
            <button 
              onClick={() => navigate("/attendance")}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Attendance
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;