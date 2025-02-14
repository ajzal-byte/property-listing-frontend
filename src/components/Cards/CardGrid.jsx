import React, { useState } from 'react';
import Card from './Card';
import Pagination from '../Pagination';

const CardGrid = ({ cards }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const totalItems = cards.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCards = cards.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentCards.map((card, index) => (
          <div key={index} className="aspect-[4/3]">
            <Card {...card} />
          </div>
        ))}
      </div>
      
      {/* Pagination Component */}
      <div className="flex justify-center mt-4">
        <Pagination 
          itemsPerPage={itemsPerPage} 
          setItemsPerPage={setItemsPerPage} 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          totalItems={totalItems} 
        />
      </div>
    </div>
  );
};

export default CardGrid;
