import { Routes, Route } from "react-router-dom";
import CourseGrid from "./components/Academy/CourseGrid";
import LessonsPage from "./components/Academy/Lessons";
import LessonContent from "./components/Academy/Content/LessonContent";
// import Analytics from "./pages/Analytics";
import CurrentUserRoles from "./components/RoleAccess/CurrentUserRoles";
import AddNewRole from "./components/RoleAccess/AddNewRole";
import PermissionManager from "./components/RoleAccess/PermissionManager";
import {
  CreateListing,
  HomePage,
  IndividualOffPlan,
  IndividualSecondary,
  Academy,
  AnalyticsDashboard,
  DetailedSecondary,
  ManageApprovals,
  AgentApprovals,
  MyCompany,
  ProfilePage,
  Subscription,
  SupportPage,
  UserManagement,
  DraftListings,
  PocketListings,
} from "./pages";
import CompanyList from "./components/CompanyManagement/CompanyList";
import DeveloperDirectory from "./components/UserManagement/DeveloperDirectory";
import LocationManagement from "./components/UserManagement/LocationManagement";
import AcademyHelpPage from "./components/Academy/AcademyHelpPage";
import PropertyListings from "./pages/PropertyListings";

export default function ProtectedRoutes() {
  return (
    <Routes>
      {/* <Route path="/" element={<HomePage />} /> */}
      {/* Default Route */}
      <Route path="/off-plan/:id" element={<IndividualOffPlan />} />
      {/* <Route path="/secondary-listings/:id" element={<IndividualSecondary />} /> */}
      <Route path="/secondary-listings/:id" element={<DetailedSecondary />} />
      {/* <Route path="/secondary-listings/:id" element={</>} /> */}
      <Route path="/academy" element={<Academy />} />
      <Route path="/academy/courses" element={<CourseGrid />} />
      <Route path="/academy/courses/:courseId" element={<LessonsPage />} />
      <Route path="/academy/help" element={<AcademyHelpPage />} />
      <Route path="/create-listing" element={<CreateListing />} />
      <Route path="/manage-users" element={<UserManagement />} />
      <Route path="/manage-companies" element={<CompanyList />} />
      <Route path="/developers" element={<DeveloperDirectory />} />
      <Route path="/locations" element={<LocationManagement />} />

      <Route
        path="/academy/courses/:courseId/lessons/:lessonId"
        element={
          <LessonContent
            youtubeUrl="https://www.youtube.com/watch?v=9B4CvtzXRpc"
            pdfUrl="https://www.newline.co/fullstack-react/assets/media/sGEMe/MNzue/30-days-of-react-ebook-fullstackio.pdf"
            courseTitle="ReactJS Beginner to Advanced"
          />
        }
      />
      <Route path="/company" element={<MyCompany />} />
      <Route path="/analytics" element={<AnalyticsDashboard />} />
      <Route path="/draft-listings" element={<DraftListings />} />
      <Route path="/pocket-listings" element={<PocketListings />} />
      <Route path="/manage-approvals" element={<ManageApprovals />} />
      <Route path="/my-requests" element={<AgentApprovals />} />
      <Route path="/permissions" element={<CurrentUserRoles />} />
      <Route path="/permissions/edit" element={<PermissionManager />} />
      <Route path="/permissions/edit/add-role" element={<AddNewRole />} />
      <Route path="/pricing" element={<Subscription />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/support" element={<SupportPage />} />
      {/* <Route
        path="/*"
        element={
          <main className="flex-1 bg-gray-50">
            <SimpleFilters />
            <div className="container mx-auto p-4">
              <CardGrid cards={cards} />
            </div>
          </main>
        }
      /> */}
      <Route path="/*" element={<PropertyListings />} />
    </Routes>
  );
}
