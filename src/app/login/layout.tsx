import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Helios Chrono",
  description: "Sign in to Helios Chrono to save favorites and personalize your observatory.",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-8">
      {children}
    </div>
  );
}
