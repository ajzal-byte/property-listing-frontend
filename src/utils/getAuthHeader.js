const getAuthHeaders = () => {
    return {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "Content-Type": "application/json",
    };
  };

  export default getAuthHeaders;