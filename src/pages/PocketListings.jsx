import { useState, useEffect, useContext } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import getAuthHeaders from "@/utils/getAuthHeader";
import PropertyCards from "@/components/PropertyListings/PropertyCards";
import MainTabContext from "@/contexts/TabContext";
import { tabs } from "@/enums/sidebarTabsEnums";

const PocketListings = () => {
  const { setMainTab } = useContext(MainTabContext);

  useEffect(() => {
    setMainTab(tabs.POCKET);
  }, [setMainTab]);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const fetchPockets = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://backend.myemirateshome.com/api/pocketlisting",
        { headers: getAuthHeaders() }
      );

      if (!response.ok) throw new Error("Failed to fetch approvals");

      const data = await response.json();
      const drafts = data.pocket_listings;
      console.log("Data: ", data);

      setListings(drafts.data || []);
      setTotalItems(drafts.total || 0);
    } catch (error) {
      toast.error("Failed to fetch approvals", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPockets();
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
      <PropertyCards
        listings={listings}
        loading={loading}
        totalItems={totalItems}
        isApprovalPage={false}
        refreshList={fetchPockets}
        isDraft={false}
        isPocket={true}
      />
    </div>
  );
};

export default PocketListings;
