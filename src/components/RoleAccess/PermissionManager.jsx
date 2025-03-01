import React, { useState, useEffect } from 'react';
import { 
  Roles,
  PermissionCategory,
  PermissionType,
  PermissionValues,
  ListingSubCategory,
  CommonPermissionName,
} from './../../enums/rolePermissionsEnums'; // Import the enums and default structure

import { defaultPermissions } from './DefaultRolePermissions';
import { LockKeyhole, RotateCcw, Save, UserRoundPen, ChevronDown, Check } from 'lucide-react';

const PermissionManager = () => {
    
  // State to track current permissions (initialized from default or localStorage)
  const [permissions, setPermissions] = useState(null);
  // Track which role is currently being edited
  const [selectedRole, setSelectedRole] = useState(Roles.AGENT);
  // Track if "Change Permission By Roles" modal is open
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  // Track which categories are enabled/disabled via toggle  
  const [enabledCategories, setEnabledCategories] = useState({});

  // Load permissions from localStorage or use defaults on component mount
  useEffect(() => {
    const savedPermissions = localStorage.getItem('permissions');
    if (savedPermissions) {
      setPermissions(JSON.parse(savedPermissions));
    } else {
      setPermissions(defaultPermissions);
    }
    
    // Initialize all categories as enabled
    const initialEnabledState = {};
    Object.keys(defaultPermissions.permissionCategories).forEach(category => {
      initialEnabledState[category] = true;
      
      // For complex categories, also enable all subcategories
      if (defaultPermissions.permissionCategories[category].type === PermissionType.COMPLEX) {
        Object.keys(defaultPermissions.permissionCategories[category].subCategories).forEach(subCategory => {
          initialEnabledState[`${category}.${subCategory}`] = true;
        });
      }
    });
    setEnabledCategories(initialEnabledState);
  }, []);

  // If permissions not loaded yet, show loading
  if (!permissions) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-blue-500 animate-spin mb-4"></div>
          <p className="text-blue-700 font-medium">Loading permissions...</p>
        </div>
      </div>
    );
  }

  // Get all unique permission names across all categories
  const getAllPermissionNames = () => {
    const permissionNames = new Set();
    
    Object.keys(permissions.permissionCategories).forEach(categoryKey => {
      const category = permissions.permissionCategories[categoryKey];
      
      if (category.type === PermissionType.SIMPLE) {
        Object.keys(category.permissions).forEach(permName => {
          permissionNames.add(permName);
        });
      } else if (category.type === PermissionType.COMPLEX) {
        Object.keys(category.subCategories).forEach(subCatKey => {
          Object.keys(category.subCategories[subCatKey].permissions).forEach(permName => {
            permissionNames.add(permName);
          });
        });
      }
    });
    
    return Array.from(permissionNames);
  };

  // Handle toggle for category or subcategory - prevent default to avoid page jumps
  const handleToggle = (category, subCategory = null, e) => {
    // Prevent default behavior to avoid page scrolling
    if (e) e.preventDefault();
    
    const key = subCategory ? `${category}.${subCategory}` : category;
    
    // Create a deep copy of permissions to modify
    const updatedPermissions = JSON.parse(JSON.stringify(permissions));
    const categoryData = updatedPermissions.permissionCategories[category];
    
    // Update enabled categories state
    setEnabledCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    // If disabling, set all permissions to negative values
    if (enabledCategories[key]) {
      if (!subCategory) {
        // Disable entire category
        if (categoryData.type === PermissionType.SIMPLE) {
          Object.keys(categoryData.permissions).forEach(permName => {
            const possibleValues = categoryData.permissions[permName].possibleValues;
            // Set to most negative value (NO, or last value if no NO)
            const negativeValue = possibleValues.includes(PermissionValues.NO) 
              ? PermissionValues.NO 
              : possibleValues[possibleValues.length - 1];
            
            categoryData.permissions[permName].defaultValues[selectedRole] = negativeValue;
          });
        } else {
          // For complex categories, disable all subcategories
          Object.keys(categoryData.subCategories).forEach(subCat => {
            Object.keys(categoryData.subCategories[subCat].permissions).forEach(permName => {
              const possibleValues = categoryData.subCategories[subCat].permissions[permName].possibleValues;
              const negativeValue = possibleValues.includes(PermissionValues.NO) 
                ? PermissionValues.NO 
                : possibleValues[possibleValues.length - 1];
              
              categoryData.subCategories[subCat].permissions[permName].defaultValues[selectedRole] = negativeValue;
            });
            
            // Also update subcategory toggle state
            setEnabledCategories(prev => ({
              ...prev,
              [`${category}.${subCat}`]: false
            }));
          });
        }
      } else {
        // Disable specific subcategory
        Object.keys(categoryData.subCategories[subCategory].permissions).forEach(permName => {
          const possibleValues = categoryData.subCategories[subCategory].permissions[permName].possibleValues;
          const negativeValue = possibleValues.includes(PermissionValues.NO) 
            ? PermissionValues.NO 
            : possibleValues[possibleValues.length - 1];
          
          categoryData.subCategories[subCategory].permissions[permName].defaultValues[selectedRole] = negativeValue;
        });
      }
    }
    
    setPermissions(updatedPermissions);
  };

  // Handle change of permission value
  const handlePermissionChange = (category, permissionName, value, subCategory = null) => {
    // Create a deep copy of permissions to modify
    const updatedPermissions = JSON.parse(JSON.stringify(permissions));
    
    if (subCategory) {
      updatedPermissions.permissionCategories[category].subCategories[subCategory].permissions[permissionName].defaultValues[selectedRole] = value;
    } else {
      updatedPermissions.permissionCategories[category].permissions[permissionName].defaultValues[selectedRole] = value;
    }
    
    setPermissions(updatedPermissions);
  };

  // Save permissions to localStorage
  const savePermissions = () => {
    localStorage.setItem('permissions', JSON.stringify(permissions));
    
    // Create a notification element
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
    notification.textContent = 'Permissions saved successfully!';
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => document.body.removeChild(notification), 500);
    }, 3000);
  };

  // Reset permissions to default
  const resetPermissions = () => {
    setPermissions(defaultPermissions);
    // Also reset all toggles to enabled
    const resetEnabledState = {};
    Object.keys(defaultPermissions.permissionCategories).forEach(category => {
      resetEnabledState[category] = true;
      
      if (defaultPermissions.permissionCategories[category].type === PermissionType.COMPLEX) {
        Object.keys(defaultPermissions.permissionCategories[category].subCategories).forEach(subCategory => {
          resetEnabledState[`${category}.${subCategory}`] = true;
        });
      }
    });
    setEnabledCategories(resetEnabledState);
    
    // Create a notification element
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
    notification.textContent = 'Permissions reset to default!';
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => document.body.removeChild(notification), 500);
    }, 3000);
  };

  // For rendering permissions dropdown
  const renderDropdown = (category, permissionName, currentValue, possibleValues, subCategory = null) => {
    const key = subCategory ? `${category}.${subCategory}` : category;
    const isDisabled = !enabledCategories[key];
    
    // Determine background color based on value
    const getBgColor = (value) => {
      if (value === PermissionValues.YES || value === PermissionValues.OWN) return 'bg-green-50 border-green-300';
      if (value === PermissionValues.NO) return 'bg-red-50 border-red-300';
      return 'bg-yellow-50 border-yellow-300'; // For "undefined" or other values
    };
    
    return (
      <div className="relative">
        <select 
          className={`appearance-none w-full px-4 py-2 rounded-lg text-sm transition-all duration-300 
            border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300
            ${isDisabled ? 'bg-gray-100 text-gray-400 border-gray-200' : getBgColor(currentValue)}`}
          value={currentValue}
          onChange={(e) => handlePermissionChange(category, permissionName, e.target.value, subCategory)}
          disabled={isDisabled}
        >
          {possibleValues.map(value => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    );
  };

  // Create a simpler toggle switch component
  const ToggleSwitch = ({ checked, onChange }) => {
    return (
     <label className="inline-flex items-center cursor-pointer">
  <div className="relative">
    <input
      type="checkbox"
      className="sr-only"
      checked={checked}
      onChange={onChange}
    />
    <div className={`block w-10 h-6 rounded-full transition ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${checked ? 'translate-x-4' : ''}`}></div>
  </div>
</label>
    );
  };

  // Get all unique permission names to use as table headers
  const allPermissionNames = getAllPermissionNames();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 mb-6">
      <div className="container mx-auto px-4 max-w-7xl mb-6">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
              <LockKeyhole className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Permission Manager</h1>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsRoleModalOpen(!isRoleModalOpen)}
              className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <UserRoundPen className="h-5 w-5" />
              Change Role: 
              <div className='font-bold'>{selectedRole}</div>
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
            
            {isRoleModalOpen && (
              <div className="absolute right-0 mt-2 bg-white rounded-xl border border-blue-100 shadow-xl z-10 w-full min-w-[200px] overflow-hidden">
                {Object.values(Roles).map(role => (
                  <button
                    key={role}
                    className=" w-full text-left px-5 py-3 hover:bg-blue-50 transition-colors duration-150 border-b border-blue-50 last:border-0 flex items-center gap-3"
                    onClick={() => {
                      setSelectedRole(role);
                      setIsRoleModalOpen(false);
                    }}
                  >
                    <div className={`w-2 h-2 rounded-full ${selectedRole === role ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-blue-100">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <th className="p-5 text-left font-semibold text-lg rounded-tl-lg w-64 border border-blue-400">Permission Categories</th>
                  {allPermissionNames.map((permName, index) => (
                    <th 
                      key={permName} 
                      className={`p-4 text-center font-medium border border-blue-400 ${index === allPermissionNames.length - 1 ? 'rounded-tr-lg' : ''}`}
                    >
                      {permName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(permissions.permissionCategories).map((categoryKey, categoryIndex) => {
                  const category = permissions.permissionCategories[categoryKey];
                  
                  if (category.type === PermissionType.SIMPLE) {
                    // Render simple category
                    return (
                      <tr key={categoryKey} className={`hover:bg-blue-50 transition-colors duration-200 ${categoryIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="p-5 flex items-center gap-4 border border-gray-200">
                          <ToggleSwitch 
                            checked={enabledCategories[categoryKey]}
                            onChange={(e) => handleToggle(categoryKey, null, e)}
                          />
                          <span className="font-medium text-gray-800">{categoryKey}</span>
                        </td>
                        
                        {allPermissionNames.map(permName => {
                          // Check if this permission exists in this category
                          if (category.permissions[permName]) {
                            const currentValue = category.permissions[permName].defaultValues[selectedRole];
                            const possibleValues = category.permissions[permName].possibleValues;
                            
                            return (
                              <td key={`${categoryKey}-${permName}`} className="p-4 text-center border border-gray-200">
                                {renderDropdown(categoryKey, permName, currentValue, possibleValues)}
                              </td>
                            );
                          }
                          return <td key={`${categoryKey}-${permName}`} className="p-4 text-center border border-gray-200 text-gray-500 italic text-sm">NO ACCESS</td>;
                        })}
                      </tr>
                    );
                  } else {
                    // Render complex category with subcategories
                    return (
                      <React.Fragment key={categoryKey}>
                        {/* Category Header */}
                        <tr className="bg-blue-100 font-bold">
                          <td className="p-4 flex items-center gap-4 border border-blue-200">
                            <ToggleSwitch 
                              checked={enabledCategories[categoryKey]}
                              onChange={(e) => handleToggle(categoryKey, null, e)}
                            />
                            <span className="font-bold text-blue-800">{categoryKey}</span>
                          </td>
                          {allPermissionNames.map(permName => (
                            <td key={`${categoryKey}-header-${permName}`} className="p-4 border border-blue-200"></td>
                          ))}
                        </tr>
                        
                        {/* Subcategories */}
                        {Object.keys(category.subCategories).map((subCatKey, subIndex) => {
                          const subCategory = category.subCategories[subCatKey];
                          return (
                            <tr 
                              key={`${categoryKey}-${subCatKey}`} 
                              className={`hover:bg-blue-50 transition-colors duration-200 ${subIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                            >
                              <td className="p-4 pl-12 flex items-center gap-4 border border-gray-200">
                                <ToggleSwitch 
                                  checked={enabledCategories[`${categoryKey}.${subCatKey}`]}
                                  onChange={(e) => handleToggle(categoryKey, subCatKey, e)}
                                />
                                <div>
                                  <span className="font-medium text-gray-800">{subCatKey}</span>
                                  {subCategory.description && (
                                    <p className="text-xs text-gray-500 mt-1">{subCategory.description}</p>
                                  )}
                                </div>
                              </td>
                              
                              {allPermissionNames.map(permName => {
                                // Check if this permission exists in this subcategory
                                if (subCategory.permissions[permName]) {
                                  const currentValue = subCategory.permissions[permName].defaultValues[selectedRole];
                                  const possibleValues = subCategory.permissions[permName].possibleValues;
                                  
                                  return (
                                    <td key={`${categoryKey}-${subCatKey}-${permName}`} className="p-4 text-center border border-gray-200">
                                      {renderDropdown(categoryKey, permName, currentValue, possibleValues, subCatKey)}
                                    </td>
                                  );
                                }
                                return <td key={`${categoryKey}-${subCatKey}-${permName}`} className="p-4 text-center border border-gray-200 text-gray-500 italic text-sm">NO ACCESS</td>;
                              })}
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex justify-end gap-4 pb-6">
          <button 
            onClick={resetPermissions}
            className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-300 transition-all duration-300 hover:shadow-md flex items-center gap-2"
          >
            <RotateCcw className="h-5 w-5" />
            Reset
          </button>
          <button 
            onClick={savePermissions}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
          >
            <Save className="h-5 w-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionManager;