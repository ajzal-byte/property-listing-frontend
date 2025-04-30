// import React, { useState, useContext, useEffect } from 'react';
// import Card from './Card';
// import Pagination from '../Pagination';
// import ClassicCard from './ClassicCard'
// import ViewContext from '../../contexts/ViewContext';
// import ListView from '../ListView';
// import MainContentContext from '../../contexts/MainContentContext';
// import MainTabContext from '../../contexts/TabContext';
// import { layouts } from '../../mockdata/mockData';
// import LayoutGrid from '../LayoutGrid';
// import { tabs } from '../../enums/sidebarTabsEnums';
// import Fetcher from '../../utils/Fetcher';

// const CardGrid = ({ cards }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(8);

//   const { viewType } = useContext(ViewContext);
//   const { mainContent } = useContext(MainContentContext);
//   const {setMainTab} = useContext(MainTabContext)
//   const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

//   // useEffect(()=>{
//   //   setAuthToken(localStorage.getItem("authToken"))
//   //   console.log();
    
//   // }, [])

//   const { loading, response, error } = Fetcher({
//     url: import.meta.env.VITE_GETALL_LISTING,
//     method: 'GET',
//     headers: { Authorization: `Bearer ${authToken}` },
//     onSuccess: (res) => console.log('Data is:', res),
//   });
//   console.log("Bearer ", authToken);
  
//   console.log("response from fetcher",response);
//   console.log("error from fetcher", error);
  
//   setMainTab(tabs.OFFPLAN)

//   const isClassicView = (viewType === 'classic');
//   const isListView = (viewType === 'list');

//   const totalItems = mainContent == 'Projects' ? cards.length : layouts.length


//   const totalPages = Math.ceil(totalItems / itemsPerPage) 

//   const indexOfLastItem = currentPage * itemsPerPage;

//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentCards = mainContent == 'Projects' ? cards.slice(indexOfFirstItem, indexOfLastItem) : layouts.slice(indexOfFirstItem,indexOfLastItem);


//   const handleCardClick = (id) => {
//     window.location.href = `/off-plan/${id}`;
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className={`
//         min-h-[600px]
//       `}>

//         {
//           (mainContent === 'Projects') ?
//           <>
//         {isListView ? (
//           <ListView currentCards={currentCards} />
//         ) : (
//           <div className={`
//             ${isClassicView 
//             ? 'space-y-6' 
//             : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-3'
//               }
//               `}>
//             {currentCards.map((card, index) => (
//               <div 
//               key={index} 
//               className={`
//                 ${isClassicView 
//                 ? 'mb-6 last:mb-0' 
//                 : 'h-full'
//                 }
//                 transition-transform duration-200 hover:scale-102
//                 hover:shadow-lg rounded-lg cursor-pointer
//                 `}
//                 onClick={() => handleCardClick(card.id)}
//                 >
//                 {isClassicView ? (
//                   <ClassicCard {...card} />
//                 ) : (
//                   <div className="h-full">
//                     <Card {...card} />
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//         </>
//         :
//         <LayoutGrid layouts={currentCards}/>
//       }
        
//         {/* Pagination Component */}
//         <div className="mt-8 flex justify-center">
//           <Pagination 
//             itemsPerPage={itemsPerPage} 
//             setItemsPerPage={setItemsPerPage} 
//             currentPage={currentPage} 
//             setCurrentPage={setCurrentPage} 
//             totalItems={totalItems} 
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CardGrid;



import React, { useState, useContext, useEffect } from 'react';
import { Heart, BedDouble, Bath, Home, Ruler, Calendar, Tag, CheckCircle } from "lucide-react";
import ViewContext from '../../contexts/ViewContext';
import MainContentContext from '../../contexts/MainContentContext';
import MainTabContext from '../../contexts/TabContext';
import { tabs } from '../../enums/sidebarTabsEnums';
import Fetcher from '../../utils/Fetcher';
import ListView from '../ListView';
import LayoutGrid from '../LayoutGrid';
import Pagination from '../Pagination';
import ClassicCard from './ClassicCard';
import PropertyCard from './PropertyCard';

// Property Card Component


// Main CardGrid Component
const CardGrid = ({ cards }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const { viewType } = useContext(ViewContext);
  const { mainContent } = useContext(MainContentContext);
  const { setMainTab } = useContext(MainTabContext);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  const { loading, response, error } = Fetcher({
    url: import.meta.env.VITE_GETALL_LISTING,
    method: 'GET',
    headers: { Authorization: `Bearer ${authToken}` },
    onSuccess: (res) => console.log('Data is:', res),
  });
  
  // Set the main tab
  useEffect(() => {
    setMainTab(tabs.OFFPLAN);
  }, [setMainTab]);

  const isClassicView = (viewType === 'classic');
  const isListView = (viewType === 'list');

  // Determine if we're using the API data or mock data
  const listings = response?.listings ? response.listings : [];
  
  // Calculate pagination
  const totalItems = listings.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListings = listings.slice(indexOfFirstItem, indexOfLastItem);

  const handleCardClick = (id) => {
    window.location.href = `/property/${id}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="min-h-[600px]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Error loading listings. Please try again later.
          </div>
        ) : (
          <>
            {isListView ? (
              <ListView currentCards={currentListings} />
            ) : (
              <div className={`
                ${isClassicView 
                ? 'space-y-6' 
                : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-3'
                  }
                  `}>
                {currentListings.map((listing, index) => (
                  <div 
                  key={listing.id || index} 
                  className={`
                    ${isClassicView 
                    ? 'mb-6 last:mb-0' 
                    : 'h-full'
                    }
                    transition-transform duration-200 hover:scale-102
                    hover:shadow-lg rounded-lg cursor-pointer
                    `}
                    onClick={() => handleCardClick(listing.id)}
                    >
                    {isClassicView ? (
                      <ClassicCard listing={listing} />
                    ) : (
                      <div className="h-full">
                        <PropertyCard listing={listing} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination Component */}
            {totalItems > 0 && (
              <div className="mt-8 flex justify-center">
                <Pagination 
                  itemsPerPage={itemsPerPage} 
                  setItemsPerPage={setItemsPerPage} 
                  currentPage={currentPage} 
                  setCurrentPage={setCurrentPage} 
                  totalItems={totalItems} 
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CardGrid;