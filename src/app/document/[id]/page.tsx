import { GetDoc } from '@/actions/docs';
import Footer from '@/app/components/footer';
import Header from '@/app/components/header';
import MdFile from '@/app/components/mdfile';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { verifySession } from '@/lib/dal';
import { BsPencilFill } from 'react-icons/bs';

interface PageProps {
    params: { id: string };
}

export async function generateMetadata(
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    await params;
    const doc = await GetDoc((await params).id);

    if (!doc || typeof doc === 'string') {
        return {
            title: 'Document Not Found',
            description: 'The requested document does not exist.',
            keywords: [],
        };
    }

    return {
        title: doc.title,
        description: doc.content.slice(0, 150), // first 150 chars as description
        keywords: doc.tags && Array.isArray(doc.tags) ? doc.tags : [],
        openGraph: {
            title: doc.title,
            description: doc.content.slice(0, 150),
            keywords: doc.tags && Array.isArray(doc.tags) ? doc.tags : [],
        },
    };
}

export default async function Page({ params }: PageProps) {
    await params;
    const doc = await GetDoc((await params).id);

    if (!doc) {
        notFound();
    }

    const session = await verifySession();

    return (
        <>
            <Header />
            <main>
                <section className="p-8">
                    <MdFile content={(typeof doc == "string" ? doc : doc.content)} />
                </section>
                {session.isAuth && doc && doc.author && String(session.userId) === doc.author.toString() as string ? (
                    <div className="text-center mt-4">
                        <a href={`/document/${doc._id}/edit`} className="text-blue-600 hover:underline">
                            <BsPencilFill className="inline align-text-top" /> Edit Document
                        </a>
                    </div>
                ) : null}
                <section className="p-4 mt-2">
                    <p>Created at {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'Unknown'} (Last updated {doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString() : 'Unknown'})</p>
                </section>
            </main>
            <Footer />
        </>
    );
}