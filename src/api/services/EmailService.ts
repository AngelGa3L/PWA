import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

class EmailService {
  async sendTwoFactorCode(email: string, code: string, userName: string) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'SmartEntry <noreply@smartentry.space>',
        to: [email],
        subject: 'Código de verificación - SmartEntry',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .container {
                  background-color: #f9f9f9;
                  border-radius: 10px;
                  padding: 30px;
                  border: 1px solid #e0e0e0;
                }
                .header {
                  text-align: center;
                  margin-bottom: 30px;
                }
                .code-box {
                  background-color: #fff;
                  border: 2px solid #4CAF50;
                  border-radius: 8px;
                  padding: 20px;
                  text-align: center;
                  margin: 30px 0;
                }
                .code {
                  font-size: 36px;
                  font-weight: bold;
                  color: #4CAF50;
                  letter-spacing: 8px;
                  font-family: 'Courier New', monospace;
                }
                .warning {
                  background-color: #fff3cd;
                  border-left: 4px solid #ffc107;
                  padding: 15px;
                  margin-top: 20px;
                  border-radius: 4px;
                }
                .footer {
                  text-align: center;
                  margin-top: 30px;
                  font-size: 12px;
                  color: #666;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="color: #4CAF50; margin: 0;">🔐 SmartEntry</h1>
                  <p style="color: #666; margin-top: 5px;">Autenticación de Dos Factores</p>
                </div>
                
                <p>Hola <strong>${userName}</strong>,</p>
                
                <p>Has solicitado iniciar sesión en tu cuenta. Para continuar, utiliza el siguiente código de verificación:</p>
                
                <div class="code-box">
                  <div class="code">${code}</div>
                </div>
                
                <p style="text-align: center; color: #666;">
                  Este código expirará en <strong>5 minutos</strong>.
                </p>
                
                <div class="warning">
                  <p style="margin: 0;">
                    <strong>⚠️ Importante:</strong> Si no solicitaste este código, ignora este correo. 
                    Nunca compartas este código con nadie.
                  </p>
                </div>
                
                <div class="footer">
                  <p>Este es un correo automático, por favor no respondas.</p>
                  <p>&copy; ${new Date().getFullYear()} SmartEntry. Todos los derechos reservados.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      if (error) {
        console.error('❌ Error enviando email con Resend:', error);
        throw new Error(`Error sending email: ${error.message}`);
      }

      console.log('✅ Email enviado correctamente:', data);
      return data;
    } catch (error) {
      console.error('❌ Error en EmailService:', error);
      throw error;
    }
  }
}

export default new EmailService();
