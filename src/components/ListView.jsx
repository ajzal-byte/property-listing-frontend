import React from 'react';
import ListItem from './ListItem'

const ListView = ({currentCards}) => {
  
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-gray-50/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="space-y-4">
            {currentCards.map((property, index) => (
              <ListItem key={index} {...property} />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default ListView;