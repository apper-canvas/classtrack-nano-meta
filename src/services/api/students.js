import { getApperClient } from "@/services/apperClient";

export const getStudents = async () => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('student_c', {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "first_name_c"}},
        {"field": {"Name": "last_name_c"}},
        {"field": {"Name": "email_c"}},
        {"field": {"Name": "phone_c"}},
        {"field": {"Name": "grade_level_c"}},
        {"field": {"Name": "class_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "photo_c"}},
        {"field": {"Name": "enrollment_date_c"}},
        {"field": {"Name": "parent_contact_name_c"}},
        {"field": {"Name": "parent_contact_email_c"}},
        {"field": {"Name": "parent_contact_phone_c"}},
        {"field": {"Name": "maths_marks_c"}}
      ]
    });
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching students:", error?.response?.data?.message || error);
    return [];
  }
};

export const getStudentById = async (id) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.getRecordById('student_c', parseInt(id), {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "first_name_c"}},
        {"field": {"Name": "last_name_c"}},
        {"field": {"Name": "email_c"}},
        {"field": {"Name": "phone_c"}},
        {"field": {"Name": "grade_level_c"}},
        {"field": {"Name": "class_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "photo_c"}},
        {"field": {"Name": "enrollment_date_c"}},
        {"field": {"Name": "parent_contact_name_c"}},
        {"field": {"Name": "parent_contact_email_c"}},
        {"field": {"Name": "parent_contact_phone_c"}},
        {"field": {"Name": "maths_marks_c"}}
      ]
    });
    
    if (!response.success) {
      console.error(response.message);
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
    return null;
  }
};

export const createStudent = async (studentData) => {
  try {
    const apperClient = getApperClient();
    
    // Prepare data with only Updateable fields
    const payload = {
      records: [{
        Name: `${studentData.first_name_c} ${studentData.last_name_c}`,
        first_name_c: studentData.first_name_c,
        last_name_c: studentData.last_name_c,
        email_c: studentData.email_c,
        phone_c: studentData.phone_c || '',
        grade_level_c: studentData.grade_level_c ? parseInt(studentData.grade_level_c) : null,
        class_c: studentData.class_c || '',
        status_c: studentData.status_c || 'Active',
        photo_c: studentData.photo_c || '',
        enrollment_date_c: studentData.enrollment_date_c || new Date().toISOString().split('T')[0],
        parent_contact_name_c: studentData.parent_contact_name_c || '',
        parent_contact_email_c: studentData.parent_contact_email_c || '',
        parent_contact_phone_c: studentData.parent_contact_phone_c || '',
        maths_marks_c: studentData.maths_marks_c ? parseInt(studentData.maths_marks_c) : null
      }]
    };
    
    const response = await apperClient.createRecord('student_c', payload);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create student:`, failed);
        throw new Error(failed[0].message || 'Failed to create student');
      }
      
      const newStudent = response.results[0].data;
      
      // Create contact in CompanyHub
      try {
        const result = await apperClient.functions.invoke(
          import.meta.env.VITE_CREATE_COMPANYHUB_CONTACT,
          {
            body: JSON.stringify({
              firstName: newStudent.first_name_c,
              lastName: newStudent.last_name_c,
              email: newStudent.email_c,
              phone: newStudent.phone_c,
              gradeLevel: newStudent.grade_level_c,
              class: newStudent.class_c,
              status: newStudent.status_c,
              parentContact: {
                name: newStudent.parent_contact_name_c,
                phone: newStudent.parent_contact_phone_c,
                email: newStudent.parent_contact_email_c
              }
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
      
      return newStudent;
    }
  } catch (error) {
    console.error("Error creating student:", error?.response?.data?.message || error);
    throw error;
  }
};

export const updateStudent = async (id, studentData) => {
  try {
    const apperClient = getApperClient();
    
    // Prepare data with only Updateable fields
    const payload = {
      records: [{
        Id: parseInt(id),
        Name: `${studentData.first_name_c} ${studentData.last_name_c}`,
        first_name_c: studentData.first_name_c,
        last_name_c: studentData.last_name_c,
        email_c: studentData.email_c,
        phone_c: studentData.phone_c || '',
        grade_level_c: studentData.grade_level_c ? parseInt(studentData.grade_level_c) : null,
        class_c: studentData.class_c || '',
        status_c: studentData.status_c || 'Active',
        photo_c: studentData.photo_c || '',
        enrollment_date_c: studentData.enrollment_date_c,
        parent_contact_name_c: studentData.parent_contact_name_c || '',
        parent_contact_email_c: studentData.parent_contact_email_c || '',
        parent_contact_phone_c: studentData.parent_contact_phone_c || '',
        maths_marks_c: studentData.maths_marks_c ? parseInt(studentData.maths_marks_c) : null
      }]
    };
    
    const response = await apperClient.updateRecord('student_c', payload);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update student:`, failed);
        throw new Error(failed[0].message || 'Failed to update student');
      }
      
      return response.results[0].data;
    }
  } catch (error) {
    console.error("Error updating student:", error?.response?.data?.message || error);
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.deleteRecord('student_c', {
      RecordIds: [parseInt(id)]
    });
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete student:`, failed);
        throw new Error(failed[0].message || 'Failed to delete student');
      }
      
      return true;
    }
  } catch (error) {
    console.error("Error deleting student:", error?.response?.data?.message || error);
    throw error;
  }
};