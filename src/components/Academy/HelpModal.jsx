import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  User, 
  Mail, 
  Phone, 
  HelpCircle, 
  Send,
  BookOpen,
  AlertCircle,
  CheckCircle,
  MessageCircleDashed
} from 'lucide-react';

// Contact Modal Component (separate component)
const HelpModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { value: 'course-access', label: 'Course Access Issues', icon: BookOpen },
    { value: 'technical', label: 'Technical Problems', icon: AlertCircle },
    { value: 'billing', label: 'Billing & Payments', icon: MessageCircle },
    { value: 'certificates', label: 'Certificates & Progress', icon: CheckCircle },
    { value: 'general', label: 'General Questions', icon: HelpCircle }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      category: '',
      subject: '',
      message: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl relative">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:cursor-pointer hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3 text-white">
            <div className="bg-white text-blue-600 bg-opacity-20 p-3 rounded-full">
              <MessageCircleDashed size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Need Help?</h2>
              <p className="text-blue-100">We're here to assist you with Academy</p>
            </div>
          </div>
        </div>

        {!isSubmitted ? (
          <div className="p-6 space-y-6">
            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User size={16} className="text-blue-600" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail size={16} className="text-blue-600" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone size={16} className="text-blue-600" />
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <HelpCircle size={16} className="text-blue-600" />
                What can we help you with? *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <label
                      key={category.value}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${
                        formData.category === category.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.value}
                        checked={formData.category === category.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <IconComponent size={18} className={formData.category === category.value ? 'text-blue-600' : 'text-gray-500'} />
                      <span className="text-sm font-medium">{category.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Brief description of your issue"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Detailed Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Please provide as much detail as possible about your question or issue..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Send size={18} />
                Send Message
              </button>
            </div>
          </div>
        ) : (
          /* Success State */
          <div className="p-8 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for reaching out. Our support team will get back to you within 24 hours.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800">
                <strong>Ticket ID:</strong> #ACD-{Math.random().toString(36).substr(2, 6).toUpperCase()}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Please save this ID for future reference
              </p>
            </div>
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpModal