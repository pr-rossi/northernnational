// Upcoming shows, edited in Keystatic (Shows). Each show is a JSON file in src/content/shows/.
// Past dates drop off automatically; the rest are sorted soonest first.
const files = import.meta.glob('../content/shows/*.json', { eager: true, import: 'default' });

const today = new Date().toISOString().slice(0, 10);

const SHOWS = Object.values(files)
  .filter((s) => s && s.date && s.date >= today)
  .sort((a, b) => a.date.localeCompare(b.date));

export default SHOWS;
