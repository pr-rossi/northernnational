export async function getSortedPosts() {
  try {
    // Fetch the blog posts from your content directory
    const response = await fetch('/content/blog/index.json');
    if (!response.ok) throw new Error('Failed to fetch blog posts');
    
    const posts = await response.json();
    
    // Sort posts by date
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug) {
  try {
    // Fetch the specific blog post content
    const response = await fetch(`/content/blog/${slug}.md`);
    if (!response.ok) throw new Error('Failed to fetch blog post');
    
    const content = await response.text();
    
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
    
    return {
      slug,
      content: postContent,
      ...metadata
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
} 