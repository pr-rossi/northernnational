import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSortedPosts } from '../utils/blogUtils';
import { Arrow } from './ui/Button';

function relativeDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}.${d.getFullYear()}`;
}

function FeaturedBlogs({ limit = 3 }) {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    getSortedPosts()
      .then((all) => setPosts(all.slice(0, limit)))
      .catch(() => setPosts([]));
  }, [limit]);

  if (posts === null) {
    return (
      <ul aria-hidden="true" className="divide-y divide-nn-line border-y border-nn-line">
        {Array.from({ length: limit }).map((_, i) => (
          <li key={i} className="flex items-center gap-6 py-6">
            <div className="h-4 w-24 rounded-nn bg-nn-raised animate-pulse" />
            <div className="h-6 flex-1 rounded-nn bg-nn-raised animate-pulse" />
            <div className="hidden sm:block h-[72px] w-[128px] rounded-nn bg-nn-raised animate-pulse" />
          </li>
        ))}
      </ul>
    );
  }

  if (posts.length === 0) {
    return <p className="text-body text-nn-muted">No news yet. New posts show up here first.</p>;
  }

  return (
    <ul className="divide-y divide-nn-line border-y border-nn-line">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            to={`/blog/${post.slug}`}
            className="group grid grid-cols-[1fr_auto] sm:grid-cols-[140px_1fr_auto] items-center gap-x-6 gap-y-1 py-6
              -mx-4 px-4 rounded-nn transition-colors duration-300 ease-out hover:bg-nn-surface/60
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-action"
          >
            <time dateTime={post.date} className="label text-nn-subtle col-start-1 row-start-1">
              {relativeDate(post.date)}
            </time>
            <span className="col-start-1 row-start-2 sm:col-start-2 sm:row-start-1 text-lead md:text-[28px] md:leading-[34px] font-bold [font-stretch:115%] tracking-[-0.02em] text-nn-text line-clamp-2 transition-colors duration-200 group-hover:text-nn-brand">
              {post.title}
            </span>
            <span className="relative col-start-2 row-start-1 row-span-2 sm:col-start-3 sm:row-span-1 h-[64px] w-[96px] md:h-[72px] md:w-[128px] overflow-hidden rounded-nn bg-nn-surface">
              <img src={post.coverImage} alt="" loading="lazy" className="photo-bw h-full w-full object-cover transition-[filter] duration-300 group-hover:[filter:none]" />
              <span className="absolute inset-0 flex items-center justify-center bg-nn-bg/60 text-nn-text opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Arrow />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default FeaturedBlogs;
