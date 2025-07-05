import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Form as FormProvider } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, X } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import getAuthHeaders from "@/utils/getAuthHeader";

const LocationForm = ({ formData, setField, nextStep, prevStep }) => {
  const form = useForm({
    defaultValues: formData,
  });

  const { handleSubmit } = form;

  // Local UI state
  const [openPF, setOpenPF] = useState(false);
  const [openBayut, setOpenBayut] = useState(false);

  // The user’s typed search queries
  const [searchQueryPF, setSearchQueryPF] = useState("");
  const [searchQueryBayut, setSearchQueryBayut] = useState("");

  // The list we show in each dropdown—starts as the full fetched list, then becomes "search results"
  const [filteredPf, setFilteredPf] = useState([]);
  const [filteredBayut, setFilteredBayut] = useState([]);

  // Floor plan file upload (unchanged)
  const floorPlanFileInputRef = useRef(null);
  const [draggingFloorPlan, setDraggingFloorPlan] = useState(false);
  const [floorPlanError, setFloorPlanError] = useState("");

  // 1) Whenever `formData.pfLocations` arrives or the user types a new search, update filteredPf
  useEffect(() => {
    // Initialize with the “all PF locations” if no search query
    if (!searchQueryPF) {
      setFilteredPf(formData.pfLocations);
      return;
    }

    // Debounce: wait 300ms after last keystroke before calling API
    const handle = setTimeout(async () => {
      try {
        const API_BASE_URL = "https://backend.myemirateshome.com/api";
        const headers = getAuthHeaders();
        const res = await fetch(
          `${API_BASE_URL}/locations?type=pf&search=${encodeURIComponent(
            searchQueryPF
          )}`,
          { headers }
        );
        const json = await res.json();
        setFilteredPf(json.data || []);
      } catch (err) {
        console.error("Error fetching PF locations:", err);
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [searchQueryPF, formData.pfLocations]);

  // 2) Similarly for Bayut locations
  useEffect(() => {
    if (!searchQueryBayut) {
      setFilteredBayut(formData.bayutLocations);
      return;
    }

    const handle = setTimeout(async () => {
      try {
        const API_BASE_URL = "https://backend.myemirateshome.com/api";
        const headers = getAuthHeaders();
        const res = await fetch(
          `${API_BASE_URL}/locations?type=bayut&search=${encodeURIComponent(
            searchQueryBayut
          )}`,
          { headers }
        );
        const json = await res.json();
        setFilteredBayut(json.data || []);
      } catch (err) {
        console.error("Error fetching Bayut locations:", err);
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [searchQueryBayut, formData.bayutLocations]);

  // 3) Once the fetched data arrives (on mount), seed the filtered lists:
  useEffect(() => {
    setFilteredPf(formData.pfLocations);
  }, [formData.pfLocations]);

  useEffect(() => {
    setFilteredBayut(formData.bayutLocations);
  }, [formData.bayutLocations]);

  // ――― Floor Plan handlers (unchanged from your original) ―――
  const handleFloorPlanChange = useCallback(
    (newImages) => {
      const updated = [...formData.floor_plan_urls, ...newImages];
      setField("floor_plan_urls", updated);
      setFloorPlanError("");
    },
    [formData.floor_plan_urls, setField]
  );

  const handleFloorPlanFileUpload = (files) => {
    const uploadedImages = [];
    const validImageTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSizeMB = 10;
    let hasError = false;

    Array.from(files).forEach((file) => {
      if (!validImageTypes.includes(file.type)) {
        setFloorPlanError("Only JPG, PNG, or WEBP images are allowed");
        hasError = true;
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setFloorPlanError(`File size exceeds ${maxSizeMB}MB limit`);
        hasError = true;
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedImages.push(e.target.result);
        if (uploadedImages.length === files.length && !hasError) {
          handleFloorPlanChange(uploadedImages);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFloorPlanDragOver = (e) => {
    e.preventDefault();
    setDraggingFloorPlan(true);
  };

  const handleFloorPlanDragLeave = () => {
    setDraggingFloorPlan(false);
  };

  const handleFloorPlanDrop = (e) => {
    e.preventDefault();
    setDraggingFloorPlan(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFloorPlanFileUpload(e.dataTransfer.files);
    }
  };

  const handleFloorPlanClickUpload = () => {
    floorPlanFileInputRef.current.click();
  };

  const removeFloorPlanImage = (index) => {
    const updatedImages = [...formData.floor_plan_urls];
    updatedImages.splice(index, 1);
    setField("floor_plan_urls", updatedImages);
  };

  // 4) When user selects a PF location, fill in the related fields automatically
  const onSelectPfLocation = (loc) => {
    // `loc` is one object from `formData.pfLocations`: { id, city, community, sub_community, building, location, type }
    setField("property_finder_location", loc.id);
    setField("property_finder_city", loc.city || "");
    setField("property_finder_community", loc.community || "");
    setField("property_finder_sub_community", loc.sub_community || "");
    setField("property_finder_tower", loc.building || "");
    setOpenPF(false);
    setSearchQueryPF("");
  };

  // 5) When user selects a Bayut location, do the same
  const onSelectBayutLocation = (loc) => {
    setField("bayut_location", loc.id);
    setField("bayut_city", loc.city || "");
    setField("bayut_community", loc.community || "");
    setField("bayut_sub_community", loc.sub_community || "");
    setField("bayut_tower", loc.building || "");
    setOpenBayut(false);
    setSearchQueryBayut("");
  };

  const onSubmit = () => nextStep();

  return (
    <FormProvider {...form}>
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="border-b pb-4">
          <h2 className="text-2xl font-semibold">Location & Floor Plan</h2>
          <p className="text-muted-foreground text-sm">
            Set property location details and upload floor plans.
          </p>
        </div>

        {/* Two Location Cards Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property Finder Location Card */}
          <Card>
            <CardHeader>
              <CardTitle>Property Finder Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Popover open={openPF} onOpenChange={setOpenPF}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openPF}
                      className="w-full justify-between"
                    >
                      {formData.property_finder_location
                        ? formData.pfLocations.find(
                            (o) => o.id === formData.property_finder_location
                          )?.location
                        : "Select location..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Search PF location..."
                        value={searchQueryPF}
                        onValueChange={setSearchQueryPF}
                      />
                      <CommandEmpty>No location found.</CommandEmpty>
                      <CommandGroup>
                        {filteredPf.map((option) => (
                          <CommandItem
                            key={option.id}
                            value={option.location}
                            onSelect={() => onSelectPfLocation(option)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.property_finder_location === option.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {option.location}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Derived fields: city, community, sub‐community, tower */}
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input value={formData.property_finder_city} disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Community</label>
                <Input value={formData.property_finder_community} disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sub Community</label>
                <Input
                  value={formData.property_finder_sub_community}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tower/Building</label>
                <Input value={formData.property_finder_tower} disabled />
              </div>
            </CardContent>
          </Card>

          {/* Bayut Location Card */}
          <Card>
            <CardHeader>
              <CardTitle>Bayut Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Popover open={openBayut} onOpenChange={setOpenBayut}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openBayut}
                      className="w-full justify-between"
                    >
                      {formData.bayut_location
                        ? formData.bayutLocations.find(
                            (o) => o.id === formData.bayut_location
                          )?.location
                        : "Select location..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Search Bayut location..."
                        value={searchQueryBayut}
                        onValueChange={setSearchQueryBayut}
                      />
                      <CommandEmpty>No location found.</CommandEmpty>
                      <CommandGroup>
                        {filteredBayut.map((option) => (
                          <CommandItem
                            key={option.id}
                            value={option.location}
                            onSelect={() => onSelectBayutLocation(option)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.bayut_location === option.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {option.location}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Derived fields for Bayut */}
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input value={formData.bayut_city} disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Community</label>
                <Input value={formData.bayut_community} disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sub Community</label>
                <Input value={formData.bayut_sub_community} disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tower/Building</label>
                <Input value={formData.bayut_tower} disabled />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Common Latitude/Longitude Section */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Latitude</label>
            <Input
              value={formData.latitude}
              onChange={(e) => setField("latitude", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Longitude</label>
            <Input
              value={formData.longitude}
              onChange={(e) => setField("longitude", e.target.value)}
            />
          </div>
        </div>

        {/* Floor Plan Card (unchanged) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="mr-2" size={20} />
              <span>Floor Plan</span>
              <span className="ml-2 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                {formData.floor_plan_urls?.length || 0}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center bg-muted/50 cursor-pointer transition-colors ${
                draggingFloorPlan
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground"
              }`}
              onDragOver={handleFloorPlanDragOver}
              onDragLeave={handleFloorPlanDragLeave}
              onDrop={handleFloorPlanDrop}
              onClick={handleFloorPlanClickUpload}
            >
              <Upload
                className={`mx-auto mb-4 ${
                  draggingFloorPlan ? "text-primary" : "text-muted-foreground"
                }`}
                size={48}
              />
              <p className="text-muted-foreground mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-muted-foreground">
                Supports JPG, PNG, WEBP up to 10MB
              </p>
              <input
                type="file"
                ref={floorPlanFileInputRef}
                className="hidden"
                accept="image/jpeg, image/png, image/webp"
                multiple
                onChange={(e) => handleFloorPlanFileUpload(e.target.files)}
              />
            </div>

            {floorPlanError && (
              <p className="text-red-500 text-sm mt-2">{floorPlanError}</p>
            )}

            {formData.floor_plan_urls?.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {formData.floor_plan_urls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square overflow-hidden rounded-lg border">
                      <img
                        src={url}
                        alt={`Floor Plan ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFloorPlanImage(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="w-full sm:w-auto"
          >
            Back
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            Continue to Next Step
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default LocationForm;
