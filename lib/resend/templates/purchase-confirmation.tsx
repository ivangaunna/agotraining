interface PurchaseConfirmationEmailProps {
  customerName: string
  planTitle: string
  amount: number
  currency: string
  purchaseDate: string
  dashboardUrl: string
}

export function PurchaseConfirmationEmail({
  customerName,
  planTitle,
  amount,
  currency,
  purchaseDate,
  dashboardUrl,
}: PurchaseConfirmationEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Compra confirmada — AgoTraining</title>
</head>
<body style="margin:0;padding:0;background-color:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0A;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#111111;border-radius:12px;overflow:hidden;border:1px solid #1f1f1f;">

          <!-- Header -->
          <tr>
            <td style="background-color:#2563EB;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">AgoTraining</h1>
              <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;">Tu transformación comienza hoy</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;color:#9ca3af;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Compra confirmada</p>
              <h2 style="margin:0 0 24px;color:#ffffff;font-size:24px;font-weight:600;">¡Hola, ${customerName}!</h2>
              <p style="margin:0 0 32px;color:#9ca3af;font-size:16px;line-height:1.6;">
                Tu pago fue procesado exitosamente. Ya podés acceder a tu plan de entrenamiento desde tu dashboard.
              </p>

              <!-- Purchase Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:8px;overflow:hidden;margin-bottom:32px;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #2a2a2a;">
                    <p style="margin:0 0 4px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Plan adquirido</p>
                    <p style="margin:0;color:#ffffff;font-size:16px;font-weight:600;">${planTitle}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #2a2a2a;">
                    <p style="margin:0 0 4px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Monto</p>
                    <p style="margin:0;color:#2563EB;font-size:20px;font-weight:700;">${currency} ${amount.toLocaleString('es-AR')}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Fecha de compra</p>
                    <p style="margin:0;color:#ffffff;font-size:14px;">${purchaseDate}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${dashboardUrl}" style="display:inline-block;background-color:#2563EB;color:#ffffff;font-size:16px;font-weight:600;padding:16px 40px;border-radius:8px;text-decoration:none;letter-spacing:0.3px;">
                      Acceder a mi plan
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #1f1f1f;text-align:center;">
              <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">
                ¿Tenés alguna consulta? Escribinos por
                <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace('+', '')}" style="color:#2563EB;text-decoration:none;">WhatsApp</a>
              </p>
              <p style="margin:0;color:#4b5563;font-size:12px;">© ${new Date().getFullYear()} AgoTraining. Todos los derechos reservados.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export async function sendPurchaseConfirmationEmail({
  to,
  customerName,
  planTitle,
  amount,
  currency,
  purchaseDate,
}: {
  to: string
  customerName: string
  planTitle: string
  amount: number
  currency: string
  purchaseDate: string
}) {
  const { resend } = await import('../client')
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `✅ Compra confirmada — ${planTitle}`,
    html: PurchaseConfirmationEmail({
      customerName,
      planTitle,
      amount,
      currency,
      purchaseDate,
      dashboardUrl,
    }),
  })
}
