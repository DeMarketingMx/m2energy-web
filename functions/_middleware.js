// Cloudflare Pages middleware — consolida el host canónico.
// Redirige www.m2energy.org → m2energy.org (apex) con 301, preservando path + query.
// Todo lo demás (apex, *.pages.dev, assets, /api/*) pasa intacto vía next().
// Nota: _redirects de CF Pages NO hace match por hostname (solo por path), por eso
// la canonicalización www→apex se resuelve aquí, a nivel de Function.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === 'www.m2energy.org') {
    url.hostname = 'm2energy.org';
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
