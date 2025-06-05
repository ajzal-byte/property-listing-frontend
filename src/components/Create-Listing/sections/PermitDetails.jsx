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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PermitDetails = ({ formData, setField, isDubai = true }) => {
  // Local tab state
  const [activeTab, setActiveTab] = useState("rera");

  // Pull in shared form context
  const { control, setValue, trigger, getValues } = useFormContext();

  const handleFieldChange = (name, value) => {
    setValue(name, value);
    setField(name, value);
    trigger(name);
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold">Permit Details</h2>
        <p className="text-muted-foreground text-sm">
          Enter permit information for your property.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rera">RERA</TabsTrigger>
          <TabsTrigger value="dtcm">DTCM</TabsTrigger>
        </TabsList>

        <TabsContent value="rera" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
            {/* RERA Permit Number */}
            <FormField
              control={control}
              name="reraPermitNumber"
              rules={{ required: "Permit Number is required." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    RERA Permit Number
                    {isDubai && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter RERA permit number"
                      value={field.value}
                      onChange={(e) =>
                        handleFieldChange("reraPermitNumber", e.target.value)
                      }
                      onBlur={() => trigger("reraPermitNumber")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* RERA Issue Date */}
            <FormField
              control={control}
              name="reraIssueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value}
                      onChange={(e) =>
                        handleFieldChange("reraIssueDate", e.target.value)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* RERA Expiration Date */}
            <FormField
              control={control}
              name="reraExpirationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiration Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value}
                      onChange={(e) =>
                        handleFieldChange("reraExpirationDate", e.target.value)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </TabsContent>

        <TabsContent value="dtcm" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
            {/* DTCM Permit Number */}
            <FormField
              control={control}
              name="dtcmPermitNumber"
              rules={{ required: "DTCM Permit Number is required." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    DTCM Permit Number <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter DTCM permit number"
                      value={field.value}
                      onChange={(e) =>
                        handleFieldChange("dtcmPermitNumber", e.target.value)
                      }
                      onBlur={() => trigger("dtcmPermitNumber")}
                    />
                  </FormControl>
                  <FormMessage />
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
