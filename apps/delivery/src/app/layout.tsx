import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coconea Repartidor — Entregas y Rutas',
  description: 'Aplicación web para repartidores de Coconea.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
