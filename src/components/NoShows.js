import React from 'react';
import { CalendarX } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const NoShows = () => {
  const cardRef = useInView();

  return (
    <div 
      ref={cardRef}
      className="flex flex-col items-center justify-center py-16 px-4 bg-black rounded-lg text-center border border-zinc-900"
    >
      <CalendarX className="w-16 h-16 text-[#D4FF99] mb-4" />
      <h3 className="text-2xl font-bold mb-2 text-white">No Upcoming Shows</h3>
      <p className="text-gray-400 max-w-md">
        We're currently working on new dates. Sign up for our mailing list to be the first to know when we announce new shows!
      </p>
      
      <div className="mt-8">
        <a 
          href="#mailing-list" 
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('#mailing-list').scrollIntoView({ 
              behavior: 'smooth'
            });
          }}
          className="inline-flex items-center px-6 py-3 bg-[#D4FF99] hover:bg-[#bfe589] text-black font-medium rounded-lg transition duration-300"
        >
          Get Updates
        </a>
      </div>
    </div>
  );
};

export default NoShows;
