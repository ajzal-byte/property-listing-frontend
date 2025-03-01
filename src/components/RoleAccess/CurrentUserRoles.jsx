import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainTabContext from '../../contexts/TabContext';
import { tabs } from '../../enums/sidebarTabsEnums';

const UserRoleManagement = ({ initialData }) => {
  const navigate = useNavigate();
  const { setMainTab } = useContext(MainTabContext);
  
  // Initialize users from localStorage if available, otherwise use initialData
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('userRoles');
    return savedUsers ? JSON.parse(savedUsers) : initialData;
  });
  
  // State for tracking edited users
  const [editedUsers, setEditedUsers] = useState({});
  // State for success message
  const [successMessage, setSuccessMessage] = useState("");

  // Set main tab
  useEffect(() => {
    setMainTab(tabs.HIDDEN);
  }, [setMainTab]);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userRoles', JSON.stringify(users));
  }, [users]);

  // Handle role change
  const handleRoleChange = (userId, newRole) => {
    setEditedUsers({
      ...editedUsers,
      [userId]: newRole
    });
  };

  // Save changes for a specific user
  const saveChanges = (userId) => {
    setUsers(users.map(user => {
      if (user.id === userId && editedUsers[userId]) {
        return { ...user, role: editedUsers[userId] };
      }
      return user;
    }));
    
    // Remove from edited users after saving
    const newEditedUsers = { ...editedUsers };
    delete newEditedUsers[userId];
    setEditedUsers(newEditedUsers);
    
    // Show success message
    setSuccessMessage(`Role updated successfully for ${users.find(u => u.id === userId).name}`);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Get badge color based on role
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "agent":
        return "bg-blue-100 text-blue-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "superadmin":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-blue-50 flex">
            <div>
              <h2 className="text-xl font-medium text-blue-800">User Role Management</h2>
              <p className="mt-1 text-sm text-blue-600">Manage user roles and permissions</p>
            </div>
            <button className='ml-[44em] bg-blue-600 text-white px-3 h-fit py-2 hover:bg-blue-700 rounded-full' onClick={() => { navigate('edit'); }}>
              View/Edit Role Permissions
            </button>
          </div>
          <div className=""></div>
          
          {successMessage && (
            <div className="m-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
              {successMessage}
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                    Stats
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                    Current Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                    New Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-800 font-medium">{user.name.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        <span className="mr-2">Leads: {user.totalleads}</span>
                        <span>Deals: {user.totaldeals}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                        value={editedUsers[user.id] || user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => saveChanges(user.id)}
                        disabled={!editedUsers[user.id] || editedUsers[user.id] === user.role}
                        className={`${
                          !editedUsers[user.id] || editedUsers[user.id] === user.role
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        } px-3 py-1 rounded-md text-sm font-medium transition-colors duration-150`}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRoleManagement;