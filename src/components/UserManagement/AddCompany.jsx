import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

export default function AddCompanyModal({ isModalOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    admins: [],
  });

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminsLoading, setIsAdminsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  //   const authToken = localStorage.getItem("authToken")
  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      setIsAdminsLoading(true);
      try {
        // In a real implementation, replace this with your actual API endpoint
        const response = await fetch(
          "https://backend.myemirateshome.com/api/unassociatedadmins",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        const data = await response.json();

        // Sort users by created_at in descending order (newest first)
        const sortedUsers = data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setUsers(sortedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsAdminsLoading(false);
      }
    };

    fetchUsers();
    // For demonstration, using mock data similar to provided example

    // Use this for demo purposes - replace with fetchUsers() in production
    setUsers(
      users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    );

    // fetchUsers(); // Uncomment this line and remove the mock data in production
  }, [setUsers]);

  useEffect(() => {
    console.log("admins: ", users);
  }, [users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const addAdmin = (userId) => {
    // Check if admin is already in the list
    if (formData.admins.some((adminId) => adminId === userId)) {
      return;
    }

    setFormData({
      ...formData,
      admins: [...formData.admins, userId],
    });

    // Close dropdown after selection
    setIsDropdownOpen(false);
  };

  const removeAdmin = (index) => {
    const updatedAdmins = [...formData.admins];
    updatedAdmins.splice(index, 1);
    setFormData({
      ...formData,
      admins: updatedAdmins,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }

    // Validate phone
    const phoneRegex = /^\d{10,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10-15 digits";
    }

    // Validate website
    const urlRegex =
      /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;
    if (formData.website && !urlRegex.test(formData.website)) {
      newErrors.website = "Website URL is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (validateForm()) {
      try {
        setIsLoading(true);
        console.log(formData);

        const response = await fetch(
          "https://backend.myemirateshome.com/api/companies",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          console.log("error response: ", response);

          throw new Error("Company creation failed");
        }

        const data = await response.json();
        console.log("response after creation: ", data);
      } catch (err) {
        // setError('Registration failed. Please try again.');
        console.log("error in regisrationForm.jsx: ", err);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
        onClose();
      }
    }
  };

  if (!isModalOpen) {
    return;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-[60%] mx-auto p-6 bg-white rounded-lg shadow-md relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Company Registration
        </h2>

        {isSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            Company information submitted successfully!
          </div>
        )}

        <div className="space-y-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="name"
            >
              Company Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                ${
                  errors.name
                    ? "border-red-500 focus:ring-red-200 bg-red-50"
                    : "border-gray-300 focus:ring-blue-200 bg-white"
                }
                text-gray-900`}
              placeholder="Enter company name"
            />
            {errors.name && (
              <div className="mt-1 flex items-center text-red-500 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.name}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="email"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                ${
                  errors.email
                    ? "border-red-500 focus:ring-red-200 bg-red-50"
                    : "border-gray-300 focus:ring-blue-200 bg-white"
                }
                text-gray-900`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <div className="mt-1 flex items-center text-red-500 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.email}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="phone"
            >
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                ${
                  errors.phone
                    ? "border-red-500 focus:ring-red-200 bg-red-50"
                    : "border-gray-300 focus:ring-blue-200 bg-white"
                }
                text-gray-900`}
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <div className="mt-1 flex items-center text-red-500 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.phone}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="website"
            >
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                ${
                  errors.website
                    ? "border-red-500 focus:ring-red-200 bg-red-50"
                    : "border-gray-300 focus:ring-blue-200 bg-white"
                }
                text-gray-900`}
              placeholder="https://example.com"
            />
            {errors.website && (
              <div className="mt-1 flex items-center text-red-500 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.website}
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Administrators
            </label>
            <div className="relative mb-2">
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md cursor-pointer"
              >
                <span className={isAdminsLoading ? "text-gray-400" : ""}>
                  {isAdminsLoading
                    ? "Loading users..."
                    : "Select administrator to add"}
                </span>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${
                    isDropdownOpen ? "transform rotate-180" : ""
                  }`}
                />
              </div>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg">
                  {users.length === 0 ? (
                    <div className="p-3 text-gray-500 text-center">
                      No users available
                    </div>
                  ) : (
                    users.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => addAdmin(user.id)}
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-0"
                      >
                        <div className="font-medium text-gray-800">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-500 flex justify-between">
                          <span>{user.role}</span>
                          <span>
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="mt-2 space-y-2">
              {formData.admins.map((admin, index) => (
                <div
                  key={admin}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded"
                >
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-medium">
                      {users.find((adm) => adm.id == admin)?.name}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {users.find((adm) => adm.id == admin)?.email}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeAdmin(index)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
              {formData.admins.length === 0 && (
                <p className="text-gray-500 text-sm italic">
                  No administrators added
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                setIsLoading(false);
              }}
              className="px-4 py-2 bg-red-400 hover:bg-red-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
