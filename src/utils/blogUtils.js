// Posts live in public/content/blog/*.md (edited in Keystatic).
// index.json is generated from their frontmatter by scripts/build-content-index.js.

let indexPromise;

function loadIndex() {
  if (!indexPromise) {
    indexPromise = fetch('/content/blog/index.json')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch blog posts');
        return r.json();
      })
      .catch((err) => {
        indexPromise = undefined; // allow a retry on the next call
        throw err;
      });
  }
  return indexPromise;
}

export async function getSortedPosts() {
  try {
    const posts = await loadIndex();
    return [...posts].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug) {
  try {
    const [posts, response] = await Promise.all([loadIndex(), fetch(`/content/blog/${encodeURIComponent(slug)}.md`)]);
    const meta = posts.find((p) => p.slug === slug);
    if (!meta || !response.ok) return null; // unpublished or missing

    const raw = await response.text();
    if (raw.trimStart().startsWith('<!DOCTYPE')) return null; // SPA fallback served instead of a post
    const content = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').trim();
    return { ...meta, content };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}
