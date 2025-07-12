import {
  BedDouble,
  Bath,
  Home,
  Ruler,
  Calendar,
  CheckCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PropertyTypeEnum } from "../../enums/createListingsEnums";
import ListingDropDown from "./ListingDropDown";

// Reuse the same status mapping from PropertyCards
const statusMap = {
  draft: { label: "Draft", color: "bg-gray-500 text-white" },
  live: { label: "Live", color: "bg-green-500 text-white" },
  archived: { label: "Archived", color: "bg-yellow-500 text-white" },
  published: { label: "Published", color: "bg-blue-500 text-white" },
  unpublished: { label: "Unpublished", color: "bg-red-500 text-white" },
  pocket: { label: "Pocket Listing", color: "bg-purple-500 text-white" },
  sendforapproval: {
    label: "Send for Approval",
    color: "bg-orange-500 text-white",
  },
  rejected: { label: "Rejected", color: "bg-red-600 text-white" },
  approved: { label: "Approved", color: "bg-green-600 text-white" },
};

const ListView = ({
  listings,
  loading,
  totalItems,
  isApprovalPage = false,
  refreshList,
}) => {
  const navigate = useNavigate();

  const getPropertyTypeName = (value) => {
    const type = PropertyTypeEnum.find((item) => item.value === value);
    return type ? type.name : value;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {listings.length} of {totalItems} properties
      </div>

      <div className="space-y-4">
        {listings.map((listing) => {
          return (
            <div
              key={listing.id}
              className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Image + Dropdown Overlay */}
              <div className="relative w-full md:w-1/4 h-58 flex-shrink-0 rounded-lg overflow-hidden">
                <ListingDropDown
                  listingId={listing.id}
                  refreshList={refreshList}
                  isApprovalPage={isApprovalPage}
                  className="absolute top-2 right-2 z-10"
                />

                {listing.photos?.length > 0 ? (
                  <Carousel className="w-full h-full">
                    <CarouselContent className="w-full h-full">
                      {listing.photos.map((photo, idx) => (
                        <CarouselItem key={idx}>
                          <img
                            src={photo.image_url}
                            alt={`Property ${idx + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {listing.photos.length > 1 && (
                      <>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </>
                    )}
                  </Carousel>
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Home className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}

                {listing.status && statusMap[listing.status] && (
                  <Badge
                    className={`absolute top-2 left-2 ${
                      statusMap[listing.status].color
                    }`}
                  >
                    {statusMap[listing.status].label}
                  </Badge>
                )}
              </div>

              {/* Property Details */}
              <div className="w-full md:w-2/3 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{listing.title_en}</h3>
                    <p className="text-md font-medium">
                      AED {listing.price}
                      {listing.amount_type.toLowerCase() == "sale"
                        ? ""
                        : ` / ${listing.amount_type}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ref: {listing.reference_no}
                    </p>
                  </div>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <div className="flex items-center gap-2">
                    <BedDouble className="h-4 w-4 text-primary" />
                    <span>{listing.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-4 w-4 text-primary" />
                    <span>{listing.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-primary" />
                    <span>{listing.size} sq.ft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-primary" />
                    <span>{getPropertyTypeName(listing.property_type)}</span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>
                      {new Date(listing.available_from).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>
                      {listing.furnished ? "Furnished" : "Unfurnished"}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto flex justify-between items-center pt-2">
                  {(listing.owner || listing.agent) && (
                    <div className="flex items-center gap-3">
                      {listing.owner && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={listing.owner.profile_url} />
                            <AvatarFallback>
                              <User className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{listing.owner.name}</span>
                        </div>
                      )}
                      {listing.agent && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={listing.agent.profile_url} />
                            <AvatarFallback>
                              <User className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{listing.agent.name}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/secondary-listings/${listing.id}`)
                      }
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="blue"
                      asChild
                      disabled={!(listing.agent?.phone || listing.agent?.email)}
                    >
                      {listing.agent?.phone ? (
                        <a
                          href={`https://wa.me/${listing.agent.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Contact
                        </a>
                      ) : listing.agent?.email ? (
                        <a
                          href={`mailto:${listing.agent.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Contact
                        </a>
                      ) : (
                        <span>Contact</span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {listings.length === 0 && !loading && (
        <div className="text-center py-12">
          <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No properties found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search filters
          </p>
        </div>
      )}
    </div>
  );
};

export default ListView;
