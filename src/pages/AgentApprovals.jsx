import { useState, useEffect, useContext } from "react";
import getAuthHeaders from "@/utils/getAuthHeader";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import MainTabContext from "@/contexts/TabContext";
import { tabs } from "@/enums/sidebarTabsEnums";

const statusConfig = {
  sendforapproval: {
    label: "Pending",
    icon: Clock,
    color: "bg-yellow-500 hover:bg-yellow-600",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle,
    color: "bg-green-500 hover:bg-green-600",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "bg-red-500 hover:bg-red-600",
  },
};

const AgentApprovals = () => {
  const { setMainTab } = useContext(MainTabContext);

  useEffect(() => {
    setMainTab(tabs.MY_REQUESTS);
  }, [setMainTab]);

  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://backend.myemirateshome.com/api/my-approvals",
        { headers: getAuthHeaders() }
      );

      if (!response.ok) throw new Error("Failed to fetch approvals");

      const data = await response.json();
      setApprovals(data);
    } catch (error) {
      toast.error("Failed to fetch your approvals", {
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
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Listing Approvals</h1>
        <p className="text-sm text-muted-foreground">
          {approvals.length} approval requests
        </p>
      </div>

      {approvals.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-medium">No approval requests found</h3>
          <p className="text-muted-foreground">
            All your submitted listings are up to date
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map((approval) => {
            const status =
              statusConfig[approval.status] || statusConfig.sendforapproval;
            const StatusIcon = status.icon;

            return (
              <div
                key={approval.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{approval.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Submitted on{" "}
                      {new Date(approval.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={status.color}>
                    <StatusIcon className="h-4 w-4 mr-2" />
                    {status.label}
                  </Badge>
                </div>

                {approval.status === "rejected" &&
                  approval.approval_feedback && (
                    <div className="mt-3 p-3 bg-red-50 rounded-md">
                      <h4 className="font-medium text-sm text-red-800">
                        Feedback:
                      </h4>
                      <p className="text-sm text-red-700 mt-1">
                        {approval.approval_feedback}
                      </p>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AgentApprovals;
