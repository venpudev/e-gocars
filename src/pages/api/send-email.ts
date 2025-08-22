import type { APIContext } from "astro";
import { Resend } from "resend";

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const HCAPTCHA_SECRET_KEY = import.meta.env.HCAPTCHA_SECRET_KEY;

export async function POST({ request }: APIContext) {
  try {
    const data = await request.json();
    const { name, email, phone, message, interest } = data;
    const captchaToken = data['h-captcha-response'];

    if (HCAPTCHA_SECRET_KEY && captchaToken) {
      const verifyUrl = `https://hcaptcha.com/siteverify`;
      const params = new URLSearchParams();
      params.append('response', captchaToken);
      params.append('secret', HCAPTCHA_SECRET_KEY);
      
      const captchaResponse = await fetch(verifyUrl, {
        method: 'POST',
        body: params,
      });

      const captchaResult = await captchaResponse.json();
      if (!captchaResult.success) {
        return new Response(JSON.stringify({ error: "Verificación de Captcha fallida." }), { status: 400 });
      }
    }

    let htmlContent = `
      <h2>Nuevo mensaje desde el sitio web E-GoCars (PRUEBA)</h2>
      <p><strong>Nombre:</strong> ${name || 'No especificado'}</p>
      <p><strong>Email:</strong> ${email || 'No especificado'}</p>
      <p><strong>Teléfono:</strong> ${phone || 'No especificado'}</p>
      <p><strong>Interés:</strong> ${interest || 'No especificado'}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message || 'No especificado'}</p>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: "E-GoCars <onboarding@resend.dev>",
      to: ["maravena@eserp.cl"], // <-- ÚNICO CORREO DE PRUEBA
      subject: `(PRUEBA E-GoCars) Mensaje de ${name}`,
      html: htmlContent,
    });

    if (error) {
      throw new Error(error.message);
    }

    return new Response(JSON.stringify({ success: true, data: emailData }), { status: 200 });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Error interno del servidor" }), { status: 500 });
  }
}