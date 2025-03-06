import React, { useState } from 'react';
import { CircleChevronLeft, CircleChevronRight, Home, Building2, Users, Calculator, BarChart3, GraduationCap, FileStack, HeadphonesIcon, Share2, MessageCircleMore } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MenuItem = ({ icon: Icon, label, isCollapsed, isActive, onClick }) => {
  return (
    <div 
    onClick={onClick}
      className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-200
        ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'}
      `}  
      >
      <Icon size={20} className={`${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`} />
      {!isCollapsed && (
        <span className="ml-3 text-sm font-medium transition-opacity duration-200">
          {label}
        </span>
      )}
    </div>
  );
};

const MenuSection = ({ items, isCollapsed, activeItem, onItemClick }) => {
  const navigate = useNavigate();
  return (
    <div className="py-2">
      {items.map((item) => (
        <MenuItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          isCollapsed={isCollapsed}
          isActive={activeItem === item.label}
          onClick={() => {
            onItemClick(item.label)
            navigate(`/${item.label.toLowerCase()}`)
            console.log(item.label)
          }
          }
        />
      ))}
    </div>
  );
};

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('Off plan');

  const mainMenuItems = [
    { icon: Home, label: 'Off plan' },
    { icon: Building2, label: 'Secondary' },
    { icon: GraduationCap, label: 'Academy' },
    { icon: Users, label: 'CRM' },
    { icon: Calculator, label: 'Mortgage' },
    { icon: BarChart3, label: 'Analytics' },
    // { icon: GraduationCap, label: 'Education' },
    { icon: FileStack, label: 'Pricing' },
  ];

  const bottomMenuItems = [
    { icon: HeadphonesIcon, label: 'Support' },
  ];

  return (
    <div 
    className={`fixed left-0 top-0 h-screen bg-white border-r transition-all duration-300 ease-in-out flex flex-col z-[999]
      ${isCollapsed ? 'w-20' : 'w-60'}
    `}
  >
    {/* Header */}
    <div className="flex items-center p-4 ease-in-out">
      {isCollapsed ? (
        <img src="logo.png" alt="Behomes" className="h-16 w-24" />
      ) : (
        <img src="user.png" alt="User" className="h-16 w-24" />
      )}
      <div
        onClick={() =>
        {

            console.log(isCollapsed)
            setIsCollapsed(!isCollapsed)
        }
        }
        className={`rounded-full bg-white text-gray-400 transition-transform duration-300 hover:bg-blue-800 hover:text-white cursor-pointer border-0 ${isCollapsed? '': 'ml-30' }`}
      >
        {
        isCollapsed ? <CircleChevronRight size={23} className="rounded-full text-white-600" /> : <CircleChevronLeft size={23} className="rounded-full text-white-600" />
        }
      </div>
    </div>

    {/* Main Menu */}
    <div className="flex-grow">
      <MenuSection
        items={mainMenuItems}
        isCollapsed={isCollapsed}
        activeItem={activeItem}
        onItemClick={setActiveItem}
      />
    </div>

    {/* Bottom Menu */}
    <div className="border-t">
      <MenuSection
        items={bottomMenuItems}
        isCollapsed={isCollapsed}
        activeItem={activeItem}
        onItemClick={setActiveItem}
      />
    </div>
  </div>
);
};

export default Sidebar;