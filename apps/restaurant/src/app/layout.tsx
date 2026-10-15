import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coconea Restaurante — Panel de Operaciones y Cocina',
  description: 'Panel de control para restaurantes aliados de Coconea.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
