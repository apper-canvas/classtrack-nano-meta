import { getApperClient } from "@/services/apperClient";

export const getClasses = async () => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('class_c', {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "subject_c"}},
        {"field": {"Name": "grade_level_c"}}
      ]
    });
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }
    
    // Add studentIds as empty array for compatibility
    return (response.data || []).map(cls => ({
      ...cls,
      studentIds: []
    }));
  } catch (error) {
    console.error("Error fetching classes:", error?.response?.data?.message || error);
    return [];
  }
};

export const getClassById = async (id) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.getRecordById('class_c', parseInt(id), {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "name_c"}},
        {"field": {"Name": "subject_c"}},
        {"field": {"Name": "grade_level_c"}}
      ]
    });
    
    if (!response.success) {
      console.error(response.message);
      return null;
    }
    
    return {
      ...response.data,
      studentIds: []
    };
  } catch (error) {
    console.error(`Error fetching class ${id}:`, error?.response?.data?.message || error);
    return null;
  }
};

export const createClass = async (classData) => {
  try {
    const apperClient = getApperClient();
    
    const payload = {
      records: [{
        Name: classData.name_c || classData.name,
        name_c: classData.name_c || classData.name,
        subject_c: classData.subject_c || classData.subject,
        grade_level_c: classData.grade_level_c ? parseInt(classData.grade_level_c) : null
      }]
    };
    
    const response = await apperClient.createRecord('class_c', payload);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create class:`, failed);
        throw new Error(failed[0].message || 'Failed to create class');
      }
      
      return {
        ...response.results[0].data,
        studentIds: []
      };
    }
  } catch (error) {
    console.error("Error creating class:", error?.response?.data?.message || error);
    throw error;
  }
};

export const updateClass = async (id, classData) => {
  try {
    const apperClient = getApperClient();
    
    const payload = {
      records: [{
        Id: parseInt(id),
        Name: classData.name_c || classData.name,
        name_c: classData.name_c || classData.name,
        subject_c: classData.subject_c || classData.subject,
        grade_level_c: classData.grade_level_c ? parseInt(classData.grade_level_c) : null
      }]
    };
    
    const response = await apperClient.updateRecord('class_c', payload);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update class:`, failed);
        throw new Error(failed[0].message || 'Failed to update class');
      }
      
      return {
        ...response.results[0].data,
        studentIds: []
      };
    }
  } catch (error) {
    console.error("Error updating class:", error?.response?.data?.message || error);
    throw error;
  }
};

export const deleteClass = async (id) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.deleteRecord('class_c', {
      RecordIds: [parseInt(id)]
    });
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete class:`, failed);
        throw new Error(failed[0].message || 'Failed to delete class');
      }
      
      return true;
    }
  } catch (error) {
    console.error("Error deleting class:", error?.response?.data?.message || error);
    throw error;
  }
};