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

  // If no token provided, still validate and allow submission
  if (!token) {
    // Don't block submission if token validation failed
    // But warn that Turnstile wasn't used
    console.warn("No Turnstile token provided, proceeding without verification");
  }

  // Verify Turnstile token if provided
  let turnstileVerified = false;
  if (token) {
    try {
      const verification = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: "0x4AAAAAAChqvxwddP2s5kKTJEq7HifURfk",
            response: token,
            remoteip: context.request.headers.get("CF-Connecting-IP") || "",
          }),
        }
      );

      const result = await verification.json() as { success: boolean; "error-codes"?: string[] };

      if (result.success) {
        turnstileVerified = true;
      } else {
        console.warn("Turnstile verification failed:", result["error-codes"]);
        return Response.json(
          { error: "CAPTCHA verification failed.", codes: result["error-codes"] },
          { status: 403 }
        );
      }
    } catch (err) {
      console.error("Turnstile verification error:", err);
      // Don't fail completely on verification error, log and continue
      return Response.json(
        { error: "CAPTCHA verification failed. Please try again." },
        { status: 403 }
      );
    }
  }

  // Forward to danctrl-portfolio-mailer Worker via Service Binding
  try {
    const mailerResponse = await context.env.MAILER.fetch(
      new Request("https://danctrl-portfolio-mailer.danctrl.workers.dev/api/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add client IP for additional bot protection
          "CF-Connecting-IP": context.request.headers.get("CF-Connecting-IP") || "",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          destination: context.env.CONTACT_EMAIL,
          turnstileVerified,
          turnstileToken: token,
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
