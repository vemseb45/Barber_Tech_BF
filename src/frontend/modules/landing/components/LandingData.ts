import { Variants } from 'framer-motion';

export const servicesData = [
  { img: "/Imagenes/cortecabello.png", title: "Corte de Cabello", desc: "Cortes clasicos y de tendencia.", price: "$25.000", time: "45 min" },
  { img: "/Imagenes/barba.png", title: "Arreglo de Barba", desc: "Perfilado preciso e hidratacion.", price: "$15.000", time: "30 min" },
  { img: "/Imagenes/tratamiento.png", title: "Tratamiento Facial", desc: "Limpieza profunda y masaje.", price: "$20.000", time: "40 min" }
];

export const testimonialsData = [
  { init: "CM", name: "Carlos Mendez", date: "Cliente desde 2022", text: "La mejor barberia de la ciudad." },
  { init: "RG", name: "Roberto Garcia", date: "Cliente frecuente", text: "El servicio de arreglo de barba es otro nivel." },
  { init: "JP", name: "Juan Perez", date: "Cliente nuevo", text: "Moderno, limpio y muy profesional." }
];

export const navLinks = [
  { href: "#inicio", name: "Inicio" },
  { href: "#servicios", name: "Servicios" },
  { href: "#galeria", name: "Galería" },
  { href: "#testimonios", name: "Testimonios" },
  { href: "#contacto", name: "Contacto" }
];

// --- Variantes de Animación ---

export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", bounce: 0.4 } }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

// Estas son las variantes que faltaban:
export const scaleUpVariant: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: "spring", bounce: 0.4 } }
};

export const dropDownVariant: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
};