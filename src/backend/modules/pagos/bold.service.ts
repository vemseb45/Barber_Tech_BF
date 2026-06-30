export class BoldService {
  private static readonly API_URL = process.env.BOLD_API_URL!;
  private static readonly API_KEY = process.env.BOLD_API_KEY!;

  static async createPaymentLink(referencia: string, descripcion: string, montoCOP: number) {
    if (!this.API_URL || !this.API_KEY) {
      throw new Error("Credenciales de Bold no configuradas.");
    }

    const payload = {
      name: descripcion,
      description: `Pago de anticipo cita ${referencia}`,
      amount: {
        currency: "COP",
        total_amount: montoCOP,
      },
      redirection_url: `${process.env.NEXT_PUBLIC_APP_URL}/cliente/citas`,
      expiration_date: new Date(Date.now() + 30 * 60000).toISOString(),
    };

    const response = await fetch(this.API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("No se pudo generar el link de pago con Bold.");
    }

    const data = await response.json();
    return data.payload.payment_url;
  }
}