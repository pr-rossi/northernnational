import React from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen bg-black animate-pulse">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <article className="max-w-4xl mx-auto py-20 px-6">
        <img 
          src={post.coverImage} 
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
        />
        
        <time className="text-sm text-gray-400">
          {format(new Date(post.date), 'MMMM d, yyyy')}
        </time>
        
        <h1 className="text-4xl font-bold text-[#D4FF99] mt-4 mb-8">
          {post.title}
        </h1>

        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}

export default BlogPost; 