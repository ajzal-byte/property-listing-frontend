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
import ActionDialog from "./DropdownActiondialog";
import axios from "axios";
import { jsPDF } from "jspdf";

const ListingDropDown = ({
  listingId,
  refreshList,
  isApprovalPage,
  isDraft = false,
  isPocket = false,
}) => {
  const [dialogAction, setDialogAction] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleActionClick = (action) => {
    setDialogAction(action);
    setIsDialogOpen(true);
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      // Get auth token from localStorage
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      // Fetch listing details from API
      const response = await axios.get(
        `https://backend.myemirateshome.com/api/listings/${listingId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const listingData = response.data.listing;

      // Initialize jsPDF
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Helper function to add header
      const addHeader = () => {
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Vortex Web Property Listing", 20, 10);
        doc.setFontSize(14);
        doc.text(listingData.title || "Property Listing", 20, 18);
        doc.setLineWidth(0.5);
        doc.line(20, 22, pageWidth - 20, 22); // Horizontal line
      };

      // Helper function to add footer
      const addFooter = () => {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(
          `Contact: ${listingData.company?.name || "Vortex Web"} | ${
            listingData.company?.phone || "N/A"
          } | ${listingData.company?.email || "N/A"}`,
          20,
          pageHeight - 10
        );
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          pageWidth - 30,
          pageHeight - 10,
          { align: "right" }
        );
      };

      // Add first page header
      addHeader();
      let yOffset = 30;

      // Add Basic Details
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Details", 20, yOffset);
      yOffset += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const details = [
        `Reference No: ${listingData.reference_no || "N/A"}`,
        `Address: ${listingData.collection_pf_location?.community || "N/A"}, ${
          listingData.collection_pf_location?.city || "N/A"
        }`,
        `Price: ${
          listingData.price
            ? `AED ${listingData.price.toLocaleString()}`
            : "N/A"
        }`,
        `Type: ${listingData.property_type || "N/A"}`,
        `Bedrooms: ${listingData.bedrooms || "N/A"}`,
        `Bathrooms: ${listingData.bathrooms || "N/A"}`,
        `Furnishing: ${listingData.furnishing_type || "N/A"}`,
        `RERA Permit: ${listingData.rera_permit_number || "N/A"}`,
        `Available From: ${
          listingData.available_from
            ? new Date(listingData.available_from).toLocaleDateString()
            : "N/A"
        }`,
        `Agent: ${listingData.agent?.name || "N/A"} (${
          listingData.agent?.phone || "N/A"
        })`,
        `Owner: ${listingData.owner?.name || "N/A"}`,
      ];
      details.forEach((detail) => {
        doc.text(detail, 20, yOffset);
        yOffset += 6;
      });
      yOffset += 6;

      // Add Description
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Description", 20, yOffset);
      yOffset += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const description = listingData.desc_en || "No description available.";
      const splitDescription = doc.splitTextToSize(description, pageWidth - 40);
      doc.text(splitDescription, 20, yOffset);
      yOffset += splitDescription.length * 5 + 6;

      // Add Specifications Table
      if (yOffset + 40 > pageHeight - 20) {
        addFooter();
        doc.addPage();
        addHeader();
        yOffset = 30;
      }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Specifications", 20, yOffset);
      yOffset += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const specs = [
        ["Area", listingData.size ? `${listingData.size} sq ft` : "N/A"],
        ["Year Built", listingData.build_year || "N/A"],
        ["Parking", listingData.parking ? `${listingData.parking} spaces` : "N/A"],
        ["Amenities", listingData.amenities?.map(a => a.amenity_name).join(", ") || "N/A"],
        ["Project Status", listingData.project_status || "N/A"],
      ];
      specs.forEach(([key, value], index) => {
        doc.setFillColor(240, 240, 240);
        if (index % 2 === 0) doc.rect(20, yOffset - 3, pageWidth - 40, 6, "F");
        doc.text(`${key}:`, 22, yOffset);
        const splitValue = doc.splitTextToSize(value, pageWidth - 70);
        doc.text(splitValue, 50, yOffset);
        yOffset += Math.max(6, splitValue.length * 5);
      });
      yOffset += 6;

      // Add Photos in 2x2 Grid
      if (listingData.photos?.length > 0) {
        if (yOffset + 70 > pageHeight - 20) {
          addFooter();
          doc.addPage();
          addHeader();
          yOffset = 30;
        }
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Images", 20, yOffset);
        yOffset += 6;

        const imageWidth = 90;
        const imageHeight = 60;
        let imagesProcessed = 0;

        for (const photo of listingData.photos) {
          try {
            const imgData = await loadImageAsBase64(photo.image_url);
            const col = imagesProcessed % 2;
            const row = Math.floor(imagesProcessed / 2) % 2;
            const x = 20 + col * (imageWidth + 5);
            const y = yOffset + row * (imageHeight + 5);

            if (row === 0 && yOffset + 130 > pageHeight - 20) {
              addFooter();

              doc.addPage();
              addHeader();
              yOffset = 30;
              imagesProcessed = 0; // Reset grid for new page
            }

            doc.addImage(imgData, "JPEG", x, y, imageWidth, imageHeight);
            imagesProcessed++;

            if (imagesProcessed % 4 === 0 && imagesProcessed < listingData.photos.length) {
              addFooter();
              doc.addPage();
              addHeader();
              yOffset = 30;
            }
          } catch (error) {
            console.error("Error loading image:", photo.image_url, error);
          }
        }
        yOffset += imagesProcessed % 4 === 0 ? 6 : (Math.floor((imagesProcessed - 1) / 2) % 2 + 1) * (imageHeight + 5) + 6;
      }

      // Add footer to the last page
      addFooter();

      // Trigger download
      doc.save(`Property_${listingData.reference_no || listingId}_${listingId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(error.message || "Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to load image as base64
  const loadImageAsBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = reject;
      img.src = url;
    });
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
                <AcceptDialog listingId={listingId} refreshList={refreshList}>
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

              <DropdownMenuItem onClick={handleDownloadPDF} disabled={loading}>
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
          refreshList={refreshList}
        />
      )}
    </>
  );
};

export default ListingDropDown;