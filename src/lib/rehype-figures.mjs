// Markdown -> HTML: a paragraph that only holds an image becomes <figure> with the alt text as its caption.
export default function rehypeFigures() {
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      if (child.type === 'element' && child.tagName === 'p') {
        const kids = child.children.filter((k) => !(k.type === 'text' && !k.value.trim()));
        if (kids.length === 1 && kids[0].type === 'element' && kids[0].tagName === 'img') {
          const img = kids[0];
          const alt = String(img.properties?.alt || '').trim();
          img.properties = { ...img.properties, loading: 'lazy' };
          return {
            type: 'element',
            tagName: 'figure',
            properties: { className: ['post-figure'] },
            children: [
              img,
              ...(alt ? [{ type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: alt }] }] : []),
            ],
          };
        }
      }
      walk(child);
      return child;
    });
  };
  return (tree) => walk(tree);
}
