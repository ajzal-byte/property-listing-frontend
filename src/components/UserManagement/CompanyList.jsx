import React, { useState, useEffect, useContext } from 'react';
import { Building2, Users, Globe, Phone, Mail, Edit, Loader } from 'lucide-react';
import MainTabContext from "../../contexts/TabContext";
import { tabs } from '../../enums/sidebarTabsEnums';
import CompanyEditModal from './EditCompany';

const CompanyCard = ({ company, onEditAssign }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-[100%] mb-4 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          {company.logo_url ? (
            <img 
              src={company.logo_url} 
              alt={`${company.name} logo`} 
              className="w-12 h-12 mr-4 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-12 h-12 mr-4 rounded-full bg-blue-100 flex items-center justify-center">
              <Building2 className="text-blue-600" size={24} />
            </div>
          )}
          <h3 className="text-xl font-semibold text-gray-800">{company.name}</h3>
        </div>
        <button 
          onClick={() => onEditAssign(company)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
          <Edit size={16} className="mr-2" />
          Edit/Assign Company
        </button>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center">
          <Mail size={16} className="text-gray-500 mr-2" />
          <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline">{company.email}</a>
        </div>
        <div className="flex items-center">
          <Phone size={16} className="text-gray-500 mr-2" />
          <span>{company.phone}</span>
        </div>
        {company.website && (
          <div className="flex items-center">
            <Globe size={16} className="text-gray-500 mr-2" />
            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
              {company.website}
            </a>
          </div>
        )}
        <div className="flex items-center">
          <Users size={16} className="text-gray-500 mr-2" />
          <span>{company.users?.length || 0} Users</span>
        </div>
      </div>
      
      {(company.admin_users?.length > 0 || company.users?.length > 0) && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <h4 className="font-medium text-gray-700 mb-2">Team Members</h4>
          <div className="flex flex-wrap gap-2">
            {company.admin_users?.map(admin => (
              <div key={admin.id} className="bg-blue-50 px-3 py-1 rounded-full text-sm flex items-center">
                <span className="bg-blue-600 text-white text-xs px-1 rounded mr-2">Admin</span>
                {admin.name}
              </div>
            ))}
            {company.users?.map(user => (
              <div key={user.id} className="bg-gray-50 px-3 py-1 rounded-full text-sm flex items-center">
                <span className="bg-gray-600 text-white text-xs px-1 rounded mr-2">{user.role}</span>
                {user.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEditCompaniesModal, setOpenEditCompaniesModal] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const { setMainTab } = useContext(MainTabContext);
  
  
  useEffect(() => {
    setMainTab(tabs.HIDDEN)
    const fetchCompanies = async () => {
      try {
 
        const response = await fetch('https://backend.myemirateshome.com/api/companies', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
          }
        });
        const data = await response.json();
        
        setCompanies(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to load companies. Please try again later.");
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleEditAssign = (company) => {
        setSelectedCompany(company)
        setOpenEditCompaniesModal(true)    
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-blue-600" size={32} />
        <span className="ml-2 text-gray-600">Loading companies...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p>{error}</p>
        <button 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-[100%] mx-auto p-4">
      <div className="bg-blue-600 text-white p-6 rounded-t-lg mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Building2 className="mr-2" size={24} />
          Companies Management
        </h1>
        <p className="mt-1 opacity-90">Manage and assign your company profiles</p>
      </div>
      
      {/* <div className="mb-6 flex justify-between items-center"> */}
        <div className='mb-3'>
          <h2 className="text-lg font-medium text-gray-700">
            {companies.length} Companies Found
          </h2>
        </div>
       
       <CompanyEditModal
       company={selectedCompany}
       isModalOpen={openEditCompaniesModal}
      onClose={()=>{
        setLoading(false);
        setOpenEditCompaniesModal(false)
      }}
       />
      
      <div className="space-y-4">
        {companies.map(company => (
          <CompanyCard 
            key={company.id} 
            company={company} 
            onEditAssign={handleEditAssign} 
          />
        ))}
      </div>
      
      {companies.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Building2 className="mx-auto text-gray-300" size={48} />
          <h3 className="mt-4 text-xl font-medium text-gray-600">No Companies Found</h3>
          <p className="text-gray-500">Add a new company to get started</p>
        </div>
      )}
    </div>
  );
}