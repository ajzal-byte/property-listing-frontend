import { useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CoursePrompt = () => {
    const navigate = useNavigate()
  return (
    <div
      className={`
          relative w-[50%] h-64 flex justify-center items-center overflow-hidden
          bg-white rounded-2xl
          border border-gray-100
          shadow-xl transition-all duration-300
           hover:scale-105 hover:shadow-2xl
        `}
        onClick={()=>{navigate('courses', {replace: false})}}
    >
      <button
        className="
            flex items-center gap-4 p-8
            group cursor-pointer
            transition-all duration-300
          "
        // onClick={() => alert("Courses would be shown here!")}
      >
        <div className="relative">
          <div
            className={`
              absolute -inset-1 rounded-lg
              bg-gradient-to-r from-purple-600 to-indigo-600
               blur transition duration-300
              hover:opacity-100 opacity-0}
            `}
          />
          <div className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex flex-col items-start">
          <h3 className="text-xl font-semibold text-gray-900">
            Discover Our Courses
          </h3>
          <p className="text-gray-500 pb-3">
            Explore our curated collection of top-rated courses
          </p>

          <div className="flex">
            <p>Over</p>
            <p>&nbsp;</p>
            <p className="font-semibold text-blue-600">50+</p>
            <p>&nbsp;</p>
            <p> courses, enroll and track yourself!</p>
          </div>
        </div>

        <ChevronRight
          className={`
            w-6 h-6 
            transition-all duration-300
            hover:transform translate-x-2 text-indigo-600}
          `}
        />
      </button>


    </div>
  );
};

export default CoursePrompt;
