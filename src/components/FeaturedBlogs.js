import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { getSortedPosts } from '../utils/blogUtils';

function FeaturedBlogs({ limit = 3 }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getSortedPosts().then(allPosts => {
      setPosts(allPosts.slice(0, limit));
    });
  }, [limit]);

  return (
    <>
      {posts.map((post, index) => (
        <Link 
          key={post.slug}
          to={`/blog/${post.slug}`}
          className="group block"
        >
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.1
            }}
            className="relative overflow-hidden"
          >
            <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4">
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
              
              <h3 className="text-xl font-bold text-white group-hover:text-[#D4FF99] transition-colors duration-300">
                {post.title}
              </h3>
              
              <p className="text-gray-400 line-clamp-2">
                {post.excerpt}
              </p>

              <div className="inline-flex items-center space-x-2 text-[#D4FF99] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>READ MORE</span>
                <ArrowUpRight size={20} />
              </div>
            </div>
          </motion.article>
        </Link>
      ))}
    </>
  );
}

export default FeaturedBlogs; 