import React from 'react';
import { Clock, PlayCircle, FileText, Lock } from 'lucide-react';
import { lessonsData  } from '../../mockdata/mockData';
import LessonCard from './LessonCard';
// Individual Lesson Card Component
;

// Main Lessons Page Component
const LessonsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">React Fundamentals Course</h1>
          <p className="text-gray-600 mt-2">Master the basics of React development through our comprehensive course</p>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Course Progress</span>
            <span>2/10 Lessons Completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full w-1/5 transition-all duration-500"></div>
          </div>
        </div>
        
        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessonsData.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonsPage;