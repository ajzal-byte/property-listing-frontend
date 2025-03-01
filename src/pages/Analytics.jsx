import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, 
  AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';
import { useContext } from 'react';
import MainTabContext from '../contexts/TabContext';
import { tabs } from '../enums/sidebarTabsEnums';
import LeadCards from './../components/Analytics/LeadCards'
import ChannelCharts from './../components/Analytics/ChannelCharts'
import SourceCharts from './../components/Analytics/SourceCharts'
import { mockLeads as leadData, mockDeals as dealData } from '../mockdata/mockData';
import { useSearchParams, useNavigate } from "react-router-dom";
import { Undo2, BarChart2, DollarSign } from 'lucide-react'
import Tables from '../components/Analytics/Tables'
import DealCards from '../components/Analytics/DealCards';
import DealTypeCharts from '../components/Analytics/DealTypeCharts';
import DealActivityCharts from '../components/Analytics/DealActivityCharts';
import DealStatusCharts from '../components/Analytics/DealStatusCharts';
import { mockUsers as userData } from '../mockdata/mockData';
import CurrentUserRoles from './../components/RoleAccess/CurrentUserRoles'
import PermissionManager from '../components/RoleAccess/PermissionManager';

const PropertyAnalyticsDashboard = () => {
  // Add statType state
  const [statType, setStatType] = useState("lead");
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const agentName = searchParams.get("agentName");

  const { mainTab, setMainTab } = useContext(MainTabContext);

  useEffect(() => {
    setMainTab(tabs.ANALYTICS);
  }, [setMainTab]);

  let filteredLeadData = leadData;

  let filteredDealData = dealData;

  if (agentName) {
    filteredLeadData = leadData.filter((lead) => lead.agent_name === agentName);
    filteredDealData = dealData.filter((deal) => deal.agent_name === agentName);
  }

  // Function to handle tab switching
  const handleTabChange = (type) => {
    setStatType(type);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {agentName ? (
        <>
          <div className='flex items-center'>
            <div className='p-3 text-md cursor-pointer' onClick={() => {navigate('/analytics')}}>
              Go to General Stats
            </div>
            <Undo2 />
          </div>
          <div className='text-4xl text-blue-600 text-center cursor-pointer mb-6'>
            {agentName} {statType === "lead" ? "Lead" : "Deal"} Stats
          </div>
        </>
      ) : ''}

      {/* Improved Tab navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 m-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="flex">
        <button
          onClick={() => handleTabChange("lead")}
          className={`flex items-center justify-center flex-1 py-6 px-8 font-semibold text-lg transition-all duration-100 ease-out cursor-pointer ${
            statType === "lead"
              ? "bg-blue-100 text-blue-700 border-t-4 border-blue-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <BarChart2 className={`w-7 h-7 mr-3 ${statType === "lead" ? "text-blue-600" : "text-gray-400"}`} />
          Lead Statistics
        </button>
        <button
          onClick={() => handleTabChange("deal")}
          className={`flex items-center justify-center flex-1 py-6 px-8 font-semibold text-lg transition-all duration-500 ease-out cursor-pointer ${
            statType === "deal"
              ? "bg-blue-100 text-blue-700 border-t-4 border-blue-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <DollarSign className={`w-7 h-7 mr-3 ${statType === "deal" ? "text-blue-600" : "text-gray-400"}`} />
          Deal Statistics
        </button>
      </div>
    </div>
      </div>

      {/* Content based on selected tab */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {agentName ? '' : <Tables statType={statType}/>}
        {statType === "lead" ? (
          <>
            <LeadCards leadData={filteredLeadData} />
            <div className='grid grid-cols-2'>
              <ChannelCharts leadData={filteredLeadData} />
              <SourceCharts leadData={filteredLeadData} />
            </div>
          </>
        ) : (
      
          <>
            
            <DealCards dealData={filteredDealData} />
            <div className='grid grid-cols-2'>
              <DealTypeCharts deals={filteredDealData} />
              <DealActivityCharts deals ={filteredDealData} />
              <DealStatusCharts deals ={filteredDealData} />
            </div>
            
          </>
        )
        }
      <PermissionManager />

      </div>

      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">© 2025 VortexWeb</p>
        </div>
      </footer>
    </div>
  );
};

export default PropertyAnalyticsDashboard;