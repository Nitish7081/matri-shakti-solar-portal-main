import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, Sun } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Portal Login — Matri Shakti Infrastructure" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoginError("");
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      // Save user session in localStorage as backup
      if (data.admin) {
        localStorage.setItem("admin_user", JSON.stringify(data.admin));
      }
      if (data.token) {
        localStorage.setItem("admin_token", data.token);
      }

      toast.success("Welcome back! Logged in successfully.");
      navigate({ to: "/admin" });
    } catch (err) {
      const msg = (err as Error).message || "Login failed. Please try again.";
      setLoginError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
      {/* Background radial gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Main Website
          </Link>

          <div className="mt-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-sun shadow-glow">
              <Sun className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="mt-3 font-display text-2xl font-extrabold text-foreground">
            Matri Shakti Portal
          </h1>
          <p className="text-sm text-muted-foreground">
            Admin Lead Management & Verification System
          </p>
        </div>

        <Card className="border-border/60 bg-card/95 shadow-card backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Admin Sign In</CardTitle>
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <ShieldCheck className="h-3.5 w-3.5" /> Secure
              </span>
            </div>
            <CardDescription className="text-xs">
              Enter your authorized administrative credentials
            </CardDescription>
          </CardHeader>

          <CardContent>
            {loginError && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive">
                {loginError}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Admin Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="admin@matrishakti.com"
                            className="pl-9 text-sm"
                            autoComplete="email"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-9 pr-10 text-sm"
                            autoComplete="current-password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign In to Dashboard"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Protected administrative system. Unauthorized access attempts are monitored and logged.
        </p>
      </div>
    </div>
  );
}
