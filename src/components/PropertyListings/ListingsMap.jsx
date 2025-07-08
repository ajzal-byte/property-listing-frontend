import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import L from "leaflet"; // Import Leaflet library itself

// Fix for default icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ListingsMap = ({ listings }) => {
  const navigate = useNavigate();

  // Filter listings to only include those with valid geopoints
  const listingsWithGeo = listings.filter(
    (listing) =>
      listing.geopoints &&
      typeof listing.geopoints === "string" &&
      listing.geopoints.includes(",")
  );

  // Set a default center for the map (e.g., Dubai)
  const defaultPosition = [25.2048, 55.2708];

  const handleViewDetails = (id) => {
    navigate(`/secondary-listings/${id}`);
  };

  if (!listingsWithGeo.length) {
    return (
      <div className="flex items-center justify-center h-96 border bg-muted rounded-lg">
        <p className="text-muted-foreground">
          No listings with location data to display on the map.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[70vh] w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={defaultPosition}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {listingsWithGeo.map((listing) => {
          // --- Start of Fix ---
          const parts = listing.geopoints.split(",");

          // Ensure there are exactly two parts after splitting
          if (parts.length !== 2) {
            return null;
          }

          const lat = parseFloat(parts[0]);
          const lon = parseFloat(parts[1]);

          // Ensure both parsed values are valid numbers before creating the marker
          if (isNaN(lat) || isNaN(lon)) {
            console.warn("Skipping invalid geopoint:", listing.geopoints);
            return null;
          }

          const position = [lat, lon];
          // --- End of Fix ---

          return (
            <Marker key={listing.id} position={position}>
              <Popup>
                <div className="space-y-2 w-48">
                  <h3 className="font-bold text-md truncate">
                    {listing.title_en}
                  </h3>
                  <p className="text-blue-600 font-semibold">
                    AED {new Intl.NumberFormat().format(listing.price)}
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleViewDetails(listing.id)}
                  >
                    View Details
                  </Button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ListingsMap;
