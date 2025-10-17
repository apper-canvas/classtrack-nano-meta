import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createClass, deleteClass, getClasses, updateClass } from "@/services/api/classes";
import { getStudents } from "@/services/api/students";
import ApperIcon from "@/components/ApperIcon";
import ClassModal from "@/components/organisms/ClassModal";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [classesData, studentsData] = await Promise.all([
        getClasses(),
        getStudents()
      ]);
      
      setClasses(classesData);
      setStudents(studentsData);
    } catch (err) {
      setError("Failed to load classes");
    } finally {
      setLoading(false);
    }
};

  const handleAddClass = () => {
    setEditingClass(null);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveClass = async (classData) => {
    try {
      setLoading(true);
      if (editingClass) {
        await updateClass(editingClass.Id, classData);
        setClasses(prev => prev.map(c => c.Id === editingClass.Id ? { ...c, ...classData } : c));
        toast.success("Class updated successfully");
      } else {
        const newClass = await createClass(classData);
        setClasses(prev => [...prev, newClass]);
        toast.success("Class added successfully");
      }
      setIsModalOpen(false);
      setEditingClass(null);
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || "Failed to save class");
    } finally {
      setLoading(false);
    }
  };

  const getClassStudents = (classData) => {
    return students.filter(student => 
      classData.studentIds.includes(student.Id)
    );
  };

  const filteredClasses = classes.filter(classData => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!classData.name.toLowerCase().includes(query) && 
          !classData.subject.toLowerCase().includes(query)) {
        return false;
      }
    }
    return true;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <Loading type="cards" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadClasses} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Classes
          </h1>
          <p className="text-gray-600">
            Manage and organize your classes and student groups
</p>
        </div>
        <Button variant="gradient" className="w-fit" onClick={handleAddClass}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Class
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search classes by name or subject..."
        className="max-w-md"
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredClasses.length} of {classes.length} classes
        </p>
      </div>

      {/* Classes Grid */}
      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClasses.map((classData) => {
            const classStudents = getClassStudents(classData);
            
            return (
              <Card key={classData.Id} className="p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-info/20 rounded-xl flex items-center justify-center">
                      <ApperIcon name="School" className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {classData.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {classData.subject}
                      </p>
                    </div>
                  </div>
                  <Badge variant="info">
                    Grade {classData.gradeLevel}
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {/* Class Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <ApperIcon name="Users" className="h-4 w-4 mr-2" />
                      {classStudents.length} Students
                    </div>
                    <div className="flex items-center text-gray-600">
                      <ApperIcon name="BookOpen" className="h-4 w-4 mr-2" />
                      {classData.subject}
                    </div>
                  </div>

                  {/* Student Avatars */}
                  {classStudents.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Students
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {classStudents.slice(0, 5).map((student) => (
                            <Avatar
                              key={student.Id}
                              src={student.photo}
                              alt={`${student.firstName} ${student.lastName}`}
                              size="sm"
                              className="border-2 border-white"
                            />
                          ))}
                          {classStudents.length > 5 && (
                            <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                              +{classStudents.length - 5}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Eye" className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="MoreHorizontal" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Empty
          title="No classes found"
          message={searchQuery 
            ? "Try adjusting your search query" 
            : "Get started by creating your first class"
}
          actionLabel="Add Class"
          icon="School"
        />
      )}
{/* Add/Edit Class Modal */}
      <ClassModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClass(null);
          setIsEditing(false);
        }}
        onSave={handleSaveClass}
        classItem={editingClass}
        isEditing={isEditing}
      />
    </div>
  );
};