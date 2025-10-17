import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const AddClassModal = ({ isOpen, onClose, onSave, classItem, isEditing }) => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    gradeLevel: "",
    teacher: "",
    schedule: "",
    room: "",
    capacity: ""
  });

  useEffect(() => {
    if (isOpen) {
      if (classItem) {
        setFormData({
          name: classItem.name || "",
          subject: classItem.subject || "",
          gradeLevel: classItem.gradeLevel || "",
          teacher: classItem.teacher || "",
          schedule: classItem.schedule || "",
          room: classItem.room || "",
          capacity: classItem.capacity || ""
        });
      } else {
        setFormData({
          name: "",
          subject: "",
          gradeLevel: "",
          teacher: "",
          schedule: "",
          room: "",
          capacity: ""
        });
      }
    }
  }, [isOpen, classItem]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.subject || !formData.teacher) {
      return;
    }
    onSave({
      ...formData,
      gradeLevel: formData.gradeLevel ? parseInt(formData.gradeLevel) : null,
      capacity: formData.capacity ? parseInt(formData.capacity) : null
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-white to-gray-50/50 mx-4">
        <div className="bg-gradient-to-r from-primary/10 to-info/10 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {classItem ? 'Edit Class' : 'Add New Class'}
              </h2>
              <p className="text-gray-600">
                Fill in the class information below
              </p>
            </div>
            <Button onClick={onClose} variant="ghost" size="sm">
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(80vh-200px)] overflow-y-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., 10-A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Mathematics"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Level
                </label>
                <select
                  value={formData.gradeLevel}
                  onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select grade</option>
                  {[9, 10, 11, 12].map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.teacher}
                  onChange={(e) => handleInputChange('teacher', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Ms. Johnson"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule
                </label>
                <input
                  type="text"
                  value={formData.schedule}
                  onChange={(e) => handleInputChange('schedule', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Mon-Fri 9:00 AM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room
                </label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => handleInputChange('room', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Room 101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="30"
                  min="1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="gradient"
            disabled={!formData.name || !formData.subject || !formData.teacher}
          >
            <ApperIcon name="Save" className="h-4 w-4 mr-2" />
            {classItem ? 'Update Class' : 'Add Class'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AddClassModal;