import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import getAuthHeaders from "@/utils/getAuthHeader";
import { toast } from "sonner";
import {
  PropertyCards,
  ListingsMap,
  ListView,
  PropertyFilters,
  PropertyPagination,
} from "../components/PropertyListings";
import { createApiParams } from "@/utils/createApiParams";
import MainTabContext from "../contexts/TabContext";
import { tabs } from "../enums/sidebarTabsEnums";

const PropertyListings = () => {
  const { setMainTab } = useContext(MainTabContext);

  useEffect(() => {
    setMainTab(tabs.SECONDARY);
  }, [setMainTab]);

  const [isMapView, setIsMapView] = useState(false);
  const [isListView, setIsListView] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 9,
    total: 0,
    last_page: 1,
  });

  // Get filters from URL params
  const getFiltersFromParams = () => {
    return {
      search: searchParams.get("search") || "",
      bedrooms: searchParams.get("bedrooms") || "",
      bathrooms: searchParams.get("bathrooms") || "",
      price_min: searchParams.get("price_min") || "",
      price_max: searchParams.get("price_max") || "",
      reference_no: searchParams.get("reference_no") || "",
      rera_permit_number: searchParams.get("rera_permit_number") || "",
      dtcm_permit_number: searchParams.get("dtcm_permit_number") || "",
      title: searchParams.get("title") || "",
      status: searchParams.get("status") || "",
      landlord_email: searchParams.get("landlord_email") || "",
      landlord_contact: searchParams.get("landlord_contact") || "",

      // multi-value filters
      property_types: searchParams.getAll("property_types") || [],
      offering_types: searchParams.getAll("offering_types") || [],
      city: searchParams.getAll("city") || [],
      community: searchParams.getAll("community") || [],
      sub_community: searchParams.getAll("sub_community") || [],
      building: searchParams.getAll("building") || [],
      portal: searchParams.getAll("portal") || [],
      developer: searchParams.getAll("developer") || [],
      agent_id: searchParams.getAll("agent_id") || [],
      owner_id: searchParams.getAll("owner_id") || [],
      page: searchParams.get("page") || 1,
      per_page: searchParams.get("per_page") || 9,
    };
  };

  const [filters, setFilters] = useState(getFiltersFromParams());

  const fetchListings = async () => {
    try {
      setLoading(true);
      const queryParams = createApiParams(filters);

      const response = await fetch(
        `https://backend.myemirateshome.com/api/listings?${queryParams.toString()}`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) throw new Error("Failed to fetch listings");

      const data = await response.json();

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

  useEffect(() => {
    const params = createApiParams(filters);
    // Don't set per_page to 1000 in the URL
    // if (isMapView) {
    //   params.delete("per_page");
    //   params.delete("page");
    // }
    setSearchParams(params);
  }, [filters, setSearchParams, isMapView, isListView]);

  useEffect(() => {
    fetchListings();
  }, [filters, isMapView, isListView]); // Re-fetch when toggling map view

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
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
        setIsListView={setIsListView}
        isListView={isListView}
      />

      {isMapView ? (
        <ListingsMap listings={listings} />
      ) : (
        <>
          {isListView ? (
            <ListView
              listings={listings}
              loading={loading}
              totalItems={pagination.total}
              isApprovalPage={false}
              refreshList={fetchListings}
            />
          ) : (
            <PropertyCards
              listings={listings}
              loading={loading}
              totalItems={pagination.total}
              isApprovalPage={false}
              refreshList={fetchListings}
            />
          )}

          {/* pagination shown for both list & card views */}
          {pagination.last_page > 1 && !loading && (
            <PropertyPagination
              currentPage={pagination.current_page}
              totalPages={pagination.last_page}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PropertyListings;
