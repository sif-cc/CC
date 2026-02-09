
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
            <span className="text-xl font-bold tracking-tight text-gray-900">EduNexus</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#modules" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Modules</a>
            <a href="#playlists" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Playlists</a>
            <a href="#ai-tutor" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">AI Tutor</a>
          </div>
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
