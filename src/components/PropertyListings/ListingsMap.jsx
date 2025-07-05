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
    (listing) => listing.geopoints && listing.geopoints.includes(",")
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
          const [latitude, longitude] = listing.geopoints.split(",");

          // Ensure coordinates are valid numbers
          if (isNaN(latitude) || isNaN(longitude)) {
            return null;
          }

          const position = [parseFloat(latitude), parseFloat(longitude)];

          return (
            <Marker key={listing.id} position={position}>
              <Popup>
                <div className="space-y-2">
                  <h3 className="font-bold text-md">{listing.title_en}</h3>
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
