"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

// --- TIPOS Y DATOS DEL MENÚ ---
type SubMenuItem = {
  id: string;
  label: string;
};

type MenuSection = {
  menuId: string;
  title: string;
  subItems: SubMenuItem[];
};

const MENU_DATA: MenuSection[] = [
  {
    menuId: "inicio",
    title: "Inicio de Sesión",
    subItems: [
      { id: "inicio-sesion", label: "Iniciar Sesión" },
      { id: "registro", label: "Registro" },
      { id: "olvido", label: "Olvido de contraseña" },
    ],
  },
  {
    menuId: "modulo-cliente",
    title: "Módulo Cliente",
    subItems: [
      { id: "cliente", label: "Dashboard Cliente" },
      { id: "asignacion", label: "Reservar Cita" },
      { id: "cierre", label: "Citas Pendientes" },
      { id: "terminadas", label: "Historial de Cortes" }
    ],
  },
  {
    menuId: "modulo-barbero",
    title: "Módulo Barbero",
    subItems: [
      { id: "directorio", label: "Directorio de Clientes" },
      { id: "gestion-citas", label: "Gestión de Reservas" },
      { id: "servicios", label: "Configurar Servicios" },
      { id: "nuevo-cliente", label: "Registrar Nuevo Cliente" },
      { id: "verificacion", label: "Verificación de Asistencia" },
      { id: "atencion", label: "Atención en Barbería" },
      { id: "corte-especial", label: "Programar Servicio Especial" },
      { id: "citas-asignadas", label: "Agenda del Día" },
    ],
  },
  {
    menuId: "modulo-admin",
    title: "Módulo Administrador",
    subItems: [
      { id: "panel-admin", label: "Panel de Control" },
      { id: "control-reservas", label: "Control General de Citas" },
      { id: "evaluacion", label: "Evaluación de Servicio" },
    ],
  },
];

// --- COMPONENTES AUXILIARES DE UI ---
const SectionTitle = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h2
    id={id}
    className="text-2xl font-bold text-slate-800 mb-5 pb-2 border-b-2 border-slate-200 text-center pt-8 first:pt-0"
  >
    {children}
  </h2>
);

const StepBlock = ({ title, children, id }: { title?: string; children: React.ReactNode; id?: string }) => (
  <div id={id} className="mt-6 pb-6 border-b border-dashed border-slate-200 last:border-0">
    {title && <h3 className="text-[1.1rem] font-semibold text-[#8519d2] mb-2.5">{title}</h3>}
    <div className="text-slate-700 mb-3">{children}</div>
  </div>
);

const ImageWrapper = ({ src, alt }: { src: string; alt: string }) => (
  <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-1.5 mt-4 shadow-sm">
    <img src={src} alt={alt} className="w-full h-auto block rounded-lg border border-slate-200/50" />
  </div>
);

// --- COMPONENTE PRINCIPAL ---
export default function ManualUsuarioView() {
  const [openMenu, setOpenMenu] = useState<string | null>("inicio");
  const [activeSection, setActiveSection] = useState<string>("inicio");

  // Maneja la apertura/cierre de los acordeones principales
  const handleMainMenuClick = (menuId: string) => {
    setOpenMenu((prev) => (prev === menuId ? null : menuId));
    setActiveSection(menuId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Maneja el clic en un sub-item y hace scroll hacia la sección específica
  const handleSubItemClick = (menuId: string, targetId: string) => {
    setActiveSection(menuId);
    setOpenMenu(menuId); // Asegura que el menú padre esté abierto

    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 90; // Compensa la altura del header sticky
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - headerOffset,
          behavior: "smooth",
        });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#8519d2]/20 selection:text-[#8519d2]">

      {/* HEADER TIPO NAVBAR */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="text-xl font-bold tracking-wide text-slate-800">
            <span className="text-[#8519d2]">BARBER</span>TECH
          </div>
          <ul className="flex items-center gap-6">
            <li>
              <a
                href="#"
                className="text-sm font-medium text-slate-500 transition-colors hover:text-[#8519d2]"
              >
                Inicio
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="mx-auto my-10 flex max-w-7xl flex-col gap-8 px-5 md:flex-row md:items-start animate-in fade-in duration-500">

        {/* SIDEBAR LATERAL */}
        <aside className="sticky top-[90px] w-full shrink-0 rounded-xl border border-slate-200 bg-white py-5 shadow-sm md:w-[280px]">
          <h3 className="mb-3 border-b border-slate-200 px-5 pb-4 text-[1.1rem] font-semibold text-slate-800">
            Secciones del Manual
          </h3>
          <ul className="flex flex-col">
            {MENU_DATA.map((menu) => {
              const isOpen = openMenu === menu.menuId;
              const isActivePadre = activeSection === menu.menuId;

              return (
                <li key={menu.menuId} className="flex flex-col">
                  {/* Botón Cabecera del Menú */}
                  <button
                    type="button"
                    onClick={() => handleMainMenuClick(menu.menuId)}
                    className={`flex w-full items-center justify-between px-5 py-3 text-sm font-medium transition-colors hover:bg-slate-50 hover:text-[#8519d2] ${isActivePadre
                        ? "border-l-4 border-[#8519d2] text-[#8519d2] bg-slate-50/50"
                        : "border-l-4 border-transparent text-slate-600"
                      }`}
                  >
                    {menu.title}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                    />
                  </button>

                  {/* Submenú desplegable */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    <ul className="flex flex-col bg-slate-50/50 py-1">
                      {menu.subItems.map((sub) => (
                        <li key={sub.id}>
                          <button
                            type="button"
                            onClick={() => handleSubItemClick(menu.menuId, sub.id)}
                            className="flex w-full px-5 py-2.5 pl-10 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 text-left"
                          >
                            {sub.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* ÁREA DE CONTENIDO */}
        <main className="flex-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 md:p-10 scroll-pro">

          <section className="mb-10 text-center">
            <h1 className="mb-3 text-3xl font-black text-slate-800">Manual Oficial del Software</h1>
            <p className="text-slate-500">
              Haga clic en cada sección del menú lateral para ver los pasos y capturas del sistema.
            </p>
          </section>

          {/* === SECCIÓN: INICIO DE SESIÓN === */}
          {activeSection === "inicio" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SectionTitle id="inicio-sesion">Inicio de Sesión</SectionTitle>

              <StepBlock title="Paso 1: Acceso al sistema">
                <p>El acceso al sistema de usuarios se realiza directamente desde la pantalla principal haciendo clic en el botón "Reservar cita".</p>
                <ImageWrapper src="/Imagenes/manual_usuario/inicio_sesion.png" alt="Inicio de sesión" />
              </StepBlock>

              <StepBlock title="Paso 2: Verificación de usuario">
                <p>Ingrese su correo electrónico y contraseña en los campos correspondientes, luego haga clic en el botón "Ingresar" para acceder al sistema.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/inicio_sesion2.png" alt="Credenciales de acceso" />
              </StepBlock>

              <SectionTitle id="registro">Registro</SectionTitle>

              <StepBlock>
                <p>Si aún no cuenta con una cuenta de usuario, haga clic en la opción "Registrarse gratis".</p>
                <ImageWrapper src="/Imagenes/manual_usuario/inicio_sesion3.png" alt="Botón de registro" />
              </StepBlock>

              <StepBlock title="Paso 1: Completar formulario">
                <p>Para crear su cuenta, complete todos los campos requeridos en el formulario de registro y haga clic en el botón "Registrarse ahora".</p>
                <ImageWrapper src="/Imagenes/manual_usuario/registro.png" alt="Formulario de registro" />
              </StepBlock>

              <SectionTitle id="olvido">Olvido de contraseña</SectionTitle>

              <StepBlock title="Paso 1: Recuperación de contraseña">
                <p>En caso de haber olvidado su contraseña, haga clic en la opción “¿Olvidaste tu contraseña?” para iniciar el proceso de recuperación.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/olvido_contraseña.png" alt="Recuperación de contraseña" />
              </StepBlock>

              <StepBlock title="Paso 2: Enviar solicitud de recuperación">
                <p>Ingrese su correo electrónico y haga clic en “ENVIAR INSTRUCCIONES”. El sistema enviará un mensaje a su correo electrónico registrado con el enlace para restablecer su contraseña.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/olvido_contraseña2.png" alt="Enviar solicitud" />
              </StepBlock>

              <StepBlock>
                <p>El sistema mostrará un mensaje de confirmación indicando que el correo electrónico para el restablecimiento ha sido enviado correctamente.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/olvido_contraseña3.png" alt="Confirmación de envío" />
              </StepBlock>

              <StepBlock title="Paso 3: Acceso al enlace de recuperación">
                <p>Recibirá un mensaje en su correo electrónico con un enlace para restablecer su contraseña. Haga clic en el botón "Restablecer Contraseña" para continuar. Tenga en cuenta que dicho enlace cuenta con una vigencia de 15 minutos.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/olvido_contraseña4.png" alt="Enlace de recuperación" />
              </StepBlock>

              <StepBlock title="Paso 4: Cambiar contraseña">
                <p>Tras acceder al enlace, ingrese su nueva contraseña en los campos correspondientes y haga clic en "CAMBIAR CONTRASEÑA".</p>
                <ImageWrapper src="/Imagenes/manual_usuario/olvido_contraseña5.png" alt="Cambiar contraseña" />
              </StepBlock>
            </div>
          )}

          {/* === SECCIÓN: MÓDULO CLIENTE === */}
          {activeSection === "modulo-cliente" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SectionTitle id="cliente">Módulo Cliente</SectionTitle>
              <p>Tras el inicio de sesión, el sistema mostrará el dashboard correspondiente al cliente de la barbería.</p>
              <ImageWrapper src="/Imagenes/manual_usuario/cliente.png" alt="Dashboard Cliente" />

              <SectionTitle id="asignacion">Reservar cita</SectionTitle>

              <StepBlock title="Paso 1: Acceder al módulo">
                <p>Para reservar un corte o servicio, debe dirigirse a la barra del menú o hacer clic en el botón "Reservar cita" del dashboard.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/reservar.png" alt="Módulo de reservas" />
              </StepBlock>

              <StepBlock title="Paso 2: Seleccionar Barbero">
                <p>Haga clic en la tarjeta del barbero de su preferencia para realizar la selección.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/reservar1.png" alt="Seleccionar barbero" />
              </StepBlock>

              <StepBlock title="Paso 3: Selección del servicio">
                <p>Haga clic en la tarjeta del servicio (ej. Corte clásico, arreglo de barba) para añadirlo a su reserva.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/reservar2.png" alt="Selección de servicio" />
              </StepBlock>

              <StepBlock title="Paso 4: Selección del día">
                <p>Haga clic en la fecha deseada en el calendario disponible.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/reservar3.png" alt="Selección de fecha" />
              </StepBlock>

              <StepBlock title="Paso 5: Selección de la Hora">
                <p>Haga clic en el bloque de hora disponible para agendar su cita.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/reservar15.png" alt="Selección de hora" />
              </StepBlock>

              <StepBlock title="Paso 6: Confirmar cita">
                <p>Revise el resumen de su reserva y haga clic en el botón "Confirmar Cita".</p>
                <ImageWrapper src="/Imagenes/manual_usuario/reservar4.png" alt="Confirmación de cita" />
              </StepBlock>

              <StepBlock>
                <p>Se redirigirá a una pasarela de pago para abonar un anticipo (si aplica) y confirmar la cita de forma definitiva.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/reservar5.png" alt="Pasarela de pago" />
              </StepBlock>

              <StepBlock>
                <p>Para verificar el estado de su cita confirmada, diríjase nuevamente a su dashboard.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/reservar6.png" alt="Estado de cita" />
              </StepBlock>

              <SectionTitle id="cierre">Citas Pendientes</SectionTitle>

              <StepBlock title="Paso 1: Acceder al módulo">
                <p>Para observar sus próximas reservas, diríjase a la barra del menú y dé clic en el botón "Citas pendientes".</p>
                <ImageWrapper src="/Imagenes/manual_usuario/pendiente.png" alt="Citas pendientes" />
              </StepBlock>

              <StepBlock>
                <p>En este apartado podrá ver sus citas agendadas y gestionarlas para reagendarlas o cancelarlas si lo requiere.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/pendiente1.png" alt="Gestión de citas pendientes" />
              </StepBlock>

              <StepBlock title="Paso 1: Reagendar">
                <p>Para modificar la fecha u hora, debe dar clic en el botón "Reagendar".</p>
                <ImageWrapper src="/Imagenes/manual_usuario/pendiente2.png" alt="Botón reagendar" />
              </StepBlock>

              <StepBlock title="Paso 2: Seleccionar nuevo horario">
                <p>Elija la nueva disponibilidad en la agenda del barbero y dé clic en confirmar.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/pendiente3.png" alt="Confirmar nuevo horario" />
              </StepBlock>

              <StepBlock title="Paso 1: Cancelar">
                <p>Para anular la cita, dé clic en el botón "Cancelar".</p>
                <ImageWrapper src="/Imagenes/manual_usuario/pendiente4.png" alt="Botón cancelar" />
              </StepBlock>

              <StepBlock title="Paso 2: Confirmar cancelación">
                <p>Aparecerá una ventana de confirmación donde debe hacer clic en "Sí, cancelar cita".</p>
                <ImageWrapper src="/Imagenes/manual_usuario/pendiente5.png" alt="Confirmar cancelación" />
              </StepBlock>

              <SectionTitle id="terminadas">Historial de Cortes</SectionTitle>

              <StepBlock title="Paso 1: Acceder al historial">
                <p>Para revisar los servicios que ya ha tomado, diríjase a la barra del menú y dé clic en el botón "Historial de Cortes".</p>
                <ImageWrapper src="/Imagenes/manual_usuario/terminadas.png" alt="Historial de citas" />
              </StepBlock>

              <StepBlock >
                <p>Aquí podrá observar el detalle de las citas completadas y los servicios realizados.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/terminadas1.png" alt="Detalle historial" />
              </StepBlock>

            </div>
          )}

          {/* === SECCIÓN: MÓDULO BARBERO === */}
          {activeSection === "modulo-barbero" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SectionTitle id="directorio">Módulo Barbero</SectionTitle>

              <StepBlock title="Panel del Barbero">
                <p>Al iniciar sesión con cuenta de empleado, accederá a la vista principal del Módulo Barbero. Desde aquí podrá gestionar su agenda, sus clientes y los cortes programados.</p>
                <ImageWrapper src="img/barbero_dashboard.png" alt="Módulo Barbero" />
              </StepBlock>

              <SectionTitle id="gestion-citas">Gestión de Reservas</SectionTitle>

              <StepBlock title="Navegación Principal">
                <p>En el panel izquierdo encontrará la barra de navegación del sistema. Haga clic en "Gestión de Reservas" para desplegar todas las opciones operativas.</p>
                <ImageWrapper src="img/barbero_nav.png" alt="Navegación Barbero" />
              </StepBlock>

              <StepBlock title="Directorio de Clientes">
                <p>Al hacer clic en "Directorio", podrá visualizar la lista consolidada de todos los clientes registrados y atendidos en la barbería.</p>
                <ImageWrapper src="img/barbero_directorio.png" alt="Directorio de clientes" />
              </StepBlock>

              <StepBlock title="Historial de Servicios">
                <p>Al hacer clic en "Historial", podrá visualizar el registro de todos los servicios y cortes procesados anteriormente en su turno.</p>
                <ImageWrapper src="img/barbero_historial.png" alt="Historial de servicios" />
              </StepBlock>

              <SectionTitle id="servicios">Configurar Servicios de Barbería</SectionTitle>

              <StepBlock title="Paso 1: Acceder al catálogo de servicios">
                <p>Para agregar nuevos tipos de cortes o combos, acceda al submódulo haciendo clic en la opción "Configuración de Servicios".</p>
                <ImageWrapper src="img/barbero_servicios.png" alt="Catálogo de servicios" />
              </StepBlock>

              <StepBlock title="Paso 2: Selección de categoría">
                <p>Haga clic en "Elegir categoría" para desplegar la lista (ej. Cabello, Barba, Cejas, Combos).</p>
                <ImageWrapper src="img/barbero_categoria.png" alt="Selección de categoría" />
              </StepBlock>

              <StepBlock title="Paso 3: Carga de catálogo (Opcional)">
                <p>Si desea importar una lista de precios, descargue la plantilla haciendo clic en el siguiente enlace:
                  <a href="formato/Servicios.xlsx" download="Servicios_Barberia.xlsx" className="font-semibold text-[#8519d2] hover:underline ml-1">
                    Descargar el formato aquí
                  </a>.
                </p>
                <p className="mt-2">Una vez diligenciado, arrastre el archivo al área designada o haga clic en "Subir lista de precios".</p>
                <ImageWrapper src="img/barbero_carga_precios.png" alt="Cargar archivo" />
              </StepBlock>

              <SectionTitle id="nuevo-cliente">Registrar Nuevo Cliente Manualmente</SectionTitle>

              <StepBlock title="Paso 1: Acceder al Registro">
                <p>Para registrar a un cliente que llegó sin cita previa (Walk-in), acceda haciendo clic en "Registrar Nuevo Cliente".</p>
                <ImageWrapper src="img/barbero_registro_cliente.png" alt="Registro único" />
              </StepBlock>

              <StepBlock title="Paso 2: Completar el formulario">
                <p>Complete los datos básicos de contacto del cliente y el servicio requerido, luego haga clic en "GUARDAR CLIENTE".</p>
                <ImageWrapper src="img/barbero_form_cliente.png" alt="Formulario cliente" />
              </StepBlock>

              <SectionTitle id="verificacion">Verificación de Asistencia</SectionTitle>

              <StepBlock title="Paso 1: Acceder a la Agenda del Día">
                <p>Desde su dashboard principal, haga clic en "Agenda del Día" para ver los clientes programados.</p>
                <ImageWrapper src="img/barbero_agenda.png" alt="Agenda del día" />
              </StepBlock>

              <StepBlock title="Paso 2: Confirmar llegada">
                <p>En esta sección se listan las reservas. Para ver el detalle de un cliente o marcar su llegada, haga clic en el icono del ojo y luego en "Marcar Asistencia".</p>
                <ImageWrapper src="img/barbero_asistencia.png" alt="Lista de reservas" />
              </StepBlock>

              <SectionTitle id="atencion">Atención en Barbería</SectionTitle>

              <StepBlock title="Paso 1: Iniciar Servicio">
                <p>Seleccione la reserva correspondiente desde su agenda y haga clic en "Iniciar Servicio".</p>
                <ImageWrapper src="img/barbero_iniciar.png" alt="Iniciar servicio" />
              </StepBlock>

              <StepBlock title="Paso 2: Detalles del Corte">
                <p>Se desplegará una ficha donde podrá añadir notas sobre las preferencias del cliente (ej. Degradado medio, barba perfilada) para futuras visitas.</p>
                <ImageWrapper src="img/barbero_notas.png" alt="Notas del corte" />
              </StepBlock>

              <StepBlock title="Paso 3: Finalizar y Sincronizar">
                <p>Una vez completado el corte, haga clic en el botón “FINALIZAR SERVICIO” para actualizar el estado de la cita a "Completado" y liberar su agenda.</p>
                <ImageWrapper src="img/barbero_finalizar.png" alt="Finalizar servicio" />
              </StepBlock>

              <SectionTitle id="corte-especial">Programar Servicio Especial</SectionTitle>

              <StepBlock title="Paso 1: Servicios a domicilio o VIP">
                <p>Para agendar un bloqueo de tiempo largo o un servicio VIP, haga clic en “Programar Servicio Especial” en el menú.</p>
                <ImageWrapper src="img/barbero_vip.png" alt="Servicio especial" />
              </StepBlock>

              <StepBlock title="Paso 2: Confirmar bloque de agenda">
                <p>Tras seleccionar los detalles y el tiempo requerido, haga clic en “CONFIRMAR BLOQUEO” para cerrar ese espacio en su agenda pública.</p>
                <ImageWrapper src="img/barbero_bloqueo.png" alt="Confirmar bloqueo" />
              </StepBlock>

            </div>
          )}

          {/* === SECCIÓN: MÓDULO ADMINISTRADOR === */}
          {activeSection === "modulo-admin" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SectionTitle id="panel-admin">Panel de Control</SectionTitle>

              <StepBlock title="Módulo de Administración">
                <p>Al iniciar sesión con credenciales de dueño/gerente, accederá a la vista principal del Módulo de Administración. Desde aquí podrá gestionar las sucursales, barberos, finanzas y revisar las calificaciones del servicio.</p>
                <ImageWrapper src="img/admin_dashboard.png" alt="Dashboard Administrador" />
              </StepBlock>

              <SectionTitle id="control-reservas">Control General de Citas</SectionTitle>

              <StepBlock title="Monitoreo de Agenda">
                <p>En el panel izquierdo, haga clic en "Control General de Citas".</p>
                <ImageWrapper src="img/admin_nav.png" alt="Navegación Administración" />
              </StepBlock>

              <StepBlock title="Gestión de Citas Globales">
                <p className="mb-2">En esta sección, el perfil de <strong className="font-semibold text-slate-800">Administrador</strong> podrá visualizar la agenda de todos los barberos del local. El sistema permite realizar las siguientes acciones:</p>
                <ul className="ml-5 list-disc space-y-1 text-slate-600">
                  <li><strong className="font-medium text-slate-800">Gestión de turnos:</strong> Puede reasignar citas si un barbero no está disponible, cambiando el estado a: <em className="italic">Pendiente</em>, <em className="italic">Completada</em> o <em className="italic">Cancelada</em>.</li>
                  <li><strong className="font-medium text-slate-800">Supervisión en tiempo real:</strong> Vea qué sillas de la barbería están ocupadas en el momento actual.</li>
                </ul>
                <ImageWrapper src="img/admin_supervision.png" alt="Supervisión de citas" />
              </StepBlock>

              <SectionTitle id="evaluacion">Evaluación de Servicio</SectionTitle>

              <StepBlock title="Paso 1: Ingresar al módulo de Reseñas">
                <p>En la barra de navegación, haga clic en "Evaluación de Servicio" para ver el feedback dejado por los clientes.</p>
                <ImageWrapper src="img/admin_reviews.png" alt="Módulo de evaluaciones" />
              </StepBlock>

              <StepBlock title="Paso 2: Buscar Reserva (Ticket)">
                <p>Ingrese el número de comprobante o ticket de la reserva en la barra de búsqueda y haga clic en "Recargar" para aislar la calificación de un corte en específico.</p>
                <ImageWrapper src="img/admin_buscar_ticket.png" alt="Buscar ticket" />
              </StepBlock>

              <StepBlock title="Paso 3: Analizar desempeño del barbero">
                <p>Revise los comentarios del cliente, la propina dejada en la pasarela de pago y las estrellas del servicio. Haga clic en “Cerrar Ticket” tras su revisión.</p>
                <ImageWrapper src="img/admin_cierre_review.png" alt="Análisis de servicio" />
              </StepBlock>
            </div>
          )}

        </main>
      </div>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        <p>&copy; 2026 Plataforma Barbertech. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}