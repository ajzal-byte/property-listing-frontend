import { useState } from "react";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Expand,
  Building2,
  Shield,
  Cog as Yoga,
  Dumbbell,
  Briefcase,
  UtensilsCrossed,
  MapPin,
  Building,
  ArrowUpRight,
  Globe,
  Phone,
  Mail,
  Landmark,
  Eye,
} from "lucide-react";

const images = [
  "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/10486074/pexels-photo-10486074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/6267583/pexels-photo-6267583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];

export default function IndividualOffPlan() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("project-info");
  const [propertyPrice, setPropertyPrice] = useState(4521807);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanDuration, setLoanDuration] = useState(25);
  const [interestRate, setInterestRate] = useState(5);
  const [favorites, setFavorites] = useState([]);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  // Mortgage calculations
  const downPayment = (propertyPrice * downPaymentPercent) / 100;
  const loanAmount = propertyPrice - downPayment;
  const monthlyInterest = interestRate / 100 / 12;
  const numberOfPayments = loanDuration * 12;
  const monthlyPayment =
    (loanAmount *
      monthlyInterest *
      Math.pow(1 + monthlyInterest, numberOfPayments)) /
    (Math.pow(1 + monthlyInterest, numberOfPayments) - 1);
  const minSalary = monthlyPayment * 3;

  const popularPlaces = [
    { name: "Gantry Plaza State Park", distance: "0.8 mi" },
    { name: "Hunter's Point South Park", distance: "1.1 mi" },
  ];

  const moreProjects = [
    {
      id: "1",
      title: "The Grand Residence",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "Completed",
      location: "Upper East Side, Manhattan",
      price: "From 2,890,000 د.إ",
    },
    // ... other projects
  ];

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "coming soon":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">
              ZD Jasper Realty - Lucent33 - Apartment
            </h1>
            <div className="flex gap-4">
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100">
                <Heart className="h-4 w-4" />
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                +
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              {[
                "project-info",
                "features",
                "layouts",
                "location",
                "mortgage",
                "developer",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    scrollToSection(tab);
                  }}
                  className={`pb-4 px-1 ${
                    activeTab === tab
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Project Info Section */}
          <div id="project-info" className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="space-y-4 md:col-span-1">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Price</div>
                    <div className="font-medium">From 3,327,772 د.إ</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Developer</div>
                    <div className="font-medium">ZD Jasper Realty</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Delivery date</div>
                    <div className="font-medium">Q4 2024</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Location</div>
                    <div className="font-medium">
                      Long Island City (New York)
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column */}
              <div className="space-y-4 md:col-span-1">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Metro</div>
                    <div className="flex items-center gap-2 font-medium">
                      9 Av, 39th Ave, Queens
                      <span className="text-sm text-muted-foreground">
                        4 min
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Facade</div>
                    <div className="font-medium">Combined</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Wall material</div>
                    <div className="font-medium">Monolith</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Parking</div>
                    <div className="font-medium">Underground parking</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Elevator</div>
                    <div className="font-medium">Elevator + Stairs</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Image Gallery */}
              <div className="flex flex-col">
                <div className="relative aspect-[4/3] mb-2">
                  <img
                    src={images[currentImage]}
                    alt="Property"
                    className="object-cover rounded-lg w-full h-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-between p-4">
                    <button
                      onClick={prevImage}
                      className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white"
                  >
                    <Expand className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto py-2">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className={`w-20 h-15 rounded-md cursor-pointer ${
                        currentImage === idx ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setCurrentImage(idx)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div id="features" className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: <Building2 className="h-5 w-5 text-muted-foreground" />,
                  text: "Lounge area for residents",
                },
                {
                  icon: <Shield className="h-5 w-5 text-muted-foreground" />,
                  text: "CCTV Security system",
                },
                {
                  icon: <Yoga className="h-5 w-5 text-muted-foreground" />,
                  text: "Yoga classes",
                },
                {
                  icon: <Dumbbell className="h-5 w-5 text-muted-foreground" />,
                  text: "Sports field",
                },
                {
                  icon: <Briefcase className="h-5 w-5 text-muted-foreground" />,
                  text: "Space to work",
                },
                {
                  icon: (
                    <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
                  ),
                  text: "Restaurant",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    {feature.icon}
                    <div className="text-sm">{feature.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Layouts Section */}
          <div id="layouts" className="pt-8">
            <h2 className="text-xl font-semibold mb-4">Layouts</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                    <Building className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">2 Bedrooms</div>
                    <div className="text-sm text-muted-foreground">
                      810.00 ft²
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">4,521,807 د.إ</div>
                  <div className="text-sm text-muted-foreground">
                    5,582 د.إ per ft²
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="location" className="pt-8">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="flex gap-4 h-96">
              {/* Left column - Map */}
              <div className="flex-1 relative rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24104.310664521527!2d-73.95216395!3d40.74467975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2593c1b27a3e1%3A0xe1a29e9cd5552d18!2sLong%20Island%20City%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="absolute bottom-4 left-4 flex items-center gap-4">
                  <div className="bg-white p-2 rounded-md shadow-md inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Long Island City, New York</span>
                  </div>
                  <div className="bg-white p-2 rounded-md shadow-md inline-flex items-center gap-2">
                    <a
                      href="https://www.google.com/search?q=Long+Island+City+New+York"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm"
                    >
                      More about this place
                    </a>
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Right column - About this place */}
              <div className="flex-1 rounded-lg overflow-hidden bg-gray-50 flex flex-col">
                <h3 className="text-md font-medium p-4">
                  A little about this place
                </h3>
                <div className="flex-1 flex flex-col p-2">
                  <div className="rounded-lg overflow-hidden h-56 mb-2">
                    <img
                      src="https://images.pexels.com/photos/11898897/pexels-photo-11898897.jpeg?"
                      alt="Long Island City"
                      width={700}
                      height={700}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm">
                    Long Island City is a borough in New York City, in Queens,
                    on Long Island, on the East River. It is separated from
                    Brooklyn by the Newtown Creek.
                  </p>
                </div>

                {/* Popular Places Nearby */}
                <div className="p-2">
                  <div className="flex flex-wrap gap-2">
                    {popularPlaces.map((place, index) => (
                      <div
                        key={index}
                        className="bg-white p-1 rounded-md shadow-md inline-flex items-center gap-2"
                      >
                        <Landmark className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">
                          {place.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {place.distance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mortgage Calculator */}
          <div id="mortgage" className="pt-8">
            <h2 className="text-xl font-semibold mb-4">Mortgage Calculator</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Property Price (AED)
                    </label>
                    <input
                      type="number"
                      value={propertyPrice}
                      onChange={(e) => setPropertyPrice(Number(e.target.value))}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="block text-sm font-medium">
                        Down payment (%)
                      </label>
                      <span className="text-sm text-gray-500">
                        {downPaymentPercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={downPaymentPercent}
                      onChange={(e) =>
                        setDownPaymentPercent(Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <input
                      value={downPayment.toFixed(0)}
                      readOnly
                      className="w-full p-2 border rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium">
                      Est. monthly payment
                    </label>
                    <div className="text-3xl font-semibold mt-2">
                      {monthlyPayment.toFixed(0)} AED
                    </div>
                  </div>
                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Send a request
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Fullscreen Modal */}
          {isFullscreen && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
              <div className="relative w-full max-w-6xl">
                <img
                  src={images[currentImage]}
                  alt="Property"
                  className="object-contain max-h-[90vh] mx-auto"
                />
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <button
                    onClick={prevImage}
                    className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div id="developer" className="pt-12 pb-8">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Developer
            </h2>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image Section */}
                <div className="aspect-[4/3] relative">
                  <img
                    src="https://images.unsplash.com/photo-1483058712412-4245e9b90334"
                    alt="ZD Jasper Realty Office"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col justify-center items-center h-full">
                  <div className="flex-grow text-center">
                    <h3 className="text-2xl font-semibold mb-4">
                      ZD Jasper Realty
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      With over 20 years of experience, ZD Jasper develops
                      carefully crafted properties with attention to
                      high-quality and detail. Our team meticulously manages
                      projects from conception to completion, bringing you a
                      refined residential experience. Welcome to modern living.
                    </p>
                    {/* Contact Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button className="flex items-center gap-2 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Globe className="h-4 w-4" />
                        <span className="text-sm">Website</span>
                      </button>
                      <button className="flex items-center gap-2 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">Call</span>
                      </button>
                      <button className="flex items-center gap-2 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">Email</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* More Projects */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">More Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {moreProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg"
                >
                  <div className="relative aspect-[4/3]">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="object-cover w-full h-full"
                    />
                    <button
                      onClick={() => toggleFavorite(project.id)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          favorites.includes(project.id)
                            ? "text-red-500 fill-red-500"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{project.title}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <div className="flex items-center mt-2 text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{project.location}</span>
                    </div>
                    <div className="mt-2 font-semibold">{project.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
