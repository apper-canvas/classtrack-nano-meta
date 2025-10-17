import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createGrade, deleteGrade, getGrades, updateGrade } from "@/services/api/grades";
import { getStudents } from "@/services/api/students";
import ApperIcon from "@/components/ApperIcon";
import AddGradeModal from "@/components/organisms/GradeModal";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const Grades = () => {
const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [gradesData, studentsData] = await Promise.all([
        getGrades(),
        getStudents()
      ]);
      
      setGrades(gradesData);
      setStudents(studentsData);
    } catch (err) {
      setError("Failed to load grades");
    } finally {
      setLoading(false);
    }
};

  const handleAddGrade = () => {
    setEditingGrade(null);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveGrade = async (gradeData) => {
    try {
      setLoading(true);
      if (editingGrade) {
        await updateGrade(editingGrade.Id, gradeData);
        setGrades(prev => prev.map(g => g.Id === editingGrade.Id ? { ...g, ...gradeData } : g));
        toast.success("Grade updated successfully");
      } else {
        const newGrade = await createGrade(gradeData);
        setGrades(prev => [...prev, newGrade]);
        toast.success("Grade added successfully");
      }
      setIsModalOpen(false);
      setEditingGrade(null);
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || "Failed to save grade");
    } finally {
      setLoading(false);
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "Unknown Student";
  };

  const getStudent = (studentId) => {
    return students.find(s => s.Id === studentId);
  };

  const subjects = [...new Set(grades.map(grade => grade.subject))];

  const filteredGrades = grades.filter(grade => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const studentName = getStudentName(grade.studentId).toLowerCase();
      const assignment = grade.assignment.toLowerCase();
      if (!studentName.includes(query) && !assignment.includes(query) && !grade.subject.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Subject filter
    if (selectedSubject && grade.subject !== selectedSubject) {
      return false;
    }

    return true;
  });

  const getGradeColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return "text-success";
    if (percentage >= 70) return "text-warning";
    return "text-error";
  };

  const getLetterGrade = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <Loading type="table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadGrades} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Grades
          </h1>
          <p className="text-gray-600">
            Manage and track student grades and assignments
          </p>
        </div>
<Button variant="gradient" className="w-fit" onClick={handleAddGrade}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Grade
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, assignment, or subject..."
            className="flex-1 max-w-md"
          />
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Subject:
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="h-10 px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[150px]"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {(searchQuery || selectedSubject) && (
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedSubject("");
              }}
              variant="ghost"
              size="sm"
            >
              <ApperIcon name="X" className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredGrades.length} of {grades.length} grades
        </p>
      </div>

      {/* Grades Table */}
      {filteredGrades.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Student</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Subject</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Assignment</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Score</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Grade</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                  <th className="text-right p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((grade) => {
                  const student = getStudent(grade.studentId);
                  const percentage = Math.round((grade.score / grade.maxScore) * 100);
                  const letterGrade = getLetterGrade(grade.score, grade.maxScore);
                  const gradeColor = getGradeColor(grade.score, grade.maxScore);
                  
                  return (
                    <tr key={grade.Id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {student && (
                            <Avatar
                              src={student.photo}
                              alt={getStudentName(grade.studentId)}
                              size="sm"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {getStudentName(grade.studentId)}
                            </p>
                            {student && (
                              <p className="text-xs text-gray-600">
                                Grade {student.gradeLevel}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="info" className="text-xs">
                          {grade.subject}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-900">{grade.assignment}</p>
                      </td>
                      <td className="p-4 text-center">
                        <p className="font-medium text-gray-900">
                          {grade.score}/{grade.maxScore}
                        </p>
                        <p className="text-xs text-gray-600">
                          {percentage}%
                        </p>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-lg font-bold ${gradeColor}`}>
                          {letterGrade}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge variant="default" className="text-xs">
                          {grade.category}
                        </Badge>
                      </td>
                      <td className="p-4 text-gray-600">
                        {new Date(grade.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <ApperIcon name="Edit" className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ApperIcon name="Trash2" className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
) : (
        <Empty
          title="No grades found"
          message={searchQuery || selectedSubject 
            ? "Try adjusting your search or filters" 
            : "Get started by adding your first grade entry"
          }
          actionLabel="Add Grade"
          icon="BookOpen"
        />
      )}

      <AddGradeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGrade(null);
          setIsEditing(false);
        }}
        onSave={handleSaveGrade}
        grade={editingGrade}
        students={students}
        isEditing={isEditing}
      />
    </div>
  );
};

export default Grades;