import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const StudentCard = ({ student, onViewDetails }) => {
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "active": return "success";
      case "inactive": return "error";
      case "at risk": return "warning";
      default: return "default";
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50/50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Avatar
            src={student.photo}
            alt={`${student.firstName} ${student.lastName}`}
            size="lg"
          />
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-gray-600 text-sm">
              Grade {student.gradeLevel} • {student.class}
            </p>
          </div>
        </div>
        <Badge variant={getStatusVariant(student.status)}>
          {student.status}
        </Badge>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Mail" className="h-4 w-4 mr-2 text-gray-400" />
          {student.email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Phone" className="h-4 w-4 mr-2 text-gray-400" />
          {student.phone}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Calendar" className="h-4 w-4 mr-2 text-gray-400" />
          Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Parent:</span> {student.parentContact.name}
        </div>
        <Button
          onClick={() => onViewDetails(student)}
          size="sm"
          variant="gradient"
        >
          <ApperIcon name="Eye" className="h-4 w-4 mr-1" />
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default StudentCard;