import { NextResponse } from 'next/server';
import { CitaService } from './cita.service';
import { CitaMapper } from './cita.mapper';
import { jwtDecode } from 'jwt-decode'; 

export class CitaController {
  private service = new CitaService();

  private obtenerCedulaDesdeToken(request: Request): string {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error("No autenticado");
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwtDecode<{ user_id: string }>(token);
    return decoded.user_id;
  }

  async reservarCita(request: Request) {
    try {
      const body = await request.json();
      await this.service.reservar(body);
      return NextResponse.json({ mensaje: "Cita creada con éxito" }, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  async finalizarCita(request: Request, id: number) {
    try {
      await this.service.finalizar(id);
      return NextResponse.json({ success: true, message: "Cita finalizada correctamente" });
    } catch (error: any) {
      const status = error.message === "Cita no encontrada" ? 404 : 400;
      return NextResponse.json({ success: false, message: error.message }, { status });
    }
  }

  async cancelarCita(request: Request, id: number) {
    try {
      await this.service.cancelar(id);
      return NextResponse.json({ success: true, message: "Cita cancelada correctamente" });
    } catch (error: any) {
      const status = error.message === "Cita no encontrada" ? 404 : 400;
      return NextResponse.json({ success: false, message: error.message }, { status });
    }
  }

  async getHistorialBarbero(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const barberoId = searchParams.get('barberoId');
      const estado = searchParams.get('estado');

      if (!barberoId) {
        return NextResponse.json({ success: false, message: "Falta barberoId" }, { status: 400 });
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
      const cedulaCliente = this.obtenerCedulaDesdeToken(request);
      const citas = await this.service.obtenerCitasCliente(cedulaCliente, 'pendientes');
      return NextResponse.json({ success: true, data: CitaMapper.toResponseList(citas) });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
  }

  async getTerminadasCliente(request: Request) {
    try {
      const cedulaCliente = this.obtenerCedulaDesdeToken(request);
      const citas = await this.service.obtenerCitasCliente(cedulaCliente, 'terminadas');
      return NextResponse.json({ success: true, data: CitaMapper.toResponseList(citas) });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
  }
}