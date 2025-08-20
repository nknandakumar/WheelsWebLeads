import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AppLayout from "@/components/app-layout";

export const metadata: Metadata = {
	title: "Wheels Web",
	description: "Lead Management System",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Cedarville+Cursive&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Libertinus+Mono&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="font-body antialiased" suppressHydrationWarning>
				<AppLayout>
					{children}
				</AppLayout>
				<Toaster />
			</body>
		</html>
	);
}
