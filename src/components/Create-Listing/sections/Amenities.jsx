import React, { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";

const Amenities = ({ formData, setField }) => {
  const { control, setValue } = useFormContext();

  // Subscribe to "selectedAmenities" so we know which codes are checked
  const selectedAmenities = useWatch({
    control,
    name: "selectedAmenities",
  });

  // Subscribe to "offeringType" so we know which subset to display
  const offeringType = useWatch({
    control,
    name: "offeringType",
  });

  const showCommercial = offeringType === "CS" || offeringType === "CR";
  const showPrivate = offeringType === "RS" || offeringType === "RR";

  // Filter the fetched amenitiesList based on amenity_type
  const filteredAmenities = formData.amenitiesList.filter((amenity) => {
    if (showCommercial) return amenity.amenity_type === "commercial";
    if (showPrivate) return amenity.amenity_type === "private";
    return false;
  });

  // On mount (or when formData.selectedAmenities changes), re-sync RHF field
  useEffect(() => {
    const saved = formData.selectedAmenities || [];
    setValue("selectedAmenities", saved);
    // We do NOT call setField here to avoid infinite loop—this just populates RHF
  }, [formData.selectedAmenities, setValue]);

  const handleAmenityToggle = (code) => {
    const updated = selectedAmenities?.includes(code)
      ? selectedAmenities.filter((c) => c !== code)
      : [...(selectedAmenities || []), code];

    // Update both RHF's "selectedAmenities" and the hook's formData
    setValue("selectedAmenities", updated);
    setField("selectedAmenities", updated);
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold">Property Amenities</h2>
        <p className="text-muted-foreground text-sm">
          Select the amenities available at your property.
        </p>
      </div>

      {filteredAmenities.length === 0 ? (
        <p className="text-sm text-gray-500">
          No amenities available for the selected offering type.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredAmenities.map((amenity) => {
            const code = amenity.id;
            const name = amenity.amenity_name;
            const isSelected = selectedAmenities?.includes(code);

            return (
              <Card
                key={code}
                className={`cursor-pointer border ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                } rounded-md text-sm`}
                onClick={() => handleAmenityToggle(code)}
              >
                <CardContent className="p-3 text-center">{name}</CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Amenities;
