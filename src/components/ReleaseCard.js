import React, { useEffect, useRef } from 'react';
import { Music } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ReleaseCard = ({ title, description, url }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const element = cardRef.current;
    
    gsap.set(element, { opacity: 0, y: 50 }); // Set initial state

    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top bottom-=100",
        toggleActions: "play none none reverse"
      }
    });
  }, []);

  return (
    <div 
      ref={cardRef}
      className="transform transition-all"
    >
      <a 
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-zinc-950 p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer border border-zinc-900 hover:border-[#D4FF99]"
      >
        <Music className="w-12 h-12 text-[#D4FF99] mb-4" />
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </a>
    </div>
  );
};

export default ReleaseCard;
