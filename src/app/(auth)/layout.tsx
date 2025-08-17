import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - VINDYAA',
  description: 'Student Login Portal',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50">
      {children}
    </div>
  );
}
