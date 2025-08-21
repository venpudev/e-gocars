import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

// Se inicializa Resend con la API Key desde las variables de entorno de Vercel
const resend = new Resend(import.meta.env.RESEND_API_KEY);
const HCAPTCHA_SECRET_KEY = import.meta.env.HCAPTCHA_SECRET_KEY;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, phone, message, interest } = data;
    const captchaToken = data['h-captcha-response'];

    // --- Verificación de hCaptcha en el Servidor ---
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
    // --- Fin de la Verificación ---

    let htmlContent = `
      <h2>Nuevo mensaje desde el sitio web E-GoCars</h2>
      <p><strong>Nombre:</strong> ${name || 'No especificado'}</p>
      <p><strong>Email:</strong> ${email || 'No especificado'}</p>
      <p><strong>Teléfono:</strong> ${phone || 'No especificado'}</p>
    `;

    if (interest) {
      htmlContent += `<p><strong>Interés:</strong> ${interest}</p>`;
    }

    htmlContent += `
      <p><strong>Mensaje:</strong></p>
      <p>${message || 'No especificado'}</p>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: "E-GoCars <onboarding@resend.dev>",
      to: ["gocarschile@gmail.com"], // <-- CORREO PRINCIPAL DEL CLIENTE
      cc: ["maravena@eserp.cl"],      // <-- TU CORREO PARA RECIBIR UNA COPIA
      subject: `(E-GoCars) Nuevo mensaje de ${name}`,
      html: htmlContent,
    });

    if (error) {
      throw new Error(error.message);
    }

    return new Response(JSON.stringify({ success: true, data: emailData }), { status: 200 });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Error interno del servidor" }), { status: 500 });
  }
};