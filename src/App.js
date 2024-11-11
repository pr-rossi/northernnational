import React, { useEffect, useState } from 'react';
import { Mail, Instagram, Twitter } from 'lucide-react';
import ReleaseCard from './components/ReleaseCard';
import ShowCard from './components/ShowCard';
import NoShows from './components/NoShows';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Data for releases with URLs
  const releases = [
    {
      title: "NEW SINGLE",
      description: "Stream our latest single now on all major platforms",
      url: "https://open.spotify.com/artist/your-artist-id" // Replace with your actual Spotify URL
    },
    {
      title: "UPCOMING ALBUM",
      description: "New album dropping soon. Stay tuned!",
      url: "https://music.apple.com/your-album-link" // Replace with your actual Apple Music URL
    }
  ];

  // Data for shows with venue and ticket URLs
  const shows = [
    // Uncomment and modify these to show tour dates
    // {
    //   date: "DEC 15",
    //   venue: "The Bomb Factory - Dallas, TX",
    //   venueUrl: "https://thebombfactory.com",
    //   ticketUrl: "https://tickets.thebombfactory.com/event/your-event"
    // },
    // {
    //   date: "DEC 18",
    //   venue: "House of Blues - Houston, TX",
    //   venueUrl: "https://www.houseofblues.com/houston",
    //   ticketUrl: "https://www.houseofblues.com/houston/event/your-event"
    // },
    // {
    //   date: "DEC 20",
    //   venue: "Stubb's - Austin, TX",
    //   venueUrl: "https://www.stubbsaustin.com",
    //   ticketUrl: "https://www.stubbsaustin.com/event/your-event"
    // }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <header 
        className={`h-screen flex items-center justify-center relative overflow-hidden bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url('/images/the-boys-show.jpeg')`
        }}
      >
        {/* Animated gradient overlay */}
        <div 
          className={`absolute inset-0 transition-opacity duration-1000 ${
            isLoaded ? 'opacity-60' : 'opacity-0'
          }`}
          style={{
            backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8))'
          }}
        />

        <div className="z-10 text-center space-y-6">
          <h1 
            className={`text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            NORTHERN NATIONAL
          </h1>
          <p 
            className={`text-xl md:text-2xl text-gray-300 transform transition-all duration-1000 delay-300 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Alternative Rock Band
          </p>
        </div>
      </header>

      {/* About Section */}
      <section className="py-20 px-6 bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-red-500">ABOUT THE BAND</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Northern National brings raw energy and authentic storytelling to the alternative rock scene. 
            With powerful vocals, driving guitars, and dynamic performances, we create an unforgettable 
            experience that resonates with audiences everywhere.
          </p>
        </div>
      </section>

      {/* Music Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-red-500">LATEST RELEASES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {releases.map((release, index) => (
              <ReleaseCard 
                key={index}
                title={release.title}
                description={release.description}
                url={release.url}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Tour Section */}
      <section className="py-20 px-6 bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-red-500">TOUR DATES</h2>
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
      </section>

      {/* Contact Section */}
      <section id="mailing-list" className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-red-500">CONNECT WITH US</h2>
          <div className="flex justify-center space-x-8 mb-12">
            <a 
              href="https://instagram.com/northernnational" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-500 transition duration-300"
            >
              <Instagram className="w-8 h-8" />
            </a>
            <a 
              href="https://twitter.com/northernnational" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-500 transition duration-300"
            >
              <Twitter className="w-8 h-8" />
            </a>
            <a 
              href="mailto:contact@northernnational.com"
              className="text-gray-400 hover:text-red-500 transition duration-300"
            >
              <Mail className="w-8 h-8" />
            </a>
          </div>
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <form
              action="https://northernnationalmusic.us17.list-manage.com/subscribe/post?u=22d3f967aaa29a31ccd2275a1&amp;id=7e228c82dc&amp;f_id=0048c2e1f0"
              method="post"
              id="mc-embedded-subscribe-form"
              name="mc-embedded-subscribe-form"
              className="validate"
              target="_blank"
            >
              <h3 className="text-xl font-bold mb-4">JOIN OUR MAILING LIST</h3>
              <div className="flex max-w-md mx-auto">
                <input
                  type="email"
                  name="EMAIL"
                  className="flex-1 p-2 bg-gray-900 border border-gray-700 rounded-l focus:outline-none focus:border-red-500"
                  id="mce-EMAIL"
                  placeholder="Enter your email"
                  required
                />
                <button 
                  type="submit"
                  name="subscribe"
                  id="mc-embedded-subscribe"
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-r transition duration-300"
                >
                  SUBSCRIBE
                </button>
              </div>
              {/* Bot protection - don't remove */}
              <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                <input type="text" name="b_22d3f967aaa29a31ccd2275a1_7e228c82dc" tabIndex="-1" value="" />
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-800 text-center">
        <p className="text-gray-400">© 2024 Northern National. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
