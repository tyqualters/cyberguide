'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownEditor from '@/app/components/mdeditor';
import { CreateDoc } from '@/actions/docs';

export default function Editor() {
    const [content, setContent] = useState<string>(
        `# New Document\n\n---\n\n**Start writing your document here!**`
    );
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();



    const handleCreate = () => {
        if (!title.trim() || !content.trim()) {
            alert('Please fill out all fields: title, content.');
            return;
        }

        startTransition(async () => {
            try {
                const res = await CreateDoc({ title, content, tags });
                if(typeof res == "string" && res.startsWith('/document/')) {
                    router.push(res);
                }
            } catch (err) {
                console.error('Error creating document:', err);
                alert('An error occurred while creating the document.');
            }
        });
    };

    const handleDiscard = () => {
        if (confirm('Are you sure you want to discard changes?')) {
            setContent('');
            setTitle('');
            setTags('');
            router.push('/');
        } else {
            console.log('Discard cancelled');
        }
    };

    return (
        <>
            <MarkdownEditor
                value={content}
                onChange={(val) => setContent(val || '')}
                disabled={isPending}
            />

            <input
                type="text"
                placeholder="Document Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="m-2 p-2 border rounded w-full max-w-md disabled:cursor-not-allowed"
                disabled={isPending}
            />

            <input
                type="text"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="m-2 p-2 border rounded w-full max-w-56 disabled:cursor-not-allowed"
                disabled={isPending}
            />

            <br />

            <button
                onClick={handleCreate}
                className="m-2 bg-blue-500 hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={isPending}
            >
                {isPending ? 'Creating...' : 'Create Document'}
            </button>

            <button
                onClick={handleDiscard}
                className="m-2 bg-gray-500 hover:bg-gray-700 cursor-pointer disabled:cursor-not-allowed text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={isPending}
            >
                Discard
            </button>
        </>
    );
}
