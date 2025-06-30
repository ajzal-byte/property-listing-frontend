import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import getAuthHeaders from "@/utils/getAuthHeader";
import { uploadFileToS3 } from "../../utils/uploadFileToS3";

const AddUserDialog = ({ onUserAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Get current user data
  const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");
  const currentUserRole = currentUser?.role?.name;
  const currentUserCompanyId = currentUser?.company_id;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company_id: currentUserCompanyId || "",
    role_id: "",
    phone: "",
    rera_number: "",
    profile_url: "",
  });

  useEffect(() => {
    if (open) {
      // Fetch companies if super admin
      if (currentUserRole === "super_admin") {
        fetchCompanies();
      }
      // Always fetch roles
      fetchRoles();
    }
  }, [open]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(
        "https://backend.myemirateshome.com/api/companies",
        {
          headers: getAuthHeaders(),
        }
      );
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to fetch companies", {
        description: "Could not load companies",
        variant: "destructive",
      });
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(
        "https://backend.myemirateshome.com/api/fetchallroles",
        {
          headers: getAuthHeaders(),
        }
      );
      const data = await response.json();
      setRoles(data.available_roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to fetch roles", {
        description: "Could not load roles",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload profile photo if selected
      let profileUrl = "";
      if (selectedFile) {
        profileUrl = await uploadFileToS3(selectedFile);
        if (!profileUrl) {
          setLoading(false);
          return;
        }
      }

      // Prepare user data
      const userData = {
        ...formData,
        profile_url: profileUrl,
      };

      // Remove rera_number if not agent
      if (selectedRole !== "agent") {
        delete userData.rera_number;
      }

      // Create user
      const response = await fetch(
        "https://backend.myemirateshome.com/api/users",
        {
          method: "POST",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create user");
      }

      toast.success("User created successfully");
      setOpen(false);
      onUserAdded?.(); // Refresh user list
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error.message || "Failed to create user", {
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    const selectedRoleObj = roles.find(
      (role) => role.role_id.toString() === value
    );
    setSelectedRole(selectedRoleObj?.role_name || "");
    setFormData((prev) => ({ ...prev, role_id: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="blue">Add New User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {currentUserRole === "super_admin" && (
            <div className="space-y-2">
              <Label htmlFor="company_id">Company</Label>
              <Select
                name="company_id"
                value={formData.company_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, company_id: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="role_id">Role</Label>
            <Select
              name="role_id"
              value={formData.role_id}
              onValueChange={handleRoleChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem
                    key={role.role_id}
                    value={role?.role_id?.toString()}
                  >
                    {role?.role_name?.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRole === "agent" && (
            <div className="space-y-2">
              <Label htmlFor="rera_number">RERA Permit Number</Label>
              <Input
                id="rera_number"
                name="rera_number"
                value={formData.rera_number}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="profile_url">Profile Photo</Label>
            <Input
              id="profile_url"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button variant="blue" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
