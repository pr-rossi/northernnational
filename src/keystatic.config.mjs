// Keystatic content model. Edit content visually at /keystatic.
// Shared by the browser (admin UI) and the dev server (src/setupProxy.js), so keep this file plain ESM, no JSX.
import { config, fields, collection, singleton } from '@keystatic/core';

// Keystatic Cloud project, e.g. "northern-national/website". Set it in Vercel to turn on editing on the live site.
const cloudProject = process.env.REACT_APP_KEYSTATIC_CLOUD_PROJECT;
// Locally you edit files directly; set REACT_APP_KEYSTATIC_STORAGE=cloud to try the cloud flow from `npm start`.
const useCloud =
  Boolean(cloudProject) &&
  (process.env.NODE_ENV !== 'development' || process.env.REACT_APP_KEYSTATIC_STORAGE === 'cloud');

export const storage = useCloud
  ? { kind: 'cloud' } // edits on the live site, committed to GitHub through Keystatic Cloud
  : { kind: 'local' }; // writes straight to the files in this repo (dev server only)

export default config({
  storage,
  ...(storage.kind === 'cloud' ? { cloud: { project: cloudProject } } : {}),
  ui: {
    brand: { name: 'Northern National' },
    navigation: {
      Site: ['home'],
      Content: ['shows', 'posts'],
    },
  },

  singletons: {
    home: singleton({
      label: 'Homepage',
      path: 'src/content/home',
      format: { data: 'json' },
      schema: {
        hero: fields.object(
          {
            image: fields.image({
              label: 'Hero photo',
              description: 'Shown in black and white behind the band name.',
              directory: 'public/images/site',
              publicPath: '/images/site/',
              validation: { isRequired: true },
            }),
            imageAlt: fields.text({ label: 'Hero photo description (for screen readers)' }),
            tags: fields.array(fields.text({ label: 'Tag' }), {
              label: 'Tags above the band name',
              itemLabel: (p) => p.value,
            }),
            sticker: fields.text({ label: 'Red sticker text', description: 'Desktop only. Leave empty to hide it.' }),
          },
          { label: 'Hero' }
        ),
        ticker: fields.array(fields.text({ label: 'Announcement' }), {
          label: 'Red ticker',
          itemLabel: (p) => p.value,
        }),
        latest: fields.object(
          {
            title: fields.text({ label: 'Song title', validation: { isRequired: true } }),
            released: fields.date({ label: 'Release date', validation: { isRequired: true } }),
            cover: fields.image({
              label: 'Cover art',
              directory: 'public/images/site',
              publicPath: '/images/site/',
              validation: { isRequired: true },
            }),
            coverAlt: fields.text({ label: 'Cover art description (for screen readers)' }),
            spotifyUrl: fields.url({ label: 'Spotify link', validation: { isRequired: true } }),
            lyric: fields.text({ label: 'Lyric to quote', description: 'One line per row.', multiline: true }),
            lyricCredit: fields.text({ label: 'Lyric label', description: 'For example "Verse one".' }),
            story: fields.relationship({ label: 'Blog post about the song', collection: 'posts' }),
          },
          { label: 'Latest release' }
        ),
        about: fields.object(
          {
            heading: fields.text({ label: 'Heading' }),
            highlight: fields.text({ label: 'Red part of the heading', description: 'Shown in red after the heading.' }),
            body: fields.text({ label: 'Paragraph', multiline: true }),
            livePhoto: fields.image({ label: 'Big live photo', directory: 'public/images/site', publicPath: '/images/site/' }),
            livePhotoAlt: fields.text({ label: 'Live photo description' }),
          },
          { label: 'About' }
        ),
        members: fields.array(
          fields.object({
            name: fields.text({ label: 'Name', validation: { isRequired: true } }),
            role: fields.text({ label: 'Role', description: 'For example "Guitar, vox".' }),
            photo: fields.image({ label: 'Photo', directory: 'public/images/site', publicPath: '/images/site/' }),
            photoAlt: fields.text({ label: 'Photo description' }),
            focus: fields.select({
              label: 'Crop focus',
              options: [
                { label: 'Center', value: 'center' },
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
              ],
              defaultValue: 'center',
            }),
          }),
          { label: 'Band members', itemLabel: (p) => `${p.fields.name.value}${p.fields.role.value ? ` · ${p.fields.role.value}` : ''}` }
        ),
      },
    }),
  },

  collections: {
    shows: collection({
      label: 'Shows',
      path: 'src/content/shows/*',
      slugField: 'name',
      format: { data: 'json' },
      columns: ['date', 'venue'],
      schema: {
        name: fields.slug({ name: { label: 'Show name', description: 'Only used in this list, e.g. "Dallas, Mar 14".' } }),
        date: fields.date({ label: 'Date', validation: { isRequired: true } }),
        city: fields.text({ label: 'City', validation: { isRequired: true } }),
        region: fields.text({ label: 'State or country', description: 'For example "TX".' }),
        venue: fields.text({ label: 'Venue', validation: { isRequired: true } }),
        ticketUrl: fields.url({ label: 'Ticket link' }),
        soldOut: fields.checkbox({ label: 'Sold out', defaultValue: false }),
      },
    }),

    posts: collection({
      label: 'News posts',
      path: 'public/content/blog/*',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['date', 'published'],
      schema: {
        title: fields.slug({ name: { label: 'Title', validation: { isRequired: true } } }),
        date: fields.date({ label: 'Date', validation: { isRequired: true } }),
        published: fields.checkbox({ label: 'Published', description: 'Untick to hide this post from the site.', defaultValue: true }),
        coverImage: fields.image({
          label: 'Cover image',
          directory: 'public/images/blog',
          publicPath: '/images/blog/',
        }),
        excerpt: fields.text({ label: 'Summary', description: 'One or two sentences for the news list.', multiline: true }),
        content: fields.markdoc({
          label: 'Post',
          extension: 'md',
          options: {
            image: { directory: 'public/images/blog', publicPath: '/images/blog/' },
          },
        }),
      },
    }),
  },
});
