import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sess = await getSession();
  if (!sess) {
    redirect(`/login?next=/admin`);
  }
  if (sess.role !== "admin") {
    redirect(`/dashboard`);
  }
  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1">{children}</main>
    </div>
  );
}
