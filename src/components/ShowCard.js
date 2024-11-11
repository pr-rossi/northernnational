import React from 'react';

const ShowCard = ({ date, venue, onTicketClick }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-900 rounded-lg shadow-lg">
      <span className="text-xl font-bold">{date}</span>
      <span className="text-gray-300">{venue}</span>
      <button 
        onClick={onTicketClick}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded transition duration-300"
      >
        TICKETS
      </button>
    </div>
  );
};

export default ShowCard;
