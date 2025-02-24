import React, { useState, useEffect } from "react";
import { courses } from "./../../mockdata/mockData";
import CourseCard from "./CourseCard";
import AcademyNavbar from "./AcademyNavbar";
import { X } from "lucide-react";

const CourseGrid = () => {
  // State for filtered courses
  const [filteredCourses, setFilteredCourses] = useState(courses);
  // State for active filters
  const [activeFilters, setActiveFilters] = useState([]);
  // Get all unique tags from courses
  const [availableTags, setAvailableTags] = useState([]);

  // Extract all unique tags when component mounts
  useEffect(() => {
    const allTags = courses.reduce((tags, course) => {
      if (course.tags && Array.isArray(course.tags)) {
        course.tags.forEach(tag => {
          if (!tags.includes(tag)) {
            tags.push(tag);
          }
        });
      }
      return tags;
    }, []);
    
    setAvailableTags(allTags);
  }, []);

  // Filter courses when activeFilters changes
  useEffect(() => {
    if (activeFilters.length === 0) {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course => {
        // If course has no tags, it doesn't match any filter
        if (!course.tags || !Array.isArray(course.tags)) return false;
        
        // Check if course has ALL selected tags
        return activeFilters.every(filter => course.tags.includes(filter));
      });
      setFilteredCourses(filtered);
    }
  }, [activeFilters]);

  // Toggle a tag filter
  const toggleFilter = (tag) => {
    if (activeFilters.includes(tag)) {
      setActiveFilters(activeFilters.filter(filter => filter !== tag));
    } else {
      setActiveFilters([...activeFilters, tag]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters([]);
  };


  return (
    <>
      <AcademyNavbar />
      
      {/* Tag Filter Section */}
      <div className="mx-6 my-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mr-2">Filter by tags:</h2>
          
          {/* Active Filters Counter */}
          {activeFilters.length > 0 && (
            <button 
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Clear all filters ({activeFilters.length})
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Tag Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {availableTags.map((tag, index) => {
            const isActive = activeFilters.includes(tag);
            
            return (
              <button
                key={index}
                onClick={() => toggleFilter(tag)}
                className={`bg-blue-100 text-blue-800 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:shadow-md ${isActive ? 'ring-2 ring-offset-2 ring-blue-300' : 'hover:scale-105'}`}
              >
                {tag}
                {isActive && <span className="ml-2 font-bold">✓</span>}
              </button>
            );
          })}
        </div>
        
        {/* Results Summary */}
        <div className="mb-2 text-sm text-gray-600">
          {filteredCourses.length === courses.length ? (
            <p>Showing all {courses.length} courses</p>
          ) : (
            <p>Showing {filteredCourses.length} of {courses.length} courses</p>
          )}
        </div>
      </div>
      
      {/* Course Grid with Filter Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((card, index) => (
            <CourseCard
              key={index}
              id={card.id}
              name={card.name}
              description={card.description}
              lectureCount={card.lectureCount}
              source={card.source}
              tags={card.tags}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses match your filters</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filter criteria or clear filters to see all courses.</p>
            <button 
              onClick={clearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseGrid;