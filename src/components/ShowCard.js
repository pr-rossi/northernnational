import React from 'react';
import { useInView } from '../hooks/useInView';

const ShowCard = ({ date, venue, venueUrl, ticketUrl }) => {
  const cardRef = useInView();

  return (
    <div 
      ref={cardRef}
      className="flex flex-col md:flex-row justify-between items-center p-4 bg-black rounded-lg shadow-lg space-y-4 md:space-y-0 border border-zinc-900"
    >
      <span className="text-xl font-bold text-[#D4FF99]">{date}</span>
      <a 
        href={venueUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-[#D4FF99] transition duration-300"
      >
        {venue}
      </a>
      <a 
        href={ticketUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-[#D4FF99] hover:bg-[#bfe589] text-black font-medium rounded transition duration-300"
      >
        TICKETS
      </a>
    </div>
  );
};

export default ShowCard;
