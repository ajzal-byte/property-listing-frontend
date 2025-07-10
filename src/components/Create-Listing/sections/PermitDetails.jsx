import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const PermitDetails = ({ formData, setField, isDubai = true }) => {
  const [activeTab, setActiveTab] = useState("rera");
  const { control, setValue, trigger } = useFormContext();

  const handleFieldChange = (name, value) => {
    setValue(name, value);
    setField(name, value);
    trigger(name);
  };

  return (
    <div className="space-y-8 rounded-lg bg-background p-6 shadow-sm">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-semibold">Permit Details</h2>
        <p className="mt-1 text-base text-muted-foreground">
          Provide permit information for your property
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rera" className="text-base">
            RERA
          </TabsTrigger>
          <TabsTrigger value="dtcm" className="text-base">
            DTCM
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rera" className="mt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* RERA Permit Number */}
            <FormField
              control={control}
              name="rera_permit_number"
              rules={{
                required: isDubai ? "Please enter a RERA permit number" : false,
              }}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-base font-medium flex items-center gap-1">
                    RERA Permit Number{" "}
                    {isDubai && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter RERA permit number"
                      value={field.value || ""}
                      onChange={(e) =>
                        handleFieldChange("rera_permit_number", e.target.value)
                      }
                      className="h-10 w-full text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />

            {/* RERA Issue Date */}
            <FormField
              control={control}
              name="rera_issue_date"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-base font-medium">
                    Issue Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={field.value || ""}
                      onChange={(e) =>
                        handleFieldChange("rera_issue_date", e.target.value)
                      }
                      className="h-10 w-full text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />

            {/* RERA Expiration Date */}
            <FormField
              control={control}
              name="reraExpirationDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-base font-medium">
                    Expiration Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={field.value || ""}
                      onChange={(e) =>
                        handleFieldChange("reraExpirationDate", e.target.value)
                      }
                      className="h-10 w-full text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>

        <TabsContent value="dtcm" className="mt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* DTCM Permit Number */}
            <FormField
              control={control}
              name="dtcm_permit_number"
              rules={{ required: "Please enter a DTCM permit number" }}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-base font-medium flex items-center gap-1">
                    DTCM Permit Number <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter DTCM permit number"
                      value={field.value || ""}
                      onChange={(e) =>
                        handleFieldChange("dtcm_permit_number", e.target.value)
                      }
                      className="h-10 w-full text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />

            {/* DTCM Expiration Date */}
            <FormField
              control={control}
              name="dtcm_expiry_date"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-base font-medium">
                    Expiration Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={field.value || ""}
                      onChange={(e) =>
                        handleFieldChange("dtcm_expiry_date", e.target.value)
                      }
                      className="h-10 w-full text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PermitDetails;
