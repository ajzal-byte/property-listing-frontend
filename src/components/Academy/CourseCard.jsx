import React from "react";
import { Clock, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({id, name, description, lectureCount, source, tags = [] }) => {
    
    const navigate = useNavigate()
    
    // Generate a color based on tag text for visual variety
    const getTagColor = (tag) => {
      const colors = [
        { bg: "bg-indigo-50", text: "text-indigo-700" },
        { bg: "bg-emerald-50", text: "text-emerald-700" },
        { bg: "bg-amber-50", text: "text-amber-700" },
        { bg: "bg-rose-50", text: "text-rose-700" },
        { bg: "bg-cyan-50", text: "text-cyan-700" },
      ];
      
      // Use tag length as simple hash to select a color
      const index = tag.length % colors.length;
      return colors[index];
    };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl max-w-lg cursor-pointer" onClick={()=>{navigate(`${id}`)}}>
      {/* Enhanced background gradients */}
      <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-500 opacity-10 blur-3xl transition-all duration-500 group-hover:opacity-25" />
      <div className="absolute -left-8 -bottom-8 h-48 w-48 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-blue-700 opacity-10 blur-3xl transition-all duration-500 group-hover:opacity-25" />

      {/* Course Name with enhanced typography */}
      <h3 className="relative mb-3 text-2xl font-bold tracking-tight text-gray-900 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text 
      group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-blue-800
      ">
        {name}
      </h3>

      {/* Description with larger text */}
      <p className="mb-6 text-base leading-relaxed text-gray-600 transition-all duration-300 group-hover:text-gray-700 line-clamp-2">
        {description}
      </p>

      {/* Tags Pills - Modern In-Card Design */}
      {tags && tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {tags.map((tag, index) => {
            const colorScheme = getTagColor(tag);
            return (
              <span
                key={index}
                // className={`${colorScheme.bg} ${colorScheme.text} rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 hover:scale-105 hover:shadow-sm`}
                className={` text-blue-800 bg-blue-100 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 hover:scale-105 hover:shadow-sm`}
              >
                {tag}
              </span>
            );
          })}
        </div>
      )}

      {/* Stats Container with hover effects */}
      <div className="flex flex-wrap gap-6">
        {/* Lecture Count */}
        <div className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
          <PlayCircle className="h-5 w-5 text-blue-500" />
          <span className="text-base font-medium text-gray-700">
            {lectureCount} lectures
          </span>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
          <Clock className="h-5 w-5 text-blue-500" />
          <span className="text-base font-medium text-gray-700">
            {Math.round(lectureCount * 1.5)}h total
          </span>
        </div>
      </div>

      {/* Instructors with enhanced styling */}
      <div className="mt-8 flex items-center gap-3">
        Offered By:
        <div className="flex flex-wrap gap-2">
          <span
            className="rounded-full bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-300 hover:from-blue-100 hover:to-purple-100"
          >
            {source}
          </span>
        </div>
      </div>

      {/* Enhanced Action Button */}
      <button className="mt-8 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 via-blue-700 to-blue-900 p-[2px] transition-all duration-300 hover:scale-[1.02]">
        <div className="rounded-[10px] bg-white px-4 py-3 transition-all duration-300 hover:bg-transparent hover:text-white font-bold">
          View Course
          <span className="text-base font-bold bg-clip-text bg-gradient-to-r from-blue-500 via-blue-700 to-blue-900 transition-all duration-300 text-black hover:text-white"></span>
        </div>
      </button>
    </div>
  );
};

export default CourseCard;