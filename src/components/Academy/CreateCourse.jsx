// import React, { useState } from "react";
// import { X } from "lucide-react";

// const CreateCourse = ({ isOpen, onClose, onSuccess }) => {
//   // State for form data
//   const [formData, setFormData] = useState({
//     title: "",
//     description: ""
//   });
  
//   // State for form submission
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear error when user starts typing
//     if (error) setError("");
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     console.log("authToken: ");
//     console.log(localStorage.getItem("authToken"));
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError("");

//     try {
//       // Get auth token from localStorage or wherever it's stored
//       const authToken = localStorage.getItem('authToken'); // Adjust this based on where you store the token

//       if (!authToken) {
//         throw new Error("Authentication token not found. Please login again.");
//       }

//       const response = await fetch('https://backend.myemirateshome.com/api/courses', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}` // Adjust format if needed
//         },
//         body: JSON.stringify(formData)
//       });

//       if (response.ok) {
//         const newCourse = await response.json();
//         // Reset form
//         setFormData({ title: "", description: "" });
//         // Call success callback
//         onSuccess(newCourse);
//         // Close modal
//         onClose();
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to create course');
//       }
//     } catch (error) {
//       console.error('Error creating course:', error);
//       setError(error.message || 'An error occurred while creating the course.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Close modal and reset form
//   const handleClose = () => {
//     setFormData({ title: "", description: "" });
//     setError("");
//     onClose();
//   };

//   // Don't render anything if modal is not open
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
//         {/* Modal Header */}
//         <div className="flex justify-between items-center p-6 border-b">
//           <h3 className="text-lg font-semibold text-gray-800">Create New Course</h3>
//           <button
//             onClick={handleClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
//             disabled={isSubmitting}
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         {/* Modal Body */}
//         <form onSubmit={handleSubmit} className="p-6">
//           {/* Error Message */}
//           {error && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-sm text-red-600">{error}</p>
//             </div>
//           )}

//           {/* Title Field */}
//           <div className="mb-4">
//             <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//               Course Title *
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               required
//               disabled={isSubmitting}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
//               placeholder="Enter course title"
//             />
//           </div>

//           {/* Description Field */}
//           <div className="mb-6">
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//               Course Description *
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               required
//               disabled={isSubmitting}
//               rows="4"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical disabled:bg-gray-100 disabled:cursor-not-allowed"
//               placeholder="Enter course description"
//             />
//           </div>

//           {/* Offered by Field */}
//           <div className="mb-6">
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//               Offered By *
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               required
//               disabled={isSubmitting}
//               rows="4"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical disabled:bg-gray-100 disabled:cursor-not-allowed"
//               placeholder="Enter course description"
//             />
//           </div>

//           {/* Form Actions */}
//           <div className="flex gap-3 justify-end">
//             <button
//               type="button"
//               onClick={handleClose}
//               disabled={isSubmitting}
//               className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? 'Creating...' : 'Create Course'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateCourse;

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const CreateCourse = ({ isOpen, onClose, onSuccess }) => {
  // State for form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    offered_by: "",
    tag_ids: []
  });
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // State for companies and tags
  const [companies, setCompanies] = useState([]);
  const [tags, setTags] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);

  // Fetch companies
  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch('https://backend.myemirateshome.com/api/companies', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const companiesData = await response.json();
        setCompanies(companiesData);
      } else {
        throw new Error('Failed to fetch companies');
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError('Failed to load companies');
    } finally {
      setLoadingCompanies(false);
    }
  };

  // Fetch all tags from all pages
  const fetchAllTags = async () => {
    setLoadingTags(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error("Authentication token not found");
      }

      let allTags = [];
      let currentPage = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await fetch(`https://backend.myemirateshome.com/api/tags?page=${currentPage}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (response.ok) {
          const tagsData = await response.json();
          allTags = [...allTags, ...tagsData.data];
          
          // Check if there's a next page
          hasMorePages = tagsData.next_page_url !== null;
          currentPage++;
        } else {
          throw new Error('Failed to fetch tags');
        }
      }

      setTags(allTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setError('Failed to load tags');
    } finally {
      setLoadingTags(false);
    }
  };

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCompanies();
      fetchAllTags();
    }
  }, [isOpen]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  // Handle tag selection
  const handleTagToggle = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tag_ids: prev.tag_ids.includes(tagId)
        ? prev.tag_ids.filter(id => id !== tagId)
        : [...prev.tag_ids, tagId]
    }));
    if (error) setError("");
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      // Get auth token from localStorage
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      console.log("body is: ", formData);
      
      const response = await fetch('https://backend.myemirateshome.com/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newCourse = await response.json();
        // Reset form
        setFormData({ title: "", description: "", offered_by: "", tag_ids: [] });
        // Call success callback
        onSuccess(newCourse);
        // Close modal
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      setError(error.message || 'An error occurred while creating the course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal and reset form
  const handleClose = () => {
    setFormData({ title: "", description: "", offered_by: "", tag_ids: [] });
    setError("");
    onClose();
  };

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-800">Create New Course</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Title Field */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter course title"
            />
          </div>

          {/* Description Field */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Course Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter course description"
            />
          </div>

          {/* Company Dropdown */}
          <div className="mb-4">
            <label htmlFor="offered_by" className="block text-sm font-medium text-gray-700 mb-2">
              Offered By *
            </label>
            <select
              id="offered_by"
              name="offered_by"
              value={formData.offered_by}
              onChange={handleInputChange}
              required
              disabled={isSubmitting || loadingCompanies}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {loadingCompanies ? "Loading companies..." : "Select a company"}
              </option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            {loadingTags ? (
              <div className="text-sm text-gray-500 py-2">Loading tags...</div>
            ) : (
              <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto">
                {tags.length === 0 ? (
                  <div className="text-sm text-gray-500">No tags available</div>
                ) : (
                  <div className="space-y-2">
                    {tags.map((tag) => (
                      <label key={tag.id} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.tag_ids.includes(tag.id)}
                          onChange={() => handleTagToggle(tag.id)}
                          disabled={isSubmitting}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
                        />
                        <span className="text-sm text-gray-700">{tag.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            {formData.tag_ids.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                {formData.tag_ids.length} tag{formData.tag_ids.length > 1 ? 's' : ''} selected
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.title.trim() || !formData.description.trim() || !formData.offered_by}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;