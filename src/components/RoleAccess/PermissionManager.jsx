import React, { useState, useEffect } from 'react';
import { 
  Roles,
  PermissionCategory,
  PermissionType,
  PermissionValues,
  ListingSubCategory,
  CommonPermissionName,
} from './../../enums/rolePermissionsEnums';

import { defaultPermissions } from './DefaultRolePermissions';
import { LockKeyhole, RotateCcw, Save, ChevronDown, Check, X, PlusCircle } from 'lucide-react';

const PermissionManager = () => {
  // State to track current permissions (initialized from default or localStorage)
  const [permissions, setPermissions] = useState(null);
  // Track which categories are expanded/collapsed
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // Load permissions from localStorage or use defaults on component mount
  useEffect(() => {
    const savedPermissions = localStorage.getItem('permissions');
    if (savedPermissions) {
      setPermissions(JSON.parse(savedPermissions));
    } else {
      setPermissions(defaultPermissions);
    }
    
    // Initialize all categories as expanded
    const initialExpandedState = {};
    Object.keys(defaultPermissions.permissionCategories).forEach(category => {
      initialExpandedState[category] = true;
    });
    setExpandedCategories(initialExpandedState);
  }, []);

  // If permissions not loaded yet, show loading
  if (!permissions) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-blue-500 animate-spin mb-4"></div>
          <p className="text-blue-700 font-medium">Loading permissions...</p>
        </div>
      </div>
    );
  }

  // Handle permission value change
  const handlePermissionChange = (category, permissionName, roleKey, value, subCategory = null) => {
    // Create a deep copy of permissions to modify
    const updatedPermissions = JSON.parse(JSON.stringify(permissions));
    
    if (subCategory) {
      updatedPermissions.permissionCategories[category].subCategories[subCategory].permissions[permissionName].defaultValues[roleKey] = value;
    } else {
      updatedPermissions.permissionCategories[category].permissions[permissionName].defaultValues[roleKey] = value;
    }
    
    setPermissions(updatedPermissions);
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
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

  // For rendering permission cell with dropdown
  const renderPermissionCell = (category, permissionName, roleKey, subCategory = null) => {
    let currentValue, possibleValues;
    
    if (subCategory) {
      const subCategoryData = permissions.permissionCategories[category].subCategories[subCategory];
      if (!subCategoryData?.permissions[permissionName]) {
        return (
          <td key={`${category}-${subCategory}-${permissionName}-${roleKey}`} className="p-3 text-center border border-gray-200">
            <X className="h-4 w-4 text-gray-300 mx-auto" />
          </td>
        );
      }
      currentValue = subCategoryData.permissions[permissionName].defaultValues[roleKey];
      possibleValues = subCategoryData.permissions[permissionName].possibleValues;
    } else {
      const categoryData = permissions.permissionCategories[category];
      if (!categoryData?.permissions[permissionName]) {
        return (
          <td key={`${category}-${permissionName}-${roleKey}`} className="p-3 text-center border border-gray-200">
            <X className="h-4 w-4 text-gray-300 mx-auto" />
          </td>
        );
      }
      currentValue = categoryData.permissions[permissionName].defaultValues[roleKey];
      possibleValues = categoryData.permissions[permissionName].possibleValues;
    }

    // Determine background color based on value
    const getBgColor = (value) => {
      if (value === PermissionValues.YES || value === PermissionValues.ALL) return 'bg-green-50 text-green-800 border-green-200';
      if (value === PermissionValues.OWN) return 'bg-blue-50 text-blue-800 border-blue-200';
      if (value === PermissionValues.AGENTS) return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      if (value === PermissionValues.NO) return 'bg-red-50 text-red-800 border-red-200';
      return 'bg-gray-50 border-gray-200'; // Default
    };
    
    return (
      <td key={`${category}-${subCategory || ""}-${permissionName}-${roleKey}`} className="p-2 text-center border border-gray-200">
        <div className="relative">
          <select 
            className={`appearance-none w-full px-3 py-1 rounded text-sm ${getBgColor(currentValue)} border focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300`}
            value={currentValue}
            onChange={(e) => handlePermissionChange(category, permissionName, roleKey, e.target.value, subCategory)}
          >
            {possibleValues.map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown className="h-3 w-3" />
          </div>
        </div>
      </td>
    );
  };

  // Format the permission name for display
  const formatPermissionName = (category, permissionName, subCategory = null) => {
    // Combine the category name with permission action
    let displayName = permissionName;
    
    if (category === PermissionCategory.PROPERTY_LISTING) {
      displayName = `${permissionName} Listings`;
    } else if (category === PermissionCategory.USER_MANAGEMENT) {
      displayName = `${permissionName} Users`;
    } else if (category === PermissionCategory.FINANCIAL) {
      displayName = `${permissionName} Financial Data`;
    } else if (category === PermissionCategory.SETTINGS) {
      displayName = `${permissionName} Settings`;
    }
    
    // If it's a subcategory, make it more specific
    if (subCategory) {
      if (subCategory === ListingSubCategory.POCKET) {
        displayName = `${permissionName} Pocket Listings`;
      } else if (subCategory === ListingSubCategory.LIVE) {
        displayName = `${permissionName} Live Listings`;
      } else if (subCategory === ListingSubCategory.DRAFT) {
        displayName = `${permissionName} Draft Listings`;
      } else if (subCategory === ListingSubCategory.PUBLISH) {
        if (permissionName === CommonPermissionName.PUBLISH) {
          displayName = "Publish Listings";
        } else if (permissionName === CommonPermissionName.UNPUBLISH) {
          displayName = "Unpublish Listings";
        }
      }
    }
    
    return displayName;
  };

  // Generate the permission rows
  const generatePermissionRows = () => {
    const rows = [];
    
    Object.entries(permissions.permissionCategories).forEach(([categoryKey, categoryData]) => {
      // Category header row
      rows.push(
        <tr key={categoryKey} className="bg-gray-100 cursor-pointer" onClick={() => toggleCategoryExpansion(categoryKey)}>
          <td colSpan={permissions.roles.length + 1} className="p-3 font-bold text-gray-800 border border-gray-300">
            <div className="flex items-center">
              <ChevronDown 
                className={`h-4 w-4 mr-2 transform transition-transform ${expandedCategories[categoryKey] ? 'rotate-180' : ''}`} 
              />
              {categoryKey}
            </div>
          </td>
        </tr>
      );
      
      // Only show permission rows if category is expanded
      if (expandedCategories[categoryKey]) {
        if (categoryData.type === PermissionType.SIMPLE) {
          // Simple permission rows
          Object.entries(categoryData.permissions).forEach(([permName, permData]) => {
            rows.push(
              <tr key={`${categoryKey}-${permName}`} className="hover:bg-blue-50">
                <td className="p-3 pl-8 text-gray-700 border border-gray-200 font-medium">
                  {formatPermissionName(categoryKey, permName)}
                </td>
                {permissions.roles.map(roleKey => (
                  renderPermissionCell(categoryKey, permName, roleKey)
                ))}
              </tr>
            );
          });
        } else if (categoryData.type === PermissionType.COMPLEX) {
          // Complex category with subcategories
          Object.entries(categoryData.subCategories).forEach(([subCatKey, subCatData]) => {
            // Subcategory header
            rows.push(
              <tr key={`${categoryKey}-${subCatKey}`} className="bg-gray-50">
                <td colSpan={permissions.roles.length + 1} className="p-2 pl-8 text-gray-700 border border-gray-200 font-medium">
                  {subCatKey} {subCatData.description ? `(${subCatData.description})` : ''}
                </td>
              </tr>
            );
            
            // Subcategory permissions
            Object.entries(subCatData.permissions).forEach(([permName, permData]) => {
              rows.push(
                <tr key={`${categoryKey}-${subCatKey}-${permName}`} className="hover:bg-blue-50">
                  <td className="p-3 pl-12 text-gray-700 border border-gray-200">
                    {formatPermissionName(categoryKey, permName, subCatKey)}
                  </td>
                  {permissions.roles.map(roleKey => (
                    renderPermissionCell(categoryKey, permName, roleKey, subCatKey)
                  ))}
                </tr>
              );
            });
          });
        }
      }
    });
    
    return rows;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <div className='flex items-center gap-3'>
          <LockKeyhole className='text-3xl font-bold text-blue-800'/>
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Roles & Permissions</h1>
          </div>
          <p className="text-gray-600">
            Permissions available for default roles. Create a custom role to upgrade the capabilities of a default role. 
            <a href="#" className="text-blue-600 ml-1 hover:underline">Learn more</a>
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-left font-medium text-gray-500 w-1/3">List of Permissions</th>
                  {permissions.roles.map(role => (
                    <th key={role} className="p-4 text-center font-medium text-gray-700 border-l border-gray-200">
                      {role}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {generatePermissionRows()}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex justify-between items-center">

          {/* Open custom role creation dialog  */}
          {/* <button 
            className="px-6 py-3 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
            onClick={() => {}} 
          >
            <div className="flex items-center">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Custom Role
            </div>
          </button> */}
          
          <div className="flex gap-4 mb-6 ml-auto">
            
            <button 
              onClick={resetPermissions}
              className="px-5 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-300 transition-all hover:shadow-sm flex items-center"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </button>
            <button 
              onClick={savePermissions}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:shadow-sm flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionManager;