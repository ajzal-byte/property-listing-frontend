import React from 'react';
import LayoutCard from './LayoutCard'; // Import the previous component
// import { layouts } from './../mockdata/mockData';

const LayoutGrid = ({layouts}) => {

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {layouts.map((layout) => (
          <LayoutCard 
            key={Math.random()} 
            layout={layout}
          />
        ))}
      </div>
      
      {/* Optional empty state */}
      {layouts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No layouts available</p>
        </div>
      )}897
    </div>
  );
};

export default LayoutGrid;