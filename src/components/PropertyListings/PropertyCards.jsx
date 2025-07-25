import {
  BedDouble,
  Bath,
  Home,
  Ruler,
  Calendar,
  CheckCircle,
  User,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PropertyTypeEnum } from "../../enums/createListingsEnums";
import ListingDropDown from "./ListingDropDown";

// Status mapping
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

const PropertyCards = ({
  listings,
  loading,
  totalItems,
  isApprovalPage = false,
  refreshList,
  isDraft,
  isPocket,
}) => {
  const navigate = useNavigate();

  // Helper function to get property type name
  const getPropertyTypeName = (value) => {
    const type = PropertyTypeEnum.find((item) => item.value === value);
    return type ? type.name : value;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {listings.length} of {totalItems} properties
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => {
          const [latitude, longitude] = listing.geopoints
            ? listing.geopoints.split(",")
            : [null, null];

          return (
            <Card
              key={listing.id}
              className="hover:shadow-lg transition-shadow"
            >
              {/* Property Image */}
              <CardHeader className="relative">
                <ListingDropDown
                  listingId={listing.id}
                  companySlug={listing.company.slug}
                  refreshList={refreshList}
                  isApprovalPage={isApprovalPage}
                  isDraft={isDraft}
                  isPocket={isPocket}
                />

                {listing.photos?.length > 0 ? (
                  <div className="w-full aspect-[4/3] relative overflow-hidden rounded-t-lg">
                    <Carousel className="absolute inset-0 w-full h-full">
                      <CarouselContent className="w-full h-full -ml-0 flex">
                        {listing.photos.map((photo, index) => (
                          <CarouselItem key={index} className="pl-0 h-full">
                            <img
                              src={photo.image_url}
                              alt={`Property ${index + 1}`}
                              className="w-full h-full object-cover"
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
                  </div>
                ) : (
                  <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center rounded-t-lg">
                    <Home className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}

                {listing.status && statusMap[listing.status] && (
                  <Badge
                    className={`absolute top-1 left-2 ${
                      statusMap[listing.status].color
                    }`}
                  >
                    {statusMap[listing.status].label}
                  </Badge>
                )}
              </CardHeader>

              {/* Property Details */}
              <CardContent className="pt-4">
                <CardTitle className="text-lg mb-2">
                  {listing.title_en}
                </CardTitle>
                <CardTitle className="text-md mb-2">
                  AED {listing.price}
                  {listing.amount_type.toLowerCase() == "sale"
                    ? ""
                    : ` / ${listing.amount_type}`}
                </CardTitle>
                <div className="text-sm text-muted-foreground mb-3">
                  Ref: {listing.reference_no}
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-4 mb-4">
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

                {/* Availability */}
                <div className="flex items-center gap-2 text-sm mb-4">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>
                    Available:{" "}
                    {new Date(listing.available_from).toLocaleDateString()}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 text-sm mb-4">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>{listing?.furnishing_type?.toUpperCase()}</span>
                </div>

                {(listing.owner || listing.agent) && (
                  <div className="flex justify-between items-start gap-6 pt-3 border-t">
                    {/* Owner Info */}
                    {listing.owner && (
                      <div className="flex flex-col items-start gap-2">
                        <Label className="text-xs">Listing Owner</Label>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={listing.owner.profile_url} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm font-medium">
                            {listing.owner.name}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Agent Info */}
                    {listing.agent && (
                      <div className="flex flex-col items-start gap-2">
                        <Label className="text-xs">Listing Agent</Label>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={listing.agent.profile_url} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm font-medium">
                            {listing.agent.name}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>

              {/* Footer with CTA */}
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/secondary-listings/${listing.id}`)}
                >
                  View Details
                </Button>
                <Button
                  asChild
                  disabled={!(listing.owner?.phone || listing.owner?.email)}
                  variant="blue"
                >
                  {listing.owner?.phone ? (
                    <a
                      href={`https://wa.me/${listing.owner.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Contact Owner
                    </a>
                  ) : listing.owner?.email ? (
                    <a
                      href={`mailto:${listing.owner.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Contact Owner
                    </a>
                  ) : null}
                </Button>
              </CardFooter>
            </Card>
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

export default PropertyCards;
