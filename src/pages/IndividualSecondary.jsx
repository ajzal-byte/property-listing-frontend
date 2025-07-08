import React, { useContext, useState } from "react";
import {
  MapPin,
  Calendar,
  Phone,
  Mail,
  User,
  Bed,
  Bath,
  Car,
  Square,
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
  Building2,
  Shield,
  Dumbbell,
  UtensilsCrossed,
  Heart,
  Building,
} from "lucide-react";
import TabContext from "./../contexts/TabContext";

const propertyData = {
  management: {
    reference: "REF001",
    agent_id: "John Doe",
    listingOwner: "Jane Smith",
    landlordName: "Ali Al-Mansoori",
    landlordEmail: "ali@landlord.com",
    landlordPhone: "+971501234567",
    availability: "Available",
    availableFrom: "2025-02-25",
  },
  specifications: {
    property_type: "Apartment",
    category: "Residential Rent",
    size: 1200,
    noOfBedrooms: 2,
    noOfBathrooms: 2,
    noOfParkingSpaces: 1,
    furnished: "Furnished",
    total_plot_size: 1200,
  },
  pricing: {
    price: 75000,
    rentalPeriod: "Yearly",
  },
  titleAndDescription: {
    title: "Luxury Apartment in Downtown",
    description:
      "A stunning luxury apartment located in the heart of the city, offering breathtaking views and world-class amenities. This modern residence features high-end finishes, smart home technology, and an optimal layout for comfortable living.",
  },
  location: {
    propertyFinder: { location: "Downtown Dubai" },
    bayut: { location: "Downtown Dubai" },
    city: "Dubai",
    community: "Downtown",
    subCommunity: "Burj Khalifa",
    building: "Burj Views",
    latitude: "25.0662° N",
    longitude: "55.2381° E",
  },
};

const images = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2029&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070&auto=format&fit=crop",
];

export default function IndividualSecondary() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const amenities = [
    { icon: Building2, label: "Concierge Service" },
    { icon: Shield, label: "24/7 Security" },
    { icon: Dumbbell, label: "Fitness Center" },
    { icon: UtensilsCrossed, label: "Restaurant" },
  ];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  const formatPrice = (price) => {
    return price.toLocaleString("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { setMainTab } = useContext(TabContext);
  setMainTab("Hidden");

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Navigation Bar */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-lg z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex space-x-8">
              {["overview", "features", "location", "contact"].map(
                (section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`${
                      activeSection === section
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-900"
                    } capitalize px-1 py-4 text-sm font-medium transition-colors`}
                  >
                    {section}
                  </button>
                )
              )}
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
              <Heart />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Overview Section */}
        <section id="overview" className="space-y-8 pb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 space-y-8">
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {propertyData.titleAndDescription.title}
                    </h1>
                    <p className="mt-2 text-gray-600 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {propertyData.location.building},{" "}
                      {propertyData.location.subCommunity}
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatPrice(propertyData.pricing.price)}
                      <span className="text-lg text-gray-500 font-normal">
                        /{propertyData.pricing.rentalPeriod.toLowerCase()}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Ref: {propertyData.management.reference}
                    </p>
                  </div>
                </div>

                <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">
                    Property Overview
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Property Type</p>
                      <p className="font-medium">
                        {propertyData.specifications.property_type}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium">
                        {propertyData.specifications.category}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Furnishing</p>
                      <p className="font-medium">
                        {propertyData.specifications.furnished}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Availability</p>
                      <p className="font-medium">
                        {propertyData.management.availability}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
                    <Bed className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">
                      {propertyData.specifications.noOfBedrooms} Beds
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
                    <Bath className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">
                      {propertyData.specifications.noOfBathrooms} Baths
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
                    <Square className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">
                      {propertyData.specifications.size} sq.ft
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
                    <Car className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">
                      {propertyData.specifications.noOfParkingSpaces} Parking
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {propertyData.titleAndDescription.description}
                </p>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="lg:w-[400px] space-y-6">
              <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={images[currentImage]}
                  alt="Property"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <button
                    onClick={prevImage}
                    className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
                >
                  <Expand className="h-4 w-4" />
                </button>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Contact Agent</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">
                        {propertyData.management.agent_id}
                      </p>
                      <p className="text-sm text-gray-500">Listing Agent</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">
                        {propertyData.management.landlordPhone}
                      </p>
                      <p className="text-sm text-gray-500">Phone</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">
                        {propertyData.management.landlordEmail}
                      </p>
                      <p className="text-sm text-gray-500">Email</p>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-4">
                    Contact Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 border-t">
          <h2 className="text-2xl font-bold mb-8">Features & Amenities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Property Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Available From</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="font-medium">
                        {propertyData.management.availableFrom}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Plot Size</p>
                    <p className="font-medium">
                      {propertyData.specifications.total_plot_size} sq.ft
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Landlord</p>
                    <p className="font-medium">
                      {propertyData.management.landlordName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Listing Owner</p>
                    <p className="font-medium">
                      {propertyData.management.listingOwner}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {amenities.map((amenity, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                  <amenity.icon className="h-6 w-6 text-blue-600 mb-2" />
                  <p className="font-medium">{amenity.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section id="location" className="py-16 border-t">
          <h2 className="text-2xl font-bold mb-8">Location</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="aspect-[16/9] bg-gray-100 rounded-lg mb-6">
              <iframe
                src={`https://maps.google.com/maps?q=${propertyData.location.latitude},${propertyData.location.longitude}&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-gray-600">
                  {propertyData.location.building},{" "}
                  {propertyData.location.subCommunity}
                  <br />
                  {propertyData.location.community},{" "}
                  {propertyData.location.city}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Property Finder Location</h3>
                <p className="text-gray-600">
                  {propertyData.location.propertyFinder.location}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Bayut Location</h3>
                <p className="text-gray-600">
                  {propertyData.location.bayut.location}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Fullscreen Image Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-90"
            onClick={() => setIsFullscreen(false)}
          />
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={images[currentImage]}
              alt="Property"
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImage === index
                      ? "bg-white scale-125"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
