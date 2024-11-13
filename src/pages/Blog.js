import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSortedPosts } from '../utils/blogUtils';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getSortedPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-[#D4FF99]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-4xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-bold text-[#D4FF99] mb-12">Blog</h1>
        <div className="grid grid-cols-1 gap-12">
          {posts.map((post) => (
            <Link 
              key={post.slug} 
              to={`/blog/${post.slug}`}
              className="group"
            >
              <article className="grid md:grid-cols-3 gap-8">
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <img 
                    src={post.coverImage} 
                    alt={post.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-400 mb-2">{post.date}</p>
                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-[#D4FF99] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-300">{post.excerpt}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Blog; 