import { useState, useEffect, useContext } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import getAuthHeaders from "@/utils/getAuthHeader";
import PropertyCards from "@/components/PropertyListings/PropertyCards";
import MainTabContext from "@/contexts/TabContext";
import { tabs } from "@/enums/sidebarTabsEnums";

const ManageApprovals = () => {
  const { setMainTab } = useContext(MainTabContext);

  useEffect(() => {
    setMainTab(tabs.APPROVALS);
  }, [setMainTab]);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://backend.myemirateshome.com/api/approvals",
        { headers: getAuthHeaders() }
      );

      if (!response.ok) throw new Error("Failed to fetch approvals");

      const data = await response.json();
      
      setListings(data || []);
      setTotalItems(data.length || 0);
    } catch (error) {
      toast.error("Failed to fetch approvals", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pending Approvals</h1>
        <p className="text-sm text-muted-foreground">
          {totalItems} listings waiting for approval
        </p>
      </div>

      <PropertyCards
        listings={listings}
        loading={loading}
        totalItems={totalItems}
        isApprovalPage={true}
        refreshList={fetchApprovals}
      />
    </div>
  );
};

export default ManageApprovals;
