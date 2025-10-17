import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createAttendance, deleteAttendance, getAttendance, updateAttendance } from "@/services/api/attendance";
import { getStudents } from "@/services/api/students";
import ApperIcon from "@/components/ApperIcon";
import MarkAttendanceModal from "@/components/organisms/AttendanceModal";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const Attendance = () => {
const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState("daily"); // daily, weekly, monthly
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [attendanceData, studentsData] = await Promise.all([
        getAttendance(),
        getStudents()
      ]);
      
      setAttendance(attendanceData);
      setStudents(studentsData);
    } catch (err) {
      setError("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
};

  const handleMarkAttendance = () => {
    setEditingAttendance(null);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleEditAttendance = (record) => {
    setEditingAttendance(record);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveAttendance = async (attendanceData) => {
    try {
      setLoading(true);
      if (editingAttendance) {
        await updateAttendance(editingAttendance.Id, attendanceData);
        setAttendance(prev => prev.map(a => a.Id === editingAttendance.Id ? { ...a, ...attendanceData } : a));
        toast.success("Attendance updated successfully");
      } else {
        const newRecord = await createAttendance(attendanceData);
        setAttendance(prev => [...prev, newRecord]);
        toast.success("Attendance marked successfully");
      }
      setIsModalOpen(false);
      setEditingAttendance(null);
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || "Failed to save attendance");
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

  const getAttendanceForDate = (date) => {
    return attendance.filter(record => 
      new Date(record.date).toDateString() === new Date(date).toDateString()
    );
  };

  const getStudentAttendanceStats = (studentId) => {
    const studentRecords = attendance.filter(record => record.studentId === studentId);
    const total = studentRecords.length;
    const present = studentRecords.filter(record => record.status === "Present").length;
    const late = studentRecords.filter(record => record.status === "Late").length;
    const absent = studentRecords.filter(record => record.status === "Absent").length;
    
    return {
      total,
      present,
      late,
      absent,
      presentRate: total > 0 ? Math.round((present / total) * 100) : 0
    };
  };

  const todayAttendance = getAttendanceForDate(selectedDate);
  const attendanceByStudent = todayAttendance.reduce((acc, record) => {
    acc[record.studentId] = record;
    return acc;
  }, {});

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
        <Error message={error} onRetry={loadAttendance} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Attendance
          </h1>
          <p className="text-gray-600">
            Track and manage student attendance
          </p>
        </div>
<Button variant="gradient" className="w-fit" onClick={handleMarkAttendance}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Mark Attendance
        </Button>
      </div>

      {/* Controls */}
      <Card className="p-4 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Date:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-10 px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            {["daily", "weekly", "monthly"].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === mode
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-r from-success/10 to-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-success">
                {todayAttendance.filter(r => r.status === "Present").length}
              </p>
              <p className="text-sm text-gray-600">Present</p>
            </div>
            <ApperIcon name="CheckCircle" className="h-8 w-8 text-success" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-r from-warning/10 to-error/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-warning">
                {todayAttendance.filter(r => r.status === "Late").length}
              </p>
              <p className="text-sm text-gray-600">Late</p>
            </div>
            <ApperIcon name="Clock" className="h-8 w-8 text-warning" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-r from-error/10 to-warning/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-error">
                {todayAttendance.filter(r => r.status === "Absent").length}
              </p>
              <p className="text-sm text-gray-600">Absent</p>
            </div>
            <ApperIcon name="XCircle" className="h-8 w-8 text-error" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-info/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">
                {todayAttendance.length > 0 
                  ? Math.round((todayAttendance.filter(r => r.status === "Present").length / todayAttendance.length) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-gray-600">Attendance Rate</p>
            </div>
            <ApperIcon name="TrendingUp" className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Attendance List */}
      {viewMode === "daily" && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Attendance for {new Date(selectedDate).toLocaleDateString()}
            </h2>
          </div>

          {students.length > 0 ? (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-700">Student</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Status</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Overall Rate</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Notes</th>
                      <th className="text-right p-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => {
                      const todayRecord = attendanceByStudent[student.Id];
                      const stats = getStudentAttendanceStats(student.Id);
                      
                      return (
                        <tr key={student.Id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <Avatar
                                src={student.photo}
                                alt={`${student.firstName} ${student.lastName}`}
                                size="sm"
                              />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {student.firstName} {student.lastName}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Grade {student.gradeLevel} • {student.class}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            {todayRecord ? (
                              <Badge variant={todayRecord.status.toLowerCase()}>
                                {todayRecord.status}
                              </Badge>
                            ) : (
                              <Badge variant="default">
                                Not Marked
                              </Badge>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <span className={`font-semibold ${
                                stats.presentRate >= 90 ? "text-success" :
                                stats.presentRate >= 75 ? "text-warning" : "text-error"
                              }`}>
                                {stats.presentRate}%
                              </span>
                              <span className="text-xs text-gray-500">
                                ({stats.present}/{stats.total})
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">
                            {todayRecord?.notes || "-"}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="ghost" size="sm">
                                <ApperIcon name="Edit" className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <ApperIcon name="Eye" className="h-4 w-4" />
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
              title="No students found"
              message="Add students to start tracking attendance"
              actionLabel="Add Student"
              icon="Users"
            />
          )}
</>
      )}

      <MarkAttendanceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAttendance(null);
          setIsEditing(false);
        }}
        onSave={handleSaveAttendance}
        attendance={editingAttendance}
        students={students}
        isEditing={isEditing}
      />
    </div>
  );
};

export default Attendance;