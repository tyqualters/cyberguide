'use server';

import { DocSchema } from '@/lib/definitions';
import Doc from '@/models/doc';
import { verifySession, isValid24ByteHex, isAdmin } from '@/lib/dal';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import connectDB from '@/lib/mongo';

async function CreateDoc({ title, content, tags }: { title: string, content: string, tags?: string }): Promise<string | string[] | undefined> {
  const session = await verifySession();
  if (!session) {
    return 'You must be logged in to create a document.';
  }

  if (typeof title !== 'string' || typeof content !== 'string') {
    return 'Invalid input: title and content must be strings.';
  }

  if (!title.trim() || !content.trim()) {
    return 'Title and content are required to create a document.';
  }

  const validatedFields = DocSchema.safeParse({
    title: title,
    content: content,
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    author: session.userId,
  });

  if (!validatedFields.success) {
    return 'Failed to validate document fields: ' + z.treeifyError(validatedFields.error);
  }

  try {
    await connectDB();
    const doc = new Doc(validatedFields.data);
    await doc.save();
    return `/document/${doc._id}`;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      console.error('Error creating document:', (error as { message: string }).message);
    }
    return 'Failed to create document. Please try again.';
  }
}

async function GetDoc(docId: string): Promise<JSON | string | null> {
  if (!isValid24ByteHex(docId)) {
    return 'Invalid document ID format.';
  }
  try {
    await connectDB();
    const doc = await Doc.findById(docId).lean();
    if (!doc) {
      return null;
    }
    return JSON.parse(JSON.stringify(doc));
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      console.error('Error fetching document:', error);
    }
    return 'Failed to fetch document. Please try again.';
  }
}

async function GetDocList() {
  try {
    await connectDB();
    const docs = await Doc.find().sort({ createdAt: -1 }); // newest first
    return docs;
  } catch (err) {
    console.error('Failed to fetch docs:', err);
    return [];
  }
}

async function DeleteDoc(docId: string): Promise<string> {
  if (!isValid24ByteHex(docId)) {
    return 'Invalid document ID format.';
  }

  const session = await verifySession();
  if (!session) {
    return 'You must be logged in to delete a document.';
  }

  try {
    await connectDB();

    const doc = await Doc.findById(docId);
    if (!doc) {
      return 'Document not found.';
    }

    if (doc.author.toString() !== session.userId && !await isAdmin(String(session.userId))) {
      return 'You do not have permission to delete this document.';
    }

    await Doc.deleteOne({ _id: docId });

    // Optionally redirect after deletion
    // redirect('/'); // Uncomment if you want immediate redirect

    return '/'; // Success response could be the redirect path
  } catch (error: unknown) {
    console.error('Error deleting document:', error);
    return 'Failed to delete document. Please try again.';
  }
}

async function UpdateDoc({
  id,
  title,
  content,
  tags,
}: {
  id: string;
  title: string;
  content: string;
  tags?: string;
}): Promise<string | string[] | undefined> {
  if (!isValid24ByteHex(id)) {
    return 'Invalid document ID format.';
  }

  const session = await verifySession();
  if (!session) {
    return 'You must be logged in to update a document.';
  }

  if (typeof title !== 'string' || typeof content !== 'string') {
    return 'Invalid input: title and content must be strings.';
  }

  if (!title.trim() || !content.trim()) {
    return 'Title and content are required.';
  }

  const validatedFields = DocSchema.safeParse({
    title: title,
    content: content,
    tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
    author: session.userId,
  });

  if (!validatedFields.success) {
    return 'Failed to validate document fields: ' + z.treeifyError(validatedFields.error);
  }

  try {
    await connectDB();
    const doc = await Doc.findById(id);

    if (!doc) {
      return 'Document not found.';
    }

    if (doc.author.toString() !== session.userId && !await isAdmin(String(session.userId))) {
      return 'You are not authorized to update this document.';
    }

    doc.title = validatedFields.data.title;
    doc.content = validatedFields.data.content;
    doc.tags = validatedFields.data.tags;
    doc.updatedAt = new Date();

    await doc.save();
    return `/document/${doc._id}`;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      console.error('Error updating document:', (error as { message: string }).message);
    }
    return 'Failed to update document. Please try again.';
  }
}

export {
  CreateDoc,
  GetDoc,
  GetDocList,
  UpdateDoc,
  DeleteDoc,
};
