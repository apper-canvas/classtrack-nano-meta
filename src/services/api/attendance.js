import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAttendance = async () => {
  await delay(300);
  return [...attendance];
};

export const getAttendanceById = async (id) => {
  await delay(200);
  return attendance.find(record => record.Id === parseInt(id));
};

export const getAttendanceByStudentId = async (studentId) => {
  await delay(250);
  return attendance.filter(record => record.studentId === parseInt(studentId));
};

export const createAttendance = async (attendanceData) => {
  await delay(400);
  const maxId = attendance.length > 0 ? Math.max(...attendance.map(a => a.Id)) : 0;
  const newRecord = {
    ...attendanceData,
    Id: maxId + 1
  };
  attendance.push(newRecord);
  return { ...newRecord };
};

export const updateAttendance = async (id, attendanceData) => {
  await delay(350);
  const index = attendance.findIndex(record => record.Id === parseInt(id));
  if (index !== -1) {
    attendance[index] = { ...attendance[index], ...attendanceData };
    return { ...attendance[index] };
  }
  throw new Error("Attendance record not found");
};

export const deleteAttendance = async (id) => {
  await delay(250);
  const index = attendance.findIndex(record => record.Id === parseInt(id));
  if (index !== -1) {
    const deletedRecord = attendance.splice(index, 1)[0];
    return { ...deletedRecord };
  }
  throw new Error("Attendance record not found");
};