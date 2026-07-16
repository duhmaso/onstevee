const ALLOWED_ORIGINS = new Set([
  'https://subbasses.com',
  'https://www.subbasses.com',
]);

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://subbasses.com',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    if (url.pathname === '/counts' && request.method === 'GET') {
      const list = await env.play_counts.list();
      const counts = {};
      await Promise.all(list.keys.map(async (key) => {
        counts[key.name] = Number(await env.play_counts.get(key.name)) || 0;
      }));

      return new Response(JSON.stringify(counts), {
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname === '/play' && request.method === 'POST') {
      const body = await request.json().catch(() => null);
      const track = body && typeof body.track === 'string' ? body.track.slice(0, 300) : null;

      if (!track) {
        return new Response(JSON.stringify({ error: 'Missing track' }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      const current = Number(await env.play_counts.get(track)) || 0;
      const next = current + 1;
      await env.play_counts.put(track, String(next));

      return new Response(JSON.stringify({ track, count: next }), {
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not found', { status: 404, headers });
  },
};
