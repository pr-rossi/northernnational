export async function getSortedPosts() {
  const posts = [];
  
  // Get all markdown files from the content/blog directory
  const markdownFiles = import.meta.glob('../../content/blog/*.md', { as: 'raw' });
  
  for (const path in markdownFiles) {
    const content = await markdownFiles[path]();
    const slug = path.replace('../../content/blog/', '').replace('.md', '');
    
    // Parse frontmatter
    const frontmatter = content.match(/---\n([\s\S]*?)\n---/)[1];
    const metadata = Object.fromEntries(
      frontmatter.split('\n').map(line => {
        const [key, ...value] = line.split(': ');
        return [key, value.join(': ').replace(/^"(.*)"$/, '$1')];
      })
    );
    
    // Get content without frontmatter
    const postContent = content.replace(/---\n[\s\S]*?\n---/, '').trim();
    
    posts.push({
      slug,
      content: postContent,
      ...metadata
    });
  }
  
  // Sort posts by date
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getPostBySlug(slug) {
  const posts = await getSortedPosts();
  return posts.find(post => post.slug === slug);
} 