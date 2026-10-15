import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Coconea — Planifica tu alimentación, confirma y recibe',
  description:
    'Plataforma de pedidos y planes de alimentación con recomendaciones personalizadas según tus preferencias y restricciones nutricionales.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={plusJakartaSans.variable}>
      <body className="min-h-screen bg-cream text-coffee font-sans antialiased selection:bg-caramel/20 selection:text-espresso">
        {children}
      </body>
    </html>
  );
}

