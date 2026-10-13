/**
 * AFK Gaming Hub API scaffold — owner-only dashboard routes.
 * This deliberately fails closed until Google OAuth and server-side sessions are implemented.
 * Never expose provider secrets or trust frontend-only authentication.
 */
const json = (body, status = 200, extraHeaders = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...extraHeaders }
  });

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin");
  const allowed = env.PUBLIC_SITE_ORIGIN;
  if (origin && allowed && origin === allowed) {
    return {
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "Content-Type,Authorization",
      "access-control-allow-credentials": "true",
      "vary": "Origin"
    };
  }
  return {};
}

export default {
  async fetch(request, env) {
    const headers = corsHeaders(request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    const url = new URL(request.url);

    if (url.pathname === "/api/health" && request.method === "GET") {
      return json({ ok: true, service: "AFK Gaming Hub API", mode: "owner-dashboard-scaffold" }, 200, headers);
    }

    if (url.pathname === "/auth/google/start" && request.method === "GET") {
      // TODO: Generate cryptographically random state + PKCE; persist state server-side;
      // redirect to Google's OAuth endpoint using an exact registered redirect URI.
      return json({ error: "Google OAuth setup is incomplete. Owner login is disabled." }, 501, headers);
    }

    if (url.pathname === "/auth/google/callback" && request.method === "GET") {
      // TODO: Validate one-time state and PKCE, exchange code server-side, validate
      // Google ID token issuer/audience/expiry, then allow only env.OWNER_EMAIL.
      // Create a secure HttpOnly + Secure + SameSite session cookie; store only hashed session IDs.
      return json({ error: "OAuth callback is not configured." }, 501, headers);
    }

    if (url.pathname === "/auth/logout" && request.method === "POST") {
      // TODO: Revoke/delete the server-side session and clear the cookie.
      return json({ error: "Logout endpoint is not configured." }, 501, headers);
    }

    if (url.pathname === "/api/owner/earnings" && request.method === "GET") {
      // TODO: Require a valid server-side session on EVERY request and verify
      // the session user email equals env.OWNER_EMAIL. Return only the minimum
      // necessary aggregated totals; never expose OAuth refresh tokens.
      return json({ error: "Owner-only earnings are disabled until Google OAuth and authorization are implemented." }, 501, headers);
    }

    if (url.pathname === "/api/owner/adsense" && request.method === "GET") {
      // TODO: Use server-held credentials with the authorized AdSense Management API.
      return json({ error: "AdSense integration is not configured." }, 501, headers);
    }

    if (url.pathname === "/api/owner/affiliate" && request.method === "GET") {
      // TODO: Pull partner reports only where an official API is available; otherwise
      // allow owner-only CSV import and validate it server-side.
      return json({ error: "Affiliate reporting is not configured." }, 501, headers);
    }

    if (url.pathname === "/api/owner/premium-sales" && request.method === "GET") {
      // TODO: Aggregate verified payment webhooks from the payment provider.
      return json({ error: "Premium sales reporting is not configured." }, 501, headers);
    }

    return json({ error: "Not found" }, 404, headers);
  }
};
