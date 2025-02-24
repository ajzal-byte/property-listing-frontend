import React, { useState, useMemo } from "react";
import { Search, ArrowDownUp, ArrowDown01, ArrowDown10 } from "lucide-react";
import { mockLeads as leadsData } from "../../mockdata/mockData";
import { useNavigate } from "react-router-dom";

const AgentLeadTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const [selectedOption, setSelectedOption] = useState('csv');

  const navigate = useNavigate();

  const nullVar = null
  const defaultDirection = "asc"

  // Process data to create agent statistics
  const agentStats = leadsData.reduce((stats, lead) => {
    if (!stats[lead.agent_name]) {
      stats[lead.agent_name] = {
        agent: lead.agent_name,
        totalLeads: 0,
        newLeads: 0,
        followUp: 0,
        closed: 0,
        junk: 0,
        totalAmount: 0,
      };
    }

    stats[lead.agent_name].totalLeads += 1;
    stats[lead.agent_name].totalAmount += lead.amount;

    switch (lead.status) {
      case "New Lead":
        stats[lead.agent_name].newLeads += 1;
        break;
      case "Follow-up":
        stats[lead.agent_name].followUp += 1;
        break;
      case "Closed":
        stats[lead.agent_name].closed += 1;
        break;
      case "Junk":
        stats[lead.agent_name].junk += 1;
        break;
      default:
        break;
    }

    return stats;
  }, {});

  // Convert stats object to array and apply search/sort
  const tableData = useMemo(() => {
    let data = Object.values(agentStats);

    // Apply search filter
    if (searchQuery) {
      data = data.filter((row) =>
        row.agent.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return data;
  }, [agentStats, searchQuery, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    let applied = true
    setSortConfig({ key, direction, applied });
  };

  const handleExport = (e)=>{
    e.preventDefault()
    console.log(selectedOption);
  }

  const handleChange = (e) =>{
    setSelectedOption(e.target.value);
  }

  const handleAgentClick = (agentName) => {
    const params = new URLSearchParams({agentName});
    console.log(`/analytics?${params.toString()}`);
    console.log(agentName)
    navigate(`/analytics?${params.toString()}`);
  }

  const SortableHeader = ({ column, label }) => (
    <th
      className="px-6 py-4 text-center font-semibold cursor-pointer group"
      onClick={() => requestSort(column)}
    >
      <div className="flex items-center justify-center gap-2">
        {label}
        
        {
           sortConfig.key !==column  ?
            <ArrowDownUp className={`h-5 w-5`} color="#333399"/>
            :
    (
        sortConfig.key === column ? (
          sortConfig.direction === "asc" ? (
            <ArrowDown01 className={`h-5 w-5`} color="#333399"/>
          ) : (
            <ArrowDown10 className={`h-5 w-5`} color="#333399"/>
          )
        ) : (
          ""
        )

    )
        
        }
      
      </div>
    </th>
  );

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-lg relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">
          Agent Lead Statistics
        </h2>

   <div className="relative">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search agents..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-[150%]"
      />
      {/* Search Icon */}
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
    </div>
        <div className="flex items-center space-x-4">
            <form action="" onSubmit={handleExport}>

            <div className=" flex gap-2">       
              <select className="block w-fit pl-3 pr-10 py-2 text-base bg-yellow-50 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={selectedOption}
                        onChange={handleChange}
              >
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </select>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" type="submit">
                Export Report
              </button>
            </div>
                </form>
            </div>
      </div>
      {
        
      }
      <div className=" mb-5 w-fit cursor-pointer border border-red-400 text-red-400 font rounded-2xl p-2 right-1 items-center top-[28] p5" onClick={()=>{setSortConfig({nullVar, defaultDirection})}}>
       Remove All Sort
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-400 text-white">
              <th className="px-6 py-0 text-left font-semibold">Agent</th>
              <SortableHeader column="totalLeads" label="Total Leads" />
              <SortableHeader column="newLeads" label="New" />
              <SortableHeader column="followUp" label="Follow-up" />
              <SortableHeader column="closed" label="Closed" />
              <SortableHeader column="junk" label="Junk" />
              <SortableHeader column="totalAmount" label="Total Amount" />
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr
                key={row.agent}
                className={`border-b ${
                  index % 2 === 0 ? "bg-blue-50" : "bg-white"
                } hover:bg-blue-100 transition-colors duration-150`}
              >
                <td className="px-6 py-4 font-medium text-blue-800 cursor-pointer hover:underline" onClick={()=>{handleAgentClick(row.agent)}}>
                  {row.agent}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {row.totalLeads}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-black px-3 py-1 rounded-full text-sm">
                    {row.newLeads}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-black px-3 py-1 rounded-full text-sm">
                    {row.followUp}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-black px-3 py-1 rounded-full text-sm">
                    {row.closed}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-black px-3 py-1 rounded-full text-sm">
                    {row.junk}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-medium text-blue-800">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "AED",
                    maximumFractionDigits: 0,
                  }).format(row.totalAmount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-300 text-black border-2 border-blue-600 rounded-lg">
            <tr>
              <td className="px-6 py-3 font-semibold">Total</td>
              <td className="px-6 py-3 text-center font-semibold">
                {tableData.reduce((sum, row) => sum + row.totalLeads, 0)}
              </td>
              <td className="px-6 py-3 text-center font-semibold">
                {tableData.reduce((sum, row) => sum + row.newLeads, 0)}
              </td>
              <td className="px-6 py-3 text-center font-semibold">
                {tableData.reduce((sum, row) => sum + row.followUp, 0)}
              </td>
              <td className="px-6 py-3 text-center font-semibold">
                {tableData.reduce((sum, row) => sum + row.closed, 0)}
              </td>
              <td className="px-6 py-3 text-center font-semibold">
                {tableData.reduce((sum, row) => sum + row.junk, 0)}
              </td>
              <td className="px-6 py-3 text-right font-semibold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "AED",
                  maximumFractionDigits: 0,
                }).format(
                  tableData.reduce((sum, row) => sum + row.totalAmount, 0)
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default AgentLeadTable;
