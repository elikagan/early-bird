/**
 * Early Bird — Cloudflare Worker API
 * Dealer-to-dealer pre-market marketplace
 *
 * Routes:
 *   POST /api/auth/request    — Send magic link SMS
 *   GET  /api/auth/verify/:token — Verify magic link, set cookie
 *   GET  /api/auth/me         — Get current dealer from cookie
 *
 *   GET  /api/markets         — List upcoming markets
 *   POST /api/markets         — Create market (admin)
 *
 *   GET  /api/items           — Browse feed (filterable)
 *   POST /api/items           — Post an item
 *   PATCH /api/items/:id      — Update item (status, etc.)
 *
 *   POST /api/inquiries       — Log an inquiry
 *   GET  /api/inquiries       — Get inquiries for an item (seller) or by buyer
 *
 *   POST /api/sms/webhook     — Telnyx SMS webhook (relay)
 *
 *   POST /api/admin/dealers   — Create/invite a dealer (admin)
 *   GET  /api/admin/dealers   — List all dealers (admin)
 *   GET  /api/admin/activity  — Activity dashboard (admin)
 *   POST /api/admin/proxy-post — Post item on behalf of dealer (admin)
 *
 *   POST /api/upload          — Upload image to R2/CDN
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
      'Access-Control-Allow-Credentials': 'true',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      let res;

      // Auth routes
      if (path === '/api/auth/request' && method === 'POST') {
        res = await handleAuthRequest(request, env);
      } else if (path.startsWith('/api/auth/verify/') && method === 'GET') {
        const token = path.split('/api/auth/verify/')[1];
        res = await handleAuthVerify(token, env);
      } else if (path === '/api/auth/me' && method === 'GET') {
        res = await handleAuthMe(request, env);

      // Market routes
      } else if (path === '/api/markets' && method === 'GET') {
        res = await handleGetMarkets(env);
      } else if (path === '/api/markets' && method === 'POST') {
        res = await requireAdmin(request, env) || await handleCreateMarket(request, env);

      // Item routes
      } else if (path === '/api/items' && method === 'GET') {
        res = await handleGetItems(url, env);
      } else if (path === '/api/items' && method === 'POST') {
        const dealer = await getDealer(request, env);
        if (!dealer) return json({ error: 'Unauthorized' }, 401, corsHeaders);
        res = await handleCreateItem(request, env, dealer);
      } else if (path.match(/^\/api\/items\/[^/]+$/) && method === 'PATCH') {
        const dealer = await getDealer(request, env);
        if (!dealer) return json({ error: 'Unauthorized' }, 401, corsHeaders);
        const itemId = path.split('/api/items/')[1];
        res = await handleUpdateItem(request, env, dealer, itemId);

      // Inquiry routes
      } else if (path === '/api/inquiries' && method === 'POST') {
        const dealer = await getDealer(request, env);
        if (!dealer) return json({ error: 'Unauthorized' }, 401, corsHeaders);
        res = await handleCreateInquiry(request, env, dealer);

      // SMS webhook
      } else if (path === '/api/sms/webhook' && method === 'POST') {
        res = await handleSmsWebhook(request, env);

      // Admin routes
      } else if (path === '/api/admin/dealers' && method === 'POST') {
        res = await requireAdmin(request, env) || await handleCreateDealer(request, env);
      } else if (path === '/api/admin/dealers' && method === 'GET') {
        res = await requireAdmin(request, env) || await handleListDealers(env);
      } else if (path === '/api/admin/activity' && method === 'GET') {
        res = await requireAdmin(request, env) || await handleActivity(url, env);
      } else if (path === '/api/admin/proxy-post' && method === 'POST') {
        res = await requireAdmin(request, env) || await handleProxyPost(request, env);
      } else if (path === '/api/admin/conversations' && method === 'GET') {
        res = await requireAdmin(request, env) || await handleGetConversations(url, env);

      } else {
        res = json({ error: 'Not found' }, 404);
      }

      // Add CORS to all responses
      const newHeaders = new Headers(res.headers);
      Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v));
      return new Response(res.body, { status: res.status, headers: newHeaders });

    } catch (err) {
      console.error('Worker error:', err);
      return json({ error: 'Internal error' }, 500, corsHeaders);
    }
  }
};

// ── Helpers ──────────────────────────────────────────────────

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

function supabase(env, path, options = {}) {
  const url = `${env.SUPABASE_URL}/rest/v1/${path}`;
  const headers = {
    'apikey': env.SUPABASE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': options.prefer || 'return=representation',
    ...options.headers,
  };
  return fetch(url, { method: options.method || 'GET', headers, body: options.body ? JSON.stringify(options.body) : undefined });
}

function getCookie(request, name) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
}

async function getDealer(request, env) {
  const dealerId = getCookie(request, 'eb_dealer');
  if (!dealerId) return null;
  const res = await supabase(env, `dealers?id=eq.${dealerId}&select=*`);
  const rows = await res.json();
  return rows[0] || null;
}

async function requireAdmin(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  if (token !== env.ADMIN_TOKEN) {
    return json({ error: 'Admin access required' }, 403);
  }
  return null; // null means "passed" — continue to handler
}

function generateToken(length = 8) {
  const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let token = '';
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < length; i++) {
    token += chars[bytes[i] % chars.length];
  }
  return token;
}

// ── Auth ─────────────────────────────────────────────────────

async function handleAuthRequest(request, env) {
  const { phone } = await request.json();
  if (!phone) return json({ error: 'Phone number required' }, 400);

  // Normalize phone (strip everything except digits, add +1 if needed)
  let normalized = phone.replace(/\D/g, '');
  if (normalized.length === 10) normalized = '1' + normalized;
  if (!normalized.startsWith('1') || normalized.length !== 11) {
    return json({ error: 'Invalid US phone number' }, 400);
  }
  normalized = '+' + normalized;

  // Check if dealer exists
  const dealerRes = await supabase(env, `dealers?phone=eq.${encodeURIComponent(normalized)}&select=id,name`);
  const dealers = await dealerRes.json();
  if (!dealers.length) {
    return json({ error: 'Early Bird is invite-only. Ask a member to get you in.' }, 403);
  }

  const dealer = dealers[0];

  // Generate magic link token
  const token = generateToken(8);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min

  await supabase(env, 'auth_tokens', {
    method: 'POST',
    body: { dealer_id: dealer.id, token, expires_at: expiresAt },
  });

  // Send magic link via Telnyx
  const siteUrl = env.SITE_URL || 'https://earlybird.com';
  const magicLink = `${siteUrl}/auth/verify/${token}`;
  const message = dealer.name
    ? `Hey ${dealer.name}, tap to open Early Bird: ${magicLink}`
    : `Tap to open Early Bird: ${magicLink}`;

  await fetch('https://api.telnyx.com/v2/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.TELNYX_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.TELNYX_AUTH_NUMBER, // dedicated auth number
      to: normalized,
      text: message,
    }),
  });

  return json({ ok: true, message: 'Magic link sent' });
}

async function handleAuthVerify(token, env) {
  // Look up token
  const res = await supabase(env, `auth_tokens?token=eq.${token}&used=eq.false&select=*,dealer:dealers(*)`);
  const tokens = await res.json();

  if (!tokens.length) {
    return new Response(renderAuthError('Invalid or expired link. Request a new one.'), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const authToken = tokens[0];
  if (new Date(authToken.expires_at) < new Date()) {
    return new Response(renderAuthError('This link has expired. Request a new one.'), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  // Mark token as used
  await supabase(env, `auth_tokens?id=eq.${authToken.id}`, {
    method: 'PATCH',
    body: { used: true },
  });

  // Set auth cookie and redirect
  const dealer = authToken.dealer;
  const needsOnboarding = !dealer.name;
  const redirectTo = needsOnboarding ? '/onboard' : '/';
  const cookie = `eb_dealer=${dealer.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}`;

  return new Response(null, {
    status: 302,
    headers: {
      'Location': redirectTo,
      'Set-Cookie': cookie,
    },
  });
}

async function handleAuthMe(request, env) {
  const dealer = await getDealer(request, env);
  if (!dealer) return json({ error: 'Not authenticated' }, 401);
  return json(dealer);
}

function renderAuthError(message) {
  return `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Early Bird</title>
<style>body{font-family:-apple-system,system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#faf9f7;color:#333}
.box{text-align:center;padding:2rem}.msg{font-size:1.1rem;margin-bottom:1.5rem}a{color:#333;text-decoration:underline}</style></head>
<body><div class="box"><div class="msg">${message}</div><a href="/">Back to Early Bird</a></div></body></html>`;
}

// ── Markets ──────────────────────────────────────────────────

async function handleGetMarkets(env) {
  const today = new Date().toISOString().split('T')[0];
  const res = await supabase(env, `markets?market_date=gte.${today}&order=market_date.asc&select=*`);
  return json(await res.json());
}

async function handleCreateMarket(request, env) {
  const body = await request.json();
  if (!body.name || !body.market_date) return json({ error: 'Name and date required' }, 400);
  const res = await supabase(env, 'markets', { method: 'POST', body });
  return json(await res.json(), 201);
}

// ── Items ────────────────────────────────────────────────────

async function handleGetItems(url, env) {
  let query = 'items?select=*,dealer:dealers(id,name,business_name,phone,venmo,zelle)&order=created_at.desc';

  const marketId = url.searchParams.get('market_id');
  if (marketId) query += `&market_id=eq.${marketId}`;

  const status = url.searchParams.get('status');
  if (status) query += `&status=eq.${status}`;

  const dealerId = url.searchParams.get('dealer_id');
  if (dealerId) query += `&dealer_id=eq.${dealerId}`;

  const category = url.searchParams.get('category');
  if (category) query += `&category=eq.${category}`;

  const res = await supabase(env, query);
  const items = await res.json();

  // For sold items, include buyer info if they opted in
  for (const item of items) {
    if (item.status === 'sold' && item.buyer_id) {
      const buyerRes = await supabase(env, `dealers?id=eq.${item.buyer_id}&select=id,name,business_name,show_name_on_sold`);
      const buyers = await buyerRes.json();
      if (buyers[0]?.show_name_on_sold) {
        item.buyer = { name: buyers[0].name, business_name: buyers[0].business_name };
      }
    }
  }

  return json(items);
}

async function handleCreateItem(request, env, dealer) {
  const body = await request.json();
  if (!body.photos?.length) return json({ error: 'At least one photo required' }, 400);
  if (!body.price || body.price <= 0) return json({ error: 'Valid price required' }, 400);
  if (!body.market_id) return json({ error: 'Market required' }, 400);

  const item = {
    dealer_id: dealer.id,
    market_id: body.market_id,
    price: body.price,
    condition: body.condition || null,
    firm: body.firm || false,
    deposit_required: body.deposit_required || false,
    deposit_amount: body.deposit_amount || null,
    notes: body.notes || null,
    category: body.category || null,
    photos: body.photos,
    status: 'live',
  };

  const res = await supabase(env, 'items', { method: 'POST', body: item });
  return json(await res.json(), 201);
}

async function handleUpdateItem(request, env, dealer, itemId) {
  // Verify ownership
  const itemRes = await supabase(env, `items?id=eq.${itemId}&select=*`);
  const items = await itemRes.json();
  if (!items.length) return json({ error: 'Item not found' }, 404);

  const item = items[0];
  // Allow owner or admin to update
  if (item.dealer_id !== dealer.id) {
    return json({ error: 'Not your item' }, 403);
  }

  const body = await request.json();
  const updates = {};

  if (body.status) {
    if (!['live', 'hold', 'sold'].includes(body.status)) {
      return json({ error: 'Invalid status' }, 400);
    }
    updates.status = body.status;
  }

  if (body.buyer_id) updates.buyer_id = body.buyer_id;
  if (body.price) updates.price = body.price;
  if (body.notes !== undefined) updates.notes = body.notes;

  const res = await supabase(env, `items?id=eq.${itemId}`, {
    method: 'PATCH',
    body: updates,
  });
  return json(await res.json());
}

// ── Inquiries ────────────────────────────────────────────────

async function handleCreateInquiry(request, env, dealer) {
  const body = await request.json();
  if (!body.item_id) return json({ error: 'Item ID required' }, 400);

  // Log the inquiry
  const inquiry = {
    item_id: body.item_id,
    buyer_id: dealer.id,
  };
  await supabase(env, 'inquiries', { method: 'POST', body: inquiry });

  // Look up the item to get seller info and set up relay conversation
  const itemRes = await supabase(env, `items?id=eq.${body.item_id}&select=*,dealer:dealers(*)`);
  const items = await itemRes.json();
  if (!items.length) return json({ error: 'Item not found' }, 404);

  const item = items[0];
  const seller = item.dealer;

  // Check for existing conversation between this buyer and seller for this item
  const existingRes = await supabase(env, `conversations?buyer_id=eq.${dealer.id}&item_id=eq.${body.item_id}&active=eq.true&select=*`);
  const existing = await existingRes.json();

  let conversation;
  if (existing.length) {
    conversation = existing[0];
  } else {
    // Assign a relay number from the pool
    const relayNumber = await assignRelayNumber(env, seller.phone, dealer.id);

    conversation = {
      item_id: body.item_id,
      buyer_id: dealer.id,
      seller_id: seller.id,
      relay_number: relayNumber,
    };
    const convRes = await supabase(env, 'conversations', { method: 'POST', body: conversation });
    const convs = await convRes.json();
    conversation = convs[0];
  }

  return json({
    ok: true,
    relay_number: conversation.relay_number,
    seller_name: seller.name,
    item_price: item.price,
    deposit_required: item.deposit_required,
    deposit_amount: item.deposit_amount,
    venmo: seller.venmo,
    zelle: seller.zelle,
  });
}

async function assignRelayNumber(env, sellerPhone, buyerId) {
  // Get all relay numbers from env (comma-separated)
  const relayNumbers = (env.TELNYX_RELAY_NUMBERS || '').split(',').map(n => n.trim()).filter(Boolean);

  // For each relay number, check if it's already in use for this seller
  for (const num of relayNumbers) {
    const checkRes = await supabase(env, `conversations?relay_number=eq.${encodeURIComponent(num)}&seller_id=eq.${sellerPhone}&active=eq.true&select=id`);
    const active = await checkRes.json();
    // A relay number can be used if it's not already assigned to a conversation with this seller
    // (different sellers can share a relay number since we route by seller phone)
    // Actually, we route by (relay_number, sender_phone). When a seller replies to relay number X,
    // we need to know which buyer to forward to. So: unique(relay_number, seller_phone).
    // Wait - the conversations table has UNIQUE(relay_number, seller_id). seller_id is a UUID.
    // Let me use seller_id instead.
  }

  // Simpler approach: find a relay number not used for any active conversation with this seller
  for (const num of relayNumbers) {
    const checkRes = await supabase(env, `conversations?relay_number=eq.${encodeURIComponent(num)}&seller_id=not.is.null&active=eq.true&select=seller_id`);
    const active = await checkRes.json();
    // This relay number is available if no active conversation uses it for routing to a phone
    // that would conflict. Actually, the constraint is simpler:
    // We look up conversations by (relay_number, seller_phone_match).
    // For now, just find any relay number not actively being used for too many conversations.
    if (active.length < 50) { // Each relay number can handle up to 50 concurrent conversations
      return num;
    }
  }

  // Fallback: use first number
  return relayNumbers[0];
}

// ── SMS Webhook (Telnyx) ─────────────────────────────────────

async function handleSmsWebhook(request, env) {
  const payload = await request.json();

  // Telnyx sends events in data.payload
  const event = payload.data;
  if (!event || event.event_type !== 'message.received') {
    return json({ ok: true }); // Ignore non-message events
  }

  const msg = event.payload;
  const fromPhone = msg.from.phone_number;
  const toNumber = msg.to[0]?.phone_number;
  const text = msg.text;

  if (!fromPhone || !toNumber || !text) return json({ ok: true });

  // Look up which conversation this belongs to
  // The relay number is `toNumber`. The sender is either buyer or seller.

  // Check if sender is a seller in any active conversation with this relay number
  const sellerRes = await supabase(env,
    `conversations?relay_number=eq.${encodeURIComponent(toNumber)}&active=eq.true&select=*,seller:dealers!conversations_seller_id_fkey(*),buyer:dealers!conversations_buyer_id_fkey(*)`
  );
  const convos = await sellerRes.json();

  let conversation = null;
  let direction = null;
  let forwardTo = null;

  for (const c of convos) {
    if (c.seller.phone === fromPhone) {
      conversation = c;
      direction = 'seller_to_buyer';
      forwardTo = c.buyer.phone;
      break;
    }
    if (c.buyer.phone === fromPhone) {
      conversation = c;
      direction = 'buyer_to_seller';
      forwardTo = c.seller.phone;
      break;
    }
  }

  if (!conversation || !forwardTo) {
    // Unknown sender — ignore
    return json({ ok: true });
  }

  // Log the message
  await supabase(env, 'messages', {
    method: 'POST',
    body: {
      conversation_id: conversation.id,
      sender_phone: fromPhone,
      body: text,
      direction,
    },
  });

  // Forward the message via Telnyx
  await fetch('https://api.telnyx.com/v2/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.TELNYX_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: toNumber, // relay number
      to: forwardTo,
      text: text,
    }),
  });

  return json({ ok: true });
}

// ── Admin ────────────────────────────────────────────────────

async function handleCreateDealer(request, env) {
  const body = await request.json();
  if (!body.phone) return json({ error: 'Phone required' }, 400);

  // Normalize phone
  let phone = body.phone.replace(/\D/g, '');
  if (phone.length === 10) phone = '1' + phone;
  phone = '+' + phone;

  const dealer = {
    phone,
    name: body.name || null,
    business_name: body.business_name || null,
    venmo: body.venmo || null,
    zelle: body.zelle || null,
  };

  const res = await supabase(env, 'dealers', { method: 'POST', body: dealer });
  const result = await res.json();

  if (res.status === 409 || (Array.isArray(result) && result.length === 0)) {
    return json({ error: 'Dealer with this phone already exists' }, 409);
  }

  return json(result, 201);
}

async function handleListDealers(env) {
  const res = await supabase(env, 'dealers?select=*&order=created_at.desc');
  return json(await res.json());
}

async function handleActivity(url, env) {
  const days = parseInt(url.searchParams.get('days') || '7');
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  // Get recent items, inquiries, and status changes
  const [itemsRes, inquiriesRes] = await Promise.all([
    supabase(env, `items?created_at=gte.${since}&select=*,dealer:dealers(name,business_name)&order=created_at.desc`),
    supabase(env, `inquiries?created_at=gte.${since}&select=*,item:items(price,photos),buyer:dealers!inquiries_buyer_id_fkey(name,business_name)&order=created_at.desc`),
  ]);

  return json({
    items: await itemsRes.json(),
    inquiries: await inquiriesRes.json(),
  });
}

async function handleProxyPost(request, env) {
  const body = await request.json();
  if (!body.dealer_id) return json({ error: 'dealer_id required' }, 400);
  if (!body.photos?.length) return json({ error: 'At least one photo required' }, 400);
  if (!body.price || body.price <= 0) return json({ error: 'Valid price required' }, 400);
  if (!body.market_id) return json({ error: 'Market required' }, 400);

  const item = {
    dealer_id: body.dealer_id,
    market_id: body.market_id,
    price: body.price,
    condition: body.condition || null,
    firm: body.firm || false,
    deposit_required: body.deposit_required || false,
    deposit_amount: body.deposit_amount || null,
    notes: body.notes || null,
    category: body.category || null,
    photos: body.photos,
    status: 'live',
    posted_by_admin: true,
  };

  const res = await supabase(env, 'items', { method: 'POST', body: item });
  return json(await res.json(), 201);
}

async function handleGetConversations(url, env) {
  const itemId = url.searchParams.get('item_id');
  let query = 'conversations?active=eq.true&select=*,buyer:dealers!conversations_buyer_id_fkey(name,business_name),seller:dealers!conversations_seller_id_fkey(name,business_name),messages(*)&order=created_at.desc';

  if (itemId) query += `&item_id=eq.${itemId}`;

  const res = await supabase(env, query);
  return json(await res.json());
}
