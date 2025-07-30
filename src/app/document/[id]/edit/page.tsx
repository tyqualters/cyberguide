import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import Editor from './edit';

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params;
    return (
        <>
            <Header />
            <main>
                <h1 className="text-2xl font-bold mb-4">Markdown Editor</h1>
                <Editor docId={id} />
            </main>
            <Footer />
        </>
    );
}
