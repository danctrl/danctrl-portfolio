# danctrl.dev

Personal portfolio for [Daniel Guntermann](https://danctrl.dev) — DevOps / AI / Cybersecurity.

Built as a single-page site with a "build log" aesthetic: minimal, dark-first, technical.

## Stack

- **[Astro](https://astro.build)** — static site generation
- **[Tailwind CSS v4](https://tailwindcss.com)** — utility-first styling
- **Cloudflare Pages** — hosting & edge functions
- **Cloudflare Turnstile** — bot-resistant contact form
- **TypeScript** — throughout

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Cloudflare Pages

1. Push this repo to GitHub (already done).
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the `danctrl-portfolio` repository.
4. Set the build configuration:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
5. Add the following **Environment Variables** (Settings → Environment Variables):

   | Variable | Description |
   |---|---|
   | `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key |
   | `CONTACT_EMAIL` | Address to receive contact form submissions |

6. Click **Save and Deploy**.

Every push to `master` triggers an automatic redeploy.

## Project Structure

```
src/
  components/   # Astro components (Hero, Timeline, Projects, Contact …)
  layouts/      # Base Layout.astro
  pages/        # index.astro
functions/
  api/
    contact.ts  # Cloudflare Pages Function – contact form handler
public/         # Static assets
```

## License

MIT
