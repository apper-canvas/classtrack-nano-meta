import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const AddGradeModal = ({ isOpen, onClose, onSave, grade, students, isEditing }) => {
  const [formData, setFormData] = useState({
    studentId: "",
    subject: "",
    assignment: "",
    score: "",
    maxScore: "",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (isOpen) {
      if (grade) {
        setFormData({
          studentId: grade.studentId || "",
          subject: grade.subject || "",
          assignment: grade.assignment || "",
          score: grade.score || "",
          maxScore: grade.maxScore || "",
          date: grade.date ? new Date(grade.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
      } else {
        setFormData({
          studentId: "",
          subject: "",
          assignment: "",
          score: "",
          maxScore: "",
          date: new Date().toISOString().split('T')[0]
        });
      }
    }
  }, [isOpen, grade]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.studentId || !formData.subject || !formData.assignment || !formData.score || !formData.maxScore) {
      return;
    }
    onSave({
      ...formData,
      studentId: parseInt(formData.studentId),
      score: parseFloat(formData.score),
      maxScore: parseFloat(formData.maxScore)
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
                {grade ? 'Edit Grade' : 'Add New Grade'}
              </h2>
              <p className="text-gray-600">
                Fill in the grade information below
              </p>
            </div>
            <Button onClick={onClose} variant="ghost" size="sm">
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(80vh-200px)] overflow-y-auto">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student <span className="text-error">*</span>
              </label>
              <select
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select student</option>
                {students.map(student => (
                  <option key={student.Id} value={student.Id}>
                    {student.firstName} {student.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.assignment}
                  onChange={(e) => handleInputChange('assignment', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Final Exam"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Score <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  value={formData.score}
                  onChange={(e) => handleInputChange('score', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="85"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Score <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  value={formData.maxScore}
                  onChange={(e) => handleInputChange('maxScore', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="100"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-error">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
            disabled={!formData.studentId || !formData.subject || !formData.assignment || !formData.score || !formData.maxScore}
          >
            <ApperIcon name="Save" className="h-4 w-4 mr-2" />
            {grade ? 'Update Grade' : 'Add Grade'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AddGradeModal;