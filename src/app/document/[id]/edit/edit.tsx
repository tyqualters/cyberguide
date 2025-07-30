'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownEditor from '@/app/components/mdeditor';
import { GetDoc, UpdateDoc, DeleteDoc } from '@/actions/docs';

interface EditorProps {
  docId?: string; // pass this prop for editing existing doc
}

export default function Editor({ docId }: EditorProps) {
  const [content, setContent] = useState<string>(
    `# New Document\n\n---\n\n**Start writing your document here!**`
  );
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [loadingDoc, setLoadingDoc] = useState(false);

  // Load existing doc if docId present
  useEffect(() => {
    if (!docId) return;

    setLoadingDoc(true);
    GetDoc(docId)
      .then((doc) => {
        if (!doc || typeof doc === 'string') {
          throw new Error(typeof doc === 'string' ? doc : 'Document not found');
        }

        setTitle(typeof doc.title === 'string' ? doc.title : '');
        setContent(typeof doc.content === 'string' ? doc.content : '');
        setTags(
          Array.isArray(doc.tags)
            ? doc.tags.filter(t => typeof t === 'string').join(', ')
            : ''
        );
      })
      .catch((e) => {
        console.error('Error loading document:', e);
        alert(e instanceof Error ? e.message : 'Failed to load document');
      })
      .finally(() => {
        setLoadingDoc(false);
      });
  }, [docId]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill out all fields: title, content.');
      return;
    }

    startTransition(async () => {
      try {
        let res;
        if (docId) {
          res = await UpdateDoc({
            id: docId,
            title,
            content,
            tags,
          });
        } else {
          throw new Error('Document ID is required for saving.');
        }

        if (typeof res === 'string' && res.startsWith('/document/')) {
          router.push(res);
        } else {
          alert(typeof res === 'string' ? res : 'Failed to save document');
        }
      } catch (err) {
        console.error('Error saving document:', err);
        alert('An error occurred while saving the document.');
      }
    });
  };

  const handleDiscard = () => {
    if (confirm('Are you sure you want to discard changes?')) {
      setContent('');
      setTitle('');
      setTags('');
      router.push(docId ? `/document/${docId}` : '/');
    }
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    startTransition(async () => {
      const res = await DeleteDoc(docId);
      if (typeof res === 'string' && res.startsWith('/')) {
        router.push(res);
      } else {
        alert(res);
      }
    });
  };

  const disabled = isPending || loadingDoc;

  return (
    <>
      <MarkdownEditor
        value={content}
        onChange={(val) => setContent(val || '')}
        disabled={disabled}
      />

      <input
        type="text"
        placeholder="Document Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="m-2 p-2 border rounded w-full max-w-md disabled:cursor-not-allowed"
        disabled={disabled}
      />

      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="m-2 p-2 border rounded w-full max-w-56 disabled:cursor-not-allowed"
        disabled={disabled}
      />

      <br />

      <button
        onClick={handleSave}
        className="m-2 bg-blue-500 hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={disabled}
      >
        {loadingDoc
          ? 'Loading...'
          : isPending
            ? 'Saving...'
            : docId
              ? 'Save Document'
              : 'Create Document'}
      </button>

      <button
        onClick={handleDiscard}
        className="m-2 bg-gray-500 hover:bg-gray-700 cursor-pointer disabled:cursor-not-allowed text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={disabled}
      >
        Discard
      </button>

      <button
        onClick={handleDelete}
        disabled={isPending}
        className="m-2 bg-red-500 hover:bg-red-700 cursor-pointer disabled:cursor-not-allowed text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isPending ? 'Deleting...' : 'Delete Document'}
      </button>
    </>
  );
}
