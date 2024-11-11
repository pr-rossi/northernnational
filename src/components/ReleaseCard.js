import React from 'react';
import { Music } from 'lucide-react';

const ReleaseCard = ({ title, description, url }) => {
  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-800 p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
    >
      <Music className="w-12 h-12 text-orange-500 mb-4" />
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </a>
  );
};

export default ReleaseCard;
