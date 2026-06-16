'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// IMPORTACIONES (Ajusta las rutas según tu nueva estructura en Next.js)
import BarberoLayout from '@/frontend/layouts/layout_barbero'; 
import ViewInicio from '@/frontend/modules/barbero/components/ViewInicio';
import ViewCitas from '@/frontend/modules/barbero/components/ViewCitas';
import ViewAjustes from '@/frontend/modules/barbero/components/ViewAjustes';
import ViewHistorial from '@/frontend/modules/barbero/components/ViewHistorial';
import ViewCanceladas from '@/frontend/modules/barbero/components/ViewCanceladas';
import type { BarberoView } from '@/frontend/types/types_barbero';

export default function DashboardBarbero() {
  const [activeView, setActiveView] = useState<BarberoView>('Inicio');

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="h-full"
        >
          {(() => {
            switch (activeView) {
              case 'Inicio': 
                return <ViewInicio onViewChange={setActiveView} />;
              case 'Citas': 
              case 'Agenda':
                return <ViewCitas />;
              case 'Historial':
                return <ViewHistorial />;
              case 'Canceladas':
                return <ViewCanceladas />;
              case 'Ajustes': 
                return <ViewAjustes />;
              case 'Clientes':
                return <PlaceholderView icon="👥" title="Módulo de Clientes" />;
              default:
                return <ViewInicio onViewChange={setActiveView} />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <BarberoLayout activeView={activeView} onViewChange={setActiveView}>
      {renderContent()}
    </BarberoLayout>
  );
}

const PlaceholderView: React.FC<{ icon: string; title: string }> = ({ icon, title }) => (
  <div className="flex flex-col items-center justify-center h-[70vh] text-center">
    <div className="w-24 h-24 bg-primary/10 dark:bg-white/5 rounded-[32px] flex items-center justify-center border border-primary/20 dark:border-white/10 shadow-2xl mb-6">
      <span className="text-5xl">{icon}</span>
    </div>
    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto italic">
      Estamos preparando esta sección para mejorar tu flujo de trabajo.
    </p>
  </div>
);