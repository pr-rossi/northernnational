import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPostBySlug } from '../utils/blogUtils';
import Markdown from 'react-markdown';
import PageTransition from '../components/PageTransition';

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPostBySlug(slug)
      .then(post => {
        setPost(post);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-[#D4FF99]">Loading...</div>
    </div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-zinc-950">
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
              <Markdown>{post.content}</Markdown>
            </div>
          </article>
        </div>
      </div>
    </PageTransition>
  );
}

export default BlogPost; 