"use client";
import React, { useState } from 'react';
import Sidebar from '@/frontend/components/sidebar/sidebar_admin'; 
import type { AdminView } from '@/frontend/types/types_admin';

// Importamos las vistas
import ViewInicio from '@/frontend/modules/admin/components/ViewInicio';
import ViewClientes from '@/frontend/modules/admin/components/ViewClientes';
import ViewBarberos from '@/frontend/modules/admin/components/ViewBarberos';
import ViewBarberias from '@/frontend/modules/admin/components/viewBarberias';
import ViewServicios from '@/frontend/modules/admin/components/ViewServicios';

export default function AdminLayout() {
  const [activeView, setActiveView] = useState<AdminView>('Inicio');

  const renderView = () => {
    switch (activeView) {
      case 'Inicio': return <ViewInicio />;
      case 'Clientes': return <ViewClientes />;
      case 'Barberos': return <ViewBarberos />;
      case 'Barberías': return <ViewBarberias />;
      case 'Servicios': return <ViewServicios/>;
      default: return <ViewInicio />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 overflow-hidden">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
}