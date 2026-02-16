interface Env {
  TURNSTILE_SECRET_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const formData = await context.request.formData();
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();
  const token = formData.get("cf-turnstile-response")?.toString();

  // Validate required fields
  if (!name || !email || !message) {
    return Response.json({ error: "All fields are required." }, { status: 400 });
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

  const result = await verification.json<{ success: boolean }>();

  if (!result.success) {
    return Response.json({ error: "Turnstile verification failed." }, { status: 403 });
  }

  // TODO: Process the contact form (e.g. send email via Mailchannels, store in D1, etc.)
  console.log("Contact form submission:", { name, email, message });

  return Response.json({ success: true });
};
