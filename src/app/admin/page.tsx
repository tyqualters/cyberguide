import { verifySession, isAdmin } from "@/lib/dal";
import { notFound } from "next/navigation";
import { admin_getAllUsers } from "@/actions/auth";
import Header from "../components/header";
import Footer from "../components/footer";
import SanitizeElements from "@/app/components/sanitize.client";

export default async function AdminPage() {
    const session = await verifySession();
    const amIAdmin = (session.isAuth && session.userId) ? await isAdmin(String(session.userId)) : false;

    if (!amIAdmin)
        notFound();
    else {

        const users = await admin_getAllUsers(String(session.userId));

        return (
            <>
                <Header />
                <main>
                    <p>Welcome, admin!</p>
                    <section>
                        <h1 className="text-2xl mb-2">Users</h1>
                        <ul className="list-disc pl-5">
                            {typeof users !== "string" && users.map((usr) => (
                                <li key={String(usr._id)}>
                                    <p>
                                        ID: {String(usr._id)} <br />
                                        Username: {<SanitizeElements html={usr.username} />} <br />
                                        isAdmin: {usr.isAdmin ? 'True' : 'False'}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </section>
                </main>
                <Footer />
            </>);
    }
}