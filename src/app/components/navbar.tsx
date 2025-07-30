import Link from "next/link";
import { verifySession, isAdmin } from "@/lib/dal";

export default async function NavBar() {

    const session = await verifySession();
    const amIAdmin = (session.isAuth && session.userId) ? await isAdmin(String(session.userId)) : false;

    return (
        <div className="flex items-center justify-between p-4 bg-blue-800 text-white w-full">
            <nav>
                <ul className="flex space-x-4">
                    <li><Link href="/" className="hover:underline">Home</Link></li>
                    {session.isAuth ?
                        (
                            <>
                                <li><Link href="/register" className="hover:underline">Register</Link></li>
                                <li><a href="/logout" className="hover:underline">Logout</a></li>
                            </>
                        )
                        :
                        (
                            <>
                                <li><Link href="/login" className="hover:underline">Login</Link></li>
                            </>
                        )
                    }
                    {amIAdmin && <li><Link href="/admin" className="hover:underline">Admin</Link></li>}
                </ul>
            </nav>
        </div>
    );
}