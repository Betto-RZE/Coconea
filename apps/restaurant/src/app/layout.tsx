import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Coconea Restaurante — Panel de Operaciones y Cocina',
  description: 'Panel de control y monitor de cocina para restaurantes aliados de Coconea.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={plusJakartaSans.variable}>
      <body className="min-h-screen bg-cream text-coffee font-sans antialiased selection:bg-caramel/20 selection:text-espresso relative">
        {/* Fondo Papel Tapiz Global Coconea en diagonal */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.18] bg-repeat"
          style={{
            backgroundImage: "url('/images/coconea-wallpaper-diagonal.png')",
            backgroundSize: '150px 150px',
            backgroundPosition: '0 0',
          }}
          aria-hidden="true"
        />

        {/* Contenedor Principal de la Aplicación */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
