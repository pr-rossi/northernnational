import { Link } from 'react-router-dom';
import { Mail, Instagram, Twitter } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-black">
      {/* Newsletter Section */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-[#D4FF99]">CONNECT WITH US</h2>
          <div className="flex justify-center space-x-8 mb-12">
            <a 
              href="https://instagram.com/northernnational" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#D4FF99] transition duration-300"
            >
              <Instagram className="w-8 h-8" />
            </a>
            <a 
              href="https://twitter.com/northernnational" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#D4FF99] transition duration-300"
            >
              <Twitter className="w-8 h-8" />
            </a>
            <a 
              href="mailto:contact@northernnational.com"
              className="text-white hover:text-[#D4FF99] transition duration-300"
            >
              <Mail className="w-8 h-8" />
            </a>
          </div>
          <div className="bg-zinc-950 p-8 rounded-lg shadow-lg">
            <form
              action="https://northernnationalmusic.us17.list-manage.com/subscribe/post?u=22d3f967aaa29a31ccd2275a1&amp;id=7e228c82dc&amp;f_id=0048c2e1f0"
              method="post"
              id="mc-embedded-subscribe-form"
              name="mc-embedded-subscribe-form"
              className="validate"
              target="_blank"
            >
              <h3 className="text-xl font-bold mb-4 text-white">JOIN OUR MAILING LIST</h3>
              <div className="flex flex-col sm:flex-row max-w-md mx-auto space-y-2 sm:space-y-0">
                <input
                  type="email"
                  name="EMAIL"
                  className="flex-1 p-2 bg-black border border-zinc-800 rounded sm:rounded-l focus:outline-none focus:border-[#D4FF99]"
                  id="mce-EMAIL"
                  placeholder="Enter your email"
                  required
                />
                <button 
                  type="submit"
                  name="subscribe"
                  id="mc-embedded-subscribe"
                  className="px-6 py-2 bg-[#D4FF99] hover:bg-[#bfe589] text-black font-medium rounded sm:rounded-r transition duration-300"
                >
                  SUBSCRIBE
                </button>
              </div>
              {/* Bot protection */}
              <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                <input type="text" name="b_22d3f967aaa29a31ccd2275a1_7e228c82dc" tabIndex="-1" value="" />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="py-8 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400">© 2024 Northern National. All rights reserved.</p>
          <nav className="flex space-x-6">
            <Link to="/merch" className="text-gray-400 hover:text-[#D4FF99] transition duration-300">
              Merch
            </Link>
            <Link to="/tour" className="text-gray-400 hover:text-[#D4FF99] transition duration-300">
              Tour
            </Link>
            <Link to="/blog" className="text-gray-400 hover:text-[#D4FF99] transition duration-300">
              Blog
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 