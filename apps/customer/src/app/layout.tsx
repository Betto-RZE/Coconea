import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';

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
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}

