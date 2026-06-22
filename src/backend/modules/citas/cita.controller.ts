import { NextResponse } from 'next/server';
import { CitaService } from './cita.service';
import { CitaMapper } from './cita.mapper';
import { getSessionUser } from '@/backend/shared/get-session-user';

export class CitaController {
  private service = new CitaService();

  async reservarCita(request: Request) {
    try {
      const session = await getSessionUser();
      if (!session) {
        return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });
      }

      const body = await request.json();
      await this.service.reservar(body);
      return NextResponse.json({ mensaje: 'Cita creada con éxito' }, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  async finalizarCita(request: Request, id: number) {
    try {
      const session = await getSessionUser();
      if (!session) {
        return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });
      }
      if (session.rol !== 'Barbero' && session.rol !== 'Admin') {
        return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 403 });
      }

      await this.service.finalizar(id);
      return NextResponse.json({ success: true, message: 'Cita finalizada correctamente' });
    } catch (error: any) {
      const status = error.message === 'Cita no encontrada' ? 404 : 400;
      return NextResponse.json({ success: false, message: error.message }, { status });
    }
  }

  async cancelarCita(request: Request, id: number) {
    try {
      const session = await getSessionUser();
      if (!session) {
        return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });
      }

      await this.service.cancelar(id);
      return NextResponse.json({ success: true, message: 'Cita cancelada correctamente' });
    } catch (error: any) {
      const status = error.message === 'Cita no encontrada' ? 404 : 400;
      return NextResponse.json({ success: false, message: error.message }, { status });
    }
  }

  async getHistorialBarbero(request: Request) {
    try {
      const session = await getSessionUser();
      if (!session) {
        return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });
      }

      const { searchParams } = new URL(request.url);
      const barberoId = searchParams.get('barberoId');
      const estado = searchParams.get('estado');

      if (!barberoId) {
        return NextResponse.json({ success: false, message: 'Falta barberoId' }, { status: 400 });
      }

      const citas = await this.service.obtenerHistorialBarbero(barberoId, estado || undefined);
      const dataMapped = CitaMapper.toHistorialResponseList(citas);

      return NextResponse.json({ success: true, data: dataMapped });
    } catch (error: any) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }

  async getPendientesCliente(request: Request) {
    try {
      const session = await getSessionUser();
      if (!session) {
        return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });
      }

      const citas = await this.service.obtenerCitasCliente(session.cedula, 'pendientes');
      return NextResponse.json({ success: true, data: CitaMapper.toResponseList(citas) });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }

  async getTerminadasCliente(request: Request) {
    try {
      const session = await getSessionUser();
      if (!session) {
        return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });
      }

      const citas = await this.service.obtenerCitasCliente(session.cedula, 'terminadas');
      return NextResponse.json({ success: true, data: CitaMapper.toResponseList(citas) });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
}
