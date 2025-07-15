import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import ActionDialog from "./DropdownActiondialog";
import { handleDownloadPDF } from "../../utils/downloadPDF";

const ListingDropDown = ({
  listingId,
  companySlug,
  refreshList,
  isApprovalPage,
  isDraft = false,
  isPocket = false,
}) => {
  const [dialogAction, setDialogAction] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-4 w-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.15 7.15 0 014.709 15H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <MoreVertical className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isApprovalPage ? (
            <>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <AcceptDialog
                  listingId={listingId}
                  companySlug={companySlug}
                  refreshList={refreshList}
                >
                  <Play className="mr-2 h-4 w-4" /> Approve
                </AcceptDialog>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <RejectDialog listingId={listingId} refreshList={refreshList}>
                  <EyeOff className="mr-2 h-4 w-4" /> Reject
                </RejectDialog>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              {(["super_admin", "admin"].includes(role) ||
                (role === "agent" && (isDraft || isPocket))) && (
                <DropdownMenuItem
                  onClick={() => navigate(`/edit-listing/${listingId}`)}
                >
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

              <DropdownMenuItem
                onClick={() => handleDownloadPDF(listingId, setLoading)}
                disabled={loading}
              >
                <FileText className="mr-2 h-4 w-4" /> Download PDF
                {loading && (
                  <svg
                    className="animate-spin ml-2 h-4 w-4 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.15 7.15 0 014.709 15H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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

              {(["super_admin", "admin"].includes(role) ||
                (role === "agent" && isDraft)) && (
                <>
                  {((!isDraft && role === "agent") || role === "admin") && (
                    <DropdownMenuSeparator />
                  )}
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleActionClick("deleted")}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </>
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
          companySlug={companySlug}
          refreshList={refreshList}
        />
      )}
    </>
  );
};

export default ListingDropDown;
