import React, { useState, useMemo } from "react";
import { Search, ArrowDownUp, ArrowDown01, ArrowDown10 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ReusableTable = ({ 
  data, 
  tableType = "leads", // "leads" or "deals"
  title = "Agent Statistics",
  currencyCode = "AED"
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [selectedOption, setSelectedOption] = useState('csv');
  
  const navigate = useNavigate();
  
  const nullVar = null;
  const defaultDirection = "asc";

  // Configuration based on table type
  const tableConfig = {
    leads: {
      columns: [
        { key: "agent", label: "Agent" },
        { key: "totalLeads", label: "Total Leads" },
        { key: "newLeads", label: "New" },
        { key: "followUp", label: "Follow-up" },
        { key: "closed", label: "Closed" },
        { key: "junk", label: "Junk" },
        { key: "totalAmount", label: "Total Amount" }
      ],
      statuses: {
        "New Lead": "newLeads",
        "Follow-up": "followUp",
        "Closed": "closed",
        "Junk": "junk"
      },
      processData: (rawData) => {
        return rawData.reduce((stats, item) => {
          if (!stats[item.agent_name]) {
            stats[item.agent_name] = {
              agent: item.agent_name,
              totalLeads: 0,
              newLeads: 0,
              followUp: 0,
              closed: 0,
              junk: 0,
              totalAmount: 0,
            };
          }
          
          stats[item.agent_name].totalLeads += 1;
          stats[item.agent_name].totalAmount += item.amount;
          
          const statusKey = tableConfig.leads.statuses[item.status];
          if (statusKey) {
            stats[item.agent_name][statusKey] += 1;
          }
          
          return stats;
        }, {});
      }
    },
    deals: {
      columns: [
        { key: "agent", label: "Agent" },
        { key: "totalDeals", label: "Total Deals" },
        { key: "inProgress", label: "In-Progress" },
        { key: "won", label: "Won" },
        { key: "onHold", label: "On-Hold" },
        { key: "category", label: "Category" },
        { key: "location", label: "Location" },
        { key: "totalAmount", label: "Total Amount" }
      ],
      statuses: {
        "progress": "inProgress",
        "won": "won",
        "hold": "onHold"
      },
      processData: (rawData) => {
        return rawData.reduce((stats, item) => {
          if (!stats[item.agent_name]) {
            stats[item.agent_name] = {
              agent: item.agent_name,
              totalDeals: 0,
              inProgress: 0,
              won: 0,
              onHold: 0,
              category: {},
              location: {},
              totalAmount: 0,
            };
          }
          
          stats[item.agent_name].totalDeals += 1;
          stats[item.agent_name].totalAmount += item.amount;
          
          // Process status counts
          const statusKey = tableConfig.deals.statuses[item.status];
          if (statusKey) {
            stats[item.agent_name][statusKey] += 1;
          }
          
          // Group by category
          if (!stats[item.agent_name].category[item.category]) {
            stats[item.agent_name].category[item.category] = 0;
          }
          stats[item.agent_name].category[item.category] += 1;
          
          // Group by location
          if (!stats[item.agent_name].location[item.location]) {
            stats[item.agent_name].location[item.location] = 0;
          }
          stats[item.agent_name].location[item.location] += 1;
          
          return stats;
        }, {});
      }
    }
  };
  
  // Get current config
  const currentConfig = tableConfig[tableType];
  
  // Process data based on table type
  const processedData = useMemo(() => {
    return currentConfig.processData(data);
  }, [data, tableType]);
  
  // Apply search and sorting
  const tableData = useMemo(() => {
    let processedArray = Object.values(processedData);
    
    // Apply search filter
    if (searchQuery) {
      processedArray = processedArray.filter((row) =>
        row.agent.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      processedArray.sort((a, b) => {
        // Special handling for category and location which are objects
        if (sortConfig.key === 'category' || sortConfig.key === 'location') {
          const aValue = Object.keys(a[sortConfig.key])[0] || '';
          const bValue = Object.keys(b[sortConfig.key])[0] || '';
          
          if (aValue < bValue) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        }
        
        // Normal sorting for other columns
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    
    return processedArray;
  }, [processedData, searchQuery, sortConfig]);
  
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    let applied = true;
    setSortConfig({ key, direction, applied });
  };
  
  const handleExport = (e) => {
    e.preventDefault();
    console.log(selectedOption);
  };
  
  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };
  
  const handleAgentClick = (agentName) => {
    const params = new URLSearchParams({agentName});
    navigate(`/analytics?${params.toString()}`);
  };
  
  const SortableHeader = ({ column, label }) => (
    <th
      className="px-6 py-4 text-center font-semibold cursor-pointer group"
      onClick={() => requestSort(column)}
    >
      <div className="flex items-center justify-center gap-2">
        {label}
        
        {sortConfig.key !== column ? (
          <ArrowDownUp className="h-5 w-5" color="#333399"/>
        ) : (
          sortConfig.direction === "asc" ? (
            <ArrowDown01 className="h-5 w-5" color="#333399"/>
          ) : (
            <ArrowDown10 className="h-5 w-5" color="#333399"/>
          )
        )}
      </div>
    </th>
  );
  
  // Render cell based on column type
  const [moreActive, setMoreActive] = useState("")
  const renderCell = (row, column) => {
  


    switch(column.key) {
      case 'agent':
        return (
          <td className="px-6 py-4 font-medium text-blue-800 cursor-pointer hover:underline" onClick={() => handleAgentClick(row.agent)}>
            {row.agent}
          </td>
        );
      case 'totalLeads':
      case 'totalDeals':
        return (
          <td className="px-6 py-4 text-center">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {row[column.key]}
            </span>
          </td>
        );
      case 'newLeads':
      case 'followUp':
      case 'closed':
      case 'junk':
      case 'inProgress':
      case 'won':
      case 'onHold':
        return (
          <td className="px-6 py-4 text-center">
            <span className="font-semibold text-black px-3 py-1 rounded-full text-sm">
              {row[column.key]}
            </span>
          </td>
        );
      case 'category':
        case 'location':
            
            const entries = Object.entries(row[column.key]);
            const primaryValue = entries.length > 0 ? entries[0] : ['', 0];
            
            // Create tooltip content with all entries
            const tooltipContent = entries.map(([location, count]) => `${location}: ${count}`).join('\n');
            
            return (
              <td className="px-6 py-4 text-center">
                <div className="relative group">
                  <span className="font-semibold text-black px-3 py-1 rounded-full text-sm cursor-help">
                    {primaryValue[0]} {entries.length > 1 ? `+${entries.length - 1}` : ''}
                  </span>
                  {
                    column.key == 'location' &&
                  <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition-colors" onClick={()=>{setMoreActive(row.agent)}}>show more</button>
                  }
                  {moreActive==row.agent && entries.length > 1 && (
                    <div className="absolute z-10 bg-gray-800 text-white text-sm rounded p-2 shadow-lg 
                                    -mt-1 left-1/2 transform -translate-x-1/2 min-w-max whitespace-pre">
                      {tooltipContent}
                    </div>
                  )}
                </div>
              </td>
            );
      case 'totalAmount':
        return (
          <td className="px-6 py-4 text-right font-medium text-blue-800">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: currencyCode,
              maximumFractionDigits: 0,
            }).format(row.totalAmount)}
          </td>
        );
      default:
        return <td className="px-6 py-4 text-center">{row[column.key]}</td>;
    }
  };
  
  // Calculate footer totals
  const calculateTotal = (column) => {
    switch(column.key) {
      case 'agent':
        return 'Total';
      case 'totalAmount':
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currencyCode,
          maximumFractionDigits: 0,
        }).format(tableData.reduce((sum, row) => sum + row[column.key], 0));
      case 'category':
      case 'location':
        return '';
      default:
        return tableData.reduce((sum, row) => sum + (row[column.key] || 0), 0);
    }
  };
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-lg relative" onClick={()=>{
        if(moreActive != ""){
            setMoreActive("")
        }
    }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">
          {title}
        </h2>

        <div className="relative">
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-[150%]"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        
        <div className="flex items-center space-x-4">
          <form action="" onSubmit={handleExport}>
            <div className="flex gap-2">
              <select 
                className="block w-fit pl-3 pr-10 py-2 text-base bg-yellow-50 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedOption}
                onChange={handleChange}
              >
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </select>
              <button 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
                type="submit"
              >
                Export Report
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div 
        className="mb-5 w-fit cursor-pointer border border-red-400 text-red-400 rounded-2xl p-2 right-1 items-center top-[28] p5" 
        onClick={() => {setSortConfig({key: nullVar, direction: defaultDirection})}}
      >
        Remove All Sort
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-400 text-white">
              {currentConfig.columns.map((column) => (
                column.key === 'agent' ? (
                  <th key={column.key} className="px-6 py-4 text-left font-semibold">{column.label}</th>
                ) : (
                  <SortableHeader key={column.key} column={column.key} label={column.label} />
                )
              ))}
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
                {currentConfig.columns.map((column) => (
                  renderCell(row, column)
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-300 text-black border-2 border-blue-600 rounded-lg">
            <tr>
              {currentConfig.columns.map((column) => {
                const total = calculateTotal(column);
                
                // Right-align the total amount
                if (column.key === 'totalAmount') {
                  return (
                    <td key={column.key} className="px-6 py-3 text-right font-semibold">
                      {total}
                    </td>
                  );
                } 
                // Left-align the Total label
                else if (column.key === 'agent') {
                  return (
                    <td key={column.key} className="px-6 py-3 font-semibold">
                      {total}
                    </td>
                  );
                } 
                // Center-align all other numeric totals
                else {
                  return (
                    <td key={column.key} className="px-6 py-3 text-center font-semibold">
                      {total}
                    </td>
                  );
                }
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ReusableTable;