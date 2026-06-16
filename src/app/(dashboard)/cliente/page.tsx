"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// IMPORTACIÓN DEL LAYOUT Y COMPONENTES
import ClienteLayout from "@/frontend/layouts/Layout_cliente";
import ViewInicioCliente from "@/frontend/modules/cliente/components/ViewInicio"; 
import ViewAgenda from "@/frontend/modules/cliente/components/ViewAgenda";
import ViewPendientes from "@/frontend/modules/cliente/components/ViewPendientes";
import ViewTerminadas from "@/frontend/modules/cliente/components/ViewTerminadas";
import ViewAjustesCliente from "@/frontend/modules/cliente/components/ViewAjustes";

export default function DashboardClientePage() {
  const [activeView, setActiveView] = useState('Inicio');

  return (
    <ClienteLayout 
      activeView={activeView} 
      onViewChange={(view) => setActiveView(view)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
        >
          {/* INICIO */}
          {activeView === 'Inicio' && (
            <ViewInicioCliente onViewChange={setActiveView} />
          )}

          {/* MIS CITAS (compatibilidad) y RESERVAR */}
          {(activeView === 'MisCitas' || activeView === 'Reservar Cita') && (
            <ViewAgenda /> 
          )}

          {/* PENDIENTES */}
          {activeView === 'Citas Pendientes' && (
            <ViewPendientes />
          )}

          {/* TERMINADAS */}
          {activeView === 'Citas Terminadas' && (
            <ViewTerminadas />
          )}

          {/* PERFIL */}
          {activeView === 'Perfil' && (
            <ViewAjustesCliente />
          )}

        </motion.div>
      </AnimatePresence>
    </ClienteLayout>
  );
}