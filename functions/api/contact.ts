interface Env {
  TURNSTILE_SECRET_KEY: string;
  CONTACT_EMAIL: string;
  MAILER: Fetcher; // Service Binding to danctrl-portfolio-mailer Worker
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

  const result = await verification.json() as { success: boolean; "error-codes"?: string[] };

  if (!result.success) {
    return Response.json(
      { error: "Turnstile verification failed.", codes: result["error-codes"] },
      { status: 403 }
    );
  }

  // Forward to danctrl-portfolio-mailer Worker via Service Binding
  try {
    const mailerResponse = await context.env.MAILER.fetch(
      new Request("https://danctrl-portfolio-mailer.danctrl.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          destination: context.env.CONTACT_EMAIL,
        }),
      })
    );

    if (!mailerResponse.ok) {
      const err = await mailerResponse.json() as { error?: string };
      console.error("Mailer error:", err);
      return Response.json({ error: "Failed to send message." }, { status: 500 });
    }
  } catch (err) {
    console.error("Service binding error:", err);
    return Response.json({ error: "Failed to send message." }, { status: 500 });
  }

  return Response.json({ success: true });
};
