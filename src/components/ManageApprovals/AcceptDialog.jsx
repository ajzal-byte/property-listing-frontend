import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import getAuthHeaders from "@/utils/getAuthHeader";

const AcceptDialog = ({ listingId, refreshList }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://backend.myemirateshome.com/api/approvals/${listingId}/approve`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) throw new Error("Failed to approve listing");

      toast.success("Listing approved successfully");
      refreshList();
      setOpen(false);
    } catch (error) {
      toast.error("Approval failed", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Approve
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Listing</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve this listing? This action will make
            the listing publicly visible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleApprove} disabled={loading}>
            {loading ? "Approving..." : "Confirm Approval"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptDialog;
