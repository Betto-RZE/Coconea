import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
