import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getPostBySlug, getSortedPosts } from '../utils/blogUtils';
import PageTransition from '../components/PageTransition';
import { useLenis } from '@studio-freight/react-lenis';
import Button, { Arrow } from '../components/ui/Button';
import { Container, Label, formatDate } from '../components/ui/Layout';
import '../styles/blog.css';

function BackLink() {
  return (
    <Link
      to="/blog"
      className="label inline-flex items-center gap-2 text-nn-muted hover:text-nn-text transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-text rounded-nn"
    >
      <Arrow className="rotate-180" /> All news
    </Link>
  );
}

const md = {
  h2: ({ children }) => (
    <h2 className="mt-16 mb-6 text-h4 md:text-h3 font-black [font-stretch:120%] uppercase tracking-[-0.02em] text-nn-text">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-10 mb-4 text-lead md:text-h4 font-bold [font-stretch:112%] tracking-[-0.01em] text-nn-text">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-6 text-[18px] leading-[30px] text-nn-muted">{children}</p>,
  img: ({ src, alt }) => <img src={src} alt={alt || ''} loading="lazy" className="my-12 w-full rounded-nn" />,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-nn-text underline decoration-nn-brand decoration-2 underline-offset-4 hover:text-nn-brand transition-colors duration-200"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="mb-6 list-disc pl-6 text-[18px] leading-[30px] text-nn-muted space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="mb-6 list-decimal pl-6 text-[18px] leading-[30px] text-nn-muted space-y-2">{children}</ol>,
};

function BlogPost() {
  const { slug } = useParams();
  const lenis = useLenis();
  const [post, setPost] = useState(undefined); // undefined = loading, null = not found
  const [next, setNext] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, [lenis, slug]);

  useEffect(() => {
    setPost(undefined);
    getPostBySlug(slug).then(setPost);
    getSortedPosts().then((all) => setNext(all.find((p) => p.slug !== slug) || null));
  }, [slug]);

  return (
    <PageTransition>
      <article className="article min-h-screen bg-nn-bg pt-32 md:pt-40 pb-24 md:pb-40">
        <Container>
          <BackLink />
        </Container>

        {post === undefined && (
          <Container className="mt-10" aria-busy="true">
            <div className="h-4 w-24 rounded-nn bg-nn-raised animate-pulse" />
            <div className="mt-6 h-24 w-full max-w-[900px] rounded-nn bg-nn-raised animate-pulse" />
            <div className="mt-12 aspect-[21/9] w-full rounded-nn bg-nn-raised animate-pulse" />
          </Container>
        )}

        {post === null && (
          <Container className="mt-10">
            <h1 className="display text-nn-text text-[48px] md:text-[96px]">Post not found.</h1>
            <p className="mt-6 text-lead text-nn-muted">It may have moved. Everything we've posted is on the news page.</p>
            <div className="mt-8">
              <Button size="lg" to="/blog">
                Read all news <Arrow />
              </Button>
            </div>
          </Container>
        )}

        {post && (
          <>
            <Container className="mt-10">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 bg-nn-brand" aria-hidden="true" />
                <Label as="time" dateTime={post.date}>
                  {formatDate(post.date)}
                </Label>
              </div>
              <h1 className="display mt-6 max-w-[18ch] text-nn-text text-[min(9vw,40px)] md:text-[clamp(48px,5.6vw,88px)] leading-[0.92]">
                {post.title}
              </h1>
              {post.excerpt && <p className="mt-8 max-w-[640px] text-lead text-nn-muted">{post.excerpt}</p>}
            </Container>

            {post.coverImage && (
              <div className="mt-12 md:mt-16 mx-auto max-w-7xl px-5 md:px-6">
                <img
                  src={post.coverImage}
                  alt=""
                  className="w-full max-h-[78vh] aspect-[16/9] object-cover rounded-nn"
                />
              </div>
            )}

            <Container className="mt-16 md:mt-24">
              <div className="mx-auto max-w-[680px]">
                <ReactMarkdown components={md}>{post.content}</ReactMarkdown>
              </div>
            </Container>

            {next && (
              <Container className="mt-24 md:mt-32">
                <Link
                  to={`/blog/${next.slug}`}
                  className="group block border-y border-nn-line py-10 md:py-14
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-text"
                >
                  <Label className="mb-4">Next dispatch</Label>
                  <span className="flex items-end justify-between gap-6">
                    <span className="display text-nn-text text-[28px] md:text-[56px] leading-[0.95] max-w-[20ch] transition-colors duration-200 group-hover:text-nn-brand">
                      {next.title}
                    </span>
                    <Arrow className="h-8 w-8 shrink-0 text-nn-text transition-transform duration-300 group-hover:translate-x-2" />
                  </span>
                </Link>
              </Container>
            )}
          </>
        )}
      </article>
    </PageTransition>
  );
}

export default BlogPost;
