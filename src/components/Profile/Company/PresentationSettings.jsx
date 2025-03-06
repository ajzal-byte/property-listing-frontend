import React, { useState } from 'react';

// Modular components
const PositionSelector = ({ selectedPosition, onPositionChange }) => {
  const positions = [
    { id: 'ceo', label: 'CEO' },
    { id: 'personal-manager', label: 'Personal manager' },
    { id: 'property-consultant', label: 'Property Consultant' }
  ];

  return (
    <div className="flex gap-2">
      {positions.map((position) => (
        <button
          key={position.id}
          onClick={() => onPositionChange(position.id)}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedPosition === position.id
              ? 'bg-blue-800 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {position.label}
        </button>
      ))}
    </div>
  );
};

const FileUploader = ({ title, description, initialImage = null, aspectRatio = null }) => {
  const [uploadedImage, setUploadedImage] = useState(initialImage);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the file
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const deleteImage = () => {
    setUploadedImage(null);
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2 text-gray-700">{title}</h3>
      <div
        className={`border-2 border-dashed rounded-md ${
          isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        } ${aspectRatio || 'aspect-video'} relative overflow-hidden`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleFileDrop}
      >
        {uploadedImage ? (
          <div className="h-full w-full relative group">
            <img 
              src={uploadedImage} 
              alt="Preview" 
              className="h-full w-full object-contain"
            />
            <button 
              onClick={deleteImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-full cursor-pointer">
            <div className="flex flex-col items-center justify-center p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-blue-600 font-medium text-center">Upload files here</span>
              {description && <p className="text-gray-400 text-xs text-center mt-1">{description}</p>}
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        )}
      </div>
    </div>
  );
};

const PresentationSettings = () => {
  const [selectedPosition, setSelectedPosition] = useState('personal-manager');

  return (
    <div className="p-6 max-w-8xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Presentation settings</h1>
      
      <div className="mb-6">
        <h2 className="text-sm font-medium mb-2 text-gray-700">Representative's position for presentations:</h2>
        <PositionSelector 
          selectedPosition={selectedPosition} 
          onPositionChange={setSelectedPosition}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FileUploader 
          title="Horizontal logo (500×250px):" 
          aspectRatio="aspect-[2/1]"
        />
        
        <FileUploader 
          title="Background image for PDF:" 
          description="Accepted file formats: jpeg, png, jpg"
        />
        
        <FileUploader 
          title="Background image for online presentation:" 
          description="A resolution of at least 2000 × 1400 pixels is recommended"
        />
      </div>
    </div>
  );
};

export default PresentationSettings;