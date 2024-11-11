import React from 'react';

const ShowCard = ({ date, venue, venueUrl, ticketUrl }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-900 rounded-lg shadow-lg space-y-4 md:space-y-0">
      <span className="text-xl font-bold">{date}</span>
      <a 
        href={venueUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-300 hover:text-red-500 transition duration-300"
      >
        {venue}
      </a>
      <a 
        href={ticketUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded transition duration-300 text-white"
      >
        TICKETS
      </a>
    </div>
  );
};

export default ShowCard;
