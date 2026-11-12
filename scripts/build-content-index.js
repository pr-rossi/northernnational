// Builds public/content/blog/index.json from the post files (the news list reads it).
// Runs before `npm start` and `npm run build`, and on every save while the dev server is running.
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const DIR = path.join(__dirname, '..', 'public', 'content', 'blog');

function readFrontmatter(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  try {
    return yaml.load(m[1], { schema: yaml.JSON_SCHEMA }) || {};
  } catch (err) {
    console.warn(`content: skipped ${path.basename(file)} (bad frontmatter: ${err.reason})`);
    return null;
  }
}

function buildIndex() {
  const posts = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const fm = readFrontmatter(path.join(DIR, f));
      if (!fm || fm.published === false) return null;
      return {
        slug: f.replace(/\.md$/, ''),
        title: String(fm.title || ''),
        date: String(fm.date || ''),
        coverImage: fm.coverImage ? String(fm.coverImage) : '',
        excerpt: fm.excerpt ? String(fm.excerpt).trim() : '',
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.date.localeCompare(a.date));

  const out = path.join(DIR, 'index.json');
  const next = JSON.stringify(posts, null, 2) + '\n';
  if (!fs.existsSync(out) || fs.readFileSync(out, 'utf8') !== next) fs.writeFileSync(out, next);
  return posts;
}

module.exports = { buildIndex, BLOG_DIR: DIR };

if (require.main === module) {
  const posts = buildIndex();
  console.log(`content: indexed ${posts.length} published post(s)`);
}
