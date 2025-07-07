import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { AcceptDialog, RejectDialog } from "../ManageApprovals";

const ListingDropDown = ({ listingId, refreshList, isApprovalPage }) => {
  return (
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
            <DropdownMenuItem>Download PDF</DropdownMenuItem>
            <DropdownMenuItem>Publish to All</DropdownMenuItem>
            <DropdownMenuItem>Publish to PF</DropdownMenuItem>
            <DropdownMenuItem>Publish to Bayut</DropdownMenuItem>
            <DropdownMenuItem>Publish to Website</DropdownMenuItem>
            <DropdownMenuItem>Make it Live</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ListingDropDown;
