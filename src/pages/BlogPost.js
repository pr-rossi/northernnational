import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { getPostBySlug } from '../utils/blogUtils';
import PageTransition from '../components/PageTransition';
import ReactMarkdown from 'react-markdown';

function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    getPostBySlug(slug).then(setPost);
  }, [slug]);

  if (!post) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-zinc-950">
        <button
          onClick={() => navigate(-1)}
          className="fixed top-8 right-8 z-50 p-2 rounded-full bg-black/50 backdrop-blur-sm 
                     text-white hover:text-[#D4FF99] transition-colors duration-200"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="max-w-4xl mx-auto py-20 px-6">
          <article>
            <div className="mb-12">
              <p className="text-sm text-gray-400 mb-2">{post.date}</p>
              <h1 className="text-4xl font-bold text-[#D4FF99] mb-6">{post.title}</h1>
              <div className="aspect-video relative overflow-hidden rounded-lg mb-8">
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </article>
        </div>
      </div>
    </PageTransition>
  );
}

export default BlogPost; 