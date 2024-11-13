import { useEffect } from 'react';
import { Events } from 'react-scroll';
import { scrollConfig } from '../utils/scrollConfig';

function ScrollProvider({ children }) {
  useEffect(() => {
    // Register global scroll settings
    Events.scrollEvent.register('begin', () => {});
    Events.scrollEvent.register('end', () => {});

    // Set default scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      // Cleanup
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
    };
  }, []);

  return children;
}

export default ScrollProvider; 