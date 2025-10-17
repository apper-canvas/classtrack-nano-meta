import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import StatsCard from "@/components/molecules/StatsCard";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { getStudents } from "@/services/api/students";
import { getGrades } from "@/services/api/grades";
import { getAttendance } from "@/services/api/attendance";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, gradesData, attendanceData] = await Promise.all([
        getStudents(),
        getGrades(),
        getAttendance()
      ]);
      
      setStudents(studentsData);
      setGrades(gradesData);
      setAttendance(attendanceData);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === "Active").length;
    const atRiskStudents = students.filter(s => s.status === "At Risk").length;
    
    // Calculate average attendance rate
    const attendanceByStudent = attendance.reduce((acc, record) => {
      if (!acc[record.studentId]) {
        acc[record.studentId] = { total: 0, present: 0 };
      }
      acc[record.studentId].total++;
      if (record.status === "Present") {
        acc[record.studentId].present++;
      }
      return acc;
    }, {});

    const attendanceRates = Object.values(attendanceByStudent).map(
      data => (data.present / data.total) * 100
    );
    const avgAttendance = attendanceRates.length > 0 
      ? Math.round(attendanceRates.reduce((sum, rate) => sum + rate, 0) / attendanceRates.length)
      : 0;

    // Calculate average GPA
    const gradesByStudent = grades.reduce((acc, grade) => {
      if (!acc[grade.studentId]) {
        acc[grade.studentId] = [];
      }
      acc[grade.studentId].push((grade.score / grade.maxScore) * 4);
      return acc;
    }, {});

    const gpas = Object.values(gradesByStudent).map(
      studentGrades => studentGrades.reduce((sum, gpa) => sum + gpa, 0) / studentGrades.length
    );
    const avgGpa = gpas.length > 0 
      ? (gpas.reduce((sum, gpa) => sum + gpa, 0) / gpas.length).toFixed(2)
      : "0.00";

    return {
      totalStudents,
      activeStudents,
      atRiskStudents,
      avgAttendance,
      avgGpa
    };
  };

  const getRecentActivity = () => {
    const recentGrades = grades
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(grade => {
        const student = students.find(s => s.Id === grade.studentId);
        return {
          ...grade,
          studentName: student ? `${student.firstName} ${student.lastName}` : "Unknown",
          type: "grade"
        };
      });

    const recentAttendance = attendance
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(record => {
        const student = students.find(s => s.Id === record.studentId);
        return {
          ...record,
          studentName: student ? `${student.firstName} ${student.lastName}` : "Unknown",
          type: "attendance"
        };
      });

    return [...recentGrades, ...recentAttendance]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  };

  if (loading) {
    return (
      <div className="p-6">
        <Loading type="stats" />
        <Loading type="cards" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadDashboardData} />
      </div>
    );
  }

  const stats = calculateStats();
  const recentActivity = getRecentActivity();
  const atRiskStudents = students.filter(s => s.status === "At Risk").slice(0, 5);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of your class performance and recent activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
          icon="Users"
          gradient="primary"
        />
        <StatsCard
          title="Active Students"
          value={stats.activeStudents}
          icon="UserCheck"
          gradient="success"
        />
        <StatsCard
          title="Average GPA"
          value={stats.avgGpa}
          icon="BookOpen"
          gradient="info"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${stats.avgAttendance}%`}
          icon="Calendar"
          gradient="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Activity
            </h2>
            <Button variant="ghost" size="sm">
              <ApperIcon name="MoreHorizontal" className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === "grade" ? "bg-primary/10" : "bg-success/10"
                }`}>
                  <ApperIcon 
                    name={activity.type === "grade" ? "BookOpen" : "Calendar"} 
                    className={`h-5 w-5 ${
                      activity.type === "grade" ? "text-primary" : "text-success"
                    }`} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.studentName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {activity.type === "grade" 
                      ? `${activity.subject}: ${activity.assignment} - ${Math.round((activity.score / activity.maxScore) * 100)}%`
                      : `Attendance: ${activity.status}`
                    }
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(activity.date).toLocaleDateString()}
                </span>
              </div>
            ))}
            
            {recentActivity.length === 0 && (
              <p className="text-gray-600 text-center py-8">
                No recent activity to display
              </p>
            )}
          </div>
        </Card>

        {/* At Risk Students */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              At Risk Students
            </h2>
            <Badge variant="warning">
              {stats.atRiskStudents} students
            </Badge>
          </div>
          
          <div className="space-y-4">
            {atRiskStudents.map((student) => (
              <div key={student.Id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Avatar
                  src={student.photo}
                  alt={`${student.firstName} ${student.lastName}`}
                  size="default"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-xs text-gray-600">
                    Grade {student.gradeLevel} • {student.class}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="MessageSquare" className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {atRiskStudents.length === 0 && (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle" className="h-12 w-12 text-success mx-auto mb-3" />
                <p className="text-gray-600">
                  Great! No students are currently at risk.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;