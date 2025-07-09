// src/components/Amenities.jsx
import React, { useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";

const Amenities = ({ formData, setField }) => {
  const { control, setValue } = useFormContext();

  // Watch the selected amenities and property type
  const selectedAmenities = useWatch({
    control,
    name: "selectedAmenities",
  });
  const propertyType = useWatch({
    control,
    name: "property_type",
  });

  // On initial mount, populate RHF with any saved amenities
  useEffect(() => {
    const saved = formData.selectedAmenities || [];
    setValue("selectedAmenities", saved);
  }, [formData.selectedAmenities, setValue]);

  // Define amenity code groups
  const residentialCodes = [
    "central-ac",
    "built-in-wardrobes",
    "kitchen-appliances",
    "security",
    "concierge",
    "maid-service",
    "balcony",
    "private-gym",
    "shared-gym",
    "private-jacuzzi",
    "shared-spa",
    "covered-parking",
    "maids-room",
    "study",
    "childrens-play-area",
    "pets-allowed",
    "barbecue-area",
    "shared-pool",
    "childrens-pool",
    "private-garden",
    "private-pool",
    "view-of-water",
    "view-of-landmark",
    "walk-in-closet",
    "lobby-in-building",
    "vastu-compliant",
  ];

  const commercialCodes = [
    "shared-gym",
    "covered-parking",
    "networked",
    "shared-pool",
    "dining-in-building",
    "conference-room",
    "lobby-in-building",
    "vastu-compliant",
  ];

  const noAmenityTypes = ["farm", "land"];

  // Compute which amenity codes are allowed for the current property type
  const allowedAmenityCodes = useMemo(() => {
    if (!propertyType || noAmenityTypes.includes(propertyType)) {
      return [];
    }

    const residentialTypes = [
      "apartment",
      "bulk-rent-unit",
      "bulk-sale-unit",
      "bungalow",
      "compound",
      "duplex",
      "full-floor",
      "half-floor",
      "hotel-apartment",
      "penthouse",
      "townhouse",
      "villa",
      "whole-building",
    ];

    const commercialTypes = [
      "business-center",
      "co-working-space",
      "factory",
      "labor-camp",
      "office-space",
      "retail",
      "shop",
      "show-room",
      "staff-accommodation",
      "warehouse",
    ];

    if (residentialTypes.includes(propertyType)) {
      return residentialCodes;
    }

    if (commercialTypes.includes(propertyType)) {
      return commercialCodes;
    }

    return [];
  }, [propertyType]);

  // Whenever propertyType changes, clear out any selected amenities
  // that are no longer in the allowed list
  useEffect(() => {
    const current = selectedAmenities || [];
    const filtered = current.filter((code) =>
      allowedAmenityCodes.includes(code)
    );

    if (filtered.length !== current.length) {
      setValue("selectedAmenities", filtered);
      setField("selectedAmenities", filtered);
    }
  }, [
    propertyType,
    allowedAmenityCodes,
    selectedAmenities,
    setValue,
    setField,
  ]);

  // Filter the full amenitiesList down to only allowed codes
  const filteredAmenities = formData.amenitiesList.filter((amenity) =>
    allowedAmenityCodes.includes(amenity.amenity_code.toLowerCase())
  );

  // Toggle handler (with duplicate protection)
  const handleAmenityToggle = (code) => {
    if (!allowedAmenityCodes.includes(code)) {
      return;
    }

    const current = selectedAmenities || [];
    const updated = current.includes(code)
      ? current.filter((c) => c !== code)
      : Array.from(new Set([...current, code]));

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
          No amenities available for the selected property type.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {filteredAmenities.map((amenity) => {
            const code = amenity.amenity_code.toLowerCase();
            const name = amenity.amenity_name;
            const isSelected = selectedAmenities?.includes(code);

            return (
              <Card
                key={amenity.amenity_id}
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
