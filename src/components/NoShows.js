import React from 'react';
import { CalendarX } from 'lucide-react';

const NoShows = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-900 rounded-lg text-center">
      <CalendarX className="w-16 h-16 text-red-500 mb-4" />
      <h3 className="text-2xl font-bold mb-2">No Upcoming Shows</h3>
      <p className="text-gray-400 max-w-md">
        We're currently working on new dates. Sign up for our mailing list to be the first to know when we announce new shows!
      </p>
      
      {/* Optional: Social Links */}
      <div className="mt-8">
        <a 
          href="#mailing-list" 
          className="inline-flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition duration-300"
        >
          Get Updates
        </a>
      </div>
    </div>
  );
};

export default NoShows;
