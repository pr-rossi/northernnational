import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
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
      <div className="pt-24 pb-16 min-h-screen bg-zinc-950">
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
      </div>
    </PageTransition>
  );
}

export default BlogPost; 