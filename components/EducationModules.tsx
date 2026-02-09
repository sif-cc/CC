
import React from 'react';
import { EDUCATIONAL_MODULES } from '../constants';
import { Module } from '../types';

const EducationModules: React.FC = () => {
  return (
    <section id="modules" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Curriculum</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Discover our curated learning paths designed by experts across multiple disciplines.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {EDUCATIONAL_MODULES.map((module) => (
            <div key={module.id} className="group relative bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-100">
              <div className={`${module.color} w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                {module.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{module.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {module.description}
              </p>
              <div className="mt-6 flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                Learn More <span className="ml-2">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationModules;
