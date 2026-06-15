import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 text-center mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 space-y-4">
        {/* Brand Tagline */}
        <p className="text-sm font-bold text-gray-800 flex items-center justify-center gap-1">
          🌿 <span className="bg-gradient-to-r from-[#166E52] to-[#639922] bg-clip-text text-transparent">CarbonSense</span>
          <span className="text-gray-400 font-medium">— Track. Reduce. Thrive.</span>
        </p>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs font-semibold text-gray-500">
          <Link to="/" className="hover:text-[#166E52] transition-colors">Dashboard</Link>
          <span className="text-gray-300">|</span>
          <Link to="/log" className="hover:text-[#166E52] transition-colors">Log Activity</Link>
          <span className="text-gray-300">|</span>
          <Link to="/insights" className="hover:text-[#166E52] transition-colors">Insights</Link>
          <span className="text-gray-300">|</span>
          <Link to="/challenges" className="hover:text-[#166E52] transition-colors">Challenges</Link>
        </div>

        {/* Source citation */}
        <p className="text-[11px] text-gray-400 font-medium max-w-md mx-auto">
          Carbon emission factors sourced from IPCC (Intergovernmental Panel on Climate Change) & Our World in Data.
        </p>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
