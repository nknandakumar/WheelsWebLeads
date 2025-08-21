import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center bg-gradient-to-b from-white to-slate-50 p-6">
      <div className="text-center max-w-xl">
        <p className="text-sm tracking-widest text-primary font-semibold mb-3">ERROR 404</p>
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-4 text-slate-600">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/dashboard" prefetch>
            <Button className="inline-flex items-center gap-2 bg-black hover:bg-slate-800">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          <Link href="/" prefetch>
            <Button variant="outline" className="inline-flex items-center gap-2">
              <Home className="h-4 w-4" /> Go Home
            </Button>
          </Link>
        </div>

        <div className="mt-10 text-xs text-slate-400">
          If you believe this is a mistake, please check the URL or try again later.
        </div>
      </div>
    </main>
  );
}
