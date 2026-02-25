export interface Env {
  TURNSTILE_SECRET_KEY: string;
  CONTACT_EMAIL: string;
}

export interface EmailRequest {
  name: string;
  email: string;
  message: string;
  turnstileVerified: boolean;
  turnstileToken: string | null;
  clientIP: string;
}

export interface EmailResponse {
  success: boolean;
  error?: string;
}

export default {
  async email(request: Request, env: Env): Promise<Response> {
    const body = await request.json() as EmailRequest;

    // Validation
    if (!body.name || !body.email || !body.message) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (body.message.length < 10) {
      return new Response(
        JSON.stringify({ error: "Message too short (min 10 characters)." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // If Turnstile was not verified but token provided, still proceed with warning
    if (body.turnstileToken && !body.turnstileVerified) {
      console.warn("Turnstile token provided but not verified. Proceeding anyway.");
    }

    // Send to contact email
    const emailRes = await fetch(`mailto:${env.CONTACT_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        subject: `New message from ${body.name}`,
        from: body.email,
        body: body.message,
      }),
    });

    if (!emailRes.ok) {
      console.error("Email sending failed");
      return new Response(
        JSON.stringify({ error: "Failed to send email." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`Email sent from ${body.email} to ${env.CONTACT_EMAIL}`);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  },
};
