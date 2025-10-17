import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getGrades } from "@/services/api/grades";
import { getAttendance } from "@/services/api/attendance";
import { createStudent, getStudents, updateStudent } from "@/services/api/students";
import ApperIcon from "@/components/ApperIcon";
import StudentModal from "@/components/organisms/StudentModal";
import Button from "@/components/atoms/Button";
import StudentCard from "@/components/molecules/StudentCard";
import FilterPanel from "@/components/molecules/FilterPanel";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [allGrades, setAllGrades] = useState([]);
  const [allAttendance, setAllAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, gradesData, attendanceData] = await Promise.all([
        getStudents(),
        getGrades(),
        getAttendance()
      ]);
      
      setStudents(studentsData);
      setAllGrades(gradesData);
      setAllAttendance(attendanceData);
    } catch (err) {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

const filteredStudents = students.filter(student => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${student.first_name_c} ${student.last_name_c}`.toLowerCase();
      if (!fullName.includes(query) && !student.email_c?.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Grade level filter
    if (filters.gradeLevel && student.grade_level_c?.toString() !== filters.gradeLevel) {
      return false;
    }

    // Class filter
    if (filters.class && student.class_c !== filters.class) {
      return false;
    }

    // Status filter
    if (filters.status && student.status_c !== filters.status) {
      return false;
    }

    return true;
  });

const getStudentGrades = (studentId) => {
    return allGrades.filter(grade => grade.student_id_c?.Id === studentId || grade.student_id_c === studentId);
  };

const getStudentAttendance = (studentId) => {
    return allAttendance.filter(record => record.student_id_c?.Id === studentId || record.student_id_c === studentId);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="mb-6">
          <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <Loading type="cards" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadStudents} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Students
          </h1>
          <p className="text-gray-600">
            Manage and view student information
          </p>
        </div>
<Button variant="gradient" className="w-fit" onClick={handleAddStudent}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search students by name or email..."
        className="max-w-md"
      />

      {/* Filters */}
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredStudents.length} of {students.length} students
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">View:</span>
          <Button variant="ghost" size="sm" className="bg-primary/10 text-primary">
            <ApperIcon name="Grid3x3" className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <ApperIcon name="List" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Students Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.Id}
              student={student}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <Empty
          title="No students found"
message={searchQuery || Object.keys(filters).length > 0 
            ? "Try adjusting your search or filters" 
            : "Get started by adding your first student"
          }
          actionLabel="Add Student"
          onAction={handleAddStudent}
          icon="Users"
        />
      )}

      {/* Student Modal */}
<StudentModal
        student={selectedStudent}
        isOpen={showModal}
        isEditing={isEditing}
        onClose={() => {
          setShowModal(false);
          setSelectedStudent(null);
          setIsEditing(false);
        }}
onSave={async (studentData) => {
          try {
            if (selectedStudent) {
              await updateStudent(selectedStudent.Id, studentData);
              toast.success('Student updated successfully');
            } else {
              await createStudent(studentData);
              toast.success('Student created successfully and synced with CompanyHub');
            }
            setShowModal(false);
            setSelectedStudent(null);
            setIsEditing(false);
            loadStudents();
          } catch (error) {
            toast.error(error.message || 'Failed to save student');
          }
        }}
        onEdit={() => setIsEditing(true)}
        grades={selectedStudent ? getStudentGrades(selectedStudent.Id) : []}
        attendance={selectedStudent ? getStudentAttendance(selectedStudent.Id) : []}
      />
    </div>
  );
};

export default Students;