import {defineCollection,z} from 'astro:content';
import {glob} from 'astro/loaders';
export const collections={announcements:defineCollection({
  loader:glob({pattern:'**/*.md',base:'./src/content/announcements'}),
  schema:z.object({title:z.string(),date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),category:z.string(),summary:z.string(),approved:z.boolean()})
})};
