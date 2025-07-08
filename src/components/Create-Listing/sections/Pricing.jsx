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
import { Checkbox } from "@/components/ui/checkbox";

const paymentMethods = ["Cash", "Installments"];
const chequeOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const amountTypeOptions = ["Sale", "Yearly", "Monthly", "Weekly", "Daily"];

const Pricing = ({ formData, setField }) => {
  const { control, setValue, trigger, getValues } = useFormContext();

  const category = getValues("category");
  const isSale = category === "Sale" || category === "RS" || category === "CS";
  const isRent = category === "Rent" || category === "RR" || category === "CR";

  const handleChange = (name, value) => {
    setValue(name, value);
    setField(name, value);
    trigger(name);
  };

  return (
    <div className="space-y-8 rounded-lg bg-background p-6 shadow-sm">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-semibold">Pricing Information</h2>
        <p className="mt-1 text-base text-muted-foreground">
          Provide pricing details for your property
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Price */}
        <FormField
          control={control}
          name="price"
          rules={{
            required: "Please enter a price",
            min: { value: 1, message: "Price must be greater than 0" },
          }}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-medium">
                Price <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter price"
                  value={field.value || ""}
                  onChange={(e) => handleChange("price", e.target.value)}
                  className="h-10 w-full text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Hide Price */}
        <FormField
          control={control}
          name="hide_price"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-4">
              <FormLabel className="text-base font-medium">
                Hide Price? (Property Finder Only)
              </FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    handleChange("hide_price", checked)
                  }
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Payment Method */}
        <FormField
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-medium">
                Payment Method
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => handleChange("paymentMethod", val)}
              >
                <FormControl>
                  <SelectTrigger className="h-10 w-full text-base">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem
                      key={method}
                      value={method.toLocaleLowerCase()}
                      className="text-base"
                    >
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Down Payment */}
        <FormField
          control={control}
          name="downPayment"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-medium">
                Down Payment
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter down payment amount"
                  value={field.value || ""}
                  onChange={(e) => handleChange("downPayment", e.target.value)}
                  className="h-10 w-full text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Amount Type */}
        <FormField
          control={control}
          name="amountType"
          rules={{ required: "Please select an amount type" }}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-medium">
                Amount Type <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => handleChange("amountType", val)}
              >
                <FormControl>
                  <SelectTrigger className="h-10 w-full text-base">
                    <SelectValue placeholder="Select amount type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {amountTypeOptions.map((type) => (
                    <SelectItem key={type} value={type} className="text-base">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Cheques */}
        <FormField
          control={control}
          name="cheques"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-medium">Cheques</FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => handleChange("cheques", val)}
              >
                <FormControl>
                  <SelectTrigger className="h-10 w-full text-base">
                    <SelectValue placeholder="Select number of cheques" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {chequeOptions.map((opt) => (
                    <SelectItem key={opt} value={opt} className="text-base">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Service Charges */}
        <FormField
          control={control}
          name="service_charges"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-medium">
                Service Charges
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter service charges"
                  value={field.value}
                  onChange={(e) =>
                    handleChange("service_charges", e.target.value)
                  }
                  className="h-10 w-full text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Financial Status */}
        <FormField
          control={control}
          name="financialStatus"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-medium">
                Financial Status
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => handleChange("financialStatus", val)}
              >
                <FormControl>
                  <SelectTrigger className="h-10 w-full text-base">
                    <SelectValue placeholder="Select financial status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["Mortgaged", "Cash"].map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="text-base"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default Pricing;
