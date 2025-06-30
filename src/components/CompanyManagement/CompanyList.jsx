import { useState, useEffect, useContext } from "react";
import { Building2, Users, Globe, Phone, Mail, Edit } from "lucide-react";
import MainTabContext from "../../contexts/TabContext";
import { tabs } from "../../enums/sidebarTabsEnums";
// import CompanyEditModal from "./EditCompany";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import getAuthHeaders from "@/utils/getAuthHeader";
import { toast } from "sonner";
import { CompanyCard } from ".";


export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openEditCompaniesModal, setOpenEditCompaniesModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const { setMainTab } = useContext(MainTabContext);

  useEffect(() => {
    setMainTab(tabs.HIDDEN);
    const fetchCompanies = async () => {
      try {
        const response = await fetch(
          "https://backend.myemirateshome.com/api/companies",
          {
            headers: getAuthHeaders(),
          }
        );
        const data = await response.json();
        setCompanies(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to load companies. Please try again later.");
        setLoading(false);
        toast.error("Failed to fetch companies", {
          description: "Could not load companies",
          variant: "destructive",
        });
      }
    };

    fetchCompanies();
  }, [refreshTrigger, setMainTab, toast]);

  const handleEditAssign = (company) => {
    setSelectedCompany(company);
    setOpenEditCompaniesModal(true);
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => !prev);
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.phone && company.phone.includes(searchTerm)) ||
      (company.website &&
        company.website.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[250px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Loading Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => {
                setLoading(true);
                setError(null);
                handleRefresh();
              }}
            >
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Building2 className="mr-2 h-6 w-6" />
            Company Management
          </h1>
          <p className="text-muted-foreground">
            Manage and assign company profiles
          </p>
        </div>
        <Input
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {filteredCompanies.length}{" "}
          {filteredCompanies.length === 1 ? "company" : "companies"} found
        </p>
      </div>


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompanies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            handleRefresh={handleRefresh}
          />
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 bg-muted/50 rounded-lg">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-1">No Companies Found</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Try a different search term"
              : "Add a new company to get started"}
          </p>
        </div>
      )}
    </div>
  );
}
