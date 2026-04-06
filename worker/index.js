/**
 * Early Bird — Cloudflare Worker API
 * Dealer-to-dealer pre-market marketplace
 *
 * Messaging model:
 *   - Buyer sends message via web UI → stored in DB → SMS notification to seller
 *   - SMS contains the message text + a link to reply: earlybird.com/c/{token}
 *   - Seller taps link → conversation page → types reply → SMS notification to buyer
 *   - One Telnyx number handles all outbound SMS. No inbound routing needed.
 *
 * Routes:
 *   POST /api/auth/request        — Send magic link SMS
 *   GET  /api/auth/verify/:token  — Verify magic link, set cookie
 *   GET  /api/auth/me             — Get current dealer from cookie
 *   PATCH /api/auth/me            — Update current dealer profile
 *
 *   GET  /api/markets             — List upcoming markets
 *   POST /api/markets             — Create market (admin)
 *
 *   GET  /api/items               — Browse feed (filterable)
 *   POST /api/items               — Post an item
 *   PATCH /api/items/:id          — Update item (status, etc.)
 *
 *   POST /api/conversations       — Start a conversation (buyer → seller about item)
 *   GET  /api/conversations/:token — Get conversation + messages
 *   POST /api/conversations/:token/messages — Send a message in conversation
 *   GET  /api/conversations       — List my conversations
 *
 *   POST /api/admin/dealers       — Create/invite a dealer (admin)
 *   GET  /api/admin/dealers       — List all dealers (admin)
 *   GET  /api/admin/activity      — Activity dashboard (admin)
 *   POST /api/admin/proxy-post    — Post item on behalf of dealer (admin)
 *   GET  /api/admin/conversations — View all conversations (admin)
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
      'Access-Control-Allow-Credentials': 'true',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      let res;

      // Auth
      if (path === '/api/auth/request' && method === 'POST') {
        res = await handleAuthRequest(request, env);
      } else if (path.startsWith('/api/auth/verify/') && method === 'GET') {
        res = await handleAuthVerify(path.split('/api/auth/verify/')[1], env);
      } else if (path === '/api/auth/me' && method === 'GET') {
        res = await handleAuthMe(request, env);
      } else if (path === '/api/auth/me' && method === 'PATCH') {
        const dealer = await getDealer(request, env);
        if (!dealer) return json({ error: 'Unauthorized' }, 401, corsHeaders);
        res = await handleUpdateDealer(request, env, dealer);

      // Markets
      } else if (path === '/api/markets' && method === 'GET') {
        res = await handleGetMarkets(env);
      } else if (path === '/api/markets' && method === 'POST') {
        res = await requireAdmin(request, env) || await handleCreateMarket(request, env);

      // Items
      } else if (path === '/api/items' && method === 'GET') {
        res = await handleGetItems(url, env);
      } else if (path === '/api/items' && method === 'POST') {
        const dealer = await getDealer(request, env);
        if (!dealer) return json({ error: 'Unauthorized' }, 401, corsHeaders);
        res = await handleCreateItem(request, env, dealer);
      } else if (path.match(/^\/api\/items\/[^/]+$/) && method === 'PATCH') {
        const dealer = await getDealer(request, env);
        if (!dealer) return json({ error: 'Unauthorized' }, 401, corsHeaders);
        res = await handleUpdateItem(request, env, dealer, path.split('/api/items/')[1]);

      // Conversations
      } else if (path === '/api/conversations' && method === 'POST') {
        const dealer = await getDealer(request, env);
        if (!dealer) return json({ error: 'Unauthorized' }, 401, corsHeaders);
        res = await handleStartConversation(request, env, dealer);
      } else if (path === '/api/conversations' && method === 'GET') {
        const dealer = await getDealer(request, env);
        if (!dealer) return json({ error: 'Unauthorized' }, 401, corsHeaders);
        res = await handleListConversations(env, dealer);
      } else if (path.match(/^\/api\/conversations\/[^/]+$/) && method === 'GET') {
        const dealer = await getDealer(request, env);
        if (!dealer) return json({ error: 'Unauthorized' }, 401, corsHeaders);
        res = await handleGetConversation(env, dealer, path.split('/api/conversations/')[1]);
      } else if (path.match(/^\/api\/conversations\/[^/]+\/messages$/) && method === 'POST') {
        const dealer = await getDealer(request, env);
        if (!dealer) return json({ error: 'Unauthorized' }, 401, corsHeaders);
        const token = path.split('/api/conversations/')[1].split('/messages')[0];
        res = await handleSendMessage(request, env, dealer, token);

      // Favorites
      } else if (path === '/api/favorites' && method === 'GET') {
        const dealer = await getDealer(request, env);
        if (!dealer) return json({ error: 'Unauthorized' }, 401, corsHeaders);
        res = await handleGetFavorites(env, dealer);
      } else if (path === '/api/favorites' && method === 'POST') {
        const dealer = await getDealer(request, env);
        if (!dealer) return json({ error: 'Unauthorized' }, 401, corsHeaders);
        res = await handleAddFavorite(request, env, dealer);
      } else if (path.match(/^\/api\/favorites\/[^/]+$/) && method === 'DELETE') {
        const dealer = await getDealer(request, env);
        if (!dealer) return json({ error: 'Unauthorized' }, 401, corsHeaders);
        const itemId = path.split('/api/favorites/')[1];
        res = await handleRemoveFavorite(env, dealer, itemId);

      // Admin
      } else if (path === '/api/admin/dealers' && method === 'POST') {
        res = await requireAdmin(request, env) || await handleCreateDealer(request, env);
      } else if (path === '/api/admin/dealers' && method === 'GET') {
        res = await requireAdmin(request, env) || await handleListDealers(env);
      } else if (path === '/api/admin/activity' && method === 'GET') {
        res = await requireAdmin(request, env) || await handleActivity(url, env);
      } else if (path === '/api/admin/proxy-post' && method === 'POST') {
        res = await requireAdmin(request, env) || await handleProxyPost(request, env);
      } else if (path === '/api/admin/conversations' && method === 'GET') {
        res = await requireAdmin(request, env) || await handleAdminConversations(url, env);

      } else {
        res = json({ error: 'Not found' }, 404);
      }

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
  // Check Authorization header first (for cross-origin), then cookie
  let dealerId = null;
  const authHeader = request.headers.get('Authorization') || '';
  if (authHeader.startsWith('Bearer ') && authHeader !== `Bearer ${env.ADMIN_TOKEN}`) {
    dealerId = authHeader.replace('Bearer ', '');
  }
  if (!dealerId) dealerId = getCookie(request, 'eb_dealer');
  if (!dealerId) return null;
  const res = await supabase(env, `dealers?id=eq.${dealerId}&select=*`);
  const rows = await res.json();
  return rows[0] || null;
}

async function requireAdmin(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  if (token !== env.ADMIN_TOKEN) return json({ error: 'Admin access required' }, 403);
  return null;
}

function generateToken(length = 8) {
  const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let token = '';
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < length; i++) token += chars[bytes[i] % chars.length];
  return token;
}

function normalizePhone(phone) {
  let d = phone.replace(/\D/g, '');
  if (d.length === 10) d = '1' + d;
  if (!d.startsWith('1') || d.length !== 11) return null;
  return '+' + d;
}

async function sendSMS(env, to, text) {
  return fetch('https://api.telnyx.com/v2/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.TELNYX_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.TELNYX_AUTH_NUMBER,
      to,
      text,
    }),
  });
}

// ── Auth ─────────────────────────────────────────────────────

async function handleAuthRequest(request, env) {
  const { phone } = await request.json();
  if (!phone) return json({ error: 'Phone number required' }, 400);

  const normalized = normalizePhone(phone);
  if (!normalized) return json({ error: 'Invalid US phone number' }, 400);

  const dealerRes = await supabase(env, `dealers?phone=eq.${encodeURIComponent(normalized)}&select=id,name,role`);
  const dealers = await dealerRes.json();

  let dealer;
  if (!dealers.length) {
    // Auto-register as buyer
    const createRes = await supabase(env, 'dealers', {
      method: 'POST',
      body: { phone: normalized, role: 'buyer' },
      headers: { 'Prefer': 'return=representation' },
    });
    const created = await createRes.json();
    if (!Array.isArray(created) || !created.length) {
      return json({ error: 'Registration failed' }, 500);
    }
    dealer = created[0];
  } else {
    dealer = dealers[0];
  }
  const token = generateToken(8);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  await supabase(env, 'auth_tokens', {
    method: 'POST',
    body: { dealer_id: dealer.id, token, expires_at: expiresAt },
  });

  const siteUrl = env.SITE_URL || 'https://elikagan.github.io/early-bird';
  const magicLink = `${siteUrl}/#/verify/${token}`;
  const message = dealer.name
    ? `Hey ${dealer.name}, tap to open Early Bird: ${magicLink}`
    : `Tap to open Early Bird: ${magicLink}`;

  await sendSMS(env, normalized, message);
  return json({ ok: true, message: 'Magic link sent' });
}

async function handleAuthVerify(token, env) {
  const res = await supabase(env, `auth_tokens?token=eq.${token}&used=eq.false&select=*`);
  const tokens = await res.json();

  if (!tokens.length) return json({ error: 'Invalid or expired link' }, 400);

  const authToken = tokens[0];
  if (new Date(authToken.expires_at) < new Date()) {
    return json({ error: 'Link expired. Request a new one.' }, 400);
  }

  await supabase(env, `auth_tokens?id=eq.${authToken.id}`, {
    method: 'PATCH',
    body: { used: true },
  });

  // Return dealer ID — frontend sets the cookie
  return json({ ok: true, dealer_id: authToken.dealer_id });
}

async function handleAuthMe(request, env) {
  const dealer = await getDealer(request, env);
  if (!dealer) return json({ error: 'Not authenticated' }, 401);
  return json(dealer);
}

async function handleUpdateDealer(request, env, dealer) {
  const body = await request.json();
  const updates = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.business_name !== undefined) updates.business_name = body.business_name;
  if (body.venmo !== undefined) updates.venmo = body.venmo;
  if (body.zelle !== undefined) updates.zelle = body.zelle;
  if (body.show_name_on_sold !== undefined) updates.show_name_on_sold = body.show_name_on_sold;

  const res = await supabase(env, `dealers?id=eq.${dealer.id}`, {
    method: 'PATCH',
    body: updates,
  });
  return json(await res.json());
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
  let query = 'items?select=*,dealer:dealers!items_dealer_id_fkey(id,name,business_name)&order=created_at.desc';

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

  if (!Array.isArray(items)) return json({ error: 'Failed to load items', detail: items }, 500);

  // Attach buyer info for sold items
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
  if (dealer.role !== 'dealer') return json({ error: 'Only dealers can post items' }, 403);
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
  const itemRes = await supabase(env, `items?id=eq.${itemId}&select=*`);
  const items = await itemRes.json();
  if (!items.length) return json({ error: 'Item not found' }, 404);
  if (items[0].dealer_id !== dealer.id) return json({ error: 'Not your item' }, 403);

  const body = await request.json();
  const updates = {};
  if (body.status && ['live', 'hold', 'sold'].includes(body.status)) updates.status = body.status;
  if (body.buyer_id) updates.buyer_id = body.buyer_id;
  if (body.price) updates.price = body.price;
  if (body.notes !== undefined) updates.notes = body.notes;

  const res = await supabase(env, `items?id=eq.${itemId}`, { method: 'PATCH', body: updates });
  return json(await res.json());
}

// ── Conversations & Messages ─────────────────────────────────

async function handleStartConversation(request, env, dealer) {
  const body = await request.json();
  if (!body.item_id) return json({ error: 'item_id required' }, 400);
  if (!body.message) return json({ error: 'message required' }, 400);

  // Get the item + seller
  const itemRes = await supabase(env, `items?id=eq.${body.item_id}&select=*,dealer:dealers(*)`);
  const items = await itemRes.json();
  if (!items.length) return json({ error: 'Item not found' }, 404);
  const item = items[0];
  const seller = item.dealer;

  // Can't message yourself
  if (seller.id === dealer.id) return json({ error: "Can't message yourself" }, 400);

  // Check for existing active conversation
  const existingRes = await supabase(env, `conversations?buyer_id=eq.${dealer.id}&item_id=eq.${body.item_id}&active=eq.true&select=*`);
  const existing = await existingRes.json();

  let conversation;
  if (existing.length) {
    conversation = existing[0];
  } else {
    // Create new conversation
    const token = generateToken(8);
    const convRes = await supabase(env, 'conversations', {
      method: 'POST',
      body: {
        item_id: body.item_id,
        buyer_id: dealer.id,
        seller_id: seller.id,
        token,
      },
    });
    const convs = await convRes.json();
    conversation = convs[0];

    // Log as inquiry
    await supabase(env, 'inquiries', {
      method: 'POST',
      body: { item_id: body.item_id, buyer_id: dealer.id },
    });
  }

  // Save the message
  await supabase(env, 'messages', {
    method: 'POST',
    body: {
      conversation_id: conversation.id,
      sender_id: dealer.id,
      sender_phone: dealer.phone,
      body: body.message,
      direction: 'buyer_to_seller',
    },
  });

  // Send SMS notification to seller
  const price = '$' + (item.price / 100).toLocaleString();
  const siteUrl = env.SITE_URL || 'https://elikagan.github.io/early-bird';
  const replyLink = `${siteUrl}/#/c/${conversation.token}`;
  const buyerName = dealer.name || 'A dealer';
  const smsText = `${buyerName} messaged you about your ${price} item on Early Bird:\n\n"${body.message}"\n\nReply: ${replyLink}`;

  await sendSMS(env, seller.phone, smsText);

  return json({ ok: true, conversation_token: conversation.token });
}

async function handleGetConversation(env, dealer, token) {
  const convRes = await supabase(env,
    `conversations?token=eq.${token}&select=*,` +
    `buyer:dealers!conversations_buyer_id_fkey(id,name,business_name,phone,venmo,zelle),` +
    `seller:dealers!conversations_seller_id_fkey(id,name,business_name,phone,venmo,zelle),` +
    `item:items(id,price,condition,firm,deposit_required,deposit_amount,notes,photos,status,category)`
  );
  const convs = await convRes.json();
  if (!convs.length) return json({ error: 'Conversation not found' }, 404);

  const conv = convs[0];
  // Only buyer or seller can view
  if (conv.buyer.id !== dealer.id && conv.seller.id !== dealer.id) {
    return json({ error: 'Not your conversation' }, 403);
  }

  // Get messages
  const msgRes = await supabase(env,
    `messages?conversation_id=eq.${conv.id}&select=*,sender:dealers!messages_sender_id_fkey(id,name)&order=created_at.asc`
  );
  const messages = await msgRes.json();

  return json({
    conversation: conv,
    messages,
    you: dealer.id === conv.buyer.id ? 'buyer' : 'seller',
  });
}

async function handleSendMessage(request, env, dealer, token) {
  const body = await request.json();
  if (!body.message) return json({ error: 'message required' }, 400);

  // Get conversation
  const convRes = await supabase(env,
    `conversations?token=eq.${token}&select=*,` +
    `buyer:dealers!conversations_buyer_id_fkey(*),` +
    `seller:dealers!conversations_seller_id_fkey(*),` +
    `item:items(id,price,photos)`
  );
  const convs = await convRes.json();
  if (!convs.length) return json({ error: 'Conversation not found' }, 404);

  const conv = convs[0];
  const isBuyer = dealer.id === conv.buyer.id;
  const isSeller = dealer.id === conv.seller.id;
  if (!isBuyer && !isSeller) return json({ error: 'Not your conversation' }, 403);

  const direction = isBuyer ? 'buyer_to_seller' : 'seller_to_buyer';
  const recipient = isBuyer ? conv.seller : conv.buyer;
  const senderName = dealer.name || 'A dealer';

  // Save message
  await supabase(env, 'messages', {
    method: 'POST',
    body: {
      conversation_id: conv.id,
      sender_id: dealer.id,
      sender_phone: dealer.phone,
      body: body.message,
      direction,
    },
  });

  // Send SMS notification to the other party
  const price = '$' + (conv.item.price / 100).toLocaleString();
  const siteUrl = env.SITE_URL || 'https://elikagan.github.io/early-bird';
  const replyLink = `${siteUrl}/#/c/${conv.token}`;
  const smsText = `${senderName} replied about the ${price} item on Early Bird:\n\n"${body.message}"\n\nReply: ${replyLink}`;

  await sendSMS(env, recipient.phone, smsText);

  return json({ ok: true });
}

async function handleListConversations(env, dealer) {
  // Get conversations where dealer is buyer or seller
  const buyerRes = await supabase(env,
    `conversations?buyer_id=eq.${dealer.id}&active=eq.true&select=*,` +
    `seller:dealers!conversations_seller_id_fkey(name,business_name),` +
    `item:items(price,photos,status)&order=created_at.desc`
  );
  const sellerRes = await supabase(env,
    `conversations?seller_id=eq.${dealer.id}&active=eq.true&select=*,` +
    `buyer:dealers!conversations_buyer_id_fkey(name,business_name),` +
    `item:items(price,photos,status)&order=created_at.desc`
  );

  const asBuyer = await buyerRes.json();
  const asSeller = await sellerRes.json();

  return json({ as_buyer: asBuyer, as_seller: asSeller });
}

// ── Favorites ────────────────────────────────────────────────

async function handleGetFavorites(env, dealer) {
  const res = await supabase(env, `favorites?dealer_id=eq.${dealer.id}&select=id,item_id,created_at,item:items!inner(id,price,photos,condition,firm,status,notes,dealer:dealers!items_dealer_id_fkey(id,name,business_name))&order=created_at.desc`);
  const favs = await res.json();
  return json(favs);
}

async function handleAddFavorite(request, env, dealer) {
  const { item_id } = await request.json();
  if (!item_id) return json({ error: 'item_id required' }, 400);
  const res = await supabase(env, 'favorites', {
    method: 'POST',
    body: { dealer_id: dealer.id, item_id },
    headers: { 'Prefer': 'return=representation,resolution=ignore-duplicates' },
  });
  return json(await res.json(), 201);
}

async function handleRemoveFavorite(env, dealer, itemId) {
  await supabase(env, `favorites?dealer_id=eq.${dealer.id}&item_id=eq.${itemId}`, {
    method: 'DELETE',
  });
  return json({ ok: true });
}

// ── Admin ────────────────────────────────────────────────────

async function handleCreateDealer(request, env) {
  const body = await request.json();
  if (!body.phone) return json({ error: 'Phone required' }, 400);

  const phone = normalizePhone(body.phone);
  if (!phone) return json({ error: 'Invalid phone' }, 400);

  const dealer = {
    phone,
    name: body.name || null,
    business_name: body.business_name || null,
    venmo: body.venmo || null,
    zelle: body.zelle || null,
    role: body.role || 'dealer',
  };

  const res = await supabase(env, 'dealers', {
    method: 'POST',
    body: dealer,
    headers: { 'Prefer': 'return=representation,resolution=ignore-duplicates' },
  });
  const result = await res.json();
  return json(result, 201);
}

async function handleListDealers(env) {
  const res = await supabase(env, 'dealers?select=*&order=created_at.desc');
  return json(await res.json());
}

async function handleActivity(url, env) {
  const days = parseInt(url.searchParams.get('days') || '7');
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const [itemsRes, inquiriesRes, msgsRes] = await Promise.all([
    supabase(env, `items?created_at=gte.${since}&select=*,dealer:dealers(name,business_name)&order=created_at.desc`),
    supabase(env, `inquiries?created_at=gte.${since}&select=*,item:items(price,photos),buyer:dealers!inquiries_buyer_id_fkey(name,business_name)&order=created_at.desc`),
    supabase(env, `messages?created_at=gte.${since}&select=*,sender:dealers!messages_sender_id_fkey(name)&order=created_at.desc&limit=50`),
  ]);

  return json({
    items: await itemsRes.json(),
    inquiries: await inquiriesRes.json(),
    recent_messages: await msgsRes.json(),
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

async function handleAdminConversations(url, env) {
  let query = 'conversations?select=*,' +
    'buyer:dealers!conversations_buyer_id_fkey(name,business_name),' +
    'seller:dealers!conversations_seller_id_fkey(name,business_name),' +
    'item:items(price,photos,status),' +
    'messages(*)&order=created_at.desc';

  const itemId = url.searchParams.get('item_id');
  if (itemId) query += `&item_id=eq.${itemId}`;

  const res = await supabase(env, query);
  return json(await res.json());
}
