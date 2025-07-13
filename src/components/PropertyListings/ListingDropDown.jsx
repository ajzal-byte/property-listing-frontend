import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Edit2,
  Copy,
  RefreshCw,
  FileText,
  Share2,
  Globe,
  Layers,
  EyeOff,
  Archive,
  FilePlus,
  Play,
  Pocket,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AcceptDialog, RejectDialog } from "../ManageApprovals";
import { role } from "../../utils/getUserRole";

const ListingDropDown = ({
  listingId,
  refreshList,
  isApprovalPage,
  isDraft = false,
  isPocket = false,
}) => {
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
          {/* Edit / Duplicate / Refresh (all users see duplicate & refresh; edit visible to admins/superadmins, and agents if draft or pocket) */}
          {(["super_admin", "admin"].includes(role) ||
            (role === "agent" && (isDraft || isPocket))) && (
            <DropdownMenuItem onClick={() => handleActionClick("edit")}>
              <Edit2 className="mr-2 h-4 w-4" /> Edit Listing
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => handleActionClick("duplicate")}>
            <Copy className="mr-2 h-4 w-4" /> Duplicate Listing
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => refreshList()}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Listing
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {/* Download */}
          <DropdownMenuItem disabled>
            <FileText className="mr-2 h-4 w-4" /> Download PDF
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {/* Approval-specific actions */}
          {isApprovalPage ? (
            <>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <AcceptDialog listingId={listingId} refreshList={refreshList}>
                  <Play className="mr-2 h-4 w-4" /> Approve
                </AcceptDialog>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <RejectDialog listingId={listingId} refreshList={refreshList}>
                  <EyeOff className="mr-2 h-4 w-4" /> Reject
                </RejectDialog>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          ) : (
            <>
              {/* Publish / Unpublish (admins only) */}
              {["super_admin", "admin"].includes(role) && (
                <>
                  <DropdownMenuItem
                    onClick={() => handleActionClick("publish_pf")}
                  >
                    <Globe className="mr-2 h-4 w-4" /> Publish to PF
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleActionClick("publish_bayut")}
                  >
                    <Share2 className="mr-2 h-4 w-4" /> Publish to Bayut
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleActionClick("publish_dubizzle")}
                  >
                    <Layers className="mr-2 h-4 w-4" /> Publish to Dubizzle
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleActionClick("publish_website")}
                  >
                    <FilePlus className="mr-2 h-4 w-4" /> Publish to Website
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleActionClick("publish_all")}
                  >
                    <Archive className="mr-2 h-4 w-4" /> Publish to All
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleActionClick("unpublish_pf")}
                  >
                    <Globe className="mr-2 h-4 w-4" /> Unpublish from PF
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleActionClick("unpublish_bayut")}
                  >
                    <Share2 className="mr-2 h-4 w-4" /> Unpublish from Bayut
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleActionClick("unpublish_dubizzle")}
                  >
                    <Layers className="mr-2 h-4 w-4" /> Unpublish from Dubizzle
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleActionClick("unpublish_website")}
                  >
                    <FilePlus className="mr-2 h-4 w-4" /> Unpublish from Website
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleActionClick("unpublish_all")}
                  >
                    <Archive className="mr-2 h-4 w-4" /> Unpublish from All
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleActionClick("archived")}
                  >
                    <Archive className="mr-2 h-4 w-4" /> Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionClick("draft")}>
                    <FilePlus className="mr-2 h-4 w-4" /> Make Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionClick("live")}>
                    <Play className="mr-2 h-4 w-4" /> Make Live
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionClick("pocket")}>
                    <Pocket className="mr-2 h-4 w-4" /> Make Pocket
                  </DropdownMenuItem>
                </>
              )}

              {/* Delete */}
              <DropdownMenuSeparator />
              {(["super_admin", "admin"].includes(role) ||
                (role === "agent" && (isDraft || isPocket))) && (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => handleActionClick("deleted")}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              )}
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
