"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Car } from "lucide-react";

const loginSchema = z.object({
	username: z.string().min(1, { message: "Username is required" }),
	password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const onSubmit = (data: LoginFormValues) => {
		setLoading(true);
		if (data.username === "abhishek_m" && data.password === "Abhi@571") {
			if (typeof window !== "undefined") {
				localStorage.setItem("isAuthenticated", "true");
			}
			toast({
				title: "Login Successful",
				description: "Welcome to Wheels Web!",
			});
			router.replace("/dashboard");
		} else {
			toast({
				variant: "destructive",
				title: "Login Failed",
				description: "Invalid username or password.",
			});
			setLoading(false);
		}
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
			<Card className="w-full max-w-sm shadow-2xl">
				<CardHeader className="text-center">
					<div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full mb-4 w-fit">
						<Car className="h-8 w-8" />
					</div>
					<CardTitle className="text-3xl font-bold text-primary">
						Wheels Web
					</CardTitle>
					<CardDescription>
						Enter your credentials to access your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input placeholder="Username" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								className="w-full"
								disabled={loading}
								style={{ backgroundColor: "#90EE90", color: "#006400" }}
							>
								{loading ? "Signing In..." : "Sign In"}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</main>
	);
}
