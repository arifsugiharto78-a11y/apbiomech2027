import type { MarkdownInstance } from 'astro';
export const announcements = Object.entries(import.meta.glob<MarkdownInstance<{title:string; date:string; category:string; summary:string; approved:boolean}>>('../content/announcements/*.md', { eager: true }))
  .filter(([, post]) => post.frontmatter.approved)
  .map(([path, post]) => ({ ...post, slug: path.split('/').pop()!.replace('.md', '') }))
  .sort((a,b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
