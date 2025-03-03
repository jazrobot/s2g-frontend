import Logo from "@/components/logo";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <header className="absolute left-0 top-0 z-10 flex h-16 items-center px-4 md:px-6">
        <nav>
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>
        </nav>
      </header>
      <main className="w-full max-w-sm">{children}</main>
    </div>
  );
}
