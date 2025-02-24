import React, { useState } from 'react';

const NativePdfViewer = ({ pdfUrl, lessonDetails }) => {
  const [activeTab, setActiveTab] = useState('details');
  
  // Default lesson details if none provided
  const defaultLessonDetails = {
    title: "Introduction to Modern Architecture",
    description: "This lesson explores the fundamental principles of ReactJS, one of the most popular JavaScript libraries for building user interfaces. We will delve into its core concepts, component-based architecture, and its impact on web development throughout the 21st century.",

objectives: [
  "Understand the key concepts and principles behind ReactJS",
  "Learn how to build and manage React components",
  "Analyze how ReactJS simplifies state management and UI updates",
  "Compare ReactJS with other frameworks and libraries in web development"
],
    duration: "45 minutes",
    level: "Intermediate"
  };
  
  // Use provided details or fall back to defaults
  const details = lessonDetails || defaultLessonDetails;

  return (
    <div className="w-full max-w-6xl mx-auto my-8 bg-gray-50 rounded-xl shadow-xl overflow-hidden">
      {/* Lesson Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{details.title}</h1>
        <div className="flex flex-wrap gap-4 mt-4">
          <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm text-gray-600 font-medium">
            {details.duration}
          </span>
          <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm text-gray-600 font-medium">
            {details.level}
          </span>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('details')}
            className={`w-1/2 py-4 px-6 text-center border-b-2 font-medium text-sm md:text-base transition-colors duration-200 ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Lesson Details
          </button>
          <button
            onClick={() => setActiveTab('objectives')}
            className={`w-1/2 py-4 px-6 text-center border-b-2 font-medium text-sm md:text-base transition-colors duration-200 ${
              activeTab === 'objectives'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Learning Objectives
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-6 md:p-8">
        {activeTab === 'details' ? (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{details.description}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {details.objectives.map((objective, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                  <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                </div>
                <p className="ml-4 text-gray-700">{objective}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* PDF Viewer */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold px-6 md:px-8 mb-4 text-gray-800">Lesson Material</h2>
        <div className="w-full h-96 md:h-130 border-t border-gray-200">
          <iframe 
            src={`${pdfUrl}#toolbar=1&navpanes=1`} 
            className="w-full h-full" 
            title="PDF Viewer"
          />
        </div>
      </div>
    </div>
  );
};

export default NativePdfViewer;