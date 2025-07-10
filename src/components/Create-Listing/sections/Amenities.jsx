// src/components/Amenities.jsx
import React, { useEffect, useMemo, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";

const Amenities = ({ formData, setField }) => {
  const { control, setValue } = useFormContext();
  const hasConvertedRef = useRef(false);

  // Watch the selected amenities and property type
  const selectedAmenities = useWatch({
    control,
    name: "selectedAmenities",
  });
  const propertyType = useWatch({
    control,
    name: "property_type",
  });

  // Convert saved codes to IDs on initial load
  useEffect(() => {
    if (hasConvertedRef.current) return;
    if (!formData.amenitiesList || formData.amenitiesList.length === 0) return;

    const saved = formData.selectedAmenities || [];

    // If already IDs, set directly
    if (saved.every((item) => typeof item === "number")) {
      setValue("selectedAmenities", saved);
      hasConvertedRef.current = true;
      return;
    }

    // Convert codes to IDs
    const converted = saved
      .map((item) => {
        if (typeof item === "string") {
          const amenity = formData.amenitiesList.find(
            (a) => a.amenity_code.toLowerCase() === item.toLowerCase()
          );
          return amenity ? amenity.id : null;
        }
        return item;
      })
      .filter((id) => id !== null);

    setValue("selectedAmenities", converted);
    setField("selectedAmenities", converted);
    hasConvertedRef.current = true;
  }, [formData.selectedAmenities, formData.amenitiesList, setValue, setField]);

  // Define amenity code groups
  const residentialCodes = useMemo(
    () => [
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
    ],
    []
  );

  const commercialCodes = useMemo(
    () => [
      "shared-gym",
      "covered-parking",
      "networked",
      "shared-pool",
      "dining-in-building",
      "conference-room",
      "lobby-in-building",
      "vastu-compliant",
    ],
    []
  );

  const noAmenityTypes = ["farm", "land"];
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

  // Compute which amenity codes are allowed (deduplicated)
  const allowedAmenityCodes = useMemo(() => {
    if (!propertyType || noAmenityTypes.includes(propertyType)) {
      return [];
    }
    if (residentialTypes.includes(propertyType)) {
      return [...new Set(residentialCodes)]; // Deduplicate just in case
    }
    if (commercialTypes.includes(propertyType)) {
      return [...new Set(commercialCodes)]; // Deduplicate just in case
    }
    return [];
  }, [propertyType, residentialCodes, commercialCodes]);

  // Filter amenities based on allowed codes and deduplicate
  const filteredAmenities = useMemo(() => {
    const filtered = formData.amenitiesList.filter((amenity) =>
      allowedAmenityCodes.includes(amenity.amenity_code.toLowerCase())
    );

    // Deduplicate based on amenity_code to prevent duplicates
    const seen = new Set();
    return filtered.filter((amenity) => {
      const key = amenity.amenity_code.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }, [formData.amenitiesList, allowedAmenityCodes]);

  // Get IDs of allowed amenities
  const allowedAmenityIds = useMemo(
    () => filteredAmenities.map((amenity) => amenity.id),
    [filteredAmenities]
  );

  // Clear invalid amenities when property type changes
  useEffect(() => {
    if (!selectedAmenities) return;

    const validAmenities = selectedAmenities.filter((id) =>
      allowedAmenityIds.includes(id)
    );

    if (validAmenities.length !== selectedAmenities.length) {
      setValue("selectedAmenities", validAmenities);
      setField("selectedAmenities", validAmenities);
    }
  }, [allowedAmenityIds, selectedAmenities, setValue, setField]);

  // Toggle handler using IDs
  const handleAmenityToggle = (id) => {
    if (!allowedAmenityIds.includes(id)) return;

    const current = selectedAmenities || [];
    const updated = current.includes(id)
      ? current.filter((c) => c !== id)
      : [...current, id];

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
            const isSelected = selectedAmenities?.includes(amenity.id);
            return (
              <Card
                key={amenity.id}
                className={`cursor-pointer border ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                } rounded-md text-sm`}
                onClick={() => handleAmenityToggle(amenity.id)}
              >
                <CardContent className="p-3 text-center">
                  {amenity.amenity_name}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Amenities;
