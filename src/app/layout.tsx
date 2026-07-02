import type { Metadata } from "next";
import "@/app/global.css";

export const metadata: Metadata = {
  title: "Barber Tech",
  description: "Tu mejor versión comienza aquí. Reserva tu cita en la mejor barbería de la ciudad.",
  icons:{
    icon:"/Recurso 1.png",

  },
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