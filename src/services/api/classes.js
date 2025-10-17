import classesData from "@/services/mockData/classes.json";

let classes = [...classesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getClasses = async () => {
  await delay(300);
  return [...classes];
};

export const getClassById = async (id) => {
  await delay(200);
  return classes.find(classItem => classItem.Id === parseInt(id));
};

export const createClass = async (classData) => {
  await delay(400);
  const maxId = classes.length > 0 ? Math.max(...classes.map(c => c.Id)) : 0;
  const newClass = {
    ...classData,
    Id: maxId + 1
  };
  classes.push(newClass);
  return { ...newClass };
};

export const updateClass = async (id, classData) => {
  await delay(350);
  const index = classes.findIndex(classItem => classItem.Id === parseInt(id));
  if (index !== -1) {
    classes[index] = { ...classes[index], ...classData };
    return { ...classes[index] };
  }
  throw new Error("Class not found");
};

export const deleteClass = async (id) => {
  await delay(250);
  const index = classes.findIndex(classItem => classItem.Id === parseInt(id));
  if (index !== -1) {
    const deletedClass = classes.splice(index, 1)[0];
    return { ...deletedClass };
  }
  throw new Error("Class not found");
};