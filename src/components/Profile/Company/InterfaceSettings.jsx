import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InterfaceSettingsSection = () => {
  // Initialize with mock data
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('interfaceSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      brokerCommission: {
        visible: true,
        value: 30
      },
      commission: {
        visible: true,
        value: 100
      },
      employeesVisibility: true,
      tourVisibility: {
        showExamples: true,
        showCurrent: false,
        hideAll: false
      },
      showChats: true,
      specifyLinks: false
    };
  });

  // Save to localStorage when settings change
  useEffect(() => {
    localStorage.setItem('interfaceSettings', JSON.stringify(settings));
  }, [settings]);

  const toggleVisibility = (setting) => {
    if (setting === 'brokerCommission' || setting === 'commission') {
      setSettings({
        ...settings,
        [setting]: {
          ...settings[setting],
          visible: !settings[setting].visible
        }
      });
    } else if (setting === 'employeesVisibility') {
      setSettings({
        ...settings,
        employeesVisibility: !settings.employeesVisibility
      });
    }
  };

  const handleValueChange = (setting, value) => {
    setSettings({
      ...settings,
      [setting]: {
        ...settings[setting],
        value: parseInt(value)
      }
    });
  };

  const handleTourVisibilityChange = (option) => {
    const newTourVisibility = {
      showExamples: false,
      showCurrent: false,
      hideAll: false
    };
    
    newTourVisibility[option] = true;
    
    setSettings({
      ...settings,
      tourVisibility: newTourVisibility
    });
  };

  const handleChatOption = (option) => {
    if (option === 'yes') {
      setSettings({
        ...settings,
        showChats: true,
        specifyLinks: false
      });
    } else if (option === 'no') {
      setSettings({
        ...settings,
        showChats: false,
        specifyLinks: false
      });
    } else if (option === 'specify') {
      setSettings({
        ...settings,
        showChats: false,
        specifyLinks: true
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Interface settings</h2>
      
      <div className="space-y-8">
        {/* Broker Commission Setting */}
        <div className="border-b pb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Displaying broker commission for partner:</span>
            <div className="flex space-x-2">
              <button 
                onClick={() => toggleVisibility('brokerCommission')}
                className={`px-4 py-1 rounded ${settings.brokerCommission.visible ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Show
              </button>
              <button 
                onClick={() => toggleVisibility('brokerCommission')}
                className={`px-4 py-1 rounded ${!settings.brokerCommission.visible ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Hide
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Partners reward:</span>
            <div className="flex items-center">
              <input
                type="number"
                min="0"
                max="100"
                value={settings.brokerCommission.value}
                onChange={(e) => handleValueChange('brokerCommission', e.target.value)}
                className="w-16 p-1 border rounded text-right"
              />
              <span className="ml-2">%</span>
            </div>
          </div>
        </div>
        
        {/* Commission Setting */}
        <div className="border-b pb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Displaying commission (all):</span>
            <div className="flex space-x-2">
              <button 
                onClick={() => toggleVisibility('commission')}
                className={`px-4 py-1 rounded ${settings.commission.visible ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Show
              </button>
              <button 
                onClick={() => toggleVisibility('commission')}
                className={`px-4 py-1 rounded ${!settings.commission.visible ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Hide
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Agency reward:</span>
            <div className="flex items-center">
              <input
                type="number"
                min="0"
                max="100"
                value={settings.commission.value}
                onChange={(e) => handleValueChange('commission', e.target.value)}
                className="w-16 p-1 border rounded text-right"
              />
              <span className="ml-2">%</span>
            </div>
          </div>
        </div>
        
        {/* Employees Visibility */}
        <div className="border-b pb-6">
          <div className="flex justify-between items-center">
            <span className="font-medium">Employees visibility:</span>
            <div className="flex space-x-2">
              <button 
                onClick={() => toggleVisibility('employeesVisibility')}
                className={`px-4 py-1 rounded ${settings.employeesVisibility ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Show
              </button>
              <button 
                onClick={() => toggleVisibility('employeesVisibility')}
                className={`px-4 py-1 rounded ${!settings.employeesVisibility ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Hide
              </button>
            </div>
          </div>
        </div>
        
        {/* 3D Tour Visibility */}
        <div className="border-b pb-6">
          <div className="flex justify-between items-center">
            <span className="font-medium">3D tour visibility:</span>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleTourVisibilityChange('showExamples')}
                className={`px-4 py-1 rounded-md text-sm ${settings.tourVisibility.showExamples ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Show examples of 3D tours
              </button>
              <button 
                onClick={() => handleTourVisibilityChange('showCurrent')}
                className={`px-4 py-1 rounded-md text-sm ${settings.tourVisibility.showCurrent ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Show current 3D tours
              </button>
              <button 
                onClick={() => handleTourVisibilityChange('hideAll')}
                className={`px-4 py-1 rounded-md text-sm ${settings.tourVisibility.hideAll ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Hide all 3D tours
              </button>
            </div>
          </div>
        </div>
        
        {/* Show chats with developers */}
        <div className="pb-6">
          <div className="flex justify-between items-center">
            <span className="font-medium">Show chats with developers:</span>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleChatOption('yes')}
                className={`px-4 py-1 rounded ${settings.showChats ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Yes
              </button>
              <button 
                onClick={() => handleChatOption('no')}
                className={`px-4 py-1 rounded ${!settings.showChats && !settings.specifyLinks ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                No
              </button>
              <button 
                onClick={() => handleChatOption('specify')}
                className={`px-4 py-1 rounded ${settings.specifyLinks ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Specify your links
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterfaceSettingsSection