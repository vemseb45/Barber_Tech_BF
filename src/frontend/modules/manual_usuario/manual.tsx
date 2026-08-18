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
      { id: "inicio-sesion", label: "Iniciar Sesion" },
      { id: "Registro", label: "Registro" },
      { id: "olvido", label: "Olvido contraseña" },
    ],
  },
  {
    menuId: "opr",
    title: "Módulo Cliente",
    subItems: [
      { id: "cliente", label: "Modulo Cliente" },
      { id: "asignacion", label: "Reservar" },
      { id: "cierre", label: "Citas Pendientes" },
      { id: "terminadas", label: "Citas terminadas" }
    ],
  },
  {
    menuId: "reclutamiento",
    title: "Módulo barbero",
    subItems: [
      { id: "reclu", label: "Poblar" },
      { id: "gestion", label: "Gestión de Candidatos" },
      { id: "masivo", label: "Crear Candidatos Masivos" },
      { id: "unico", label: "Crear Candidato Unico" },
      { id: "verf", label: "Verificacion Candidatos" },
      { id: "pobla", label: "Reclutamiento" },
      { id: "ases", label: "Solicitar Assesment" },
      { id: "agensd", label: "Citas Agendadas" },
    ],
  },
  {
    menuId: "analisis",
    title: "Modulo Administrador",
    subItems: [
      { id: "anal", label: "Análisis" },
      { id: "cita", label: "Citas" },
      { id: "cal", label: "Calificación Assesment" },
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
                        ? "border-l-4 border-red-500 text-[#8519d2] bg-slate-50/50"
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

              <StepBlock title="Paso 2: Verificacion de usuario">
                <p>Ingrese su correo electrónico y contraseña en los campos correspondientes haga clic en el botón "Ingresar" para acceder al sistema.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/inicio_sesion2.png" alt="Inicio de sesión" />
              </StepBlock>

              <SectionTitle id="Registro">Registro</SectionTitle>

              <StepBlock>
                <p>Si aún no cuenta con una cuenta de usuario, haga clic en la opción "Registrarse gratis".</p>
                <ImageWrapper src="/Imagenes/manual_usuario/inicio_sesion3.png" alt="Caducidad" />
              </StepBlock>

              <StepBlock title="Paso 1: Completar formulario">
                <p>Para crear su cuenta, complete todos los campos requeridos en el formulario de registro y haga clic en el botón "Registrarse ahora".</p>
                <ImageWrapper src="/Imagenes/manual_usuario/registro.png" alt="Cambio contraseña" />
              </StepBlock>

              <SectionTitle id="olvido">Olvido de contraseña</SectionTitle>

              <StepBlock title="Paso 1: Recuperación de contraseña">
                <p>En caso de haber olvidado su contraseña, haga clic en la opción “¿Olvidaste tu contraseña?” para iniciar el proceso de recuperación.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/olvido_contraseña.png" alt="Recuperación" />
              </StepBlock>

              <StepBlock title="Paso 2: Enviar solicitud de recuperación">
                <p>Ingrese su correo electrónico y haga clic en “ENVIAR INSTRUCCIONES”. El sistema enviará un mensaje a su correo electrónico registrado con el enlace para restablecer su contraseña.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/olvido_contraseña2.png" alt="Enviar solicitud" />
              </StepBlock>

              <StepBlock>
                <p>El sistema mostrará un mensaje de confirmación indicando que el correo electrónico para el restablecimiento ha sido enviado correctamente.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/olvido_contraseña3.png" alt="Confirmación envío" />
              </StepBlock>

              <StepBlock title="Paso 3: Acceso al enlace de recuperación">
                <p>Recibirá un mensaje en su correo electrónico con un enlace para restablecer su contraseña. Haga clic en el botón "Restablecer Contraseña" para continuar. Tenga en cuenta que dicho enlace cuenta con una vigencia de 15 minutos.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/olvido_contraseña4.png" alt="Enlace recuperación" />
              </StepBlock>

              <StepBlock title="Paso 4: Cambiar contraseña">
                <p>Tras acceder al enlace, ingrese su nueva contraseña en los campos correspondientes y haga clic en "CAMBIAR CONTRASEÑA".</p>
                <ImageWrapper src="/Imagenes/manual_usuario/olvido_contraseña5.png" alt="Cambiar contraseña" />
              </StepBlock>
            </div>
          )}

          {/* === SECCIÓN: MÓDULO Cliente === */}
          {activeSection === "opr" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SectionTitle id="cliente">Módulo Cliente</SectionTitle>
              <p>Tras el inicio de sesión, el sistema mostrará el dashboard correspondiente al cliente.</p>
              <ImageWrapper src="/Imagenes/manual_usuario/cliente.png" alt="Módulo OPR" />

              <SectionTitle id="asignacion">Reservar cita</SectionTitle>

              <StepBlock title="Paso 1: Acceder al módulo">
                <p>Para reservar una cita, debe dirigirse a la barra del menú o hacer clic en el botón "Reservar cita" del dashboard.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/reservar.png" alt="Asignar OPR" />
              </StepBlock>

              <StepBlock title="Paso 2: Seleccionar Barbero">
                <p>Haga clic en la tarjeta del barbero para realizar la selección.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/reservar1.png" alt="Seleccionar responsable" />
              </StepBlock>

              <StepBlock title="Paso 3: Selección del servicio">
                <p>Haga clic en la tarjeta del servicio para realizar la selección.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/reservar2.png" alt="Selección reclutador" />
              </StepBlock>

              <StepBlock title="Paso 4: Selección del día">
                <p>Haga clic en la tarjeta del día para realizar la selección.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/reservar3.png" alt="Selección analista" />
              </StepBlock>

              <StepBlock title="Paso 5: Selección del Hora">
                <p>Haga clic en la tarjeta de la hora para realizar la selección.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/reservar15.png" alt="Confirmar asignación" />
              </StepBlock>

              <StepBlock title="Paso 6: Confirmar cita">
                <p>Haga clic en el boton de "Confirmar Cita".</p>
                <ImageWrapper src="/Imagenes/manual_usuario/reservar4.png" alt="Confirmar asignación" />
              </StepBlock>

              <StepBlock>
                <p>Se redirigirá a una pasarela de pago para abonar un porcentaje y confirmar la cita.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/reservar5.png" alt="Confirmar asignación" />
              </StepBlock>

              <StepBlock>
                <p>Para verificar el estado de su cita confirmada, diríjase al dashboard.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/reservar6.png" alt="Confirmar asignación" />
              </StepBlock>

              <SectionTitle id="cierre">Citas pendientes</SectionTitle>

              <StepBlock title="Paso 1: Acceder al módulo">
                <p>Para observar las citas pendientes, debe dirigirse a la barra del menú y dar clic en el botón "Citas pendientes".</p>
                <ImageWrapper src="/Imagenes/manual_usuario/pendiente.png" alt="Selección OPR" />
              </StepBlock>

              <StepBlock>
                <p>En este apartado podrá ver sus citas y gestionarlas para reagendarlas o cancelarlas si lo desea.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/pendiente1.png" alt="Cierre OPR" />
              </StepBlock>

              <StepBlock title="Paso 1: Reagendar">
                <p>Para reagendar debe dar clic en el boton "Reagendar".</p>
                <ImageWrapper src="/Imagenes/manual_usuario/pendiente2.png" alt="Confirmar cierre" />
              </StepBlock>

              <StepBlock title="Paso 2: Seleccionar horario">
                <p>Debe seleccionar el nuevo horario para la cita y dar clic en confirmar.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/pendiente3.png" alt="Confirmar cierre" />
              </StepBlock>

              <StepBlock title="Paso 1: Cancelar">
                <p>Para Cancelar debe dar clic en el boton "Cancelar".</p>
                <ImageWrapper src="/Imagenes/manual_usuario/pendiente4.png" alt="Confirmar cierre" />
              </StepBlock>

              <StepBlock title="Paso 2: Confirmar">
                <p>Aparecerá una ventana de confirmación donde debe hacer clic en "Sí, cancelar".</p>
                <ImageWrapper src="/Imagenes/manual_usuario/pendiente5.png" alt="Confirmar cierre" />
              </StepBlock>

              <SectionTitle id="terminadas">Citas terminadas</SectionTitle>

              <StepBlock title="Paso 1: Acceder al módulo">
                <p>Para observar las citas terminadas, debe dirigirse a la barra del menú y dar clic en el botón "Citas Terminadas".</p>
                <ImageWrapper src="/Imagenes/manual_usuario/terminadas.png" alt="Selección OPR" />
              </StepBlock>

              <StepBlock >
                <p>Podra observar las citas que se han completado.</p>
                <ImageWrapper src="/Imagenes/manual_usuario/terminadas1.png" alt="Selección OPR" />
              </StepBlock>

            </div>
          )}

          {/* === SECCIÓN:  MÓDULO barbero === */}
          {activeSection === "reclutamiento" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SectionTitle id="reclu">Barbero</SectionTitle>

              <StepBlock title="Módulo de Reclutamiento">
                <p>Al iniciar sesión, accederá a la vista principal del Módulo de Reclutamiento. Desde aquí podrá gestionar a los candidatos y crear nuevos assessments.</p>
                <ImageWrapper src="img/reclutador1.png" alt="Módulo Reclutamiento" />
              </StepBlock>

              <SectionTitle id="gestion">Gestión de candidatos</SectionTitle>

              <StepBlock title="Submódulos">
                <p>En el panel izquierdo encontrará la barra de navegación del sistema. Haga clic en "Reclutamiento" para desplegar todas las opciones disponibles.</p>
                <ImageWrapper src="img/reclutador2.png" alt="Navegación Reclutamiento" />
              </StepBlock>

              <StepBlock title="Poblado">
                <p>Al hacer clic en "Poblado" en la barra de navegación, podrá visualizar la lista consolidada de todos los candidatos registrados en todas las OPR.</p>
                <ImageWrapper src="img/reclutador3.png" alt="Poblado" />
              </StepBlock>

              <StepBlock title="Historial de cargas">
                <p>Al hacer clic en "Historial de cargas" en la barra de navegación, podrá visualizar el registro de todas las bases de candidatos procesadas anteriormente.</p>
                <ImageWrapper src="img/reclutador4.png" alt="Historial" />
              </StepBlock>

              <SectionTitle id="masivo">Crear candidatos masivos</SectionTitle>

              <StepBlock title="Paso 1: Acceder al submódulo de Carga masiva">
                <p>Para iniciar el proceso de carga masiva de candidatos, acceda al submódulo haciendo clic en la opción "Carga masiva de candidatos" en la barra de navegacion.</p>
                <ImageWrapper src="img/reclutador5.png" alt="Carga masiva" />
              </StepBlock>

              <StepBlock title="Paso 2: Selección de proceso">
                <p>Haga clic en "Elegir un proceso activo o vacante" para desplegar la lista de las OPR asignadas a su usuario.</p>
                <ImageWrapper src="img/reclutador6.png" alt="Selección de proceso" />
              </StepBlock>

              <StepBlock title="Paso 3: Selección de la OPR">
                <p>Haga clic en una OPR activa para habilitar la opción de carga masiva.</p>
                <ImageWrapper src="img/reclutador7.png" alt="Selección OPR activa" />
              </StepBlock>

              <StepBlock title="Paso 4: Cargar archivo de candidatos">
                <p>Puede descargar la plantilla de carga haciendo clic en el siguiente enlace:
                  <a href="formato/Formato.xlsx" download="Candidatos_excel.xlsx" className="font-semibold text-[#8519d2] hover:underline ml-1">
                    Descargar el formato aquí
                  </a>.
                </p>
                <p className="mt-2">Una vez completado y diligenciado el formato con la información de los candidatos, puede arrastrar el archivo al área designada o hacer clic en "Subir consolidado aquí".</p>
                <ImageWrapper src="img/reclutador8.png" alt="Cargar archivo" />
              </StepBlock>

              <StepBlock title="Paso 5: Seleccionar Archivo">
                <p>Haga clic en el botón "Subir consolidado aquí" para abrir el explorador de archivos. Seleccione el archivo correspondiente y presione "Abrir".</p>
                <ImageWrapper src="img/reclutador9.png" alt="Explorador de archivos" />
              </StepBlock>

              <StepBlock title="Paso 6: Cargar el archivo">
                <p>Tras subir el archivo Excel, el sistema validará automáticamente la información. Se indicará qué hojas cumplen con los parámetros y cuáles presentan errores de estructura. Para finalizar, haga clic en el botón "Cargar-OPR".</p>
                <ImageWrapper src="img/reclutador10.png" alt="Validación archivo" />
              </StepBlock>

              <StepBlock>
                <p>Al finalizar la carga, los candidatos quedarán vinculados a la OPR seleccionada. El sistema mostrará automáticamente cualquier error de carga o bloqueo de ingreso detectado. Si necesita procesar un nuevo archivo, haga clic en el botón 'NUEVA IMPORTACIÓN'.</p>
                <ImageWrapper src="img/reclutador11.png" alt="Finalizar carga" />
              </StepBlock>

              <SectionTitle id="unico">Crear Candidato Unico</SectionTitle>

              <StepBlock title="Paso 1: Acceder al Registro Único de Candidatos">
                <p>Para realizar el registro individual de un candidato, acceda al submódulo haciendo clic en la opción "Registro Único de Candidato".</p>
                <ImageWrapper src="img/reclutador12.png" alt="Registro único" />
              </StepBlock>

              <StepBlock title="Paso 2: Selección de la OPR">
                <p>Para realizar el registro individual de un candidato, primero debe seleccionar la OPR correspondiente.</p>
                <ImageWrapper src="img/reclutador13.png" alt="Selección OPR Registro" />
              </StepBlock>

              <StepBlock title="Paso 3: Completar el formulario">
                <p>Tras seleccionar la OPR, complete los campos del formulario y haga clic en el botón "GUARDAR CANDIDATO".</p>
                <ImageWrapper src="img/reclutador14.png" alt="Completar formulario" />
              </StepBlock>

              <SectionTitle id="verf">Verificar creación de candidatos</SectionTitle>

              <StepBlock title="Paso 1: Acceder al Dashboard Global">
                <p>Tras finalizar la carga masiva o el registro único de candidatos, haga clic en la opción "Dashboard Global" en la barra de navegacion.</p>
                <ImageWrapper src="img/reclutador15.png" alt="Dashboard global" />
              </StepBlock>

              <StepBlock title="Paso 2: Selección de la OPR">
                <p>Seleccione la OPR que desea consultar para visualizar la lista de candidatos asociados.</p>
                <ImageWrapper src="img/reclutador16.png" alt="Selección OPR consulta" />
              </StepBlock>

              <StepBlock>
                <p>En esta sección se listan los candidatos asignados a la OPR. Puede desplazarse horizontalmente para consultar el estado del proceso de cada uno. Para ver la información detallada de un candidato, haga clic en el icono del ojo.</p>
                <ImageWrapper src="img/reclutador17.png" alt="Lista candidatos" />
              </StepBlock>

              <StepBlock>
                <p>Este módulo permite visualizar la información del candidato, la cual se actualiza progresivamente a medida que avanza el proceso hasta la contratación final.</p>
                <ImageWrapper src="img/reclutador18.png" alt="Información candidato" />
              </StepBlock>

              <SectionTitle id="pobla">Reclutamiento</SectionTitle>

              <StepBlock title="Paso 1: Ingresar al Formulario Reclutador">
                <p>Para comenzar, seleccione "Formulario Reclutador" desde la barra de navegación del sistema.</p>
                <ImageWrapper src="img/reclutador19.png" alt="Formulario Reclutador" />
              </StepBlock>

              <StepBlock title="Paso 2: Seleccionar una OPR">
                <p>Al ingresar al módulo, elija la OPR correspondiente de la lista de opciones activas.</p>
                <ImageWrapper src="img/reclutador20.png" alt="Elegir OPR" />
              </StepBlock>

              <StepBlock title="Paso 3: Selección del candidato">
                <p>Tras seleccionar la OPR, elija al candidato correspondiente y haga clic en "Completar".</p>
                <ImageWrapper src="img/reclutador21.png" alt="Elegir candidato" />
              </StepBlock>

              <StepBlock title="Paso 4: Completar formulario">
                <p>Se desplegará un formulario para completar la información necesaria y continuar con el proceso.</p>
                <ImageWrapper src="img/reclutador22.png" alt="Llenar formulario" />
              </StepBlock>

              <StepBlock title="Paso 5: Sincronización de datos">
                <p>Después de completar la totalidad del formulario, haga clic en el botón “SINCRONIZAR DATOS” para finalizar el proceso.</p>
                <ImageWrapper src="img/reclutador23.png" alt="Sincronizar datos" />
              </StepBlock>

              <StepBlock title="Paso 6: Verificación de datos">
                <p>Tras hacer clic en “SINCRONIZAR DATOS”, el sistema realizará una validación automática. Verifique en pantalla que el mensaje de confirmación indique que la información se ha guardado correctamente; al finalizar, el estado cambiará automáticamente de “Pendiente” a “Completado”.</p>
                <ImageWrapper src="img/reclutador24.png" alt="Verificación datos" />
              </StepBlock>

              <SectionTitle id="ases">Solicitar assesment</SectionTitle>

              <StepBlock title="Paso 1: Acceso a la generación de assessments">
                <p>Para acceder al módulo de generación de assessments, haga clic en la opción “Solicitar Assessment” ubicada en la barra de navegación del sistema.</p>
                <ImageWrapper src="img/reclutador25.png" alt="Generar assessment" />
              </StepBlock>

              <StepBlock title="Paso 2: Seleccionar OPR">
                <p>Seleccione la OPR correspondiente para iniciar la generación de la cita de Assessment. Tras completar los datos del formulario, diríjase a la sección "Selección masiva de candidatos". Apareceran los candidatos en el proceso. Puede enviar la notificación a todos los candidatos o filtrar únicamente a aquellos que continúan en el proceso.</p>
                <ImageWrapper src="img/reclutador26.png" alt="Selección masiva" />
              </StepBlock>

              <StepBlock title="Paso 3: Confirmar cita">
                <p>Tras seleccionar a los candidatos y completar la totalidad del formulario, haga clic en el botón “CONFIRMAR CITA” para finalizar la programación.</p>
                <ImageWrapper src="img/reclutador27.png" alt="Confirmar cita" />
              </StepBlock>

              <StepBlock>
                <p>Tras la creación de la cita, aparecerá un mensaje de confirmación indicando: "Cita agendada correctamente".</p>
                <ImageWrapper src="img/reclutador28.png" alt="Confirmación cita" />
              </StepBlock>

              <SectionTitle id="agensd">Citas agendadas</SectionTitle>

              <StepBlock title="Paso 1: Acceso al módulo de citas agendadas">
                <p>Para comenzar, seleccione la opción “Citas agendadas” ubicada en la barra de navegación del sistema.</p>
                <ImageWrapper src="img/reclutador29.png" alt="Citas agendadas" />
              </StepBlock>

              <StepBlock>
                <p>En esta sección del módulo podrá visualizar todas las citas creadas, así como su estado actual. Para acceder a la sesión, haga clic en el botón "Link" correspondiente a la cita deseada.</p>
                <ImageWrapper src="img/reclutador30.png" alt="Link cita" />
              </StepBlock>
            </div>
          )}

          {/* === SECCIÓN: MÓDULO administrador === */}
          {activeSection === "analisis" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SectionTitle id="anal">Análisis</SectionTitle>

              <StepBlock title="Modulo analisis">
                <p>Al iniciar sesión, accederá a la vista principal del Módulo de Analisis. Desde aquí podrá gestionar a los candidatos citados assesment y generar su calificación.</p>
                <ImageWrapper src="img/analisis.png" alt="Módulo Análisis" />
              </StepBlock>

              <SectionTitle id="cita">Citas assesment</SectionTitle>

              <StepBlock title="Submódulos">
                <p>En el panel izquierdo encontrará la barra de navegación del sistema. Haga clic en "Análisis" para desplegar todas las opciones disponibles.</p>
                <ImageWrapper src="img/analisis2.png" alt="Navegación Análisis" />
              </StepBlock>

              <StepBlock title="Paso 1: ingresar al modulo">
                <p>En el panel izquierdo encontrará la barra de navegación del sistema. Haga clic en "Citas agendadas" para desplegar todas las opciones disponibles.</p>
                <ImageWrapper src="img/analisis3.png" alt="Citas agendadas Análisis" />
              </StepBlock>

              <StepBlock title="citas Agendadas">
                <p className="mb-2">En esta sección, el perfil de <strong className="font-semibold text-slate-800">Analista</strong> podrá visualizar las citas programadas para los assessments. El sistema permite realizar las siguientes acciones:</p>
                <ul className="ml-5 list-disc space-y-1 text-slate-600">
                  <li><strong className="font-medium text-slate-800">Gestión de estados:</strong> Es posible actualizar el estado de la cita según el progreso de la sesión, seleccionando entre: <em className="italic">Pendiente</em>, <em className="italic">Realizada</em> o <em className="italic">Rechazada</em>.</li>
                  <li><strong className="font-medium text-slate-800">Acceso a la reunión:</strong> Para ingresar a la sesión virtual, haga clic en el botón "Unirse" correspondiente a la cita deseada.</li>
                </ul>
                <ImageWrapper src="img/analisis4.png" alt="Gestión citas" />
              </StepBlock>

              <SectionTitle id="cal">Calificacion assesment</SectionTitle>

              <StepBlock title="Paso 1: ingresar al modulo">
                <p>En el panel izquierdo encontrará la barra de navegación del sistema. Haga clic en "Calificación Assesment" para desplegar todas las opciones disponibles.</p>
                <ImageWrapper src="img/analisis5.png" alt="Calificación Assessment" />
              </StepBlock>

              <StepBlock title="Paso 2: Buscar OPR">
                <p>Ingrese el número de la OPR que desea calificar en la barra de búsqueda y haga clic en el botón "Recargar" para visualizar los registros correspondientes.</p>
                <ImageWrapper src="img/analisis6.png" alt="Buscar OPR" />
              </StepBlock>

              <StepBlock title="Paso 3: Buscar candidato">
                <p>Ingrese el número de documento de identificación del candidato en la barra de búsqueda y haga clic en el botón “Analizar” para proceder con la calificación del assessment.</p>
                <ImageWrapper src="img/analisis7.png" alt="Analizar candidato" />
              </StepBlock>

              <StepBlock>
                <p>Tras completar el formulario, haga clic en el botón “FINALIZAR EVALUACIÓN” para concluir el proceso.</p>
                <ImageWrapper src="img/analisis9.png" alt="Finalizar evaluación" />
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