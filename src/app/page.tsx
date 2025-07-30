import { Metadata } from "next";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { GetDocList } from "@/actions/docs";
import SanitizeElements from "@/app/components/sanitize.client";
import { verifySession } from "@/lib/dal";
import { BsFileEarmarkTextFill } from "react-icons/bs";

export const metadata: Metadata = {
  title: "CyberGuide",
  description: "A reference and study guide for Cybersecurity",
};

export default async function Home() {
  const session = await verifySession();
  const docs = await GetDocList();

  return (
    <>
      <Header>
        <hgroup className="text-center p-4">
          <h1 className="text-3xl">CyberGuide</h1>
          <h3 className="text-xl">A reference and study guide for Cybersecurity</h3>
        </hgroup>
      </Header>
      <main>
        <section id="table-of-contents" className="p-4 max-w-3xl mx-auto border-l-2 border-black">
          <div id="table-of-contents-categorized" className="mb-4">
            <h2 className="text-2xl mb-2">Categorized Items</h2>
          </div>
          <div id="table-of-contents-uncategorized" className="mb-4">
            <h2 className="text-2xl mb-2">Uncategorized Items</h2>
            <ul className="list-disc pl-5">
              {docs.map((doc) => (
                <li key={doc._id}>
                  <a href={`/document/${doc._id}`} className="text-blue-600 hover:underline">
                    {<SanitizeElements html={doc.title} />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
        {session.isAuth && (
            <div className="text-center mt-4">
              <a href="/document/new" className="text-blue-600 hover:underline">
                <span className="inline-flex items-center">
                  <BsFileEarmarkTextFill className="inline align-text-top mr-2" />
                  Create New Document
                </span>
              </a>
            </div>
          )}
      </main>
      <Footer />
    </>
  );
}
