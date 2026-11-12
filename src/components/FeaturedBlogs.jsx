import React from 'react';
import { Arrow } from './ui/Button';
import { formatDate } from './ui/Layout';

// Static list of posts (rendered at build time from the blog content collection).
export default function FeaturedBlogs({ posts = [] }) {
  if (posts.length === 0) {
    return <p className="text-body text-nn-muted">No news yet. New posts show up here first.</p>;
  }

  return (
    <ul className="divide-y divide-nn-line border-y border-nn-line">
      {posts.map((post) => (
        <li key={post.slug}>
          <a
            href={`/blog/${post.slug}`}
            className="group grid grid-cols-[1fr_auto] sm:grid-cols-[140px_1fr_auto] items-center gap-x-6 gap-y-1 py-6
              -mx-4 px-4 rounded-nn transition-colors duration-300 ease-out hover:bg-nn-surface/60
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-action"
          >
            <time dateTime={post.date} className="label text-nn-subtle col-start-1 row-start-1">
              {formatDate(post.date)}
            </time>
            <span className="col-start-1 row-start-2 sm:col-start-2 sm:row-start-1 text-lead md:text-[28px] md:leading-[34px] font-bold [font-stretch:115%] tracking-[-0.02em] text-nn-text line-clamp-2 transition-colors duration-200 group-hover:text-nn-brand">
              {post.title}
            </span>
            {post.coverImage && (
              <span className="relative col-start-2 row-start-1 row-span-2 sm:col-start-3 sm:row-span-1 h-[64px] w-[96px] md:h-[72px] md:w-[128px] overflow-hidden rounded-nn bg-nn-surface">
                <img
                  src={post.coverImage}
                  alt=""
                  loading="lazy"
                  className="photo-bw h-full w-full object-cover transition-[filter] duration-300 group-hover:[filter:none]"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-nn-bg/60 text-nn-text opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Arrow />
                </span>
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
