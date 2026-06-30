export class BoldService {
  static async createPaymentLink(referencia: string, descripcion: string, monto: number): Promise<string> {
    const apiKey = process.env.BOLD_API_KEY;
    const apiUrl = process.env.BOLD_API_URL;

    if (!apiKey || !apiUrl) {
      console.error("❌ [BoldService] Faltan variables de entorno BOLD_API_KEY o BOLD_API_URL");
      throw new Error("Credenciales de pasarela incompletas");
    }

    const payload = {
      description: descripcion,
      reference: referencia, 
      amount_type: "CLOSE",
      amount: {
        currency: "COP",
        total_amount: monto
      }
    };

    try {
      console.log(`[BoldService] Intentando crear link de pago por $${monto} COP...`);
      console.log(`[BoldService] Payload enviado a Bold:`, JSON.stringify(payload));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `x-api-key ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ [BoldService] Error devuelto por la API de Bold:");
        console.error(JSON.stringify(data, null, 2));
        throw new Error("Error en la respuesta de Bold");
      }

      // Dependiendo de la versión de la API de Bold, devuelven la URL del link en una de estas variables
      const urlDePago = data.payload?.url || data.url || data.linkUrl || "";

      console.log("✅ [BoldService] Link creado exitosamente:", urlDePago);

      return urlDePago;

    } catch (error: any) {
      console.error("❌ [BoldService] Excepción capturada:", error.message);
      throw new Error("No se pudo generar el link de pago con Bold.");
    }
  }
}