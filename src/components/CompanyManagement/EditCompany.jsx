import { useState, useEffect } from "react";
import { Building, Mail, Phone, Globe, Users, X, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import getAuthHeaders from "@/utils/getAuthHeader";

const EditCompanyDialog = ({ company, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    admins_to_add: [],
    admins_to_remove: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [unassociatedAdmins, setUnassociatedAdmins] = useState([]);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        email: company.email || "",
        phone: company.phone || "",
        website: company.website || "",
        admins_to_add: [],
        admins_to_remove: [],
      });
    }
  }, [company]);

  const fetchUnassociatedAdmins = async () => {
    try {
      const response = await fetch(
        "https://backend.myemirateshome.com/api/unassociatedadmins",
        {
          headers: getAuthHeaders(),
        }
      );
      const data = await response.json();
      setUnassociatedAdmins(data);
    } catch (error) {
      console.error("Error fetching unassociated admins:", error);
      toast.error("Failed to fetch available admins", {
        description: "Could not load available admins",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const toggleAdminAdd = (adminId) => {
    setFormData((prev) => ({
      ...prev,
      admins_to_add: prev.admins_to_add.includes(adminId)
        ? prev.admins_to_add.filter((id) => id !== adminId)
        : [...prev.admins_to_add, adminId],
    }));
  };

  const toggleAdminRemove = (adminId) => {
    setFormData((prev) => ({
      ...prev,
      admins_to_remove: prev.admins_to_remove.includes(adminId)
        ? prev.admins_to_remove.filter((id) => id !== adminId)
        : [...prev.admins_to_remove, adminId],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Company name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.website.trim()) newErrors.website = "Website is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://backend.myemirateshome.com/api/companies/${company.id}`,
        {
          method: "PUT",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Company update failed");
      }

      toast.success("Company updated successfully", {
        description: "The company details have been updated.",
      });
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error(error.message || "Failed to update company", {
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const availableAdmins = unassociatedAdmins || [];
  const removableAdmins = company?.admin_users || [];

  return (
    <>
      <Button
        variant="blue"
        size="sm"
        className="flex items-center"
        onClick={() => {
          setOpen(true);
          fetchUnassociatedAdmins();
        }}
      >
        <Edit className="h-4 w-4 mr-2" />
        Manage
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-9"
                  placeholder="Enter company name"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-9"
                  placeholder="Enter company email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-9"
                  placeholder="Enter phone number"
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  className="pl-9"
                  placeholder="Enter website URL"
                />
              </div>
              {errors.website && (
                <p className="text-sm text-destructive">{errors.website}</p>
              )}
            </div>

            {/* Admin Management */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <h3 className="font-medium">Admin Management</h3>
              </div>

              {/* Add Admins */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Add Admins</h4>
                {availableAdmins.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {availableAdmins.map((admin) => (
                      <div
                        key={`add-${admin.id}`}
                        className={`flex items-center justify-between p-2 border rounded-md cursor-pointer ${
                          formData.admins_to_add.includes(admin.id)
                            ? "bg-secondary"
                            : "hover:bg-accent"
                        }`}
                        onClick={() => toggleAdminAdd(admin.id)}
                      >
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {admin.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{admin.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {admin.email}
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.admins_to_add.includes(admin.id)}
                          onChange={() => {}}
                          className="h-4 w-4 text-primary rounded focus:ring-primary"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No admins available to add
                  </p>
                )}
              </div>

              {/* Remove Admins */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Remove Admins</h4>
                {removableAdmins.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {removableAdmins.map((admin) => (
                      <div
                        key={`remove-${admin.id}`}
                        className={`flex items-center justify-between p-2 border rounded-md cursor-pointer ${
                          formData.admins_to_remove.includes(admin.id)
                            ? "bg-destructive/10 border-destructive"
                            : "hover:bg-accent"
                        }`}
                        onClick={() => toggleAdminRemove(admin.id)}
                      >
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {admin.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{admin.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {admin.email}
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.admins_to_remove.includes(admin.id)}
                          onChange={() => {}}
                          className="h-4 w-4 text-destructive rounded focus:ring-destructive"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No admins available to remove
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="blue" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditCompanyDialog;
