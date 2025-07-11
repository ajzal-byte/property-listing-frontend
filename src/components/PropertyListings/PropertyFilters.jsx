import { useEffect, useState } from "react";
import {
  Search,
  Map,
  PlusCircle,
  Filter,
  X,
  List,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MultiSelectFilter } from "./MultiSelectFilter";
import { LocationSelectField } from "./LocationSelectField";
import { getAllFilterOptions } from "@/utils/getFilterOptions";

const PropertyFilters = ({
  filters,
  onFilterChange,
  isMapView,
  isListView,
  isGridView,
  handleViewChange = () => {},
}) => {
  const navigate = useNavigate();
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // State for non-location filter options
  const [filterOptions, setFilterOptions] = useState({
    propertyTypes: [],
    offeringTypes: [],
    developers: [],
    agents: [],
    owners: [],
    bedroomOptions: [],
    bathroomOptions: [],
    statusOptions: [],
    portalOptions: [],
  });

  // Load non-location options once on mount
  useEffect(() => {
    const loadOptions = async () => {
      const options = await getAllFilterOptions();
      setFilterOptions(options);
    };
    loadOptions();
  }, []);

  // Count active filters
  useEffect(() => {
    const count = Object.entries(filters).filter(
      ([key, value]) =>
        value && value.length > 0 && !["page", "per_page"].includes(key)
    ).length;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleMultiSelectChange = (field, value) => {
    const currentValues = filters[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFilterChange({ [field]: newValues });
  };

  const clearFilter = (field) => {
    if (Array.isArray(filters[field])) {
      onFilterChange({ [field]: [] });
    } else {
      onFilterChange({ [field]: "" });
    }
  };

  const handleLocationChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  // Prepare location filters for the location select fields
  const locationFilters = {};

  return (
    <div className="space-y-6 mb-8">
      {/* Top Row - Search and Create */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            className="pl-10 w-full"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
          />
        </div>

        <Button variant="blue" onClick={() => navigate("/create-listing")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Listing
        </Button>
      </div>

      {/* Main Filter Row */}
      <div className="flex flex-wrap -mx-2">
        <div className="px-2 mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
          <MultiSelectFilter
            title="Property Type"
            options={filterOptions.propertyTypes}
            value={filters.property_types || []}
            onChange={(values) => onFilterChange({ property_types: values })}
          />
        </div>
        <div className="px-2 mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
          <MultiSelectFilter
            title="Offering Types"
            options={filterOptions.offeringTypes}
            value={filters.offering_types || []}
            onChange={(values) => onFilterChange({ offering_types: values })}
          />
        </div>
        <div className="px-2 mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
          <LocationSelectField
            field="city"
            label="City"
            value={filters.city || []}
            onChange={(value) => handleLocationChange("city", value)}
            locationFilters={locationFilters}
          />
        </div>
        <div className="px-2 mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/7">
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange({ status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="px-2 mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
          <MultiSelectFilter
            title="Select Portals"
            className="w-full"
            options={filterOptions.portalOptions}
            value={filters.portal || []}
            onChange={(values) => onFilterChange({ portal: values })}
          />
        </div>
        <div className="px-2 mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/8">
          <Select
            value={filters.bedrooms}
            onValueChange={(value) => onFilterChange({ bedrooms: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.bedroomOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="px-2 mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/8">
          <Select
            value={filters.bathrooms}
            onValueChange={(value) => onFilterChange({ bathrooms: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Bathrooms" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.bathroomOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="px-2 mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
          <Dialog open={moreFiltersOpen} onOpenChange={setMoreFiltersOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="relative w-full">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="blue"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Advanced Filters</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="grid grid-cols-2 gap-6">
                  {/* Column 1 */}
                  <div className="space-y-4">
                    {/* Reference Number */}
                    <div className="space-y-2">
                      <Label>Reference Number</Label>
                      <Input
                        value={filters.reference_no}
                        onChange={(e) =>
                          onFilterChange({ reference_no: e.target.value })
                        }
                        placeholder="Enter reference number"
                      />
                    </div>

                    {/* Community */}
                    <div className="space-y-2">
                      <Label>Community</Label>
                      <LocationSelectField
                        field="community"
                        label="community"
                        value={filters.community || []}
                        onChange={(value) =>
                          handleLocationChange("community", value)
                        }
                        locationFilters={locationFilters}
                      />
                    </div>

                    {/* Sub‑community */}
                    <div className="space-y-2">
                      <Label>Sub‑community</Label>
                      <LocationSelectField
                        field="sub_community"
                        label="sub-community"
                        value={filters.sub_community || []}
                        onChange={(value) =>
                          handleLocationChange("sub_community", value)
                        }
                        locationFilters={locationFilters}
                      />
                    </div>

                    {/* Building */}
                    <div className="space-y-2">
                      <Label>Building</Label>
                      <LocationSelectField
                        field="building"
                        label="building"
                        value={filters.building || []}
                        onChange={(value) =>
                          handleLocationChange("building", value)
                        }
                        locationFilters={locationFilters}
                      />
                    </div>

                    {/* RERA Permit */}
                    <div className="space-y-2">
                      <Label>RERA Permit Number</Label>
                      <Input
                        value={filters.rera_permit_number}
                        onChange={(e) =>
                          onFilterChange({ rera_permit_number: e.target.value })
                        }
                        placeholder="Enter RERA number"
                      />
                    </div>

                    {/* DTCM Permit */}
                    <div className="space-y-2">
                      <Label>DTCM Permit Number</Label>
                      <Input
                        value={filters.dtcm_permit_number}
                        onChange={(e) =>
                          onFilterChange({ dtcm_permit_number: e.target.value })
                        }
                        placeholder="Enter DTCM number"
                      />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={filters.title}
                        onChange={(e) =>
                          onFilterChange({ title: e.target.value })
                        }
                        placeholder="Enter listing title"
                      />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={filters.status}
                        onValueChange={(value) =>
                          onFilterChange({ status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {filterOptions.statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4">
                    {/* Developer IDs */}
                    <div className="space-y-2">
                      <Label>Developer</Label>
                      <MultiSelectFilter
                        title="Select Developer"
                        className="w-full"
                        options={filterOptions.developers}
                        value={filters.developer || []}
                        onChange={(values) =>
                          onFilterChange({ developer: values })
                        }
                      />
                    </div>

                    {/* Agent IDs */}
                    <div className="space-y-2">
                      <Label>Agent</Label>
                      <MultiSelectFilter
                        title="Select Agent"
                        className="w-full"
                        options={filterOptions.agents}
                        value={filters.agent_id || []}
                        onChange={(values) =>
                          onFilterChange({ agent_id: values })
                        }
                      />
                    </div>

                    {/* Owner IDs */}
                    <div className="space-y-2">
                      <Label>Owner</Label>
                      <MultiSelectFilter
                        title="Select Owner"
                        className="w-full"
                        options={filterOptions.owners}
                        value={filters.owner_id || []}
                        onChange={(values) =>
                          onFilterChange({ owner_id: values })
                        }
                      />
                    </div>
                    {/* Landlord Email */}
                    <div className="space-y-2">
                      <Label>Landlord Email</Label>
                      <Input
                        value={filters.landlord_email}
                        onChange={(e) =>
                          onFilterChange({ landlord_email: e.target.value })
                        }
                        placeholder="Enter landlord email"
                      />
                    </div>

                    {/* Landlord Contact */}
                    <div className="space-y-2">
                      <Label>Landlord Contact</Label>
                      <Input
                        value={filters.landlord_contact}
                        onChange={(e) =>
                          onFilterChange({ landlord_contact: e.target.value })
                        }
                        placeholder="Enter landlord phone"
                      />
                    </div>

                    {/* Price Range */}
                    <div className="space-y-2">
                      <Label>Price Range</Label>
                      <div className="flex gap-2">
                        <Input
                          value={filters.price_min}
                          onChange={(e) =>
                            onFilterChange({ price_min: e.target.value })
                          }
                          placeholder="Min"
                          type="number"
                        />
                        <Input
                          value={filters.price_max}
                          onChange={(e) =>
                            onFilterChange({ price_max: e.target.value })
                          }
                          placeholder="Max"
                          type="number"
                        />
                      </div>
                    </div>

                    {/* Portals */}
                    <div className="space-y-2">
                      <Label>Portals</Label>
                      <MultiSelectFilter
                        title="Select Portals"
                        className="w-full"
                        options={filterOptions.portalOptions}
                        value={filters.portal || []}
                        onChange={(values) =>
                          onFilterChange({ portal: values })
                        }
                      />
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (
              !value ||
              value.length === 0 ||
              ["page", "per_page"].includes(key)
            )
              return null;

            if (Array.isArray(value)) {
              return value.map((val) => {
                // Find the label for the value
                let label = val;
                const optionGroup =
                  key === "property_types"
                    ? filterOptions.propertyTypes
                    : key === "offering_types"
                    ? filterOptions.offeringTypes
                    : key === "developer"
                    ? filterOptions.developers
                    : key === "agent_id"
                    ? filterOptions.agents
                    : key === "owner_id"
                    ? filterOptions.owners
                    : key === "portal"
                    ? filterOptions.portalOptions
                    : null;

                if (optionGroup) {
                  const option = optionGroup.find((opt) => opt.value === val);
                  if (option) label = option.label;
                }

                return (
                  <Badge
                    variant="blue"
                    key={`${key}-${val}`}
                    className="flex items-center gap-1"
                  >
                    {key}: {label}
                    <button onClick={() => handleMultiSelectChange(key, val)}>
                      <X className="h-3 w-3 cursor-pointer" />
                    </button>
                  </Badge>
                );
              });
            } else {
              // Find the label for single select values
              let label = value;
              const optionGroup =
                key === "city"
                  ? filterOptions.cities
                  : key === "community"
                  ? filterOptions.communities
                  : key === "sub_community"
                  ? filterOptions.subCommunities
                  : key === "building"
                  ? filterOptions.buildings
                  : key === "bedrooms"
                  ? filterOptions.bedroomOptions
                  : key === "bathrooms"
                  ? filterOptions.bathroomOptions
                  : key === "status"
                  ? filterOptions.statusOptions
                  : null;

              if (Array.isArray(optionGroup)) {
                if (
                  key === "city" ||
                  key === "community" ||
                  key === "sub_community" ||
                  key === "building"
                ) {
                  // These are already strings
                } else {
                  const option = optionGroup.find((opt) => opt.value === value);
                  if (option) label = option.label;
                }
              }

              return (
                <Badge
                  variant="blue"
                  key={key}
                  className="flex items-center gap-1"
                >
                  {key}: {label}
                  <button onClick={() => clearFilter(key)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            }
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onFilterChange({
                search: "",
                property_types: [],
                city: "",
                community: "",
                sub_community: "",
                building: "",
                bedrooms: "",
                bathrooms: "",
                price_min: "",
                price_max: "",
                reference_no: "",
                rera_permit_number: "",
                dtcm_permit_number: "",
                title: "",
                status: "",
                landlord_email: "",
                landlord_contact: "",
                offering_types: [],
                portal: [],
                developer: [],
                agent_id: [],
                owner_id: [],
                page: 1,
              });
            }}
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Bottom Row - Map View and Clear */}
      <div className="flex items-center space-x-2">
        {/* List View */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              pressed={isListView}
              onPressedChange={() => handleViewChange("list")}
              size="sm"
              className={cn(isListView && "bg-blue-500 text-white")}
            >
              <List className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent side="top">List View</TooltipContent>
        </Tooltip>

        {/* Grid View */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              pressed={isGridView}
              onPressedChange={() => handleViewChange("grid")}
              size="sm"
              className={cn(isGridView && "bg-blue-500 text-white")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent side="top">Grid View</TooltipContent>
        </Tooltip>

        {/* Map View */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              pressed={isMapView}
              onPressedChange={() => handleViewChange("map")}
              size="sm"
              className={cn(isMapView && "bg-blue-500 text-white")}
            >
              <Map className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent side="top">Map View</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default PropertyFilters;
