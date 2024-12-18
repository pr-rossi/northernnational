import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSortedPosts } from '../utils/blogUtils';
import PageTransition from '../components/PageTransition';
import { useLenis } from '@studio-freight/react-lenis';

function Blog() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const lenis = useLenis();

  useEffect(() => {
    getSortedPosts().then(setPosts);
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [lenis]);

  return (
    <PageTransition>
      <div className="pt-48 pb-32 min-h-screen bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-[#D4FF99] mb-12">BLOG</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {posts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <Link 
                  to={`/blog/${post.slug}`}
                  className="block group"
                >
                  <div className="aspect-[16/9] overflow-hidden rounded-lg mb-6">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400 tracking-wider">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    
                    <h2 className="text-2xl font-bold text-white group-hover:text-[#D4FF99] transition-colors duration-200">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-400 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Blog; 