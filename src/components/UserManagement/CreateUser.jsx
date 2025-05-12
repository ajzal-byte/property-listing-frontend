import { useState,useEffect } from 'react';

export default function CreateUSerModal({ isModalOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company_id: null,
    role: "admin", // Default role
    phone: "",
    rera_number: "",
    profile_url: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // Add this to your existing imports

// Add this state inside your component
const [companies, setCompanies] = useState([]);
const [isCompaniesLoading, setIsCompaniesLoading] = useState(false);



useEffect(() => {
    const fetchCompanies = async () => {
        setIsCompaniesLoading(true);
    try {
        const response = await fetch('https://backend.myemirateshome.com/api/companies', {
            method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
    });
    const data = await response.json();
    setCompanies(data);
    } catch (error) {
        console.error('Error fetching companies:', error);
    } finally {
        setIsCompaniesLoading(false);
    }
  };
  
  fetchCompanies();
}, []);

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
    });
}
};

const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    if (!formData.name.trim()) {
        newErrors.name = "Name is required";
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
        newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "Email format is invalid";
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
    }
    
    // Validate phone
    const phoneRegex = /^\d{10,15}$/;
    if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Phone number must be 10-15 digits";
    }
    
    // Validate RERA number
    if (!formData.rera_number.trim()) {
        newErrors.rera_number = "RERA number is required";
    }
    
    // Validate profile URL if provided
    if (formData.profile_url.trim()) {
        const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;
        if (!urlRegex.test(formData.profile_url)) {
            newErrors.profile_url = "Profile URL is invalid";
        }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (validateForm()) {
        setIsLoading(true);
        
        //   try {
            //     // Call the provided onSubmit prop with form data
            //     await onSubmit(formData);
            //   } catch (error) {
                //     console.error("Error submitting admin form:", error);
                //   } finally {
                    //     setIsLoading(false);
                    //   }
                    
                    try {
                        
                        setIsLoading(true)
                        console.log(formData);
                        
                        const response = await fetch('https://backend.myemirateshome.com/api/users', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                            },
                            body: JSON.stringify(formData)
                        });
                        
                        
        if (!response.ok) {
            console.log("error response: ",response);
            
            throw new Error('User creation failed');
        }
        
        const data = await response.json();
        console.log("response after creation: ", data);
        
        
    } catch (err) {
        // setError('Registration failed. Please try again.');
        console.log("error in regisrationForm.jsx: ", err);
        setIsLoading(false);
        
    } finally {
        setIsLoading(false);
        window.alert("User created successfully")
        onClose();
    }
    
}
};

// Simple error display component
const ErrorMessage = ({ message }) => (
    <div className="mt-1 flex items-center text-red-500 text-sm">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {message}
    </div>
  );
  
  if(!isModalOpen){
      return
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md">
    <div className="w-full max-w-[60%]  max-h-[90vh] overflow-y-auto  mx-auto p-6 bg-white rounded-lg shadow-md ">
      <h2 className="text-xl font-bold  text-gray-800">Admin Registration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
              errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter full name"
          />
          {errors.name && <ErrorMessage message={errors.name} />}
        </div>
        
        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="new-email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
              errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter email address"
          />
          {errors.email && <ErrorMessage message={errors.email} />}
        </div>
        
        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
            Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
              errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter password"
          />
          {errors.password && <ErrorMessage message={errors.password} />}
        </div>
        
        {/* Role Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
          >
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="owner">Owner</option>
          </select>
        </div>

        {/* Company ID Field */}
<div className="mb-4">
  <label className="block text-gray-700 font-medium mb-2" htmlFor="company_id">
    Company
  </label>
  <select
    id="company_id"
    name="company_id"
    value={formData.company_id || ""}
    onChange={handleChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
    disabled={isCompaniesLoading}
  >
    <option value="">Select a company</option>
    {companies.map(company => (
      <option key={company.id} value={company.id}>
        ID: {company.id} - {company.name}
      </option>
    ))}
  </select>
  {isCompaniesLoading && <p className="text-sm text-gray-500 mt-1">Loading companies...</p>}
</div>
        
        {/* Phone Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
              errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter phone number"
          />
          {errors.phone && <ErrorMessage message={errors.phone} />}
        </div>
        
        {/* RERA Number Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="rera_number">
            RERA Number *
          </label>
          <input
            type="text"
            id="rera_number"
            name="rera_number"
            value={formData.rera_number}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
              errors.rera_number ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter RERA number"
          />
          {errors.rera_number && <ErrorMessage message={errors.rera_number} />}
        </div>
        
        {/* Profile URL Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="profile_url">
            Profile URL
          </label>
          <input
            type="url"
            id="profile_url"
            name="profile_url"
            value={formData.profile_url}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
              errors.profile_url ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="https://example.com/profile"
          />
          {errors.profile_url && <ErrorMessage message={errors.profile_url} />}
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={()=> {
                setIsLoading(false);
                onClose();
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md focus:outline-none"
            >
              Cancel
            </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Register User'}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}