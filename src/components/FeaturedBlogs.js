import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSortedPosts } from '../utils/blogUtils';

function FeaturedBlogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getSortedPosts();
        setPosts(allPosts.slice(0, 3));
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-400">Failed to load blog posts</div>;
  }

  if (!posts.length) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link 
            key={post.slug} 
            to={`/blog/${post.slug}`}
            className="group"
          >
            <div className="bg-black rounded-lg overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-400 mb-2">{post.date}</p>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D4FF99] transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-300 line-clamp-2">{post.excerpt}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link 
        to="/blog" 
        className="text-[#D4FF99] hover:text-white transition-colors mt-8 inline-block"
      >
        View all posts →
      </Link>
    </>
  );
}

export default FeaturedBlogs; 