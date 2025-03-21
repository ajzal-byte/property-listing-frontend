import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

const RoleCreationPage = () => {
  const [permissionData, setPermissionData] = useState(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [baseRole, setBaseRole] = useState('')

  // Fetch permission data from localStorage
  useEffect(() => {
    try {
      const storedData = localStorage.getItem('permissions');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setPermissionData(parsedData);

        // Set the first role as the default base role if there are any roles
        if (parsedData.roles.length > 0) {
          setBaseRole(parsedData.roles[0]);
        }

        initializeNewRolePermissions(parsedData, parsedData.roles.length > 0 ? parsedData.roles[0] : null);
        setIsLoading(false);
      } else {
        setError('Permission data not found in localStorage');
        setIsLoading(false);
      }
    } catch (error) {
      setError('Error loading permission data: ' + error.message);
      setIsLoading(false);
    }
  }, []);

  // Initialize new role permissions with first value from possible values
  const initializeNewRolePermissions = (data, baseRole) => {
    const initialPermissions = {};
    
    Object.keys(data.permissionCategories).forEach(category => {
      const categoryData = data.permissionCategories[category];
      
      if (categoryData.type === 'simple') {
        Object.keys(categoryData.permissions).forEach(permission => {
          // Use the value from the base role if it exists, otherwise use the first possible value
          initialPermissions[`${category}-${permission}`] = 
            baseRole && categoryData.permissions[permission].defaultValues[baseRole] 
              ? categoryData.permissions[permission].defaultValues[baseRole]
              : categoryData.permissions[permission].possibleValues[0];
        });
      } else if (categoryData.type === 'complex') {
        Object.keys(categoryData.subCategories).forEach(subCategory => {
          Object.keys(categoryData.subCategories[subCategory].permissions).forEach(permission => {
            // Use the value from the base role if it exists, otherwise use the first possible value
            initialPermissions[`${category}-${subCategory}-${permission}`] = 
              baseRole && categoryData.subCategories[subCategory].permissions[permission].defaultValues[baseRole]
                ? categoryData.subCategories[subCategory].permissions[permission].defaultValues[baseRole]
                : categoryData.subCategories[subCategory].permissions[permission].possibleValues[0];
          });
        });
      }
    });
    
    setNewRolePermissions(initialPermissions);
  };

  // Handle permission selection change
  const handlePermissionChange = (key, value) => {
    setNewRolePermissions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Create new role
  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      alert("Please enter a role name");
      return;
    }
    
    if (permissionData.roles.includes(newRoleName)) {
      alert("Role name already exists. Please choose a different name.");
      return;
    }
    
    // Add new role to the roles array
    const updatedRoles = [...permissionData.roles, newRoleName];
    
    // Update permission categories with new role defaults
    const updatedPermissionCategories = {...permissionData.permissionCategories};
    
    // Process all permission categories
    Object.keys(updatedPermissionCategories).forEach(category => {
      const categoryData = updatedPermissionCategories[category];
      
      if (categoryData.type === 'simple') {
        Object.keys(categoryData.permissions).forEach(permission => {
          categoryData.permissions[permission].defaultValues[newRoleName] = 
            newRolePermissions[`${category}-${permission}`];
        });
      } else if (categoryData.type === 'complex') {
        Object.keys(categoryData.subCategories).forEach(subCategory => {
          Object.keys(categoryData.subCategories[subCategory].permissions).forEach(permission => {
            categoryData.subCategories[subCategory].permissions[permission].defaultValues[newRoleName] = 
              newRolePermissions[`${category}-${subCategory}-${permission}`];
          });
        });
      }
    });
    
    // Update localStorage
    const updatedData = {
      roles: updatedRoles,
      permissionCategories: updatedPermissionCategories
    };
    
    localStorage.setItem('permissions', JSON.stringify(updatedData));
    setPermissionData(updatedData);
    
    // Show success message and reset form
    setSuccessMessage(`Role "${newRoleName}" created successfully!`);
    setNewRoleName('');
    initializeNewRolePermissions(updatedData);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Render permission selection controls
  const renderPermissionControls = (permission, possibleValues, key) => {
    return (
      <div className="mt-1 space-x-2">
        {possibleValues.map((value) => (
          <button
            key={`${key}-${value}`}
            className={`px-3 py-1 text-sm rounded-md ${
              newRolePermissions[key] === value
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
            onClick={() => handlePermissionChange(key, value)}
          >
            {value}
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-md mx-auto bg-red-100 p-4 rounded-md border border-red-300 text-red-700">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">
              Create New Role
            </h1>
            <p className="text-gray-600 mt-1">
              Configure permissions for a new user role
            </p>
          </div>

          {/* UI for base permission selection */}
          <div className="my-4">
            <label
              htmlFor="baseRole"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Base Role (Copy permissions from)
            </label>
            <select
              id="baseRole"
              value={baseRole}
              onChange={(e) => {
                setBaseRole(e.target.value);
                initializeNewRolePermissions(permissionData, e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {permissionData.roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md flex items-center justify-between">
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-green-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Role name input */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="mb-4">
            <label
              htmlFor="roleName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role Name
            </label>
            <input
              id="roleName"
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter role name"
            />
          </div>

          <div className="text-sm text-gray-500">
            <p>Existing roles: {permissionData.roles.join(", ")}</p>
          </div>
        </div>

        {/* Permissions Configuration */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Permissions Configuration
          </h2>

          {/* Simple Categories */}
          {Object.keys(permissionData.permissionCategories).map((category) => {
            const categoryData = permissionData.permissionCategories[category];

            return (
              <div key={category} className="mb-4">
                <h3 className="font-medium text-blue-800 bg-blue-50 px-3 py-2 rounded-md mb-3">
                  {category}
                </h3>

                {/* Simple category permissions */}
                {categoryData.type === "simple" && (
                  <div className="space-y-3 pl-2">
                    {Object.keys(categoryData.permissions).map((permission) => {
                      const permissionData =
                        categoryData.permissions[permission];
                      const permissionKey = `${category}-${permission}`;

                      return (
                        <div
                          key={permissionKey}
                          className="border-b border-gray-100 pb-3"
                        >
                          <div className="flex items-center justify-between">
                            <label className="text-gray-700">
                              {permission}
                            </label>
                            <span className="text-sm px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                              {newRolePermissions[permissionKey]}
                            </span>
                          </div>
                          {renderPermissionControls(
                            permission,
                            permissionData.possibleValues,
                            permissionKey
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Complex category with subcategories - flattened */}
                {categoryData.type === "complex" && (
                  <div className="space-y-3 pl-2">
                    {Object.keys(categoryData.subCategories).map(
                      (subCategory) => {
                        const subCategoryData =
                          categoryData.subCategories[subCategory];

                        return (
                          <div key={subCategory} className="mb-3">
                            <h4 className="font-medium text-gray-700 mb-2">
                              {subCategory}
                              {subCategoryData.description && (
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                  ({subCategoryData.description})
                                </span>
                              )}
                            </h4>

                            <div className="space-y-3 pl-2">
                              {Object.keys(subCategoryData.permissions).map(
                                (permission) => {
                                  const permissionData =
                                    subCategoryData.permissions[permission];
                                  const permissionKey = `${category}-${subCategory}-${permission}`;

                                  return (
                                    <div
                                      key={permissionKey}
                                      className="border-b border-gray-100 pb-3"
                                    >
                                      <div className="flex items-center justify-between">
                                        <label className="text-gray-700">
                                          {permission}
                                        </label>
                                        <span className="text-sm px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                                          {newRolePermissions[permissionKey]}
                                        </span>
                                      </div>
                                      {renderPermissionControls(
                                        permission,
                                        permissionData.possibleValues,
                                        permissionKey
                                      )}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-3 hover:bg-gray-300"
           
            onClick={() => {
                setNewRoleName('');
                if (permissionData.roles.length > 0) {
                  setBaseRole(permissionData.roles[0]);
                  initializeNewRolePermissions(permissionData, permissionData.roles[0]);
                } else {
                  initializeNewRolePermissions(permissionData, null);
                }
              }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
            onClick={handleCreateRole}
          >
            <Save size={16} className="mr-2" />
            Create Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleCreationPage;