// Import all blog posts using Webpack's require.context
const importAll = (r) => {
  const posts = {};
  r.keys().forEach((fileName) => {
    const slug = fileName.replace(/^\.\//, '').replace(/\.md$/, '');
    posts[slug] = r(fileName);
  });
  return posts;
};

// Import all .md files from the content/posts directory
const postFiles = require.context('../../content/posts', false, /\.md$/);
const posts = importAll(postFiles);

export function getAllPosts() {
  return Object.keys(posts)
    .map((slug) => ({
      slug,
      ...posts[slug].metadata,
      content: posts[slug].default
    }))
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
}

export function getPostBySlug(slug) {
  const post = posts[slug];
  if (!post) return null;
  
  return {
    slug,
    ...post.metadata,
    content: post.default
  };
} 