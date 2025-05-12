import { useState, useRef } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';

export default function BulkImportModal({ isModalOpen, onClose, type }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);

  if (!isModalOpen) return;

  const title = type === "locations" ? "Bulk Import Locations" : "Bulk Import Developers";
  const apiEndpoint = type === "locations" 
    ? "https://backend.myemirateshome.com/api/bulk-upload/locations"
    : "https://backend.myemirateshome.com/api/bulk-upload/developers";

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus(null); // Reset status on new file selection
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setUploadStatus(null); // Reset status on new file selection
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) return;
    
    const formData = new FormData();
    formData.append('csv_file', file);
    
    setIsUploading(true);
    setUploadStatus(null);
    
    try {
      // Get auth token from localStorage or however you store it 
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.ok) {
        setUploadStatus('success');
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        const errorData = await response.json();
        setUploadStatus('error');
        console.error('Upload failed:', errorData);
      }
    } catch (error) {
      setUploadStatus('error');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        
        <form onSubmit={handleSubmit}>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            
            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
            
            <p className="text-sm text-gray-600 mb-1">
              {file ? file.name : "Drag and drop a CSV file here, or click to browse"}
            </p>
            
            <p className="text-xs text-gray-500">
              Only CSV files are accepted
            </p>
          </div>
          
          {uploadStatus === 'success' && (
            <div className="mt-4 text-green-600 flex items-center justify-center">
              <CheckCircle size={16} className="mr-2" />
              <span>Upload successful!</span>
            </div>
          )}
          
          {uploadStatus === 'error' && (
            <div className="mt-4 text-red-600 text-center">
              Upload failed. Please try again.
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={!file || isUploading}
              className={`px-4 py-2 rounded-md text-white flex items-center ${
                !file || isUploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Upload
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}