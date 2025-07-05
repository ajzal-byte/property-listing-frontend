// App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { ViewProvider } from "./contexts/ViewContext";
import { MainContentProvider } from "./contexts/MainContentContext";
import { MainTabProvider } from "./contexts/TabContext";
import TitleComponent from "./components/TitleComponent";
import LoginForm from "./components/Auth/Login";
import RegisterForm from "./components/Auth/RegisterForm";
import ProtectedRoutes from "./ProtectedRoutes";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "@/components/ui/sonner";

const AppContent = () => {
  const location = useLocation();
  const isAuthRoute = ["/login", "/register"].includes(location.pathname);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    localStorage.getItem("authToken") && setIsLoggedIn(true);
  }, [isLoggedIn]);

  return (
    <div className="flex h-screen">
      {!isAuthRoute && isLoggedIn && (
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      )}

      <div
        className={
          isAuthRoute
            ? "flex-1 flex items-center justify-center"
            : `flex-1 flex flex-col pt-4 transition-all duration-300 ${
                isCollapsed ? "ml-20" : "ml-60"
              }`
        }
      >
        {/* {!isAuthRoute && (user || isLoggedIn) && <Navbar />} */}

        <MainTabProvider>
          <MainContentProvider>
            {!isAuthRoute && <TitleComponent />}

            <Routes>
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
  );
};

const App = () => (
  <Router>
    <ViewProvider>
      <AppContent />
    </ViewProvider>
    <ToastContainer position="top-center" />
    <Toaster richColors />
  </Router>
);

export default App;
