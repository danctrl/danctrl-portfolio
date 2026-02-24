/**
 * portfolio-mailer
 *
 * Cloudflare Email Worker — receives emails forwarded by Email Routing
 * (from noreply@danctrl.dev) and forwards them to the destination address.
 *
 * Setup in Cloudflare Dashboard:
 *   1. Workers & Pages → Create → Worker → name it "portfolio-mailer"
 *   2. Paste this code into the editor and deploy
 *   3. Email → Email Routing → Custom Addresses → noreply@danctrl.dev
 *      → Action: Send to Worker → portfolio-mailer
 *   4. Add the environment variable FORWARD_TO (your real email address)
 *      in the Worker's Settings → Variables
 */

export default {
  async email(message, env, ctx) {
    const forwardTo = env.FORWARD_TO;

    if (!forwardTo) {
      console.error("FORWARD_TO environment variable is not set");
      message.setReject("Configuration error: no forward address");
      return;
    }

    await message.forward(forwardTo);
  },
};
