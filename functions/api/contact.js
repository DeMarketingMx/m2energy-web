// Cloudflare Pages Function — POST /api/contact
// Recibe el lead del formulario ECRA y lo envía por email vía Resend.
// La API key vive como secret de entorno: RESEND_API_KEY (NUNCA en el repo).

const JSON_HEADERS = { 'Content-Type': 'application/json' };

// Destinatario(s) del aviso de lead. Ajustable vía env LEAD_TO (CSV).
const DEFAULT_TO = 'miguel.cantu@profitops.com, juan.pablorenterias@profitops.com, monte@m2energy.org, juanpablo@demarketing.mx, miguel@demarketing.mx';
// Remitente: dominio verificado en Resend (demarketing.mx). Ajustable vía env LEAD_FROM.
const DEFAULT_FROM = 'M2 Energy <noreply@demarketing.mx>';

function esc(v) {
  if (v === null || v === undefined) return '';
  return String(v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function row(label, value) {
  if (value === '' || value === null || value === undefined) return '';
  return `<tr>
    <td style="padding:6px 14px 6px 0;color:#7a8a99;font:600 12px/1.4 system-ui,sans-serif;text-transform:uppercase;letter-spacing:.04em;vertical-align:top;white-space:nowrap">${esc(label)}</td>
    <td style="padding:6px 0;color:#0d1a23;font:14px/1.5 system-ui,sans-serif">${esc(value)}</td>
  </tr>`;
}

export async function onRequestPost({ request, env }) {
  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ ok: false, error: 'Server not configured (missing RESEND_API_KEY).' }), { status: 500, headers: JSON_HEADERS });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body.' }), { status: 400, headers: JSON_HEADERS });
  }

  // Validación mínima
  const name = (data.name || '').trim();
  const email = (data.email || '').trim();
  const company = (data.company || '').trim();
  if (!name || !email) {
    return new Response(JSON.stringify({ ok: false, error: 'Faltan campos obligatorios (nombre, email).' }), { status: 422, headers: JSON_HEADERS });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: 'Email inválido.' }), { status: 422, headers: JSON_HEADERS });
  }

  const ptype = Array.isArray(data.ptype) ? data.ptype.join(', ') : (data.ptype || '');

  const html = `<div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e4e9ee;border-radius:12px;overflow:hidden">
    <div style="background:#0d1a23;padding:20px 24px">
      <div style="color:#f6be1f;font:700 13px/1 system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase">Nuevo lead · M2 Energy</div>
      <div style="color:#fff;font:600 20px/1.3 system-ui,sans-serif;margin-top:6px">${esc(company || data.source || 'Nuevo lead')}${(data.score !== undefined && data.score !== null && data.score !== '') ? ' — Score ECRA ' + esc(data.score) : ''}</div>
    </div>
    <div style="padding:20px 24px">
      <table style="border-collapse:collapse;width:100%">
        ${row('Empresa', company)}
        ${row('Nombre', name)}
        ${row('Cargo', data.role)}
        ${row('Email', email)}
        ${row('Teléfono', data.phone)}
        ${row('Idioma', data.lang)}
        ${row('Tipo de proyecto', ptype)}
        ${row('Etapa', data.stage)}
        ${row('Ubicación', data.loc)}
        ${row('Arranque objetivo', data.golive)}
        ${row('Carga (kVA)', data.kva)}
        ${row('Crecimiento 5a', data.growth ? data.growth + '%' : '')}
        ${row('Perfil de carga', data.lprofile)}
        ${row('Etapa CFE', data.cfe)}
        ${row('Riesgo cronograma', data.riskTimeline)}
        ${row('Riesgo capacidad', data.riskCapacity)}
        ${row('Riesgo infraestructura', data.riskInfra)}
        ${row('Riesgo costos', data.riskCost)}
        ${row('Score ECRA', data.score)}
        ${row('Nivel de riesgo', data.riskLevel)}
      </table>
      ${data.msg ? `<div style="margin-top:16px;padding:14px 16px;background:#f6f8fa;border-radius:8px;color:#0d1a23;font:14px/1.6 system-ui,sans-serif"><strong style="display:block;color:#7a8a99;font-size:12px;text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px">Mensaje</strong>${esc(data.msg)}</div>` : ''}
    </div>
  </div>`;

  const payload = {
    from: env.LEAD_FROM || DEFAULT_FROM,
    to: (env.LEAD_TO || DEFAULT_TO).split(',').map(s => s.trim()),
    reply_to: email,
    subject: `Lead M2E · ${company || data.source || 'Web'} (${name})`,
    html,
  };

  const resendResp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!resendResp.ok) {
    const detail = await resendResp.text();
    return new Response(JSON.stringify({ ok: false, error: 'Resend rejected the request.', detail }), { status: 502, headers: JSON_HEADERS });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: JSON_HEADERS });
}

// Rechaza otros métodos limpiamente
export async function onRequest({ request }) {
  if (request.method === 'POST') return; // manejado arriba
  return new Response(JSON.stringify({ ok: false, error: 'Method not allowed.' }), { status: 405, headers: JSON_HEADERS });
}
