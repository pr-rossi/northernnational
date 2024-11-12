import React, { useEffect, useRef } from 'react';
import { Mail, Instagram, Twitter } from 'lucide-react';
import gsap from 'gsap';
import ReleaseCard from './components/ReleaseCard';
import ShowCard from './components/ShowCard';
import NoShows from './components/NoShows';

function App() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    // Split text into spans for animation
    if (titleRef.current) {
      const text = titleRef.current.innerText;
      const characters = text.split('');
      
      titleRef.current.innerHTML = characters
        .map((char, index) => char === ' ' 
          ? '<span style="display: inline-block; margin: 0 0.1em;">&nbsp;</span>' 
          : `<span style="display: inline-block; transform: translateY(100px); opacity: 0;">${char}</span>`
        )
        .join('');

      // Animate each character
      const chars = titleRef.current.querySelectorAll('span');
      chars.forEach((char, index) => {
        gsap.fromTo(char, 
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: 0.5 + (index * 0.04),
            ease: "power4.out"
          }
        );
      });
    }

    // Subtitle animation
    if (subtitleRef.current) {
      gsap.fromTo(subtitleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 1.2,
          ease: "power4.out"
        }
      );
    }
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
      <header className="h-screen flex items-center justify-center relative overflow-hidden">
        {/* Water effect overlay */}
        <div className="absolute inset-0 water-effect">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/images/the-boys-show.jpeg')`
            }}
          />
        </div>

        {/* Gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8))',
            zIndex: 1
          }}
        />

        <div className="z-10 text-center space-y-6 px-4">
  <h1 
    ref={titleRef}
    className="text-6xl md:text-8xl font-bold text-white"
  >
    NORTHERN NATIONAL
  </h1>
  <p 
    ref={subtitleRef}
    className="text-xl md:text-2xl text-gray-300"
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
