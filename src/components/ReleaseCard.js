import React from 'react';
import { Music } from 'lucide-react';

const ReleaseCard = ({ title, description }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <Music className="w-12 h-12 text-orange-500 mb-4" />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default ReleaseCard;
