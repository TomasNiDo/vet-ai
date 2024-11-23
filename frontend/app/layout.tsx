import { LayoutProvider } from '@/contexts/layout-context';
import { ClientLayout } from '@/components/client-layout';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutProvider>
          <ClientLayout>{children}</ClientLayout>
        </LayoutProvider>
      </body>
    </html>
  );
}

