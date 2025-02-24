import React, { useState } from 'react';
import YouTubeEmbed from '../Utils/YoutubeEmbed';
import PdfViewer from '../Utils/PdfViewer';
import { Video, BookHeart } from 'lucide-react';

const CourseContentPage = ({ courseTitle, youtubeUrl, pdfUrl }) => {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Course Title */}
        <h1 className="text-3xl font-bold text-blue-900 mb-8">{courseTitle}</h1>

        {/* Content Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('video')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'video'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <div className='flex gap-2'>
              <Video className='h-5 w-5' />
              <div>Video Lesson</div>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('pdf')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'pdf'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <div className='flex gap-2'>
              <BookHeart  className='h-5 w-5'/>
              <div>PDF Content</div>
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'video' && <YouTubeEmbed url={youtubeUrl} />}
            {activeTab === 'pdf' && <PdfViewer pdfUrl={pdfUrl} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContentPage;