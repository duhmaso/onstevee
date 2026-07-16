# Play count worker

Tiny Cloudflare Worker that stores a play count per track in KV, so the counts
shown on subbasses.com persist across all visitors (a static GitHub Pages site
can't do this on its own).

## Endpoints
- `GET /counts` -> `{ "music/adjust 145.mp3": 12, ... }`
- `POST /play` with JSON body `{ "track": "music/adjust 145.mp3" }` -> increments
  and returns `{ "track": ..., "count": ... }`

## Deploy
1. Install wrangler and log in: `npm install -g wrangler` then `wrangler login`
   (needs a free Cloudflare account).
2. Create the KV namespace: `wrangler kv namespace create PLAY_COUNTS`
3. Copy the returned `id` into `wrangler.toml` in place of
   `REPLACE_WITH_KV_NAMESPACE_ID`.
4. Deploy: `wrangler deploy`
5. Wrangler prints a URL like
   `https://subbasses-play-counts.<your-subdomain>.workers.dev`.
   Put that URL into `PLAY_COUNT_API` near the top of the player script in
   `index.html`.

If subbasses.com's DNS is on Cloudflare, you can instead map a route like
`subbasses.com/api/*` to this Worker to avoid CORS entirely — not required,
the `workers.dev` URL with CORS works fine as-is.
