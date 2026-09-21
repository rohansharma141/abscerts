interface Env {
  RESEND_API_KEY: string;
  NOTIFICATION_EMAIL: string;
  FROM_EMAIL: string;
}

// "Book a free consultation" popup (contact page: the closing banner button and the "Book a meeting" card)
// → same inbox as quote/contact/partner enquiries. A request for a call, not a booked slot: ABS replies to
// arrange a time (content review, decision §8.2).
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const data = await context.request.json<{
      name: string;
      email: string;
      phone: string;
      country: string;
      service: string;          // service area (the 9 service groups + "Other")
      company?: string;         // optional
      message?: string;         // optional — what they'd like to discuss
      preferredTimes?: string;  // optional — free text, e.g. "Tuesday or Wednesday afternoon"
      website?: string;         // honeypot — must stay empty
    }>();

    // Honeypot: if a bot filled the hidden "website" field, pretend success and skip the email send.
    if (data.website) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Basic validation
    if (!data.name || !data.email || !data.phone || !data.country || !data.service) {
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
      console.warn('[consultation] RESEND_API_KEY is missing or a placeholder — email will NOT be delivered. Set a real key in the Cloudflare dashboard before launch.');
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
        subject: `New consultation request — ${data.company || data.name} (${data.country})`,
        html: `
          <h2>New consultation request</h2>
          <p><strong>Name:</strong> ${escape(data.name)}</p>
          <p><strong>Email:</strong> ${escape(data.email)}</p>
          <p><strong>Phone:</strong> ${escape(data.phone)}</p>
          ${data.company ? `<p><strong>Company:</strong> ${escape(data.company)}</p>` : ''}
          <p><strong>Country:</strong> ${escape(data.country)}</p>
          <p><strong>Service area:</strong> ${escape(data.service)}</p>
          ${data.message ? `<p><strong>What they'd like to discuss:</strong><br>${escape(data.message)}</p>` : ''}
          ${data.preferredTimes ? `<p><strong>Preferred days and times:</strong> ${escape(data.preferredTimes)}</p>` : ''}
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
