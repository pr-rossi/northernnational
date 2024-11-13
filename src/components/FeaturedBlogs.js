import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getAllPosts } from '../utils/mdx';

function FeaturedBlogs() {
  const posts = getAllPosts().slice(0, 3); // Get only the 3 most recent posts

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map(post => (
          <Link 
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group"
          >
            <article className="bg-zinc-950 rounded-lg overflow-hidden transition-transform hover:scale-105">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <time className="text-sm text-gray-400">
                  {format(new Date(post.date), 'MMMM d, yyyy')}
                </time>
                <h3 className="text-xl font-bold text-white mt-2 group-hover:text-[#D4FF99]">
                  {post.title}
                </h3>
                <p className="text-gray-400 mt-2 line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link 
          to="/blog"
          className="inline-block px-6 py-2 bg-[#D4FF99] hover:bg-[#bfe589] text-black font-medium rounded transition duration-300"
        >
          VIEW ALL POSTS
        </Link>
      </div>
    </>
  );
}

export default FeaturedBlogs; 