import { useState } from "react";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import getAuthHeaders from "@/utils/getAuthHeader";
import { uploadFileToS3 } from "@/utils/uploadFileToS3";

const AddCompanyDialog = ({ onCompanyAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [watermarkFile, setWatermarkFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    slug: "",
    phone: "",
    website: "",
    logo_url: "",
    watermark_url: "",
    bitrix_api: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-generate slug when name changes
    if (name === "name") {
      const generatedSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      setFormData((prev) => ({ ...prev, [name]: value, slug: generatedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleWatermarkChange = (e) => {
    setWatermarkFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload files if selected
      let logoUrl = "";
      let watermarkUrl = "";

      if (logoFile) {
        console.log("logo is true");
        logoUrl = await uploadFileToS3(logoFile);
        if (!logoUrl) {
          setLoading(false);
          return;
        }
      }

      if (watermarkFile) {
        console.log("watermark is true");
        watermarkUrl = await uploadFileToS3(watermarkFile);
        if (!watermarkUrl) {
          setLoading(false);
          return;
        }
      }

      // Prepare company data
      const companyData = {
        ...formData,
        logo_url: logoUrl,
        watermark_url: watermarkUrl,
      };

      // Create company
      const response = await fetch(
        "https://backend.myemirateshome.com/api/companies",
        {
          method: "POST",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(companyData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create company");
      }

      toast.success("Company created successfully");
      setFormData({
        name: "",
        email: "",
        slug: "",
        phone: "",
        website: "",
        logo_url: "",
        watermark_url: "",
        bitrix_api: "",
      });
      setLogoFile(null);
      setWatermarkFile(null);
      setOpen(false);
      onCompanyAdded?.(); // Refresh company list
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error(error.message || "Failed to create company", {
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Company</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new company profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Company Name*
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug
              </Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="col-span-3"
                disabled
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email*
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right">
                Website
              </Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bitrix_api" className="text-right">
                Bitrix API
              </Label>
              <Input
                id="bitrix_api"
                name="bitrix_api"
                value={formData.bitrix_api}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="logo" className="text-right">
                Logo
              </Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="watermark" className="text-right">
                Watermark
              </Label>
              <Input
                id="watermark"
                type="file"
                accept="image/*"
                onChange={handleWatermarkChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Company"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompanyDialog;
