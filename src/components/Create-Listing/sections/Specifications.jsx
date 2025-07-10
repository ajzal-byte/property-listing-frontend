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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  OfferingTypeEnum,
  bedroomOptions,
  bathroomOptions,
  furnishing_typeEnum,
  finishingTypeEnum,
  projectStautusEnum,
} from "../../../enums/createListingsEnums";

const Specifications = ({ formData, setField }) => {
  const { control, setValue, trigger } = useFormContext();

  // Define residential and commercial property types based on offering type
  const residentialTypes = formData.propertyTypes.filter((type) =>
    type.category.includes("residential")
  );
  const commercialTypes = formData.propertyTypes.filter((type) =>
    type.category.includes("commercial")
  );

  const handleChange = (name, value) => {
    setValue(name, value);
    setField(name, value);
    trigger(name);
  };

  // Determine property types based on offering type
  const getPropertyTypes = (category) => {
    if (category === "residential") {
      return residentialTypes;
    }
    return commercialTypes;
  };

  return (
    <div className="space-y-8 rounded-lg bg-background p-6 shadow-sm">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-semibold">Property Specifications</h2>
        <p className="mt-1 text-base text-muted-foreground">
          Provide essential details about your property
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Category */}
        <FormField
          control={control}
          name="category"
          rules={{ required: "Please select a category" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium flex items-center gap-1">
                Category <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => handleChange("category", val)}
              >
                <FormControl>
                  <SelectTrigger className="h-10 text-base w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {OfferingTypeEnum.map(({ value, name }) => (
                    <SelectItem key={value} value={value} className="text-base">
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Property Type */}
        <FormField
          control={control}
          name="property_type"
          rules={{ required: "Please select a property type" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium flex items-center gap-1">
                Property Type{" "}
                <span className="text-sm text-stone-500">
                  (Select a Category first)
                </span>{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => handleChange("property_type", val)}
              >
                <FormControl>
                  <SelectTrigger className="h-10 text-base w-full">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getPropertyTypes(formData.category).map(
                    ({ value, name }) => (
                      <SelectItem
                        key={value}
                        value={value}
                        className="text-base"
                      >
                        {name}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Title Deed */}
        <FormField
          control={control}
          name="title_deed"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Title Deed
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter title deed number"
                  value={field.value || ""}
                  onChange={(e) => handleChange("title_deed", e.target.value)}
                  className="h-10 text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Size (sq.ft) */}
        <FormField
          control={control}
          name="size"
          rules={{
            required: "Please enter property size",
            min: { value: 1, message: "Size must be greater than 0" },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium flex items-center gap-1">
                Size (sq.ft) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter size in sq.ft"
                  value={field.value || ""}
                  min={1}
                  step={0.01}
                  onChange={(e) => handleChange("size", e.target.value)}
                  className="h-10 text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Bedrooms */}
        <FormField
          control={control}
          name="bedrooms"
          rules={{ required: "Please select no. of bedrooms" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium flex items-center gap-1">
                Bedrooms <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => handleChange("bedrooms", val)}
              >
                <FormControl>
                  <SelectTrigger className="h-10 text-base w-full">
                    <SelectValue placeholder="Select no. of bedrooms" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bedroomOptions.map((item) => (
                    <SelectItem key={item} value={item} className="text-base">
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Bathrooms */}
        <FormField
          control={control}
          name="bathrooms"
          rules={{ required: "Please select no. of bathrooms" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium flex items-center gap-1">
                Bathrooms <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => handleChange("bathrooms", val)}
              >
                <FormControl>
                  <SelectTrigger className="h-10 text-base w-full">
                    <SelectValue placeholder="Select no. of bathrooms" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bathroomOptions.map((item) => (
                    <SelectItem key={item} value={item} className="text-base">
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Furnishing Type */}
        <FormField
          control={control}
          name="furnishing_type"
          rules={{ required: "Please select furnishing type" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium flex items-center gap-1">
                Furnishing Type <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => handleChange("furnishing_type", val)}
              >
                <FormControl>
                  <SelectTrigger className="h-10 text-base w-full">
                    <SelectValue placeholder="Select furnishing type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {furnishing_typeEnum.map(({ value, name }) => (
                    <SelectItem key={value} value={value} className="text-base">
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Finishing Type */}
        <FormField
          control={control}
          name="finishingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Finishing Type
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => handleChange("finishingType", val)}
              >
                <FormControl>
                  <SelectTrigger className="h-10 text-base w-full">
                    <SelectValue placeholder="Select finishing type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {finishingTypeEnum.map(({ value, name }) => (
                    <SelectItem key={value} value={value} className="text-base">
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Parking Spaces */}
        <FormField
          control={control}
          name="parking"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Parking Spaces
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of parking spaces"
                  value={field.value || ""}
                  min={0}
                  step={1}
                  onChange={(e) => handleChange("parking", e.target.value)}
                  className="h-10 text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Unit Number */}
        <FormField
          control={control}
          name="unit_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Unit Number
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter unit number"
                  value={field.value || ""}
                  onChange={(e) => handleChange("unit_no", e.target.value)}
                  className="h-10 text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Total Plot Size */}
        <FormField
          control={control}
          name="total_plot_size"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Total Plot Size (sq.ft)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter total plot size"
                  value={field.value || ""}
                  min={1}
                  step={0.01}
                  onChange={(e) =>
                    handleChange("total_plot_size", e.target.value)
                  }
                  className="h-10 text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Lot Size */}
        <FormField
          control={control}
          name="lotSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Lot Size (sq.ft)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter lot size"
                  value={field.value || ""}
                  min={1}
                  step={0.01}
                  onChange={(e) => handleChange("lotSize", e.target.value)}
                  className="h-10 text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Built-up Area */}
        <FormField
          control={control}
          name="built_up_area"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Built-up Area (sq.ft)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter built-up area"
                  value={field.value || ""}
                  min={1}
                  step={0.01}
                  onChange={(e) =>
                    handleChange("built_up_area", e.target.value)
                  }
                  className="h-10 text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Layout Type */}
        <FormField
          control={control}
          name="layout_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Layout Type
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter layout type"
                  value={field.value || ""}
                  onChange={(e) => handleChange("layout_type", e.target.value)}
                  className="h-10 text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Ownership */}
        <FormField
          control={control}
          name="ownership"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Ownership</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter ownership type"
                  value={field.value || ""}
                  onChange={(e) => handleChange("ownership", e.target.value)}
                  className="h-10 text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Developer */}
        <FormField
          control={control}
          name="developer"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Developer</FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => handleChange("developer", val)}
              >
                <FormControl>
                  <SelectTrigger className="h-10 text-base w-full">
                    <SelectValue placeholder="Select developer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {formData.developers.map((dev) => (
                    <SelectItem
                      key={dev.id}
                      value={String(dev.id)}
                      className="text-base"
                    >
                      {dev.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Project Name */}
        <FormField
          control={control}
          name="project_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Project Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter project name"
                  value={field.value || ""}
                  onChange={(e) => handleChange("project_name", e.target.value)}
                  className="h-10 text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Project Status */}
        <FormField
          control={control}
          name="project_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium flex items-center gap-1">
                Project Status
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => handleChange("project_status", val)}
              >
                <FormControl>
                  <SelectTrigger className="h-10 text-base w-full">
                    <SelectValue placeholder="Project Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projectStautusEnum.map(({ value, name }) => (
                    <SelectItem key={value} value={value} className="text-base">
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Build Year */}
        <FormField
          control={control}
          name="build_year"
          rules={{
            min: {
              value: 1900,
              message: "Build year must be greater than 1900",
            },
            max: {
              value: new Date().getFullYear(),
              message: "Build year must be less than current year",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Build Year
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter build year"
                  value={field.value || ""}
                  onChange={(e) => handleChange("build_year", e.target.value)}
                  className="h-10 text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Floor Number */}
        <FormField
          control={control}
          name="floor_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Floor Number
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter floor number"
                  value={field.value || ""}
                  onChange={(e) => handleChange("floor_number", e.target.value)}
                  className="h-10 text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Plot Number */}
        <FormField
          control={control}
          name="plot_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Plot Number
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter plot number"
                  value={field.value || ""}
                  onChange={(e) => handleChange("plot_number", e.target.value)}
                  className="h-10 text-base"
                />
              </FormControl>
              <FormMessage className="text-base" />
            </FormItem>
          )}
        />

        {/* Garden Switch */}
        <FormField
          control={control}
          name="hasGarden"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="text-base font-medium">
                Has Garden?
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      handleChange("hasGarden", checked)
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

        {/* Kitchen Switch */}
        <FormField
          control={control}
          name="hasKitchen"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="text-base font-medium">
                Has Kitchen?
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      handleChange("hasKitchen", checked)
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
      </div>
    </div>
  );
};

export default Specifications;
