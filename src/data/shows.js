// Upcoming shows, edited in Keystatic (Shows). Each show is a JSON file in src/content/shows/.
// Past dates drop off automatically; the rest are sorted soonest first.
const ctx = require.context('../content/shows', false, /\.json$/);

const today = new Date().toISOString().slice(0, 10);

const SHOWS = ctx
  .keys()
  .map((key) => ctx(key))
  .filter((s) => s && s.date && s.date >= today)
  .sort((a, b) => a.date.localeCompare(b.date));

export default SHOWS;
