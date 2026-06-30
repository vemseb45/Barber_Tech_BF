import crypto from 'crypto';

export class WebhookSecurity {

  static validateBoldSignature(rawBody: string, signature: string | null): boolean {
    if (!signature) return false;


    const secretKey = process.env.BOLD_WEBHOOK_SECRET || '';

    try {
      const encodedBody = Buffer.from(rawBody, 'utf-8').toString('base64');

      const hashed = crypto
        .createHmac('sha256', secretKey)
        .update(encodedBody)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(hashed),
        Buffer.from(signature)
      );
    } catch (error) {
      console.error('[Bold Webhook] Error procesando la firma:', error);
      return false;
    }
  }
}