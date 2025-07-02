import { Search, ChevronDown, Map, BarChart2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle, toggleVariants } from "@/components/ui/toggle";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const PropertyFilters = ({
  filters,
  onFilterChange,
  isMapView,
  setIsMapView,
}) => {
  const navigate = useNavigate();

  // Sample options - replace with API data
  const propertyTypes = ["Apartment", "Villa", "Townhouse"];
  const offeringTypes = ["Sale", "Rent", "Off-plan"];
  const cities = ["Dubai", "Abu Dhabi", "Sharjah"];
  const bedroomOptions = ["Any", "Studio", "1", "2", "3", "4+"];

  return (
    <div className="space-y-6 mb-8">
      {/* Tabs and Create Button */}
      <div className="flex justify-between items-center mb-4">
        {/* Search */}
        <div className="relative w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            className="pl-10 w-full"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
          />
        </div>

        {/* Create Listing Button */}
        <Button variant="blue" onClick={() => navigate("/create-listing")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Listing
        </Button>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          value={filters.property_type}
          onValueChange={(value) => onFilterChange({ property_type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.offering_type}
          onValueChange={(value) => onFilterChange({ offering_type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Offering Type" />
          </SelectTrigger>
          <SelectContent>
            {offeringTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.city}
          onValueChange={(value) => onFilterChange({ city: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.bedrooms}
          onValueChange={(value) => onFilterChange({ bedrooms: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent>
            {bedroomOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Secondary Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Toggle
            pressed={isMapView}
            onPressedChange={setIsMapView}
            className={toggleVariants({ variant: "blue" })}
          >
            <Map className="mr-2 h-4 w-4" />
            Map View
          </Toggle>
        </div>

        <Button
          variant="ghost"
          onClick={() =>
            onFilterChange({
              search: "",
              property_type: "",
              offering_type: "",
              city: "",
              bedrooms: "",
              price_min: "",
              price_max: "",
              page: 1,
            })
          }
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default PropertyFilters;
