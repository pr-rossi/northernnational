import React from 'react';
import { Music, Mail, Instagram, Twitter } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <header className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50" />
        <div className="z-10 text-center space-y-6">
          <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
            NORTHERN NATIONAL
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">Alternative Rock Band</p>
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
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <Music className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">NEW SINGLE</h3>
              <p className="text-gray-400">Stream our latest single now on all major platforms</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <Music className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">UPCOMING ALBUM</h3>
              <p className="text-gray-400">New album dropping soon. Stay tuned!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Section */}
      <section className="py-20 px-6 bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-red-500">TOUR DATES</h2>
          <div className="space-y-4">
            {[
              { date: "DEC 15", venue: "The Bomb Factory - Dallas, TX" },
              { date: "DEC 18", venue: "House of Blues - Houston, TX" },
              { date: "DEC 20", venue: "Stubb's - Austin, TX" }
            ].map((show, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-900 rounded-lg shadow-lg">
                <span className="text-xl font-bold">{show.date}</span>
                <span className="text-gray-300">{show.venue}</span>
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded transition duration-300">
                  TICKETS
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-red-500">CONNECT WITH US</h2>
          <div className="flex justify-center space-x-8 mb-12">
            <a href="https://instagram.com/northernnational" className="text-gray-400 hover:text-red-500 transition duration-300">
              <Instagram className="w-8 h-8" />
            </a>
            <a href="https://twitter.com/northernnatl" className="text-gray-400 hover:text-red-500 transition duration-300">
              <Twitter className="w-8 h-8" />
            </a>
            <a href="mailto:info@northernnational.com" className="text-gray-400 hover:text-red-500 transition duration-300">
              <Mail className="w-8 h-8" />
            </a>
          </div>
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">JOIN OUR MAILING LIST</h3>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 p-2 bg-gray-900 border border-gray-700 rounded-l focus:outline-none focus:border-red-500"
              />
              <button className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-r transition duration-300">
                SUBSCRIBE
              </button>
            </div>
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
