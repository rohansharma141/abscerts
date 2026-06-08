interface Env {
  RESEND_API_KEY: string;
  MARKETING_EMAIL: string;
  FROM_EMAIL: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const data = await context.request.json<{
      type: 'email' | 'phone';
      email?: string;
      phone?: string;
      website?: string; // honeypot — must stay empty
    }>();

    // Honeypot: if a bot filled the hidden "website" field, pretend success and skip the email send.
    if (data.website) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Basic validation — need a type and the matching contact value.
    if (data.type === 'email') {
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return new Response(JSON.stringify({ error: 'Invalid email' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else if (data.type === 'phone') {
      if (!data.phone) {
        return new Response(JSON.stringify({ error: 'Missing phone' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else {
      return new Response(JSON.stringify({ error: 'Invalid type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!context.env.RESEND_API_KEY || context.env.RESEND_API_KEY === 're_placeholder') {
      console.warn('[newsletter] RESEND_API_KEY is missing or a placeholder — email will NOT be delivered. Set a real key in the Cloudflare dashboard before launch.');
    }

    // Forward to marketing
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: context.env.FROM_EMAIL,
        to: context.env.MARKETING_EMAIL,
        ...(data.type === 'email' && data.email ? { reply_to: data.email } : {}),
        subject: `New lead from exit popup — ${data.type}`,
        html: `
          <h2>New lead from exit popup</h2>
          <p><strong>Preferred contact:</strong> ${escape(data.type)}</p>
          ${data.email ? `<p><strong>Email:</strong> ${escape(data.email)}</p>` : ''}
          ${data.phone ? `<p><strong>Phone:</strong> ${escape(data.phone)}</p>` : ''}
        `,
      }),
    });

    if (!emailRes.ok) throw new Error('Email send failed');

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

function escape(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
