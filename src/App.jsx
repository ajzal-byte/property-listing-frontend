import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { cards } from "./mockdata/mockData";
import { ViewProvider } from "./contexts/ViewContext";
import { MainContentProvider } from "./contexts/MainContentContext";
import { MainTabProvider } from "./contexts/TabContext";
import TitleComponent from "./components/TitleComponent";
import LoginForm from "./components/Auth/Login";
import RegisterForm from "./components/Auth/RegisterForm";
import ProtectedRoutes from "./ProtectedRoutes";
import PrivateRoute from "./components/PrivateRoute"; // path
import { useAuth } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    console.log(isLoggedIn);
    localStorage.getItem("authToken") && setIsLoggedIn(true);
  }, [isLoggedIn, setIsLoggedIn]);

  return (
    <Router>
      {/* <AuthProvider> */}
      <ViewProvider>
        <div className="flex h-screen">
          {isLoggedIn && (
            <Sidebar
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          )}

          <div
            className={`flex-1 flex flex-col pt-[1rem] transition-all duration-300 ${
              isCollapsed ? "ml-20" : "ml-60"
            }`}
          >
            {(user || isLoggedIn) && <Navbar />}

            <MainTabProvider>
              <MainContentProvider>
                <TitleComponent />

                <Routes>
                  {/* Public routes */}
                  <Route
                    path="/login"
                    element={
                      <LoginForm
                        isLoggedIn={isLoggedIn}
                        setIsLoggedIn={setIsLoggedIn}
                      />
                    }
                  />
                  <Route
                    path="/register"
                    element={<RegisterForm setIsLoggedIn={setIsLoggedIn} />}
                  />

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
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
