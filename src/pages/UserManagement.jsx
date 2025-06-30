import { useContext, useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import getAuthHeaders from "@/utils/getAuthHeader";
import { AddUserDialog, UserCard } from "../components/UserManagement";
import MainTabContext from "../contexts/TabContext";
import { tabs } from "../enums/sidebarTabsEnums";
import { Building2 } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const { setMainTab } = useContext(MainTabContext);

  // Get current user data
  const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");
  const currentUserId = currentUser?.id;
  const currentUserRole = currentUser?.role?.name;

  useEffect(() => {
    setMainTab(tabs.HIDDEN); // Hide the main tab when on User Management page
  }, [setMainTab]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://backend.myemirateshome.com/api/users",
        {
          headers: getAuthHeaders(),
        }
      );
      const data = await response.json();

      // Filter out the current user
      const filteredData = data.filter((user) => user.id !== currentUserId);

      setUsers(filteredData);
      setFilteredUsers(filteredData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUserId, currentUserRole, refreshTrigger]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.phone && user.phone.includes(searchTerm)) ||
          (user.rera_number &&
            user.rera_number.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Group users by company for super_admin view
  const groupUsersByCompany = (users) => {
    return users.reduce((acc, user) => {
      const companyName = user.company?.name || "No Company";
      const companyLogo = user.company?.logo_url;
      if (!acc[companyName]) {
        acc[companyName] = [];
      }
      acc[companyName].push(user);
      return acc;
    }, {});
  };

  const companyGroups = groupUsersByCompany(filteredUsers);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => !prev); // Toggle refreshTrigger to trigger useEffect
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <AddUserDialog onUserAdded={handleRefresh} />
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search users by name, email, phone or RERA number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {currentUserRole === "super_admin" ? (
        <Accordion type="multiple" className="space-y-4">
          {Object.entries(companyGroups).map(([companyName, companyUsers]) => (
            <AccordionItem
              key={companyName}
              value={companyName}
              className="border-none"
            >
              <Card>
                <CardHeader className="p-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center">
                      {companyUsers[0]?.company?.logo_url ? (
                        <img
                          src={companyUsers[0].company.logo_url}
                          alt={`${companyName} logo`}
                          className="w-12 h-12 mr-4 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 mr-4 rounded-full bg-blue-100 flex items-center justify-center">
                          <Building2 className="text-blue-600" size={24} />
                        </div>
                      )}
                      <h3 className="text-xl font-semibold text-gray-800">
                        {companyName}
                      </h3>
                      <Badge variant="secondary" className="ml-2">
                        {companyUsers.length} users
                      </Badge>
                    </div>
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {companyUsers.map((user) => (
                      <UserCard
                        key={user.id}
                        {...user}
                        onUserUpdated={handleRefresh}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} {...user} onUserUpdated={handleRefresh} />
          ))}
        </div>
      )}

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm.trim() === ""
              ? "No users found"
              : "No users match your search criteria"}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
