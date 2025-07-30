'use client';

import createDOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

export default function MarkdownClient({ html }: { html: string }) {
  const [cleanHtml, setCleanHtml] = useState('');

  useEffect(() => {
    const DOMPurify = createDOMPurify(window);
    const clean = DOMPurify.sanitize(html);
    setCleanHtml(clean);
  }, [html]);

  return (
    <div
      className="markdown"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
