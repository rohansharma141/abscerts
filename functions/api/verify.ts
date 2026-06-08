interface Env {
  CERTIFICATES: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const ref = url.searchParams.get('ref')?.trim().toUpperCase();

  if (!ref || !/^ABS-\d{4}-[A-Z]{2}-\d{5}$/.test(ref)) {
    return new Response(JSON.stringify({ valid: false, error: 'Invalid reference format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const record = await context.env.CERTIFICATES.get(ref, 'json');

  if (!record) {
    return new Response(JSON.stringify({ valid: false }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ valid: true, ...record }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
