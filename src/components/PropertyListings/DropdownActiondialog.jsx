import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import getAuthHeaders from "@/utils/getAuthHeader";

const API_BASE_URL = "https://backend.myemirateshome.com/api";

const ActionDialog = ({
  open,
  onOpenChange,
  action,
  listingId,
  companySlug,
  refreshList,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const actionTitles = {
    publish_pf: "Publish to Property Finder",
    publish_bayut: "Publish to Bayut",
    publish_dubizzle: "Publish to Dubizzle",
    publish_website: "Publish to Website",
    publish_all: "Publish to All Platforms",
    unpublish_pf: "Unpublish from Property Finder",
    unpublish_bayut: "Unpublish from Bayut",
    unpublish_dubizzle: "Unpublish from Dubizzle",
    unpublish_website: "Unpublish from Website",
    unpublish_all: "Unpublish from All Platforms",
    archived: "Archive",
    draft: "Move to Draft",
    live: "Make Live",
    pocket: "Move to Pocket",
    deleted: "Delete",
  };

  const handleAction = async () => {
    setIsLoading(true);
    try {
      if (action === "deleted") {
        // DELETE API for delete action
        await axios.delete(
          `${API_BASE_URL}/listings/${listingId}?portal_slug=${companySlug}`,
          {
            headers: getAuthHeaders(),
          }
        );
      } else {
        // POST API for all other actions
        await axios.post(
          `${API_BASE_URL}/listing/action`,
          {
            action,
            propertyId: [listingId],
            portal_slug: companySlug, // Include portal_slug in the request body
          },
          {
            headers: getAuthHeaders(),
          }
        );
      }
      toast.success(`${actionTitles[action]} successful`);
      refreshList();
    } catch (error) {
      toast.error(
        `Failed to perform action: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{actionTitles[action]}</DialogTitle>
          <DialogDescription>
            Are you sure you want to perform this action?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleAction} disabled={isLoading}>
            {isLoading ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionDialog;
