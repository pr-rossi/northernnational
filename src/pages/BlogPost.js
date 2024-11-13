import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Mail, Instagram, Twitter } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getPostBySlug } from '../utils/blogUtils';
import PageTransition from '../components/PageTransition';
import { useLenis } from '@studio-freight/react-lenis';
import '../styles/blog.css';

function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const lenis = useLenis();
  const [post, setPost] = useState(null);

  useEffect(() => {
    getPostBySlug(slug).then(setPost);
  }, [slug]);

  const handleClose = () => {
    // First, disable smooth scrolling
    if (lenis) {
      lenis.stop();
    }

    // Store current scroll position
    const currentScroll = window.scrollY;

    // Set a fixed position to prevent any scroll jumps
    document.body.style.position = 'fixed';
    document.body.style.top = `-${currentScroll}px`;
    document.body.style.width = '100%';

    // Navigate back
    navigate(-1);

    // After navigation, reset the scroll position and re-enable scrolling
    requestAnimationFrame(() => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Force scroll to top
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);

      // Re-enable Lenis
      if (lenis) {
        lenis.start();
      }
    });
  };

  // Ensure scroll is enabled when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      if (lenis) {
        lenis.start();
      }
    };
  }, [lenis]);

  if (!post) return null;

  return (
    <PageTransition>
      <div className="pt-16 pb-8 min-h-screen bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <button
            onClick={handleClose}
            className="fixed top-8 right-8 z-50 p-2 rounded-full bg-black/50 backdrop-blur-sm 
                       text-white hover:text-[#D4FF99] transition-colors duration-200"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <div className="max-w-7xl mx-auto pt-20 px-6">
            <p className="text-sm text-gray-400 tracking-wider">{post.date}</p>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-[#D4FF99] leading-tight">
              {post.title}
            </h1>
          </div>

          <div className="w-full h-[70vh] relative mb-16">
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent z-10" />
            <img 
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="max-w-3xl mx-auto px-6 pb-20">
            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-2xl md:text-3xl font-bold text-[#D4FF99] mt-12 mb-6">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl md:text-2xl font-bold text-white mt-8 mb-4">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-300 leading-relaxed mb-6">{children}</p>
                  ),
                  img: ({ src, alt }) => (
                    <div className="my-12">
                      <img 
                        src={src} 
                        alt={alt} 
                        className="rounded-lg w-full"
                      />
                    </div>
                  ),
                  a: ({ children, href }) => (
                    <a 
                      href={href}
                      className="text-[#D4FF99] hover:text-white transition-colors duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-gray-300 mb-6">
                      {children}
                    </ul>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Connect Section */}
          <section className="mt-32">
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
              <div className="bg-zinc-950 p-8 rounded-lg shadow-lg border border-zinc-900">
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
                  <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                    <input type="text" name="b_22d3f967aaa29a31ccd2275a1_7e228c82dc" tabIndex="-1" value="" />
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

export default BlogPost; 