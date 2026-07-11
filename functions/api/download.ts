interface Env {
  RESEND_API_KEY: string;
  MARKETING_EMAIL: string;
  FROM_EMAIL: string;
}

// Gated resource download: capture the lead's email, notify ABS, and email the
// requester the download link. Emails are best-effort — the client reveals the
// direct download regardless, so a mail hiccup never blocks the user.
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const data = await context.request.json<{
      email: string;
      resource?: string;
      file?: string;
      website?: string; // honeypot — must stay empty
    }>();

    // Honeypot: silently accept bot submissions without sending anything.
    if (data.website) {
      return json({ ok: true });
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return json({ error: 'Invalid email' }, 400);
    }

    // Only ever link to our own /downloads/ files (no arbitrary URLs).
    const file = (data.file || '').startsWith('/downloads/') ? data.file! : '';
    const link = file ? new URL(context.request.url).origin + file : '';
    const resource = data.resource || 'guide';

    if (!context.env.RESEND_API_KEY || context.env.RESEND_API_KEY === 're_placeholder') {
      console.warn('[download] RESEND_API_KEY is missing or a placeholder — emails will NOT be delivered. Set a real key in the Cloudflare dashboard before launch.');
    }

    const send = (to: string, subject: string, html: string) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: context.env.FROM_EMAIL, to, subject, html }),
      }).catch((e) => { console.error('[download] email failed', e); });

    // 1) Notify ABS of the lead.
    await send(
      context.env.MARKETING_EMAIL,
      `Resource download — ${escape(resource)}`,
      `<h2>Resource downloaded</h2>
       <p><strong>Email:</strong> ${escape(data.email)}</p>
       <p><strong>Resource:</strong> ${escape(resource)}</p>`,
    );

    // 2) Deliver the link to the requester.
    if (link) {
      await send(
        data.email,
        `Your download: ${escape(resource)}`,
        `<p>Thanks for your interest in ABS Certifications &amp; Advisory.</p>
         <p>Here is the guide you requested — <strong>${escape(resource)}</strong>:</p>
         <p><a href="${link}">Download ${escape(resource)}</a></p>
         <p>If you'd like a fixed-price certification quote, just reply to this email.</p>
         <p>— ABS Certifications &amp; Advisory</p>`,
      );
    }

    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ error: 'Internal server error' }, 500);
  }
};

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function escape(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
