import React from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

const paymentMethods = ["Cash", "Bank Transfer", "Cheque", "Credit Card"];
const chequeOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

const Pricing = ({ formData, setField }) => {
  // grab shared form context
  const { control, setValue, trigger, getValues } = useFormContext();

  const offeringType = getValues("offeringType");
  const isSale =
    offeringType === "Sale" || offeringType === "RS" || offeringType === "CS";
  const isRent =
    offeringType === "Rent" || offeringType === "RR" || offeringType === "CR";

  const handleChange = (name, value) => {
    setValue(name, value);
    setField(name, value);
    trigger(name);
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold">Pricing Information</h2>
        <p className="text-muted-foreground text-sm">
          Enter pricing details for your property.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
        {isSale && (
          <>
            {/* Price */}
            <FormField
              control={control}
              name="price"
              rules={{ required: "Price is required." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Price <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price"
                      value={field.value}
                      onChange={(e) => handleChange("price", e.target.value)}
                      onBlur={() => trigger("price")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hide Price */}
            <FormField
              control={control}
              name="hidePrice"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 mt-8">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        handleChange("hidePrice", checked)
                      }
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Hide Price? (Property Finder Only)</FormLabel>
                </FormItem>
              )}
            />

            {/* Payment Method */}
            <FormField
              control={control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(val) => handleChange("paymentMethod", val)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Down Payment */}
            <FormField
              control={control}
              name="downPayment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Down Payment</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter down payment amount"
                      value={field.value}
                      onChange={(e) =>
                        handleChange("downPayment", e.target.value)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {isRent && (
          <>
            {/* Rent Frequency */}
            <FormField
              control={control}
              name="rentFrequency"
              rules={{ required: "Rent Frequency is required." }}
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel className="flex items-center gap-1">
                    Rent Frequency <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="flex flex-wrap gap-4"
                      value={field.value}
                      onValueChange={(val) =>
                        handleChange("rentFrequency", val)
                      }
                    >
                      {["Yearly", "Monthly", "Weekly", "Daily"].map((freq) => (
                        <div key={freq} className="flex items-center space-x-2">
                          <RadioGroupItem
                            id={freq.toLowerCase()}
                            value={freq}
                          />
                          <label
                            htmlFor={freq.toLowerCase()}
                            className="cursor-pointer"
                          >
                            {freq}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rent Amount */}
            <FormField
              control={control}
              name="rentAmount"
              rules={{ required: "Rent Amount is required." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Rent Amount <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter rent amount"
                      value={field.value}
                      onChange={(e) =>
                        handleChange("rentAmount", e.target.value)
                      }
                      onBlur={() => trigger("rentAmount")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Common Fields */}
        <FormField
          control={control}
          name="cheques"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cheques</FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => handleChange("cheques", val)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of cheques" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {chequeOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="serviceCharges"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Charges</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter service charges"
                  value={field.value}
                  onChange={(e) =>
                    handleChange("serviceCharges", e.target.value)
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="financialStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Financial Status</FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => handleChange("financialStatus", val)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select financial status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["Mortgaged", "Cash"].map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default Pricing;
