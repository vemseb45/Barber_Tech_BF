import { NextResponse } from 'next/server';
import { AgendaService } from './agenda.service';
import { AgendaMapper } from './agenda.mapper';
import { getSessionUser } from '@/backend/shared/get-session-user';

export class AgendaController {
  private service = new AgendaService();

  async getMiAgenda(request: Request) {
    try {
      const session = await getSessionUser();
      if (!session) {
        return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });
      }

      const { searchParams } = new URL(request.url);
      const barberoId = searchParams.get('barberoId');
      const fecha = searchParams.get('fecha');
      const fechaInicio = searchParams.get('fechaInicio');
      const fechaFin = searchParams.get('fechaFin');

      if (!barberoId) {
        return NextResponse.json({ success: false, message: 'Falta barberoId' }, { status: 400 });
      }

      const citas = await this.service.listarMiAgenda(
        barberoId,
        fecha || undefined,
        fechaInicio || undefined,
        fechaFin || undefined
      );
      const dataMapped = AgendaMapper.toCitaResponseList(citas);

      return NextResponse.json({ success: true, data: dataMapped });
    } catch (error: any) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }

  async getDisponibilidad(request: Request) {
    try {
      // Disponibilidad es pública (clientes la necesitan para reservar)
      const { searchParams } = new URL(request.url);
      const barberoId = searchParams.get('barberoId');
      const fecha = searchParams.get('fecha');

      if (!barberoId || !fecha) {
        return NextResponse.json({ success: false, message: 'Faltan parámetros' }, { status: 400 });
      }

      const bloques = await this.service.calcularDisponibilidad(barberoId, fecha);
      return NextResponse.json({ success: true, message: 'Lista de horas disponibles', data: bloques });
    } catch (error: any) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }

  async getHorariosConfigurados(request: Request) {
    try {
      const session = await getSessionUser();
      if (!session) {
        return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });
      }

      const { searchParams } = new URL(request.url);
      const barberoId = searchParams.get('barberoId');
      const horarios = await this.service.verTodosLosHorarios(barberoId || undefined);
      return NextResponse.json({ success: true, data: AgendaMapper.toAgendaResponseList(horarios) });
    } catch (error: any) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }

  async postConfigurarHorario(request: Request) {
    try {
      const session = await getSessionUser();
      if (!session) {
        return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });
      }
      if (session.rol !== 'Barbero' && session.rol !== 'Admin') {
        return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 403 });
      }

      const body = await request.json();
      const resultado = await this.service.configurarHorario(body);
      return NextResponse.json(
        { success: true, message: 'Horario guardado correctamente', data: resultado },
        { status: 201 }
      );
    } catch (error: any) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
  }

  async postCargaMasiva(request: Request) {
    try {
      const session = await getSessionUser();
      if (!session) {
        return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });
      }
      if (session.rol !== 'Admin') {
        return NextResponse.json({ success: false, message: 'No autorizado. Se requiere rol Admin.' }, { status: 403 });
      }

      const body = await request.json();
      const resultado = await this.service.cargaMasiva(body.horarios || []);
      return NextResponse.json({ success: true, message: 'Proceso finalizado', ...resultado });
    } catch (error: any) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }

  async deleteHorario(request: Request) {
    try {
      const session = await getSessionUser();
      if (!session) {
        return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });
      }
      if (session.rol !== 'Barbero' && session.rol !== 'Admin') {
        return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 403 });
      }

      const { searchParams } = new URL(request.url);
      const cedula = searchParams.get('cedula');
      const dia = searchParams.get('dia');

      if (!cedula || !dia) {
        return NextResponse.json({ success: false, message: 'Faltan parámetros' }, { status: 400 });
      }

      await this.service.eliminarHorario(cedula, dia);
      return NextResponse.json({ success: true, message: 'Horario eliminado' });
    } catch (error: any) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }
}
