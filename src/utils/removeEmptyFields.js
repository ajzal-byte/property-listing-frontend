const removeEmptyFields = (data) => {
    const cleanData = {};
    
    Object.entries(data).forEach(([key, value]) => {
      // Skip empty strings
      if (value === "") return;
      
      // Skip empty arrays
      if (Array.isArray(value) && value.length === 0) return;
      
      // Skip empty objects
      if (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0) return;
      
      // Keep the value
      cleanData[key] = value;
    });
    
    return cleanData;
  };

  export default removeEmptyFields