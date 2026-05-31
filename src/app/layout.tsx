import type { Metadata } from "next";
import "@/app/global.css";

// Puedes modificar estos textos a tu gusto para mejorar el SEO
export const metadata: Metadata = {
  title: "BarberTech | Estilo y Personalidad",
  description: "Tu mejor versión comienza aquí. Reserva tu cita en la mejor barbería de la ciudad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning evita errores en consola cuando el 
    // modo oscuro (cliente) modifica las clases de esta etiqueta
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased bg-slate-50 dark:bg-[#0a0a0f] text-slate-900 dark:text-slate-100 transition-colors duration-500">
        {children}
      </body>
    </html>
  );
}