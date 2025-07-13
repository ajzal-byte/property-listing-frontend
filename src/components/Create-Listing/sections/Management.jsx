import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Management = ({ formData, setField }) => {
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const { control, setValue, getValues, trigger } = useFormContext();

  const handleChange = (name, value) => {
    // Store all IDs as strings
    setValue(name, value);
    setField(name, value);
    trigger(name);

    // When a super_admin picks a company, update agents and owners
    if (name === "company" && user.role.name === "super_admin") {
      const selected = formData.companies.find((c) => String(c.id) === value);
      const agentsForCompany = selected?.agents ?? [];
      // Reset agent_id
      setValue("agent_id", "");
      setField("agent_id", "");
      // Update agents list
      setField("agents", agentsForCompany);
      setValue("agents", agentsForCompany);

      // Filter owners by company
      const ownersForCompany = formData?.allOwners?.filter(
        (o) => o.company_id === selected.id
      );
      // Reset listingOwner
      setValue("listingOwner", "");
      setField("listingOwner", "");
      // Update owners list
      setField("owners", ownersForCompany);
      setValue("owners", ownersForCompany);
    }
  };

  const agents = formData.agents || [];

  // Set initial agents and owners based on selected company
  useEffect(() => {
    const selectedCompanyId = getValues("company");
    if (selectedCompanyId && user.role.name === "super_admin") {
      const selected = formData.companies.find(
        (c) => String(c.id) === String(selectedCompanyId)
      );
      if (selected) {
        // Set agents for this company
        const agentsForCompany = selected.agents ?? [];
        setField("agents", agentsForCompany);
        setValue("agents", agentsForCompany);

        // Set owners for this company
        const ownersForCompany = formData?.allOwners?.filter(
          (o) => o.company_id === selected.id
        );
        setField("owners", ownersForCompany);
        setValue("owners", ownersForCompany);
      }
    }
  }, [
    getValues,
    formData.companies,
    formData.allOwners,
    user.role.name,
    setField,
    setValue,
  ]);

  return (
    <div className="space-y-8 rounded-lg bg-background p-6 shadow-sm">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-semibold">Management</h2>
        <p className="mt-1 text-base text-muted-foreground">
          Provide management and contact details for your property
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Reference Number */}
        <FormField
          control={control}
          name="reference_no"
          rules={{ required: "Please enter a reference number" }}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-medium flex items-center gap-1">
                Reference Number <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter reference number"
                  value={field.value || ""}
                  onChange={(e) => handleChange("reference_no", e.target.value)}
                  className="h-10 w-full text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Super-admin only: Company */}
        {user.role.name === "super_admin" && (
          <FormField
            control={control}
            name="company"
            rules={{ required: "Please select a company" }}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-base font-medium flex items-center gap-1">
                  Company <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(val) => handleChange("company", val)}
                >
                  <FormControl>
                    <SelectTrigger className="h-10 w-full text-base">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {formData?.companies?.map((c) => (
                      <SelectItem
                        key={c.id}
                        value={String(c.id)}
                        className="text-base"
                      >
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />
        )}

        {/* Listing Agent */}
        <FormField
          control={control}
          name="agent_id"
          rules={{ required: "Please select a listing agent" }}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-medium flex items-center gap-1">
                Listing Agent <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => handleChange("agent_id", val)}
              >
                <FormControl>
                  <SelectTrigger className="h-10 w-full text-base">
                    <SelectValue placeholder="Select listing agent" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {agents?.map((agent) => (
                    <SelectItem
                      key={agent.id}
                      value={String(agent.id)}
                      className="text-base"
                    >
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Use Different Agents Toggle */}
        <FormField
          control={control}
          name="useDifferentAgents"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-4">
              <FormLabel className="text-base font-medium">
                Use different agents per portal?
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      handleChange("useDifferentAgents", checked)
                    }
                  />
                  <span className="text-base">
                    {field.value ? "Yes" : "No"}
                  </span>
                </div>
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Conditional Agent Fields */}
        {getValues("useDifferentAgents") && (
          <>
            {/* PF Agent */}
            <FormField
              control={control}
              name="pfAgent"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-base font-medium">
                    PF Agent
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(val) => handleChange("pfAgent", val)}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 w-full text-base">
                        <SelectValue placeholder="Select PF agent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {agents?.map((agent) => (
                        <SelectItem
                          key={agent.id}
                          value={String(agent.id)}
                          className="text-base"
                        >
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />

            {/* Bayut Agent */}
            <FormField
              control={control}
              name="bayutAgent"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-base font-medium">
                    Bayut Agent
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(val) => handleChange("bayutAgent", val)}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 w-full text-base">
                        <SelectValue placeholder="Select Bayut agent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {agents?.map((agent) => (
                        <SelectItem
                          key={agent.id}
                          value={String(agent.id)}
                          className="text-base"
                        >
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />

            {/* Website Agent */}
            <FormField
              control={control}
              name="websiteAgent"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-base font-medium">
                    Website Agent
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(val) => handleChange("websiteAgent", val)}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 w-full text-base">
                        <SelectValue placeholder="Select website agent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {agents?.map((agent) => (
                        <SelectItem
                          key={agent.id}
                          value={String(agent.id)}
                          className="text-base"
                        >
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Listing Owner */}
        <FormField
          control={control}
          name="listingOwner"
          rules={{ required: "Please select a listing owner" }}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-medium flex items-center gap-1">
                Listing Owner <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => handleChange("listingOwner", val)}
              >
                <FormControl>
                  <SelectTrigger className="h-10 w-full text-base">
                    <SelectValue placeholder="Select listing owner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {formData?.owners?.map((owner) => (
                    <SelectItem
                      key={owner.id}
                      value={String(owner.id)}
                      className="text-base"
                    >
                      {owner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Landlord Name */}
        <FormField
          control={control}
          name="landlordName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-medium">
                Landlord Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter landlord name"
                  value={field.value || ""}
                  onChange={(e) => handleChange("landlordName", e.target.value)}
                  className="h-10 w-full text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Landlord Email */}
        <FormField
          control={control}
          name="landlordEmail"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-medium">
                Landlord Email
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter landlord email"
                  value={field.value || ""}
                  onChange={(e) =>
                    handleChange("landlordEmail", e.target.value)
                  }
                  className="h-10 w-full text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Landlord Contact */}
        <FormField
          control={control}
          name="landlordContact"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-medium">
                Landlord Contact
              </FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Enter landlord contact number"
                  value={field.value || ""}
                  onChange={(e) =>
                    handleChange("landlordContact", e.target.value)
                  }
                  className="h-10 w-full text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Available From */}
        <FormField
          control={control}
          name="availableFrom"
          rules={{ required: "Please select an availability date" }}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-medium flex items-center gap-1">
                Available From <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value || ""}
                  onChange={(e) =>
                    handleChange("availableFrom", e.target.value)
                  }
                  className="h-10 w-full text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Contract Expiry Date */}
        <FormField
          control={control}
          name="contract_expiry"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-medium flex items-center gap-1">
                Contract Expiry Date
              </FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  value={field.value || ""}
                  onChange={(e) =>
                    handleChange("contract_expiry", e.target.value)
                  }
                  className="h-10 w-full text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Contract Charges */}
        <FormField
          control={control}
          name="contract_charges"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-medium flex items-center gap-1">
                Contract Charges
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter contract charges"
                  step="0.01"
                  min="0"
                  value={field.value || ""}
                  onChange={(e) =>
                    handleChange("contract_charges", e.target.value)
                  }
                  className="h-10 w-full text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default Management;
