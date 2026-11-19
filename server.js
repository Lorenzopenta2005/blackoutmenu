const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const PORT = process.env.PORT || 3002;
// Nessuna password di default: se manca, il pannello admin resta chiuso (il menu pubblico funziona lo stesso)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const ADMIN_SECRET_PATH = process.env.ADMIN_SECRET_PATH || 'admin-panel';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('[FATAL] SUPABASE_URL e SUPABASE_KEY sono obbligatorie nel file .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
// Le tabelle birre/spine possono stare in un altro progetto Supabase (ex servizio tap-menu)
const supabaseBirre = process.env.BIRRE_SUPABASE_URL
  ? createClient(process.env.BIRRE_SUPABASE_URL, process.env.BIRRE_SUPABASE_KEY)
  : supabase;

// Che tipo di chiave Supabase è stata messa nelle variabili d'ambiente (senza mai stamparla)
function ruoloChiave(key) {
  if (!key) return 'mancante';
  if (key.startsWith('sb_secret_')) return 'secret';
  if (key.startsWith('sb_publishable_')) return 'publishable';
  try { return JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role || 'sconosciuto'; }
  catch { return 'sconosciuto'; }
}

// =============================================================================
// LOGGER
// =============================================================================

const logger = {
  info: (msg) => console.log(`[INFO]  ${new Date().toISOString()} ${msg}`),
  warn: (msg) => console.warn(`[WARN]  ${new Date().toISOString()} ${msg}`),
  error: (msg, err) => console.error(`[ERROR] ${new Date().toISOString()} ${msg}`, err || ''),
};

// =============================================================================
// INIT DB — verifica che la tabella esista
// =============================================================================

async function initDB() {
  const { data, error } = await supabase
    .from('menu_generale')
    .select('id')
    .limit(1);

  if (error) {
    logger.error('Tabella "menu_generale" non trovata:', error);
    logger.error('Esegui lo script SQL in supabase/menu_generale.sql prima di avviare il server.');
    process.exit(1);
  }

  logger.info(`Database pronto — ${data.length > 0 ? 'tabella con dati' : 'tabella vuota (aggiungi dati dall\'admin)'}.`);
}

// =============================================================================
// DATA ACCESS LAYER
// =============================================================================

const db = {

  getMenuDisponibile: async () => {
    const { data, error } = await supabase
      .from('menu_generale')
      .select('*')
      .eq('available', true)
      .order('macro_category')
      .order('sub_category')
      .order('ordine')
      .order('id');
    if (error) throw new Error(error.message);
    return data;
  },

  getMenuAdmin: async () => {
    const { data, error } = await supabase
      .from('menu_generale')
      .select('*')
      .order('macro_category')
      .order('sub_category')
      .order('ordine')
      .order('id');
    if (error) throw new Error(error.message);
    return data;
  },

  addMenuItem: async ({ name, description, price, macro_category, sub_category, badge, available, immagine_url, allergeni, tipologia, ordine }) => {
    if (!name || !price || !macro_category || !sub_category)
      throw new Error('Campi obbligatori: name, price, macro_category, sub_category');
    if (!['Cucina', 'Drink'].includes(macro_category))
      throw new Error('macro_category deve essere "Cucina" o "Drink"');
    const { data, error } = await supabase
      .from('menu_generale')
      .insert({
        name,
        description: description || null,
        price,
        macro_category,
        sub_category,
        badge: badge || null,
        immagine_url: immagine_url || null,
        allergeni: allergeni || null,
        tipologia: tipologia || null,
        ordine: ordine || 0,
        available: available !== false,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  updateMenuItem: async (id, fields) => {
    const allowed = ['name', 'description', 'price', 'macro_category', 'sub_category', 'badge', 'available', 'immagine_url', 'allergeni', 'tipologia', 'ordine'];
    const patch = {};
    for (const k of allowed) { if (fields[k] !== undefined) patch[k] = fields[k]; }
    if (patch.badge !== undefined) patch.badge = patch.badge || null;
    if (patch.immagine_url !== undefined) patch.immagine_url = patch.immagine_url || null;
    if (patch.tipologia !== undefined) patch.tipologia = patch.tipologia || null;
    if (patch.allergeni !== undefined) patch.allergeni = Array.isArray(patch.allergeni) && patch.allergeni.length ? patch.allergeni : null;
    if (!Object.keys(patch).length) throw new Error('Nessun campo da aggiornare');
    if (patch.macro_category && !['Cucina', 'Drink'].includes(patch.macro_category))
      throw new Error('macro_category non valida');
    const { data, error } = await supabase
      .from('menu_generale')
      .update(patch)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Nessuna voce trovata da aggiornare');
    return data;
  },

  reorderMenuItems: async (updates) => {
    // updates is an array of { id, ordine }
    if (!Array.isArray(updates) || updates.length === 0) return true;
    // Purtroppo supabase js non ha un vero batch update semplice, facciamo un loop
    const promises = updates.map(u =>
      supabase.from('menu_generale').update({ ordine: u.ordine }).eq('id', u.id)
    );
    const results = await Promise.all(promises);
    const errors = results.filter(r => r.error).map(r => r.error.message);
    if (errors.length > 0) throw new Error('Errore durante il riordinamento: ' + errors.join(', '));
    return true;
  },

  deleteMenuItem: async (id) => {
    const { data, error } = await supabase
      .from('menu_generale')
      .delete()
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error('La voce non esiste o era già stata eliminata');
    return data;
  },

  toggleMenuItem: async (id) => {
    const { data: item, error: errRead } = await supabase
      .from('menu_generale')
      .select('id, name, available')
      .eq('id', id)
      .maybeSingle();
    if (errRead) throw new Error(errRead.message);
    if (!item) throw new Error('Voce menu non trovata');
    const { data: updated, error: errUpd } = await supabase
      .from('menu_generale')
      .update({ available: !item.available })
      .eq('id', id)
      .select()
      .maybeSingle();
    if (errUpd) throw new Error(errUpd.message);
    if (!updated) throw new Error('Salvataggio fallito. Assicurati di aver inserito la "service_role" key in .env (non la anon key).');
    return updated;
  },
};

// =============================================================================
// APP SETUP
// =============================================================================

const app = express();
const httpServer = createServer(app);
// Nessun CORS: il menu si collega dallo stesso indirizzo, altri siti non possono usare il live
const io = new Server(httpServer);

// Render passa le richieste da un proxy: serve per avere il vero IP del cliente (blocco tentativi password)
app.set('trust proxy', 1);

app.use(helmet({
  // Le pagine possono caricare script/stili solo da qui (+ Google Fonts) e parlare solo con questo server
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'script-src': ["'self'", "'unsafe-inline'"],    // script scritti dentro le pagine
      'script-src-attr': ["'unsafe-inline'"],           // onclick dei pannelli admin
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'img-src': ["'self'", 'data:', 'https:'],         // l'admin accetta anche URL di immagini esterne
      'connect-src': ["'self'"],
      'frame-ancestors': ["'none'"],
      'upgrade-insecure-requests': null,                // Render è già tutto https; in locale romperebbe l'anteprima
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(express.json({ limit: '50kb' }));
app.use(express.static(path.join(__dirname, 'public')));
// Alcune immagini birre nel DB sono salvate come "public/images/..."
app.use('/public', express.static(path.join(__dirname, 'public')));

// ── HTML routes ──
const serveHtml = (file) => (req, res) => res.sendFile(path.join(__dirname, file));

// Menu unico (index.html) — i vecchi link dei QR portano alla sezione giusta
app.get(['/cibo-drink', '/cibo-drink.html'], (req, res) => res.redirect('/'));
app.get(['/cliente', '/cliente.html'], (req, res) => res.redirect('/#birre'));

// Pannelli admin — accessibili SOLO tramite il percorso segreto
app.get('/' + ADMIN_SECRET_PATH, serveHtml('admin/admin-cibo-drink.html'));
app.get('/' + ADMIN_SECRET_PATH + '/birre', serveHtml('admin/admin-birre.html'));

// Tutte le altre route /admin* restituiscono 404 (nessuna discovery)
app.get('/admin', (req, res) => res.status(404).send('Not found'));
app.get('/admin-cibo-drink', (req, res) => res.status(404).send('Not found'));

logger.info(`Admin path: /${ADMIN_SECRET_PATH} (tienilo segreto!)`);

// =============================================================================
// MIDDLEWARE — auth guard
// =============================================================================

// Confronto a tempo costante (non si può indovinare la password misurando i tempi di risposta)
const pwHash = ADMIN_PASSWORD && crypto.createHash('sha256').update(ADMIN_PASSWORD).digest();
const passwordOk = (pw) => !!pwHash && typeof pw === 'string'
  && crypto.timingSafeEqual(crypto.createHash('sha256').update(pw).digest(), pwHash);

// Anti forza bruta: dopo MAX_FAILS password sbagliate dallo stesso IP, blocco per FAIL_WINDOW_MS
const FAIL_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 10;
const fails = new Map(); // ip -> { n, until }
setInterval(() => { const now = Date.now(); for (const [ip, f] of fails) if (f.until < now) fails.delete(ip); }, FAIL_WINDOW_MS).unref();

const requireAdmin = (req, res, next) => {
  const now = Date.now();
  let f = fails.get(req.ip);
  if (f && f.until < now) { fails.delete(req.ip); f = null; }
  if (f && f.n >= MAX_FAILS) {
    return res.status(429).json({ success: false, message: 'Troppi tentativi sbagliati, riprova tra 15 minuti' });
  }
  if (!passwordOk(req.headers['x-admin-password'])) {
    f = f || { n: 0, until: now + FAIL_WINDOW_MS };
    f.n++;
    fails.set(req.ip, f);
    logger.warn(`Accesso non autorizzato da ${req.ip} (tentativo ${f.n}/${MAX_FAILS})`);
    return res.status(401).json({ success: false, message: 'Password non valida' });
  }
  next();
};

if (!ADMIN_PASSWORD) logger.error('ADMIN_PASSWORD non impostata: pannello admin disattivato finché non la aggiungi su Render');
else if (ADMIN_PASSWORD.length < 12) logger.warn('ADMIN_PASSWORD è corta: usa almeno 12 caratteri (meglio una frase)');
for (const [nome, key] of [['SUPABASE_KEY', SUPABASE_KEY], ['BIRRE_SUPABASE_KEY', process.env.BIRRE_SUPABASE_URL && process.env.BIRRE_SUPABASE_KEY]]) {
  if (key === undefined) continue;
  const ruolo = ruoloChiave(key);
  if (['service_role', 'secret'].includes(ruolo)) logger.info(`${nome}: chiave server (${ruolo}) OK`);
  else logger.warn(`${nome}: chiave di tipo "${ruolo}", serve la service_role/secret. NON eseguire supabase/sicurezza.sql finché non la cambi, o il menu non potrà più salvare`);
}

const birreReady = require('./birre')({ app, io, supabase: supabaseBirre, requireAdmin, logger });

// =============================================================================
// ROUTES — PUBLIC
// =============================================================================

// Tutti gli items disponibili (usato da cibo-drink.html)
app.get('/api/menu', async (req, res) => {
  try { res.json({ success: true, data: await db.getMenuDisponibile() }); }
  catch (err) { logger.error('GET /api/menu', err); res.status(500).json({ success: false, message: 'Errore interno' }); }
});

// =============================================================================
// ROUTES — ADMIN
// =============================================================================

// Tutti gli items (inclusi non disponibili)
app.get('/api/admin/menu', requireAdmin, async (req, res) => {
  try { res.json({ success: true, data: await db.getMenuAdmin() }); }
  catch (err) { logger.error('GET /api/admin/menu', err); res.status(500).json({ success: false, message: err.message }); }
});

// Aggiungi voce
app.post('/api/admin/menu', requireAdmin, async (req, res) => {
  try {
    const { name, description, price, macro_category, sub_category, badge, available, immagine_url, allergeni, tipologia } = req.body;
    const item = await db.addMenuItem({
      name, description,
      price: parseFloat(price),
      macro_category, sub_category, badge, available, immagine_url,
      allergeni: Array.isArray(allergeni) ? allergeni : null,
      tipologia: tipologia || null,
    });
    if (!item) throw new Error('Salvataggio fallito. Verifica la service_role key nel file .env.');
    io.emit('menu_aggiornato', await db.getMenuDisponibile());
    io.emit('admin_menu_aggiornato', await db.getMenuAdmin());
    logger.info(`Menu aggiunto: ${item.name} [${item.macro_category}/${item.sub_category}]`);
    res.status(201).json({ success: true, data: item });
  } catch (err) { logger.error('POST /api/admin/menu', err); res.status(400).json({ success: false, message: err.message }); }
});

// Riordina voci
app.put('/api/admin/menu/reorder', requireAdmin, async (req, res) => {
  try {
    const { updates } = req.body;
    if (!updates) return res.status(400).json({ success: false, message: 'Nessun aggiornamento fornito' });
    await db.reorderMenuItems(updates);
    io.emit('menu_aggiornato', await db.getMenuDisponibile());
    io.emit('admin_menu_aggiornato', await db.getMenuAdmin());
    logger.info(`Menu riordinato (${updates.length} voci)`);
    res.json({ success: true, message: 'Riordinamento completato' });
  } catch (err) { logger.error('PUT /api/admin/menu/reorder', err); res.status(400).json({ success: false, message: err.message }); }
});

// Aggiorna voce esistente
app.put('/api/admin/menu/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID non valido' });
    const updated = await db.updateMenuItem(id, req.body);
    io.emit('menu_aggiornato', await db.getMenuDisponibile());
    io.emit('admin_menu_aggiornato', await db.getMenuAdmin());
    logger.info(`Menu aggiornato: id=${id}`);
    res.json({ success: true, data: updated });
  } catch (err) { logger.error('PUT /api/admin/menu/:id', err); res.status(400).json({ success: false, message: err.message }); }
});

// Elimina voce
app.delete('/api/admin/menu/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID non valido' });
    await db.deleteMenuItem(id);
    io.emit('menu_aggiornato', await db.getMenuDisponibile());
    io.emit('admin_menu_aggiornato', await db.getMenuAdmin());
    logger.info(`Menu eliminato: id=${id}`);
    res.json({ success: true, message: 'Voce eliminata' });
  } catch (err) { logger.error('DELETE /api/admin/menu/:id', err); res.status(400).json({ success: false, message: err.message }); }
});

// Toggle disponibile
app.post('/api/admin/menu/:id/toggle', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID non valido' });
    const updated = await db.toggleMenuItem(id);
    io.emit('menu_aggiornato', await db.getMenuDisponibile());
    // Emette un evento separato per l'admin con tutto il menu
    io.emit('admin_menu_aggiornato', await db.getMenuAdmin());
    logger.info(`Menu toggle: id=${id} → available=${updated.available}`);
    res.json({ success: true, data: updated });
  } catch (err) { logger.error('POST /api/admin/menu/:id/toggle', err); res.status(400).json({ success: false, message: err.message }); }
});

// =============================================================================
// SOCKET.IO & SUPABASE REALTIME
// =============================================================================

io.on('connection', async (socket) => {
  logger.info(`Socket connesso: ${socket.id}`);
  try {
    socket.emit('menu_aggiornato', await db.getMenuDisponibile());
  } catch (err) {
    logger.error('Socket init error', err);
  }
  socket.on('disconnect', () => logger.info(`Socket disconnesso: ${socket.id}`));
});

// Ascolta in tempo reale le modifiche del database (es. fatte dalla dashboard Supabase)
// e aggiorna istantaneamente tutti i clienti e admin connessi
supabase
  .channel('public:menu_generale')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_generale' }, async (payload) => {
    logger.info(`Supabase Realtime event: ${payload.eventType}`);
    io.emit('menu_aggiornato', await db.getMenuDisponibile());
    io.emit('admin_menu_aggiornato', await db.getMenuAdmin());
  })
  .subscribe();

// =============================================================================
// ERROR HANDLER & START
// =============================================================================

app.use((err, req, res, next) => {
  logger.error('Unhandled error', err);
  res.status(500).json({ success: false, message: 'Errore interno del server' });
});

Promise.all([initDB(), birreReady]).then(() => {
  httpServer.listen(PORT, () => {
    logger.info(`Server avviato su :${PORT}`);
    logger.info(`Cliente → http://localhost:${PORT}/`);
    logger.info(`Admin   → http://localhost:${PORT}/${ADMIN_SECRET_PATH} (birre: /${ADMIN_SECRET_PATH}/birre)`);
  });
});

process.on('SIGTERM', () => httpServer.close(() => process.exit(0)));
