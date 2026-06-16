import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private apiKey: string | undefined;
  private fromEmail: string | undefined;
  private fromName: string;
  private frontendUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('BREVO_API_KEY');
    this.fromEmail = this.configService.get<string>('BREVO_FROM_EMAIL');
    this.fromName = this.configService.get<string>('BREVO_FROM_NAME') || '4Persona Vun Diego';
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
  }

  async sendReportEmail(
    toEmail: string,
    toName: string,
    reportToken: string,
    personaPrimer: string,
  ): Promise<void> {
    if (!this.apiKey || !this.fromEmail) {
      console.warn('⚠️  Brevo API key tidak diset. Email tidak terkirim.');
      return;
    }

    const reportUrl = `${this.frontendUrl}/report/${reportToken}`;

    const ELEMENT_NAMES: Record<string, string> = {
      API: 'Api (Choleric)',
      AIR: 'Air (Melancholic)',
      ANGIN: 'Angin (Sanguine)',
      TANAH: 'Tanah (Phlegmatic)',
    };

    const personaName = ELEMENT_NAMES[personaPrimer] || personaPrimer;
    const firstName = toName.split(' ')[0];

    const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:'Inter',Arial,sans-serif;background:#f8f6f2;color:#1c1b19;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <tr><td style="background:#1c1b19;padding:40px;text-align:center;">
      <h1 style="color:#fff;font-size:28px;font-weight:400;letter-spacing:0.1em;margin:0;font-family:Georgia,serif;">Vun Diego</h1>
      <p style="color:rgba(255,255,255,0.5);font-size:12px;letter-spacing:0.15em;text-transform:uppercase;margin:8px 0 0;">4Persona Result</p>
    </td></tr>
    <tr><td style="padding:40px;">
      <p style="font-size:16px;color:#6b6560;margin:0 0 8px;">Halo, <strong style="color:#1c1b19;">${firstName}</strong>!</p>
      <h2 style="font-family:Georgia,serif;font-size:24px;font-weight:400;color:#1c1b19;margin:0 0 16px;line-height:1.3;">
        Persona utamamu adalah<br/><em style="color:#c9a96e;">${personaName}</em>
      </h2>
      <p style="color:#6b6560;font-size:15px;line-height:1.7;margin:0 0 32px;">
        Laporan lengkap kepribadianmu sudah siap! Klik tombol di bawah untuk melihat analisis mendalam, radar chart, dan rekomendasi parfum Vun Diego yang paling cocok untukmu.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="text-align:center;padding-bottom:32px;">
          <a href="${reportUrl}" style="display:inline-block;padding:16px 40px;background:#c9a96e;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">
            Lihat Laporan Lengkap →
          </a>
        </td></tr>
      </table>
      <p style="color:#a09890;font-size:12px;border-top:1px solid #efece6;padding-top:24px;margin:0;text-align:center;line-height:1.6;">
        Link berlaku <strong>30 hari</strong> · <a href="${reportUrl}" style="color:#c9a96e;">${reportUrl}</a>
      </p>
    </td></tr>
    <tr><td style="background:#f8f6f2;padding:20px 40px;text-align:center;border-top:1px solid #efece6;">
      <p style="color:#a09890;font-size:11px;margin:0;">© 2026 Vun Diego · Temukan Parfum Sesuai Kepribadianmu</p>
    </td></tr>
  </table>
</body>
</html>`;

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          sender: { email: this.fromEmail, name: this.fromName },
          to: [{ email: toEmail, name: toName }],
          subject: `🎉 Hasil Tesmu Sudah Siap, ${firstName}!`,
          htmlContent,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('❌ Brevo email error:', error);
      } else {
        console.log(`📧 Report email sent to ${toEmail}`);
      }
    } catch (err) {
      console.error('❌ Failed to send report email:', err?.message || err);
    }
  }
}
