import LoginForm from "./login";
import { _verifySession as getSession } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <>
      <LoginForm />
    </>
  );
}