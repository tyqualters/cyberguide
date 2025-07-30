import SignupForm from "./register";
import { verifySession as getSession, isAdmin } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await getSession();

  if (!session.isAuth || session.userId !== null && !await isAdmin(String(session.userId))) {
    redirect("/");
  }

  return (
    <>
      <SignupForm />
    </>
  );
}