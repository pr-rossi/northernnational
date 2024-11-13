import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

function BlogList() {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-bold text-[#D4FF99] mb-12">Blog</h1>
        
        <div className="grid gap-8">
          {posts.map(post => (
            <Link 
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group"
            >
              <article className="bg-zinc-950 rounded-lg overflow-hidden flex flex-col md:flex-row">
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="w-full md:w-64 h-48 object-cover"
                />
                <div className="p-6">
                  <time className="text-sm text-gray-400">
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                  </time>
                  <h2 className="text-2xl font-bold text-white mt-2 group-hover:text-[#D4FF99]">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 mt-2">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogList; 