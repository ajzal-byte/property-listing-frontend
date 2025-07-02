import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import getAuthHeaders from "@/utils/getAuthHeader";
import { toast } from "sonner";
import {
  PropertyCards,
  PropertyFilters,
  PropertyPagination,
} from "../components/PropertyListings";

const PropertyListings = () => {
  const [isMapView, setIsMapView] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
  });

  // Get filters from URL params
  const getFiltersFromParams = () => {
    return {
      search: searchParams.get("search") || "",
      property_type: searchParams.get("property_type") || "",
      offering_type: searchParams.get("offering_type") || "",
      city: searchParams.get("city") || "",
      community: searchParams.get("community") || "",
      sub_community: searchParams.get("sub_community") || "",
      building: searchParams.get("building") || "",
      bedrooms: searchParams.get("bedrooms") || "",
      bathrooms: searchParams.get("bathrooms") || "",
      price_min: searchParams.get("price_min") || "",
      price_max: searchParams.get("price_max") || "",
      page: searchParams.get("page") || 1,
      per_page: searchParams.get("per_page") || 10,
    };
  };

  const [filters, setFilters] = useState(getFiltersFromParams());

  // Fetch listings
  const fetchListings = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      // Add filters to query params
      for (const [key, value] of Object.entries(filters)) {
        if (value) queryParams.append(key, value);
      }

      const response = await fetch(
        `https://backend.myemirateshome.com/api/listings?${queryParams.toString()}`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) throw new Error("Failed to fetch listings");

      const data = await response.json();
      console.log("Fetched Listings:", data);

      setListings(data.listings.data);
      setPagination({
        current_page: data.listings.current_page,
        per_page: data.listings.per_page,
        total: data.listings.total,
        last_page: data.listings.last_page,
      });
    } catch (error) {
      toast.error("Failed to fetch listings", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Fetch listings when filters change
  useEffect(() => {
    fetchListings();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PropertyFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        setIsMapView={setIsMapView}
        isMapView={isMapView}
      />

      <PropertyCards
        listings={listings}
        loading={loading}
        totalItems={pagination.total}
        isMapView={isMapView}
      />

      {pagination.last_page > 1 && (
        <PropertyPagination
          currentPage={pagination.current_page}
          totalPages={pagination.last_page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default PropertyListings;
