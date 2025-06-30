import { useState, useEffect, useContext } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import getAuthHeaders from "@/utils/getAuthHeader";
import { toast } from "sonner";
import MainTabContext from "../contexts/TabContext";
import { tabs } from "../enums/sidebarTabsEnums";



const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const AnalyticsDashboard = () => {

    const { mainTab, setMainTab } = useContext(MainTabContext);

  useEffect(() => {
    setMainTab(tabs.ANALYTICS);
  }, [setMainTab]);

  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          "https://backend.myemirateshome.com/api/listing-analytics",
          {
            headers: getAuthHeaders(),
          }
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast.error("Failed to fetch analytics data", {
          description: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Loading Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load analytics data. Please try again later.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Prepare data for charts
  const statusData = Object.entries(data.status_counts).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const platformData = Object.entries(data.platform_counts).map(
    ([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace("_", " "),
      value,
    })
  );

  const categoryData = Object.entries(data.category_counts).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const purposeData = Object.entries(data.purpose_counts).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const filteredPropertyTypes = data.top_property_types.filter((item) =>
    item.property_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Listing Analytics</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Export</Button>
          <Button>Refresh</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(data.status_counts).reduce((a, b) => a + b, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.status_counts.published}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Live</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.status_counts.live}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Deleted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.status_counts.deleted}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Listing Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Listings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Purpose Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Purpose Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={purposeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Listings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Property Types Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Top Property Types</CardTitle>
            <Input
              placeholder="Filter property types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property Type</TableHead>
                <TableHead className="text-right">Total Listings</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPropertyTypes.map((item) => {
                const total = data.top_property_types.reduce(
                  (sum, curr) => sum + curr.total,
                  0
                );
                const percentage = ((item.total / total) * 100).toFixed(1);

                return (
                  <TableRow key={item.property_type}>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {item.property_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{item.total}</TableCell>
                    <TableCell className="text-right">{percentage}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
