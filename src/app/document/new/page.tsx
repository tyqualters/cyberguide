import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import Editor from './new';

export default function Page() {
    return (
        <>
            <Header />
            <main>
                <h1 className="text-2xl font-bold mb-4">Markdown Editor</h1>
                <Editor />
            </main>
            <Footer />
        </>
    );
}
