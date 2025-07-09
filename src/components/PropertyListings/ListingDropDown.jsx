import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { AcceptDialog, RejectDialog } from "../ManageApprovals";
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

const API_BASE_URL = "https://backend.myemirateshome.com/api";

const ActionDialog = ({
  open,
  onOpenChange,
  action,
  listingId,
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
      await axios.post(`${API_BASE_URL}/listing/action`, {
        action,
        propertyId: [listingId],
      });
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

const ListingDropDown = ({ listingId, refreshList, isApprovalPage }) => {
  const [dialogAction, setDialogAction] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleActionClick = (action) => {
    setDialogAction(action);
    setIsDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* Approval-specific actions */}
          {isApprovalPage ? (
            <>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <AcceptDialog listingId={listingId} refreshList={refreshList} />
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <RejectDialog listingId={listingId} refreshList={refreshList} />
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem disabled>Download PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleActionClick("publish_pf")}>
                Publish to PF
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleActionClick("publish_bayut")}
              >
                Publish to Bayut
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleActionClick("publish_dubizzle")}
              >
                Publish to Dubizzle
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleActionClick("publish_website")}
              >
                Publish to Website
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleActionClick("publish_all")}
              >
                Publish to All
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleActionClick("unpublish_pf")}
              >
                Unpublish from PF
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleActionClick("unpublish_bayut")}
              >
                Unpublish from Bayut
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleActionClick("unpublish_dubizzle")}
              >
                Unpublish from Dubizzle
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleActionClick("unpublish_website")}
              >
                Unpublish from Website
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleActionClick("unpublish_all")}
              >
                Unpublish from All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleActionClick("archived")}>
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleActionClick("draft")}>
                Make it Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleActionClick("live")}>
                Make it Live
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleActionClick("pocket")}>
                Make it Pocket
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleActionClick("deleted")}
              >
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {dialogAction && (
        <ActionDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          action={dialogAction}
          listingId={listingId}
          refreshList={refreshList}
        />
      )}
    </>
  );
};

export default ListingDropDown;
