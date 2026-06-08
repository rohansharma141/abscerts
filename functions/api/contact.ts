interface Env {
  RESEND_API_KEY: string;
  NOTIFICATION_EMAIL: string;
  FROM_EMAIL: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const data = await context.request.json<{
      name: string;
      email: string;
      company: string;
      country: string;
      service: string;
      phone?: string;
      companySize?: string;
      message?: string;
      website?: string; // honeypot — must stay empty
    }>();

    // Honeypot: if a bot filled the hidden "website" field, pretend success and skip the email send.
    if (data.website) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Basic validation
    if (!data.name || !data.email || !data.company || !data.service) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Email-format sanity check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 });
    }

    if (!context.env.RESEND_API_KEY || context.env.RESEND_API_KEY === 're_placeholder') {
      console.warn('[contact] RESEND_API_KEY is missing or a placeholder — email will NOT be delivered. Set a real key in the Cloudflare dashboard before launch.');
    }

    // Send to internal team
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: context.env.FROM_EMAIL,
        to: context.env.NOTIFICATION_EMAIL,
        reply_to: data.email,
        subject: `New contact enquiry — ${data.company} (${data.country})`,
        html: `
          <h2>New contact enquiry</h2>
          <p><strong>Name:</strong> ${escape(data.name)}</p>
          <p><strong>Email:</strong> ${escape(data.email)}</p>
          <p><strong>Company:</strong> ${escape(data.company)}</p>
          <p><strong>Country:</strong> ${escape(data.country)}</p>
          <p><strong>Service:</strong> ${escape(data.service)}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${escape(data.phone)}</p>` : ''}
          ${data.companySize ? `<p><strong>Company size:</strong> ${escape(data.companySize)}</p>` : ''}
          ${data.message ? `<p><strong>Message:</strong><br>${escape(data.message)}</p>` : ''}
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
