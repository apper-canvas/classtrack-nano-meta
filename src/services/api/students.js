import studentsData from "@/services/mockData/students.json";

const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

let students = [...studentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getStudents = async () => {
  await delay(300);
  return [...students];
};

export const getStudentById = async (id) => {
  await delay(200);
  return students.find(student => student.Id === parseInt(id));
};

export const createStudent = async (studentData) => {
  await delay(400);
  const maxId = students.length > 0 ? Math.max(...students.map(s => s.Id)) : 0;
  const newStudent = {
    ...studentData,
    Id: maxId + 1
  };
  students.push(newStudent);
  
  // Create contact in CompanyHub
  try {
    const result = await apperClient.functions.invoke(
      import.meta.env.VITE_CREATE_COMPANYHUB_CONTACT,
      {
        body: JSON.stringify({
          firstName: newStudent.firstName,
          lastName: newStudent.lastName,
          email: newStudent.email,
          phone: newStudent.phone,
          gradeLevel: newStudent.gradeLevel,
          class: newStudent.class,
          status: newStudent.status,
          parentContact: newStudent.parentContact
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const responseData = await result.json();
    
    if (!responseData.success) {
      console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_CREATE_COMPANYHUB_CONTACT}. The response body is: ${JSON.stringify(responseData)}.`);
    }
  } catch (error) {
    console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_CREATE_COMPANYHUB_CONTACT}. The error is: ${error.message}`);
  }
  
  return { ...newStudent };
};

export const updateStudent = async (id, studentData) => {
  await delay(350);
  const index = students.findIndex(student => student.Id === parseInt(id));
  if (index !== -1) {
    students[index] = { ...students[index], ...studentData };
    return { ...students[index] };
  }
  throw new Error("Student not found");
};

export const deleteStudent = async (id) => {
  await delay(250);
  const index = students.findIndex(student => student.Id === parseInt(id));
  if (index !== -1) {
    const deletedStudent = students.splice(index, 1)[0];
    return { ...deletedStudent };
  }
  throw new Error("Student not found");
};