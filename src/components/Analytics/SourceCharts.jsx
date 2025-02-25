import {React, useState }from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Sector
} from 'recharts';
// import { mockLeads as leadData } from '../../mockdata/mockData';

const SourceCharts = ({leadData}) => {

  // Process data for source bar chart
  const getSourceData = () => {
    const sourceCounts = {};
    leadData.forEach(lead => {
      sourceCounts[lead.source] = (sourceCounts[lead.source] || 0) + 1;
    });
    
    return Object.entries(sourceCounts).map(([source, count]) => ({
      source,
      count
    })).sort((a, b) => b.count - a.count);
  };

  const sourceData = getSourceData();

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Custom active shape for pie chart
  const renderActiveShape = (props) => {
    const { 
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value
    } = props;
  
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#333" fontSize={16}>
          {payload.channel}
        </text>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333" fontSize={16}>
          {value} leads
        </text>
        <text x={cx} y={cy} dy={25} textAnchor="middle" fill="#999" fontSize={14}>
          {`(${(percent * 100).toFixed(1)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 12}
          outerRadius={outerRadius + 15}
          fill={fill}
        />
      </g>
    );
  };
  
  // State for active pie slice
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  // Custom tooltip for bar chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-medium text-gray-900">{`${payload[0].payload.source}`}</p>
          <p className="text-blue-600">{`Leads: ${payload[0].value}`}</p>
          <p className="text-gray-500 text-sm">{`${((payload[0].value / leadData.length) * 100).toFixed(1)}% of total`}</p>
        </div>
      );
    }
    return null;
  };

    const [sourceChartType, setSourceChartType] = useState("bar");
    const handleChartToggle = () =>
      setSourceChartType(sourceChartType === "bar" ? "pie" : "bar");

  return (
    <div className="p-6 bg-white rounded-xl shadow-md lg:w-[1200px] md:w-[400px] 300px">
      <button className="w-fit h-fit px-2 py-1 ml-2 cursor-pointer bg-blue-200 rounded-r-2xl font-thin" onClick={handleChartToggle}>
        Toggle to {sourceChartType == 'bar' ? 'PIE' : 'BAR'} view
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {
        

        sourceChartType =='bar' ?  

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Lead Distribution by Sources (BAR)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sourceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="source" 
                  // tick={{ fill: '#4a5568' }}
                  tick={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  // tickLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: '#4a5568' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={{ stroke: '#e2e8f0' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  payload={
                    sourceData.map((item, index) => ({
                      id: item.source,
                      type: 'square',
                      value: item.source,
                      color: COLORS[index % COLORS.length]
                    }))
                  }
                  wrapperStyle={{ 
                    paddingTop: 20, 
                    fontFamily: 'system-ui' 
                  }}
                />
                <Bar 
                  name="Number of Leads" 
                  dataKey="count" 
                  fill="#3182ce"
                  radius={[4, 4, 0, 0]}
                  barSize={60}
                  animationDuration={1500}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

       :
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Lead Distribution By Sources (PIE)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  dataKey="count"
                  nameKey="source"
                  onMouseEnter={onPieEnter}
                  animationDuration={1500}
                >
                  {sourceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{
                    paddingLeft: "30px",
                    fontFamily: "system-ui",
                  }}
                  formatter={(value, entry) => (
                    <span className="text-gray-700">
                      {entry.payload.source}
                    </span>
                  )}
                />
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} leads (${(
                      (value / leadData.length) *
                      100
                    ).toFixed(1)}%)`,
                    props.payload.source
                  ]}
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      }

      </div>
      
    </div>
  );
};

export default SourceCharts;