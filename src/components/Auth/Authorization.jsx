import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './Login';
import RegisterForm from './Login';

export default function AuthPages() {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        {
        showLogin ==true ?
        <div className="bg-white rounded-xl shadow-xl p-8 ">
         <LoginForm showLogin={showLogin} setShowLogin={setShowLogin} />
        </div>

         :
         <div className="bg-white rounded-xl shadow-xl p-8 mt-8 w-full">
       <RegisterForm showLogin={showLogin} setShowLogin={setShowLogin}/>
        </div>
        }
    </div>
  );
}