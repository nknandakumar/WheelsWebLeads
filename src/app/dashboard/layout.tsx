import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const sess = await getSession();
    if (!sess) {
        redirect(`/login?next=/dashboard`);
    }
    return (
        <div className="min-h-screen bg-white">
            <main className="flex-1">{children}</main>
        </div>
    );
}
