'use client';

import createDOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

export default function SanitizeElement({ html }: { html: string }) {
    const [cleanHtml, setCleanHtml] = useState('');

    useEffect(() => {
        const DOMPurify = createDOMPurify(window);
        const clean = DOMPurify.sanitize(html);
        setCleanHtml(clean);
    }, [html]);

    return (
        <span
            className="inline"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
    );
}