// import { useState } from "react";
// import { Mail, Lock, LogIn } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const LoginForm = ({showLogin, setShowLogin}) => {

//     const navigate = useNavigate();

//     const [loginData, setLoginData] = useState({
//       email: '',
//       password: ''
//     });
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
    
//     const handleChange = (e) => {
//       setLoginData({
//         ...loginData,
//         [e.target.name]: e.target.value
//       });
//     };
    
//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       setIsLoading(true);
//       setError('');
      
//       try {
//         const response = await fetch('http://3.111.31.34/api/login', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(loginData)
//         });
        
//         if (!response.ok) {
//           throw new Error('Login failed');
//         }
        
//         const data = await response.json();
        
//         // Save token to localStorage
//         localStorage.setItem('authToken', data.token);
        
//         // Navigate to listings page
//         navigate('/listings');
//       } catch (err) {
//         setError('Invalid credentials. Please try again. Error: ', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     return (
//       <div className="w-full max-w-md">
//         <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Welcome Back</h2>
//         <p className="text-center mb-8 text-gray-600">Enter your credentials to access your account</p>
        
//         {error && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
//             {error}
//           </div>
//         )}
        
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
//               Email Address
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Mail className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 value={loginData.email}
//                 onChange={handleChange}
//                 className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="name@example.com"
//               />
//             </div>
//           </div>
          
//           <div className="mb-6">
//             <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
//               Password
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Lock className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 value={loginData.password}
//                 onChange={handleChange}
//                 className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="••••••••"
//               />
//             </div>
//             <div className="flex justify-end mt-2">
//               <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
//                 Forgot password?
//               </a>
//             </div>
//           </div>
          
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg flex items-center justify-center"
//           >
//             {isLoading ? (
//               <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
//             ) : (
//               <LogIn className="h-5 w-5 mr-2" />
//             )}
//             {isLoading ? 'Logging in...' : 'Log In'}
//           </button>
//         </form>
        
//         <div className="mt-8 text-center">
//           <p className="text-gray-600">
//             Haven't registered yet?{' '}
//             <button
//               onClick={() => {
//                               navigate("/register")
                              
//               }}
//               className="text-blue-600 hover:text-blue-800 font-medium"
//             >
//               Register now
//             </button>
//           </p>
//         </div>
//       </div>
//     );
//   };

// export default LoginForm;

import { useEffect, useState } from "react";
import { Mail, Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";

const LoginForm = ({isLoggedIn, setIsLoggedIn}) => {

    const navigate = useNavigate();
    const {login} = useAuth();
    const [loginData, setLoginData] = useState({
      email: '',
      password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const authToken = localStorage.getItem("authToken")

    

    const handleChange = (e) => {
      setLoginData({
        ...loginData,
        [e.target.name]: e.target.value
      });
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
      
      try {
        const response = await fetch('http://3.111.31.34/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData)
        });
        
        if (!response.ok) {
          throw new Error('Login failed');
        }
        
        const data = await response.json();

        console.log("login gives token:", data.token);
        
        // Save token to localStorage
        localStorage.setItem('authToken', data.token);
        setIsLoggedIn(true);
        console.log("in login page:", isLoggedIn );
        
        
        
        // Navigate to listings page
        navigate('/listings');
      } catch (err) {
        setError('Invalid credentials. Please try again.');
        console.log("error in Login.jsx: ", err);
        
      } finally {
        setIsLoading(false);
      }
    };
    
    return (
      // Added flex container with centering classes
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Welcome Back</h2>
          <p className="text-center mb-8 text-gray-600">Enter your credentials to access your account</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          {
              authToken && navigate("/")
          }
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={loginData.email}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="name@example.com"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={loginData.password}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end mt-2">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg flex items-center justify-center"
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : (
                <LogIn className="h-5 w-5 mr-2" />
              )}
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Haven't registered yet?{' '}
              <button
                onClick={() => {
                  navigate("/register")
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Register now
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

export default LoginForm;