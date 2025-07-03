// Add this helper function inside your PropertyListings component
export const createApiParams = (filters) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value)) {
      // THE KEY FIX: Append '[]' to the key for array values
      value.forEach((v) => {
        if (v) {
          // Ensure the value is not empty
          params.append(`${key}[]`, v);
        }
      });
    } else if (value && value !== "") {
      // Standard handling for other values
      params.set(key, value);
    }
  }
  return params;
};
