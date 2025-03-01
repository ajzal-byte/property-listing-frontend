import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import SimpleFilters from "./components/SimpleFilters";
import CardGrid from "./components/DataView/CardGrid";
import { cards } from "./mockdata/mockData";
import { ViewProvider } from "./contexts/ViewContext";
import { MainContentProvider } from "./contexts/MainContentContext";
import { MainTabProvider } from "./contexts/TabContext";
import Academy from "./pages/Academy";
import TitleComponent from "./components/TitleComponent";
import CourseGrid from "./components/Academy/CourseGrid";
import LessonsPage from "./components/Academy/Lessons";
import LessonContent from "./components/Academy/Content/LessonContent";
import Analytics from "./pages/Analytics";
import IndividualOffPlan from "./pages/IndividualOffPlan";
import IndividualSecondary from "./pages/IndividualSecondary";
import CurrentUserRoles from './components/RoleAccess/CurrentUserRoles'
import {mockUsers} from './mockdata/mockData'
import PermissionManager from "./components/RoleAccess/PermissionManager";


const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Router>
      <ViewProvider>
        <div className="flex h-screen">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

          <div
            className={`flex-1 flex flex-col pt-[1rem] transition-all duration-300 ${
              isCollapsed ? "ml-20" : "ml-60"
            }`}
          >
            <Navbar />

            <MainTabProvider>
              <MainContentProvider>
                <TitleComponent />
                <Routes>
                  {/* Individual Off-Plan page */}
                  <Route path="/off-plan/:id" element={<IndividualOffPlan />} />

                  {/* Individual Secondary lsitings page */}
                  <Route
                    path="/secondary-listings/:id"
                    element={<IndividualSecondary />}
                  />

                  {/* Academy Main Page */}
                  <Route path="/academy" element={<Academy />} />

                  {/* Course & Lesson Pages - Render Independently */}
                  <Route path="/academy/courses" element={<CourseGrid />} />
                  <Route
                    path="/academy/courses/:courseId"
                    element={<LessonsPage />}
                  />
                  <Route
                    path="/academy/courses/:courseId/lessons/:lessonId"
                    element={
                      <LessonContent
                        youtubeUrl={
                          "https://www.youtube.com/watch?v=9B4CvtzXRpc"
                        }
                        pdfUrl={
                          "https://www.newline.co/fullstack-react/assets/media/sGEMe/MNzue/30-days-of-react-ebook-fullstackio.pdf"
                        }
                        courseTitle={"ReactJS Beginner to Advanced"}
                      />
                    }
                  />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/analytics?agentId=" element={<Analytics />} />
                  <Route path="/permissions" element={<CurrentUserRoles initialData={mockUsers}/>} />
                  <Route path="/permissions/edit" element={<PermissionManager/>} />

                  {/* Default Route */}
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
              </MainContentProvider>
            </MainTabProvider>
          </div>
        </div>
      </ViewProvider>
    </Router>
  );
};

export default App;
