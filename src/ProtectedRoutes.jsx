import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import SimpleFilters from "./components/SimpleFilters";
import CardGrid from "./components/DataView/CardGrid";
import { cards } from "./mockdata/mockData";
import Academy from "./pages/Academy";
import TitleComponent from "./components/TitleComponent";
import CourseGrid from "./components/Academy/CourseGrid";
import LessonsPage from "./components/Academy/Lessons";
import LessonContent from "./components/Academy/Content/LessonContent";
import Analytics from "./pages/Analytics";
import IndividualOffPlan from "./pages/IndividualOffPlan";
import IndividualSecondary from "./pages/IndividualSecondary";
import CurrentUserRoles from "./components/RoleAccess/CurrentUserRoles";
import AddNewRole from "./components/RoleAccess/AddNewRole";
import { mockUsers } from "./mockdata/mockData";
import PermissionManager from "./components/RoleAccess/PermissionManager";
import ProfilePage from "./pages/Profile";
import MyCompany from "./pages/MyCompany";
import Subscription from "./pages/Subscription";
import SupportPage from "./pages/SupportPage";
import CreateListing from './pages/CreateListing'
import DetailedSecondary from "./pages/DetailedSecondary";
import CompanyList from "./components/UserManagement/CompanyList";
import DeveloperDirectory from "./components/UserManagement/DeveloperDirectory";
import LocationManagement from "./components/UserManagement/LocationManagement";
import AcademyHelpPage from "./components/Academy/AcademyHelpPage";



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
      <Route path="/create-listing" element={< CreateListing/>} />
      <Route path="/manage-companies" element={< CompanyList/>} />
      <Route path="/manage-companies" element={< CompanyList/>} />
      <Route path="/developers" element={< DeveloperDirectory/>} />
      <Route path="/locations" element={< LocationManagement/>} />

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
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/permissions" element={<CurrentUserRoles />} />
      <Route path="/permissions/edit" element={<PermissionManager />} />
      <Route path="/permissions/edit/add-role" element={<AddNewRole />} />
      <Route path="/pricing" element={<Subscription />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route
        path="/*"
        element={
          <main className="flex-1 bg-gray-50">
            <SimpleFilters />
            <div className="container mx-auto p-4">
              <CardGrid cards={cards} />
            </div>
          </main>
        }
      />
    </Routes>
  );
}
