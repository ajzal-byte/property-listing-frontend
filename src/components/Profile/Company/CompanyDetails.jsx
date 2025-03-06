import React, { useState, useEffect } from 'react';
import { Edit, Share, Globe, Phone, Mail, MapPin, Users, Award, Facebook, Instagram, MessageCircle, Send } from 'lucide-react';

const CompanyDetailsSection = () => {
  // Initialize with mock data
  const [companyData, setCompanyData] = useState(() => {
    const savedData = localStorage.getItem('companyData');
    return savedData ? JSON.parse(savedData) : {
      name: 'VortexWeb Real Estate LLC',
      logo: "user.png",
      phone: '+97143484850',
      website: 'https://aghalirealestate.com',
      employees: '11-25',
      country: 'United Arab Emirates',
      email: 'contact@vortex.com',
      address: 'Nassima Tower - Trade Center',
      agencyReward: 100,
      socialMedia: {
        whatsapp: '',
        facebook: 'www.facebook.com/vortexweb',
        telegram: '',
        instagram: 'www.instagram.com/vortexweb'
      }
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({...companyData});

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('companyData', JSON.stringify(companyData));
  }, [companyData]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedData({...companyData});
  };

  const handleSave = () => {
    setCompanyData(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditedData({
        ...editedData,
        [parent]: {
          ...editedData[parent],
          [child]: value
        }
      });
    } else {
      setEditedData({
        ...editedData,
        [name]: value
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My company</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Logo and main details */}
          <div className="flex-shrink-0">
            <img 
              src={companyData.logo || "user.png"} 
              alt={companyData.name} 
              className="w-24 h-24 rounded-md object-cover" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 flex-grow">
            {/* Company Name */}
            <div className="flex flex-col">
              <div className="flex items-center text-gray-500 mb-1">
                <span className="text-sm">Name</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedData.name}
                  onChange={handleChange}
                  className="border rounded p-1"
                />
              ) : (
                <span className="font-medium">{companyData.name}</span>
              )}
            </div>
            
            {/* Phone number */}
            <div className="flex flex-col">
              <div className="flex items-center text-gray-500 mb-1">
                <Phone size={16} className="mr-1" />
                <span className="text-sm">Phone number</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={editedData.phone}
                  onChange={handleChange}
                  className="border rounded p-1"
                />
              ) : (
                <span className="font-medium">{companyData.phone}</span>
              )}
            </div>
            
            {/* Website */}
            <div className="flex flex-col">
              <div className="flex items-center text-gray-500 mb-1">
                <Globe size={16} className="mr-1" />
                <span className="text-sm">Link to website</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="website"
                  value={editedData.website}
                  onChange={handleChange}
                  className="border rounded p-1"
                />
              ) : (
                <a href={companyData.website} className="text-blue-600" target="_blank" rel="noopener noreferrer">
                  {companyData.website}
                </a>
              )}
            </div>
            
            {/* Employees */}
            <div className="flex flex-col">
              <div className="flex items-center text-gray-500 mb-1">
                <Users size={16} className="mr-1" />
                <span className="text-sm">Employees</span>
              </div>
              {isEditing ? (
                <select
                  name="employees"
                  value={editedData.employees}
                  onChange={handleChange}
                  className="border rounded p-1"
                >
                  <option value="1-10">1-10</option>
                  <option value="11-25">11-25</option>
                  <option value="26-50">26-50</option>
                  <option value="51+">51+</option>
                </select>
              ) : (
                <span className="font-medium">{companyData.employees}</span>
              )}
            </div>
            
            {/* Country */}
            <div className="flex flex-col">
              <div className="flex items-center text-gray-500 mb-1">
                <Globe size={16} className="mr-1" />
                <span className="text-sm">Country</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="country"
                  value={editedData.country}
                  onChange={handleChange}
                  className="border rounded p-1"
                />
              ) : (
                <span className="font-medium">{companyData.country}</span>
              )}
            </div>
            
            {/* Email */}
            <div className="flex flex-col">
              <div className="flex items-center text-gray-500 mb-1">
                <Mail size={16} className="mr-1" />
                <span className="text-sm">E-mail</span>
              </div>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editedData.email}
                  onChange={handleChange}
                  className="border rounded p-1"
                />
              ) : (
                <span className="font-medium">{companyData.email}</span>
              )}
            </div>
            
            {/* Address */}
            <div className="flex flex-col">
              <div className="flex items-center text-gray-500 mb-1">
                <MapPin size={16} className="mr-1" />
                <span className="text-sm">Address</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={editedData.address}
                  onChange={handleChange}
                  className="border rounded p-1"
                />
              ) : (
                <span className="font-medium">{companyData.address}</span>
              )}
            </div>
            
            {/* Agency reward */}
            <div className="flex flex-col">
              <div className="flex items-center text-gray-500 mb-1">
                <Award size={16} className="mr-1" />
                <span className="text-sm">Agency reward</span>
              </div>
              {isEditing ? (
                <input
                  type="number"
                  name="agencyReward"
                  value={editedData.agencyReward}
                  onChange={handleChange}
                  className="border rounded p-1"
                />
              ) : (
                <span className="font-medium">{companyData.agencyReward}</span>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0">
            {isEditing ? (
              <div className="flex space-x-2">
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button 
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={handleEditClick}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Edit size={16} className="mr-2" />
                  Edit Company
                </button>
                <button className="flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded hover:bg-orange-200">
                  <Share size={16} className="mr-2" />
                  Share Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Social Media */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 border-t pt-6">
        {/* WhatsApp */}
        <div className="flex flex-col">
          <div className="flex items-center text-gray-500 mb-1">
            <MessageCircle size={16} className="mr-1" />
            <span className="text-sm">WhatsApp</span>
          </div>
          {isEditing ? (
            <input
              type="text"
              name="socialMedia.whatsapp"
              value={editedData.socialMedia.whatsapp}
              onChange={handleChange}
              className="border rounded p-1"
              placeholder="Add WhatsApp number"
            />
          ) : (
            <span className="font-medium">{companyData.socialMedia.whatsapp || "-"}</span>
          )}
        </div>
        
        {/* Facebook */}
        <div className="flex flex-col">
          <div className="flex items-center text-gray-500 mb-1">
            <Facebook size={16} className="mr-1" />
            <span className="text-sm">Facebook</span>
          </div>
          {isEditing ? (
            <input
              type="text"
              name="socialMedia.facebook"
              value={editedData.socialMedia.facebook}
              onChange={handleChange}
              className="border rounded p-1"
            />
          ) : (
            <span className="font-medium">{companyData.socialMedia.facebook}</span>
          )}
        </div>
        
        {/* Telegram */}
        <div className="flex flex-col">
          <div className="flex items-center text-gray-500 mb-1">
            <Send size={16} className="mr-1" />
            <span className="text-sm">Telegram</span>
          </div>
          {isEditing ? (
            <input
              type="text"
              name="socialMedia.telegram"
              value={editedData.socialMedia.telegram}
              onChange={handleChange}
              className="border rounded p-1"
              placeholder="Add Telegram handle"
            />
          ) : (
            <span className="font-medium">{companyData.socialMedia.telegram || "-"}</span>
          )}
        </div>
        
        {/* Instagram */}
        <div className="flex flex-col">
          <div className="flex items-center text-gray-500 mb-1">
            <Instagram size={16} className="mr-1" />
            <span className="text-sm">Instagram</span>
          </div>
          {isEditing ? (
            <input
              type="text"
              name="socialMedia.instagram"
              value={editedData.socialMedia.instagram}
              onChange={handleChange}
              className="border rounded p-1"
            />
          ) : (
            <span className="font-medium">{companyData.socialMedia.instagram}</span>
          )}
        </div>
        
        {/* Join the chat button */}
        <div className="col-span-1 md:col-span-2 mt-4">
          <button className="flex items-center px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600">
            <MessageCircle size={18} className="mr-2" />
            Join the chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsSection
