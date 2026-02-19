interface Env {
  TURNSTILE_SECRET_KEY: string;
  CONTACT_EMAIL: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const formData = await context.request.formData();
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();
  const token = formData.get("cf-turnstile-response")?.toString();
  const website = formData.get("website")?.toString();

  // Honeypot: bots fill hidden fields, humans don't
  if (website) {
    return Response.json({ success: true });
  }

  // Validate required fields
  if (!name || !email || !message) {
    return Response.json({ error: "All fields are required." }, { status: 400 });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Response.json({ error: "Invalid email address." }, { status: 400 });
  }

  // Message length validation
  if (message.length < 10) {
    return Response.json({ error: "Message too short (min 10 characters)." }, { status: 400 });
  }

  if (!token) {
    return Response.json({ error: "Turnstile verification missing." }, { status: 400 });
  }

  // Verify Turnstile token
  const verification = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: context.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: context.request.headers.get("CF-Connecting-IP") || "",
      }),
    }
  );

  const result = await verification.json() as { success: boolean };

  if (!result.success) {
    return Response.json({ error: "Turnstile verification failed." }, { status: 403 });
  }

  // Send email via MailChannels
  const emailResponse = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      personalizations: [
        {
          to: [
            {
              email: context.env.CONTACT_EMAIL || "fallback@danctrl.dev",
              name: "Daniel Guntermann",
            },
          ],
        },
      ],
      from: {
        email: "noreply@danctrl.dev",
        name: "danctrl.dev Contact Form",
      },
      reply_to: {
        email: email,
        name: name,
      },
      subject: `Portfolio Contact: ${name}`,
      content: [
        {
          type: "text/html",
          value: `
            <h2>New message from danctrl.dev</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <hr>
            <p>${message.replace(/\n/g, "<br>")}</p>
          `,
        },
      ],
    }),
  });

  if (!emailResponse.ok) {
    return Response.json({ error: "Failed to send message." }, { status: 500 });
  }

  return Response.json({ success: true });
};
