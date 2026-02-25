/**
 * danctrl-mailer Worker
 *
 * Accepts POST requests from the danctrl-portfolio Pages Function via a
 * Service Binding and sends transactional email using Cloudflare's native
 * send_email binding.
 *
 * Expected JSON body:
 *   { name: string, email: string, message: string, destination: string }
 *
 * Environment bindings required:
 *   - SEND_EMAIL  →  Send email binding (noreply@danctrl.dev → d.guntermann@me.com)
 */

import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext/browser";

interface Env {
  SEND_EMAIL: SendEmail;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Only accept POST from the Pages Function (service binding calls are
    // same-origin, but we validate the method regardless)
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    let body: { name: string; email: string; message: string; destination: string };
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { name, email, message, destination } = body;

    if (!name || !email || !message || !destination) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sender = "noreply@danctrl.dev";

    try {
      const msg = createMimeMessage();
      msg.setSender({ name: "danctrl.dev Contact Form", addr: sender });
      msg.setRecipient(destination);
      msg.setHeader("Reply-To", email);
      msg.setSubject(`Portfolio Contact: ${name}`);
      msg.addMessage({
        contentType: "text/plain",
        data: `New message from danctrl.dev\n\nName: ${name}\nEmail: ${email}\n\n${message}`,
      });
      msg.addMessage({
        contentType: "text/html",
        data: `<h2>New message from danctrl.dev</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr><p>${message.replace(/\n/g, "<br>")}</p>`,
      });

      const emailMessage = new EmailMessage(sender, destination, msg.asRaw());
      await env.SEND_EMAIL.send(emailMessage);
    } catch (err) {
      console.error("send_email error:", err);
      return Response.json({ error: "Failed to send email" }, { status: 500 });
    }

    return Response.json({ success: true });
  },
};
