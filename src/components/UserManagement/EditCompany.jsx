import { useState, useEffect } from "react";
import { X, Save, Building, Mail, Phone, Globe, Users } from "lucide-react";

export default function CompanyEditModal({ isModalOpen, company, onClose }) {
  const [formData, setFormData] = useState({
    name: company?.name || "",
    email: company?.email || "",
    phone: company?.phone || "",
    website: company?.website || "",
    admins_to_add: [],
    admins_to_remove: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [unassociatedAdminsloading, setUnassociatedAdminsLoading] =
    useState(false);
  const [unassociatedAdmins, setUnassociatedAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      setUnassociatedAdminsLoading(true);
      try {
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
        setUnassociatedAdmins(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setUnassociatedAdminsLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Filter admin users who can be added (role=admin and company_id=null)
  const availableAdmins = unassociatedAdmins || [];

  // Filter admin users who can be removed (role=admin and already in the company)
  const removableAdmins = company?.admin_users || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on field change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const toggleAdminAdd = (adminId) => {
    setFormData((prev) => {
      const updatedAdmins = prev.admins_to_add.includes(adminId)
        ? prev.admins_to_add.filter((id) => id !== adminId)
        : [...prev.admins_to_add, adminId];

      return { ...prev, admins_to_add: updatedAdmins };
    });
  };

  const toggleAdminRemove = (adminId) => {
    setFormData((prev) => {
      const updatedAdmins = prev.admins_to_remove.includes(adminId)
        ? prev.admins_to_remove.filter((id) => id !== adminId)
        : [...prev.admins_to_remove, adminId];

      return { ...prev, admins_to_remove: updatedAdmins };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Company name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.website.trim()) {
      newErrors.website = "Website is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // try {
    //   await onSubmit(formData);
    //   onClose();
    // } catch (error) {
    //   console.error("Error updating company:", error);
    // } finally {
    //   setLoading(false);
    // }
    try {
      setLoading(true);
      console.log(formData);

      const response = await fetch(
        `https://backend.myemirateshome.com/api/companies/${company.id}`,
        {
          method: "PUT",
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

        window.alert("Company Update failed");
        throw new Error("Company Update failed");
      }

      const data = await response.json();
      console.log("response after creation: ", data);

      window.alert("Company Updated successfully");
      window.location.reload()
    } catch (err) {
      // setError('Registration failed. Please try again.');
      console.log("error in EditCompany.jsx : ", err);
      setLoading(false);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  // Initialize form data when company prop changes
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        email: company.email || "",
        phone: company.phone || "",
        website: company.website || "",
        admins_to_add: [],
        admins_to_remove: [],
      });
    }
  }, [company]);

  if (!company) return null;
  if (!isModalOpen) return;
  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Edit Company</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-5">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter company name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter company email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter phone number"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.website ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter website URL"
                />
              </div>
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">{errors.website}</p>
              )}
            </div>

            {/* Admin Management Section */}
            <div className="pt-4 border-t">
              <div className="flex items-center mb-3">
                <Users size={18} className="mr-2 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-700">
                  Admin Management
                </h3>
              </div>

              {/* Add Admins Section */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Add Admins
                </h4>
                {availableAdmins.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {availableAdmins.map((admin) => (
                      <div
                        key={`add-${admin.id}`}
                        className={`flex items-center justify-between p-2 border rounded-md cursor-pointer ${
                          formData.admins_to_add.includes(admin.id)
                            ? "bg-blue-50 border-blue-300"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                        onClick={() => toggleAdminAdd(admin.id)}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                            {admin.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{admin.name}</p>
                            <p className="text-xs text-gray-500">
                              {admin.email}
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.admins_to_add.includes(admin.id)}
                          onChange={() => {}}
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No admins available to add
                  </p>
                )}
              </div>

              {/* Remove Admins Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Remove Admins
                </h4>
                {removableAdmins.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {removableAdmins.map((admin) => (
                      <div
                        key={`remove-${admin.id}`}
                        className={`flex items-center justify-between p-2 border rounded-md cursor-pointer ${
                          formData.admins_to_remove.includes(admin.id)
                            ? "bg-red-50 border-red-300"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                        onClick={() => toggleAdminRemove(admin.id)}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                            {admin.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{admin.name}</p>
                            <p className="text-xs text-gray-500">
                              {admin.email}
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.admins_to_remove.includes(admin.id)}
                          onChange={() => {}}
                          className="h-4 w-4 text-red-600 rounded focus:ring-red-500"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No admins available to remove
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save size={18} className="mr-1" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
