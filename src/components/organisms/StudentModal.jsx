import React, { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Label from "@/components/atoms/Label";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Avatar from "@/components/atoms/Avatar";
import Grades from "@/components/pages/Grades";
import Attendance from "@/components/pages/Attendance";

const StudentModal = ({ student, isOpen, onClose, onSave, onEdit, isEditing: isEditingProp, grades = [], attendance = [] }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(isEditingProp || false);
const [formData, setFormData] = useState({
    first_name_c: '',
    last_name_c: '',
    email_c: '',
    phone_c: '',
    grade_level_c: '',
    class_c: '',
    status_c: 'Active',
    maths_marks_c: '',
    photo_c: '',
    parent_contact_name_c: '',
    parent_contact_phone_c: '',
    parent_contact_email_c: ''
  });
  const [errors, setErrors] = useState({});
const [imagePreview, setImagePreview] = useState(student?.photo_c || '');
  // Initialize form data when modal opens or student changes
React.useEffect(() => {
    if (isOpen) {
      setIsEditing(isEditingProp || false);
      if (student) {
        setFormData({
          first_name_c: student.first_name_c || '',
          last_name_c: student.last_name_c || '',
          email_c: student.email_c || '',
          phone_c: student.phone_c || '',
          grade_level_c: student.grade_level_c || '',
          class_c: student.class_c || '',
          status_c: student.status_c || 'Active',
          photo_c: student.photo_c || '',
          maths_marks_c: student.maths_marks_c || '',
          parent_contact_name_c: student.parent_contact_name_c || '',
          parent_contact_phone_c: student.parent_contact_phone_c || '',
          parent_contact_email_c: student.parent_contact_email_c || ''
        });
      } else {
        setFormData({
          first_name_c: '',
          last_name_c: '',
          email_c: '',
          phone_c: '',
          grade_level_c: '',
          maths_marks_c: '',
          class_c: '',
          status_c: 'Active',
          photo_c: '',
          parent_contact_name_c: '',
          parent_contact_phone_c: '',
          parent_contact_email_c: ''
        });
      }
    }
  }, [isOpen, student, isEditingProp]);

const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

const handleSave = () => {
    if (!formData.first_name_c || !formData.last_name_c || !formData.email_c) {
      return;
    }
    onSave(formData);
  };

  const handleCancel = () => {
    if (student) {
      setIsEditing(false);
    } else {
      onClose();
}
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'secondary';
      case 'At Risk':
        return 'error';
      default:
        return 'default';
    }
  };

const calculateGPA = () => {
    if (!grades || grades.length === 0) return 'N/A';
    const totalPercentage = grades.reduce((sum, grade) => {
      return sum + ((grade.score_c / grade.max_score_c) * 100);
    }, 0);
    const avgPercentage = totalPercentage / grades.length;
    const gpa = (avgPercentage / 100) * 4;
    return gpa.toFixed(2);
  };

const calculateAttendanceRate = () => {
    if (!attendance || attendance.length === 0) return 'N/A';
    const presentCount = attendance.filter(record => 
      record.status_c?.toLowerCase() === 'present'
    ).length;
    const rate = (presentCount / attendance.length) * 100;
    return `${rate.toFixed(1)}%`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-white to-gray-50/50 mx-4">
        {/* Header */}
<div className="bg-gradient-to-r from-primary/10 to-info/10 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {student && !isEditing && (
                <>
                  <Avatar
src={student.photo_c}
                    alt={`${student.first_name_c} ${student.last_name_c}`}
                    size="xl"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {student.first_name_c} {student.last_name_c}
                    </h2>
                    <p className="text-gray-600">
                      Grade {student.grade_level_c} • {student.class_c}
                    </p>
                    <Badge variant={getStatusVariant(student.status_c)} className="mt-2">
                      {student.status_c}
                    </Badge>
                  </div>
                </>
              )}
              {isEditing && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {student ? 'Edit Student' : 'Add New Student'}
                  </h2>
                  <p className="text-gray-600">
                    Fill in the student information below
                  </p>
                </div>
              )}
            </div>
            <Button onClick={onClose} variant="ghost" size="sm">
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex px-6">
            {[
              { id: "profile", label: "Profile", icon: "User" },
              { id: "grades", label: "Grades", icon: "BookOpen" },
              { id: "attendance", label: "Attendance", icon: "Calendar" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                <ApperIcon name={tab.icon} className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
<div className="p-6 max-h-[calc(80vh-200px)] overflow-y-auto">
{activeTab === "profile" && (
            <div className="space-y-6">
              {!isEditing && student ? (
                <>
                  <div className="flex justify-end mb-4">
                    <Button onClick={() => { setIsEditing(true); if (onEdit) onEdit(); }} variant="outline" size="sm">
                      <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
                      Edit Student
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Contact Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <ApperIcon name="Mail" className="h-4 w-4 text-gray-400 mr-3" />
<span className="text-gray-600">{student.email_c}</span>
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="Phone" className="h-4 w-4 text-gray-400 mr-3" />
                          <span className="text-gray-600">{student.phone_c}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Parent/Guardian
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
<ApperIcon name="User" className="h-4 w-4 text-gray-400 mr-3" />
                          <span className="text-gray-600">{student.parent_contact_name_c}</span>
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="Phone" className="h-4 w-4 text-gray-400 mr-3" />
                          <span className="text-gray-600">{student.parent_contact_phone_c}</span>
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="Mail" className="h-4 w-4 text-gray-400 mr-3" />
                          <span className="text-gray-600">{student.parent_contact_email_c}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Academic Summary
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card className="p-4 text-center bg-gradient-to-br from-primary/5 to-info/5">
                        <p className="text-2xl font-bold text-primary">{calculateGPA()}</p>
                        <p className="text-sm text-gray-600">Current GPA</p>
                      </Card>
                      <Card className="p-4 text-center bg-gradient-to-br from-success/5 to-primary/5">
                        <p className="text-2xl font-bold text-success">{calculateAttendanceRate()}</p>
                        <p className="text-sm text-gray-600">Attendance Rate</p>
                      </Card>
                      <Card className="p-4 text-center bg-gradient-to-br from-warning/5 to-error/5">
                        <p className="text-2xl font-bold text-warning">{grades.length}</p>
                        <p className="text-sm text-gray-600">Total Assignments</p>
                      </Card>
                    </div>
                  </div>
                </>
) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
value={formData.first_name_c}
                        onChange={(e) => handleInputChange('first_name_c', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.last_name_c}
                        onChange={(e) => handleInputChange('last_name_c', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-error">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email_c}
                        onChange={(e) => handleInputChange('email_c', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="student@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone_c}
                        onChange={(e) => handleInputChange('phone_c', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grade Level
                      </label>
                      <select
                        value={formData.grade_level_c}
                        onChange={(e) => handleInputChange('grade_level_c', e.target.value)}
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
                        Class
                      </label>
                      <input
                        type="text"
                        value={formData.class_c}
                        onChange={(e) => handleInputChange('class_c', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="10-A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status_c}
                        onChange={(e) => handleInputChange('status_c', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="At Risk">At Risk</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="mathsMarks">Maths Marks</Label>
                    <Input
                      id="mathsMarks"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.maths_marks_c}
                      onChange={(e) => handleInputChange('maths_marks_c', e.target.value)}
                      placeholder="Enter maths marks (0-100)"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Parent/Guardian Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Parent Name
                        </label>
                        <input
                          type="text"
                          value={formData.parent_contact_name_c}
                          onChange={(e) => handleInputChange('parent_contact_name_c', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Parent full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Parent Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.parent_contact_phone_c}
                          onChange={(e) => handleInputChange('parent_contact_phone_c', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="(555) 987-6543"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Parent Email
                        </label>
                        <input
                          type="email"
                          value={formData.parent_contact_email_c}
                          onChange={(e) => handleInputChange('parent_contact_email_c', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="parent@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {isEditing && (
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
variant="gradient"
                disabled={!formData.first_name_c || !formData.last_name_c || !formData.email_c}
              >
                <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                {student ? 'Update Student' : 'Add Student'}
              </Button>
            </div>
          )}

          {activeTab === "grades" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Grades
              </h3>
              {grades.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-3 border-b font-semibold text-gray-700">Subject</th>
                        <th className="text-left p-3 border-b font-semibold text-gray-700">Assignment</th>
                        <th className="text-center p-3 border-b font-semibold text-gray-700">Score</th>
                        <th className="text-center p-3 border-b font-semibold text-gray-700">Grade</th>
                        <th className="text-left p-3 border-b font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
{grades.map((grade) => {
                        const percentage = Math.round((grade.score_c / grade.max_score_c) * 100);
                        const letterGrade = percentage >= 90 ? "A" : percentage >= 80 ? "B" : percentage >= 70 ? "C" : percentage >= 60 ? "D" : "F";
                        const gradeColor = percentage >= 90 ? "text-success" : percentage >= 70 ? "text-warning" : "text-error";
                        
                        return (
                          <tr key={grade.Id} className="hover:bg-gray-50">
                            <td className="p-3 border-b">{grade.subject_c}</td>
                            <td className="p-3 border-b">{grade.assignment_c}</td>
                            <td className="p-3 border-b text-center">{grade.score_c}/{grade.max_score_c}</td>
                            <td className={`p-3 border-b text-center font-semibold ${gradeColor}`}>
                              {letterGrade} ({percentage}%)
                            </td>
                            <td className="p-3 border-b text-gray-600">
                              {new Date(grade.date_c).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No grades recorded yet.</p>
              )}
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Attendance History
              </h3>
              {attendance.length > 0 ? (
                <div className="space-y-2">
{attendance.slice(-10).reverse().map((record) => (
                    <div key={record.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Calendar" className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {new Date(record.date_c).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={record.status_c?.toLowerCase()}>
                          {record.status_c}
                        </Badge>
                        {record.notes_c && (
                          <span className="text-sm text-gray-600">
                            {record.notes_c}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No attendance records yet.</p>
              )}
</div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StudentModal;