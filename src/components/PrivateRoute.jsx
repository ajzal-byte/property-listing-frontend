import { Navigate } from "react-router-dom";
import { useAuth } from "./../contexts/AuthContext"; // path where your AuthContext is

export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  // console.log(localStorage.getItem("authToken"));
  
  if ( !localStorage.getItem("authToken")) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If logged in, allow access
  return children;
}
