
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute top-0 right-0 -z-10 opacity-10">
        <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="300" cy="300" r="300" fill="url(#paint0_linear)"/>
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="600" y2="600" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4F46E5"/>
              <stop offset="1" stopColor="#9333EA"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
          Learning Without <span className="gradient-text">Limits</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          The all-in-one educational platform designed for the next generation of thinkers, builders, and dreamers.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="#modules" className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-xl">
            Explore Modules
          </a>
          <a href="#ai-tutor" className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
            Talk to AI Tutor
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
