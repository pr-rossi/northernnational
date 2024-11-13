import React from 'react';
import { CalendarX } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { useLenis } from '@studio-freight/react-lenis';

const NoShows = () => {
  const cardRef = useInView();
  const lenis = useLenis();

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
            const footer = document.querySelector('footer');
            if (footer && lenis) {
              lenis.scrollTo(footer, {
                offset: -50, // Adds some padding at the top
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
              });
            }
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
