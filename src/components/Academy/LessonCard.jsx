import React from "react";
import { PlayCircle, FileText, Clock, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LessonCard = ({ lesson }) => {

    const navigate = useNavigate()

    return (
      <div className={`group relative bg-white rounded-xl shadow-md overflow-hidden 
                      transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                      border-l-4 ${lesson.completed ? 'border-green-500' : lesson.isLocked ? 'border-gray-300' : 'border-blue-500'} cursor-pointer`} onClick={()=>{navigate(`lessons/${lesson.id}`)}}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
            {lesson.sequence}.{' '}{lesson.title}
            </h3>
            {lesson.isLocked ? (
              <Lock className="w-5 h-5 text-gray-400" />
            ) : (
              <PlayCircle className="w-5 h-5 text-blue-500" />
            )}
          </div>
          
          {/* Description */}
          <p className="text-gray-600 mb-4 text-sm">
            {lesson.description}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">{lesson.duration}</span>
            </div>
            
            <div className="flex items-center">
              {lesson.type === 'video' && (
                <div className="flex items-center text-sm text-blue-500">
                  <FileText className="w-4 h-4 mr-1" />
                  <span>Video Lesson</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Hover overlay for locked lessons */}
        {lesson.isLocked && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-0 group-hover:bg-opacity-50 
                        transition-all duration-300 flex items-center justify-center opacity-0 
                        group-hover:opacity-100">
            <div className="text-white text-center">
              <Lock className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Complete previous lessons to unlock</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  export default LessonCard