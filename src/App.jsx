import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { cards } from "./mockdata/mockData";
import { ViewProvider } from "./contexts/ViewContext";
import { MainContentProvider } from "./contexts/MainContentContext";
import { MainTabProvider } from "./contexts/TabContext";
import TitleComponent from "./components/TitleComponent";

// import {AuthProvider} from './contexts/AuthContext';
import LoginForm from "./components/Auth/Login";
import RegisterForm from "./components/Auth/RegisterForm";
import ProtectedRoutes from "./ProtectedRoutes";
import PrivateRoute from "./components/PrivateRoute"; // path
import { useAuth } from "./contexts/AuthContext";

const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user } = useAuth();

  useEffect(()=>{
    console.log(isLoggedIn);
    localStorage.getItem("authToken") && setIsLoggedIn(true);
  }, [isLoggedIn, setIsLoggedIn])

  return (
    <Router>
      {/* <AuthProvider> */}
        <ViewProvider>
          <div className="flex h-screen">
            {isLoggedIn && <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}

            <div
              className={`flex-1 flex flex-col pt-[1rem] transition-all duration-300 ${
                isCollapsed ? "ml-20" : "ml-60"
              }`}
            >
             {(user || isLoggedIn ) &&  <Navbar />}

              <MainTabProvider>
                <MainContentProvider>
                  <TitleComponent />

                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginForm isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/register" element={<RegisterForm setIsLoggedIn={setIsLoggedIn}/>} />

                    {/* Protected routes */}
                    <Route
                      path="/*"
                      element={
                        <PrivateRoute>
                          <ProtectedRoutes />
                        </PrivateRoute>
                      }
                    />
                  </Routes>

                </MainContentProvider>
              </MainTabProvider>
            </div>
          </div>
        </ViewProvider>
      {/* </AuthProvider> */}
    </Router>
  );
};

export default App;

// const App = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   return (
//     <Router>
//       <AuthProvider>
//       <ViewProvider>
//         <div className="flex h-screen">
//           <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

//           <div
//             className={`flex-1 flex flex-col pt-[1rem] transition-all duration-300 ${
//               isCollapsed ? "ml-20" : "ml-60"
//             }`}
//           >
//             {/* <Navbar /> */}

//             <MainTabProvider>
//               <MainContentProvider>
//                 <TitleComponent />
//                 <Routes>
//                   {/* Individual Off-Plan page */}
//                   <Route path="/login" element={<LoginForm/>}/>
//                   <Route path="/register" element={<RegisterForm/>}/>
//                   <Route path="/">

//                   </Route>
//                   {/* <Route path="/auth" element={<AuthPages />} /> */}

//                   <Route path="/off-plan/:id" element={<IndividualOffPlan />} />

//                   {/* Individual Secondary lsitings page */}
//                   <Route
//                     path="/secondary-listings/:id"
//                     element={<IndividualSecondary />}
//                     />

//                   {/* Academy Main Page */}
//                   <Route path="/academy" element={<Academy />} />

//                   {/* Course & Lesson Pages - Render Independently */}
//                   <Route path="/academy/courses" element={<CourseGrid />} />
//                   <Route
//                     path="/academy/courses/:courseId"
//                     element={<LessonsPage />}
//                     />
//                   <Route
//                     path="/academy/courses/:courseId/lessons/:lessonId"
//                     element={
//                       <LessonContent
//                       youtubeUrl={
//                         "https://www.youtube.com/watch?v=9B4CvtzXRpc"
//                         }
//                         pdfUrl={
//                           "https://www.newline.co/fullstack-react/assets/media/sGEMe/MNzue/30-days-of-react-ebook-fullstackio.pdf"
//                         }
//                         courseTitle={"ReactJS Beginner to Advanced"}
//                       />
//                     }
//                     />
//                   <Route path="/company" element={<MyCompany />} />
//                   <Route path="/*" element={<HomePage />} />
//                   <Route path="/analytics" element={<Analytics />} />
//                   <Route path="/analytics?agentId=" element={<Analytics />} />
//                   <Route path="/permissions" element={<CurrentUserRoles initialData={mockUsers}/>} />
//                   <Route path="/permissions/edit" element={<PermissionManager/>} />
//                   <Route path="/permissions/edit/add-role" element={<AddNewRole/>} />
//                   <Route path="/pricing" element={<Subscription/>} />
//                   <Route path="/profile" element={<ProfilePage />} />
//                   <Route path="/support" element={<SupportPage />} />

//                   {/* Default Route */}
//                   <Route
//                     path="/*"
//                     element={
//                       <main className="flex-1 bg-gray-50">
//                         <SimpleFilters />
//                         <div className="container mx-auto p-4">
//                           <CardGrid cards={cards} />
//                         </div>
//                       </main>
//                     }
//                   />
//                 </Routes>
//               </MainContentProvider>
//             </MainTabProvider>
//           </div>
//         </div>
//       </ViewProvider>
//     </AuthProvider>
//     </Router>
//   );
// };

// export default App;
