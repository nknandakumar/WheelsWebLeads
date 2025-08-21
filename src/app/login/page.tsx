import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import dynamic from "next/dynamic";

export const dynamic = "force-dynamic";

const LoginClient = dynamic(() => import("./LoginClient"), { ssr: false });

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect(session.role === "admin" ? "/admin" : "/dashboard");
  }
  return <LoginClient />;
}
