'use server';
import { marked } from 'marked';
import MarkdownClient from './mdfile.client';

import '@/app/md.css';

export default async function MdHtml({ content }: { content: string }) {
  const rawHtml = await marked.parse(content); // Run on server
  return <MarkdownClient html={rawHtml} />;    // Render/sanitize on client
}