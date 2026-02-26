import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext/browser";

interface Env {
  DESTINATION_EMAIL: string;
  SEND_EMAIL: SendEmail;
}

export default {
  async email(message: ForwardableEmailMessage, env: Env) {
    await message.forward(env.DESTINATION_EMAIL || "d.guntermann@me.com");
  },

  async fetch(request: Request, env: Env) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    interface MailBody {
      name: string;
      email: string;
      message: string;
      destination: string;
    }

    let body: MailBody;
    try {
      body = await request.json() as MailBody;
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { name, email, message: msg, destination } = body;
    if (!name || !email || !msg || !destination) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sender = "noreply@danctrl.dev";

    try {
      const mime = createMimeMessage();
      mime.setSender({ name: "danctrl.dev Contact Form", addr: sender });
      mime.setRecipient(destination);
      mime.setSubject(`Portfolio Contact: ${name}`);
      mime.addMessage({
        contentType: "text/plain",
        data: `New message from danctrl.dev\n\nName: ${name}\nEmail: ${email}\n\n${msg}`,
      });
      mime.addMessage({
        contentType: "text/html",
        data: `<h2>New message from danctrl.dev</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr><p>${msg.replace(/\n/g, "<br>")}</p>`,
      });

      await env.SEND_EMAIL.send(new EmailMessage(sender, destination, mime.asRaw()));
    } catch (err) {
      return Response.json({ error: "Failed to send email" }, { status: 500 });
    }

    return Response.json({ success: true });
  },
};
