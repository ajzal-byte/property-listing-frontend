import React, { useState } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, 
  AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';
import { useContext } from 'react';
import MainTabContext from '../contexts/TabContext';
import { tabs } from '../enums/enums';
import LeadTable from './../components/Analytics/LeadTable'
import LeadCards from './../components/Analytics/LeadCards'
import LeadCharts from './../components/Analytics/LeadCharts'
import SourceCharts from './../components/Analytics/SourceCharts'
import { mockLeads as leadData } from '../mockdata/mockData';
import { useSearchParams, useNavigate } from "react-router-dom";
import {Undo2 } from 'lucide-react'



const PropertyAnalyticsDashboard = () => {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const agentName = searchParams.get("agentName");

    const { mainTab, setMainTab } = useContext(MainTabContext);

    setMainTab(tabs.ANALYTICS)

    let filteredLeadData = leadData

    if (agentName) {
    filteredLeadData = leadData.filter((lead) => lead.agent_name === agentName);
}

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {
        agentName ? 
        <>
        <div className='flex items-center'>
        <div className='p-3 text-md cursor-pointer' onClick={()=>{navigate('/analytics')}}> Go to General Stats</div>
        <Undo2 />
        </div>
        <div className='text-4xl text-blue-600 text-center cursor-pointer' >{agentName}{' '} Lead Stats</div>
        </>
      : ''
      }


      {agentName? '' : <LeadTable/>}
      <LeadCards leadData={filteredLeadData}/>
      <div className='grid grid-cols-2'>
      <LeadCharts leadData={filteredLeadData}/>
      <SourceCharts leadData={filteredLeadData}/>
      </div>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">© 2025 VortexWeb</p>
        </div>
      </footer>
    </div>
  );
};

export default PropertyAnalyticsDashboard;