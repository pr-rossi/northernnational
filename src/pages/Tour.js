import { useEffect } from 'react';
import { useLenis } from '@studio-freight/react-lenis';
import PageTransition from '../components/PageTransition';
import ShowCard from '../components/ShowCard';
import NoShows from '../components/NoShows';

function Tour() {
  const lenis = useLenis();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    // Also reset Lenis scroll
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [lenis]);

  // You can move this to a data file or fetch from an API
  const shows = [
    {
      date: "DEC 15",
      venue: "The Bomb Factory - Dallas, TX",
      venueUrl: "https://thebombfactory.com",
      ticketUrl: "https://tickets.thebombfactory.com/event/your-event"
    }
  ];

  return (
    <PageTransition>
      <div className="pt-48 pb-32 min-h-screen bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-[#D4FF99] mb-12">TOUR DATES</h1>
          
          <div className="space-y-4">
            {shows.length > 0 ? (
              shows.map((show, index) => (
                <ShowCard
                  key={index}
                  date={show.date}
                  venue={show.venue}
                  venueUrl={show.venueUrl}
                  ticketUrl={show.ticketUrl}
                />
              ))
            ) : (
              <NoShows />
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Tour; 