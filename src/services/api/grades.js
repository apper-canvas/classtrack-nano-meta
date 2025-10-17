import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getGrades = async () => {
  await delay(300);
  return [...grades];
};

export const getGradeById = async (id) => {
  await delay(200);
  return grades.find(grade => grade.Id === parseInt(id));
};

export const getGradesByStudentId = async (studentId) => {
  await delay(250);
  return grades.filter(grade => grade.studentId === parseInt(studentId));
};

export const createGrade = async (gradeData) => {
  await delay(400);
  const maxId = grades.length > 0 ? Math.max(...grades.map(g => g.Id)) : 0;
  const newGrade = {
    ...gradeData,
    Id: maxId + 1
  };
  grades.push(newGrade);
  return { ...newGrade };
};

export const updateGrade = async (id, gradeData) => {
  await delay(350);
  const index = grades.findIndex(grade => grade.Id === parseInt(id));
  if (index !== -1) {
    grades[index] = { ...grades[index], ...gradeData };
    return { ...grades[index] };
  }
  throw new Error("Grade not found");
};

export const deleteGrade = async (id) => {
  await delay(250);
  const index = grades.findIndex(grade => grade.Id === parseInt(id));
  if (index !== -1) {
    const deletedGrade = grades.splice(index, 1)[0];
    return { ...deletedGrade };
  }
  throw new Error("Grade not found");
};