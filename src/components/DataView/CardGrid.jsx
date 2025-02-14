import React, { useState, useContext } from 'react';
import Card from './Card';
import Pagination from '../Pagination';
import ClassicCard from './ClassicCard'
import ViewContext from '../../contexts/ViewContext';
import ListView from '../ListView';
import MainContentContext from '../../contexts/MainContentContext';
import { layouts } from '../../mockdata/mockData';
import LayoutGrid from '../LayoutGrid';

const CardGrid = ({ cards }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const { viewType } = useContext(ViewContext);
  const { mainContent } = useContext(MainContentContext);

  const isClassicView = (viewType === 'classic');
  const isListView = (viewType === 'list');

  const totalItems = mainContent == 'Projects' ? cards.length : layouts.length


  const totalPages = Math.ceil(totalItems / itemsPerPage) 

  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCards = mainContent == 'Projects' ? cards.slice(indexOfFirstItem, indexOfLastItem) : layouts.slice(indexOfFirstItem,indexOfLastItem);


  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`
        min-h-[600px]
      `}>

        {
          (mainContent === 'Projects') ?
          <>
        {isListView ? (
          <ListView currentCards={currentCards} />
        ) : (
          <div className={`
            ${isClassicView 
            ? 'space-y-6' 
            : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-16'
              }
              `}>
            {currentCards.map((card, index) => (
              <div 
              key={index} 
              className={`
                ${isClassicView 
                ? 'mb-6 last:mb-0' 
                : 'h-full'
                }
                transition-transform duration-200 hover:scale-102
                hover:shadow-lg rounded-lg
                `}
                >
                {isClassicView ? (
                  <ClassicCard {...card} />
                ) : (
                  <div className="h-full">
                    <Card {...card} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        </>
        :
        <LayoutGrid layouts={currentCards}/>
      }
        
        {/* Pagination Component */}
        <div className="mt-8 flex justify-center">
          <Pagination 
            itemsPerPage={itemsPerPage} 
            setItemsPerPage={setItemsPerPage} 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
            totalItems={totalItems} 
          />
        </div>
      </div>
    </div>
  );
};

export default CardGrid;