// Birre (spine + lattine): codice dell'ex server blackout-tap-menu, montato nel server unico.
module.exports = function setupBirre({ app, io, supabase, requireAdmin, logger }) {

// =============================================================================
// SEED DATA
// =============================================================================

const SEED_BIRRE = [
  { id: 1,  formato: 'spina',   nome: 'URTYP',         birrificio: 'PAULANER',            tipologia: 'Helles',       gradazione_alcolica: 5.5, prezzo_piccola: 3.00, prezzo_media: 4.50, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/paulaner.png' },
  { id: 2,  formato: 'spina',   nome: 'RAPID',         birrificio: 'BREWORT',             tipologia: 'Lager',        gradazione_alcolica: 5.3, prezzo_piccola: 3.50, prezzo_media: 5.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/viennalager.png' },
  { id: 3,  formato: 'spina',   nome: 'ESTIVALE',      birrificio: 'LA RULLES',           tipologia: 'Saison',       gradazione_alcolica: 5.2, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/estivale-rulles.png' },
  { id: 4,  formato: 'spina',   nome: 'BOCK',          birrificio: 'BANDIGA',             tipologia: 'Bock',         gradazione_alcolica: 6.2, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/bandiga-bock.png' },
  { id: 5,  formato: 'spina',   nome: 'STOUT',         birrificio: 'BANDIGA',             tipologia: 'Stout',        gradazione_alcolica: 5.5, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/stout-bandiga.png' },
  { id: 6,  formato: 'spina',   nome: 'RENNA RIBELLE', birrificio: 'PORTA BRUCIATA',      tipologia: 'Red Ale',      gradazione_alcolica: 6.5, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/renna-ribelle.png' },
  { id: 7,  formato: 'spina',   nome: 'JAMBON ATTACKS',birrificio: 'MUTNINK',             tipologia: 'IPA',          gradazione_alcolica: 6.2, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/jambon-attack.png' },
  { id: 8,  formato: 'spina',   nome: 'BERRY DROP',    birrificio: 'VETRA',               tipologia: 'Fruit Beer',   gradazione_alcolica: 4.5, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/berrydrop-vetra.png' },
  { id: 9,  formato: 'spina',   nome: 'SAN LORENZO',   birrificio: 'MC-77',               tipologia: 'Blanche',      gradazione_alcolica: 5.2, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/sanlorenzo.png' },
  { id: 10, formato: 'spina',   nome: 'BOCKBIER',      birrificio: 'MÖNCHSHOF',           tipologia: 'Bock',         gradazione_alcolica: 6.9, prezzo_piccola: 3.50, prezzo_media: 5.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/bockbier.png' },
  { id: 11, formato: 'spina',   nome: 'ITALIAN PILS',  birrificio: 'BANDIGA',             tipologia: 'Italian Pils', gradazione_alcolica: 5.0, prezzo_piccola: 3.00, prezzo_media: 4.50, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/italian-pils-bandiga.png' },
  { id: 12, formato: 'spina',   nome: 'ZHULKA',        birrificio: 'MUTTNIK',             tipologia: 'Imperial IPA', gradazione_alcolica: 8.0, prezzo_piccola: 4.50, prezzo_media: 6.50, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/zhulka-muttnik.png' },
  { id: 13, formato: 'spina',   nome: 'MINI',          birrificio: 'HAMMER',              tipologia: 'Session IPA',  gradazione_alcolica: 4.2, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/session-ipa-mini.png' },
  { id: 14, formato: 'spina',   nome: 'DUNKELBOCK',    birrificio: 'FALKENTRUM',          tipologia: 'Stark bier',   gradazione_alcolica: 7.0, prezzo_piccola: 3.50, prezzo_media: 5.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/dunkelbock.png' },
  { id: 15, formato: 'spina',   nome: 'TIPOPILS',      birrificio: 'BIRRIFICIO ITALIANO', tipologia: 'Italian Pils', gradazione_alcolica: 5.2, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/tipopils.png' },
  { id: 16, formato: 'spina',   nome: 'ANARCHISTE',    birrificio: '100VENTI',            tipologia: 'Belgian blonde', gradazione_alcolica: 5.9, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/anarchiste.png' },
  { id: 17, formato: 'spina',   nome: 'BLANCHE',       birrificio: 'BANDIGA',             tipologia: 'Blanche',      gradazione_alcolica: 4.8, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/blanche-bandiga.png' },
  { id: 18, formato: 'spina',   nome: 'COSMIC',        birrificio: 'LAMBRATE',            tipologia: 'Session IPA',  gradazione_alcolica: 4.5, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/cosmic-lambrate.png' },
  { id: 19, formato: 'spina',   nome: 'MACCHÈKELLER',  birrificio: 'LAMBRATE',            tipologia: 'Keller',       gradazione_alcolica: 4.7, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/ma_che_keller_lambrate.png' },
  { id: 20, formato: 'spina',   nome: 'WAVE RUNNER',   birrificio: 'HAMMER',              tipologia: 'American IPA', gradazione_alcolica: 6.5, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/waverunner-hammer.png' },
  { id: 21, formato: 'spina',   nome: 'VIOLET FEVER',  birrificio: 'GRANDA',              tipologia: 'Fruit Beer',   gradazione_alcolica: 5.2, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/violetfever-granda.png' },
  { id: 33, formato: 'spina',   nome: 'DOUBLE IPA',    birrificio: 'CLATERNA',            tipologia: 'Double IPA',   gradazione_alcolica: 8.0, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/dipam-claterna.png' },
  { id: 34, formato: 'spina',   nome: 'BOLIK',         birrificio: 'MUTTNIK',             tipologia: 'APA',          gradazione_alcolica: 5.4, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/bolik-muttnik.png' },
  { id: 35, formato: 'spina',   nome: 'IPA',           birrificio: 'BANDIGA',             tipologia: 'IPA',          gradazione_alcolica: 6.3, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/bandiga-ipa.png' },
  { id: 36, formato: 'spina',   nome: 'GOSE',          birrificio: 'BANDIGA',             tipologia: 'Gose',         gradazione_alcolica: 4.3, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/bandiga-gose.png' },
  { id: 37, formato: 'spina',   nome: 'FLEUR SOFRONIA',birrificio: 'MC-77',               tipologia: 'Blanche',      gradazione_alcolica: 5.0, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/sofronia.png' },
  { id: 38, formato: 'spina',   nome: 'GHISA',         birrificio: 'LAMBRATE',            tipologia: 'Stout',        gradazione_alcolica: 5.0, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/ghisa.png' },
  { id: 39, formato: 'spina',   nome: 'SESSION TRIPEL',birrificio: 'BANDIGA',             tipologia: 'Belgian Blond Ale',         gradazione_alcolica: 5.8, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/tripel-bandiga.png' },
  { id: 75, formato: 'spina',   nome: 'IPACONDA'      ,birrificio: 'EDIT',                tipologia: 'American IPA',         gradazione_alcolica: 6.6, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true, gluten_free: false, immagine_url: '/images/ipaconda.png' },
  { id: 77, formato: 'spina', nome: 'SESSION IPA (GLUTEN FREE)',   birrificio: 'BANDIGA',             tipologia: 'Session IPA', gradazione_alcolica: 4.5, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true,  gluten_free: true, immagine_url: '/images/sessionipa.png' },
  { id: 78, formato: 'spina', nome: 'WEST COAST IPA',   birrificio: 'LA GRAMIGNA',             tipologia: 'West Coast IPA', gradazione_alcolica: 6.8, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true,  gluten_free: false, immagine_url: '/images/gramigna.png' },
  { id: 79, formato: 'spina', nome: 'ATOMIC',   birrificio: 'LAMBRATE',             tipologia: 'IPA', gradazione_alcolica: 6.2, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true,  gluten_free: false, immagine_url: '/images/atomicspina.png' },
  { id: 80, formato: 'spina', nome: 'PILS2',   birrificio: 'OTUS',             tipologia: 'Pilsner', gradazione_alcolica: 5.2, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true,  gluten_free: false, immagine_url: '/images/pils2.png' },
  { id: 81, formato: 'spina', nome: 'FALESIA',   birrificio: 'BIRRIFICIO LANARO',             tipologia: 'Bock', gradazione_alcolica: 7.0, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true,  gluten_free: false, immagine_url: '/images/falesia.png' },
  { id: 82, formato: 'spina', nome: 'MADIBA',   birrificio: 'BIRRIFICIO LANARO',             tipologia: 'Stout', gradazione_alcolica: 5.3, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true,  gluten_free: false, immagine_url: '/images/madiba.png' },
  { id: 83, formato: 'spina', nome: 'LATEX PIÙ',   birrificio: 'RETORTO',             tipologia: 'Blanche', gradazione_alcolica: 4.8, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true,  gluten_free: false, immagine_url: '/images/latex.png' },
  { id: 84, formato: 'spina', nome: 'JACOBATOR',   birrificio: 'JACOB',             tipologia: 'Doppelbock', gradazione_alcolica: 7.5, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true,  gluten_free: false, immagine_url: '/images/jacobator.png' }, 
  { id: 85, formato: 'spina', nome: 'GOGO (Gluten Free)',   birrificio: 'EDIT',             tipologia: 'Asian Blanche ', gradazione_alcolica: 4.5, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true,  gluten_free: false, immagine_url: '/images/gogo.png' },
  { id: 86, formato: 'spina', nome: 'IRISH STOUT',   birrificio: 'OHARAS',             tipologia: 'Irish Stout ', gradazione_alcolica: 4.3, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true,  gluten_free: false, immagine_url: '/images/ohara.png' },
  { id: 87, formato: 'spina', nome: 'CINCININ',   birrificio: 'LAMBRATE',             tipologia: 'Micro IPA ', gradazione_alcolica: 2.8, prezzo_piccola: 3.50, prezzo_media: 6.00, prezzo_unico: null, disponibile: true,  gluten_free: false, immagine_url: '/images/cincinin.png' },

  
 
 
  //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //BIRRE SPINE
  //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // BIRRE LATTINA
  //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
  
  
  { id: 22, formato: 'lattina', nome: 'ZIP',           birrificio: 'BREWFIST',            tipologia: 'Italian Pils', gradazione_alcolica: 5.1, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true,  gluten_free: true,  analcolico: false, immagine_url: '/images/brewort-zip.png' },
  { id: 23, formato: 'lattina', nome: 'BUNDES',        birrificio: 'HAMMER',              tipologia: 'Pils',         gradazione_alcolica: 5.2, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true,  gluten_free: false, immagine_url: '/images/bundes.png' },
  { id: 24, formato: 'lattina', nome: 'HIRSCH',        birrificio: 'HAMMER',              tipologia: 'Gose',         gradazione_alcolica: 4.5, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true,  gluten_free: false, immagine_url: '/images/hirsch.png' },
  { id: 25, formato: 'lattina', nome: 'MINI',          birrificio: 'HAMMER',              tipologia: 'Session IPA',  gradazione_alcolica: 4.2, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true,  gluten_free: false, immagine_url: '/images/session-lattina.png' },
  { id: 26, formato: 'lattina', nome: 'RIEGELE KELLER',birrificio: 'RIEGELE',             tipologia: 'Keller',       gradazione_alcolica: 5.0, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 5.00, disponibile: true,  gluten_free: false, immagine_url: '/images/riegele-keller.png' },
  { id: 27, formato: 'lattina', nome: 'HUGO',          birrificio: 'DADA',                tipologia: 'Ball Bitter Ale', gradazione_alcolica: 4.0, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true,  gluten_free: false, immagine_url: '/images/hugodada.png' },
  { id: 28, formato: 'lattina', nome: 'DUKE HERZOG',   birrificio: 'DADA',                tipologia: 'Keller',      gradazione_alcolica: 5.2, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true,  gluten_free: false, immagine_url: '/images/dukedada.png' },
  { id: 29, formato: 'lattina', nome: 'ROOFTOP',       birrificio: 'LA GRAMIGNA',         tipologia: 'Gose',        gradazione_alcolica: 4.3, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true,  gluten_free: false, immagine_url: '/images/rooftop.png' },
  { id: 30, formato: 'lattina', nome: 'SOUR DROP',     birrificio: 'LAMBRATE',            tipologia: 'Sour IPA',    gradazione_alcolica: 5.0, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true,  gluten_free: false, immagine_url: '/images/sourdrop-lambrate.png' },
  { id: 31, formato: 'lattina', nome: 'PAZZESKA',      birrificio: 'BREWFIST',            tipologia: 'Session IPA', gradazione_alcolica: 4.0, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true,  gluten_free: false, immagine_url: '/images/pazzeska.png' },
  { id: 32, formato: 'lattina', nome: 'ARIA FRITTA',   birrificio: 'CANEDIGUERRA',        tipologia: 'Saison',      gradazione_alcolica: 4.3, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true,  gluten_free: false, immagine_url: '/images/ariafritta.png' },
  { id: 40, formato: 'lattina', nome: 'SESSION IPA',   birrificio: 'BANDIGA',             tipologia: 'Session IPA', gradazione_alcolica: 4.5, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true,  gluten_free: true, immagine_url: '/images/sessionipa-lattina.png' },
  { id: 41, formato: 'lattina', nome: 'IPA',           birrificio: 'BANDIGA',             tipologia: 'IPA',         gradazione_alcolica: 6.5, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true,  gluten_free: false, immagine_url: '/images/ipa-lattina.png' },
  { id: 42, formato: 'lattina', nome: 'NIGREDO',       birrificio: 'BIRRIFICIO ITALIANO',             tipologia: 'Dark Hoppy Lager',         gradazione_alcolica: 6.5, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true,  gluten_free: false, immagine_url: '/images/nigredo.png' },
  { id: 43, formato: 'lattina', nome: 'GREEN MOUNTAIN', birrificio: 'THORNBRIDGE',        tipologia: 'Session IPA', gradazione_alcolica: 4.3, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true,  gluten_free: false, immagine_url: '/images/greenmountain.png' },
  { id: 44, formato: 'lattina', nome: 'MISHKA',        birrificio: 'MUTTNIK',             tipologia: 'Blanche',         gradazione_alcolica: 4.1, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true,  gluten_free: false, immagine_url: '/images/mishka.png' },
  { id: 45, formato: 'lattina', nome: 'ATOMIC',        birrificio: 'LAMBRATE',            tipologia: 'IPA',         gradazione_alcolica: 6.2, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true,  gluten_free: false, immagine_url: '/images/atomic.png' },
  { id: 46, formato: 'lattina', nome: 'MACHEKELLER',   birrificio: 'LAMBRATE',            tipologia: 'Keller',         gradazione_alcolica: 4.7, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true,  gluten_free: false, immagine_url: '/images/kellerlattina.png' },
  { id: 47, formato: 'lattina', nome: 'OH MY GOLD!',   birrificio: '100VENTI',            tipologia: 'Belgian Strong Golden Ale',         gradazione_alcolica: 7.5, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true,  gluten_free: false, immagine_url: '/images/ohmygold.png' },
  { id: 48, formato: 'lattina', nome: 'RAUCHBIER',       birrificio: 'BANDIGA',           tipologia: 'Rauch',         gradazione_alcolica: 5.3, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true,  gluten_free: false, immagine_url: '/images/rauchbier.png' },
  { id: 49, formato: 'lattina',  nome: 'SESSION TRIPEL',birrificio: 'BANDIGA',            tipologia: 'Session Tripel',         gradazione_alcolica: 5.8, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true, gluten_free: false, immagine_url: '/images/tripel-lattina-bandiga.png' },
  { id: 50, formato: 'lattina',  nome: 'DIAVOLA',      birrificio: 'LA GRAMIGNA',         tipologia: 'Grodziskie',    gradazione_alcolica: 4.0, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true, gluten_free: false, immagine_url: '/images/diavola.png' },
  { id: 51, formato: 'lattina',  nome: 'TERMINAL',      birrificio: 'BREWFIST',         tipologia: 'Pale Ale',    gradazione_alcolica: 3.5, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 7.00, disponibile: true, gluten_free: false, immagine_url: '/images/terminal.png' },
  { id: 52, formato: 'lattina',  nome: 'SPACEMAN',      birrificio: 'BREWFIST',         tipologia: 'West Coast IPA',    gradazione_alcolica: 7.0, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 7.00, disponibile: true, gluten_free: false, immagine_url: '/images/spaceman.png' },
  { id: 53, formato: 'lattina',  nome: '2LATE',      birrificio: 'BREWFIST',         tipologia: 'Imperial Ipa',    gradazione_alcolica: 9.0, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 7.00, disponibile: true, gluten_free: false, immagine_url: '/images/2late.png' },
  { id: 54, formato: 'lattina',  nome: 'L UNA ROSSA',      birrificio: 'OPPERBACCO',         tipologia: 'Belgian Amber Ale',    gradazione_alcolica: 7.0, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 7.00, disponibile: true, gluten_free: false, immagine_url: '/images/lunarossa.png' },
  { id: 55, formato: 'lattina',  nome: 'BADESSA',      birrificio: 'PORTA BRUCIATA',         tipologia: 'Tripel',    gradazione_alcolica: 9.0, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true, gluten_free: false, immagine_url: '/images/badessa.png' },
  { id: 56, formato: 'lattina',  nome: 'ROCHEFORT 8',      birrificio: 'ROCHEFORT',         tipologia: 'Belgian Strong Ale',    gradazione_alcolica: 9.2, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true, gluten_free: false, immagine_url: '/images/rochefort8.png' },
  { id: 57, formato: 'lattina',  nome: 'WESTMALLE TRIPEL',      birrificio: 'WESTMALLE',         tipologia: 'Tripel',    gradazione_alcolica: 9.5, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true, gluten_free: false, immagine_url: '/images/westmalle.png' },
  { id: 58, formato: 'lattina',  nome: 'FRANZISKANER',      birrificio: 'FRANZISKANER',         tipologia: 'Weiss',    gradazione_alcolica: 5.0, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true, gluten_free: false, immagine_url: '/images/franziskaner.png' },
  { id: 59, formato: 'lattina',  nome: 'CORONA',      birrificio: 'CERVECERIA MODELO',         tipologia: 'Lager messicana',    gradazione_alcolica: 6.5, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 4.00, disponibile: true, gluten_free: false, immagine_url: '/images/corona.png' },
  { id: 60, formato: 'lattina',  nome: "TENNENT'S",      birrificio: 'WELLPARK BREWERY',         tipologia: 'Strong Lager',    gradazione_alcolica: 9.0, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 4.50, disponibile: true, gluten_free: false, immagine_url: '/images/tennets.png' },
  { id: 61, formato: 'lattina',  nome: 'AMARANTA',      birrificio: 'ORSO VERDE',         tipologia: 'Bock',    gradazione_alcolica: 6.0, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 7.00, disponibile: true, gluten_free: false, immagine_url: '/images/amaranta.png' },
  { id: 62, formato: 'lattina',  nome: 'VLAANDER',      birrificio: 'ORSO VERDE',         tipologia: 'Tripel',    gradazione_alcolica: 8.1, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 7.00, disponibile: true, gluten_free: false, immagine_url: '/images/vlaander.png' },
  { id: 63, formato: 'lattina',  nome: 'CA**O GUARDI',      birrificio: 'BREWFIST',         tipologia: 'Blond Ale',    gradazione_alcolica: 0.0, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true, gluten_free: false, analcolico: true, immagine_url: '/images/cazzoguardi.png' },
  { id: 64, formato: 'lattina',  nome: 'FUMANT',      birrificio: 'BIRRIFICIO DEI CASTELLI',         tipologia: 'Rauch',    gradazione_alcolica: 5.2, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true, gluten_free: false, analcolico: false, immagine_url: '/images/fumant.png' },
  { id: 65, formato: 'lattina',  nome: 'ARIES',      birrificio: 'BIRRIFICIO DEI CASTELLI',         tipologia: 'Bock',    gradazione_alcolica: 6.5, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true, gluten_free: false, analcolico: false, immagine_url: '/images/aries.png' },
  { id: 66, formato: 'lattina',  nome: 'BLOEMENBIER',      birrificio: 'DE PROEFBROUWERIJ',         tipologia: 'Strong Ale',    gradazione_alcolica: 7.0, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true, gluten_free: false, analcolico: false, immagine_url: '/images/bloemenbier.png' },
  { id: 67, formato: 'lattina',  nome: 'FALL GUY',      birrificio: 'TEMPEST',         tipologia: 'Stout',    gradazione_alcolica: 5.6, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true, gluten_free: false, analcolico: false, immagine_url: '/images/fallguy.png' },
  { id: 68, formato: 'lattina',  nome: 'PRIMA NOTTE',      birrificio: 'CLATERNA',         tipologia: 'Imperial Stout',    gradazione_alcolica: 13.5, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true, gluten_free: false, analcolico: false, immagine_url: '/images/primanotte.png' },
  { id: 69, formato: 'lattina',  nome: 'APEX',      birrificio: 'WICKLOW WOLF',         tipologia: 'Stout',    gradazione_alcolica: 6.5, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true, gluten_free: false, analcolico: false, immagine_url: '/images/wolf.png' },
  { id: 70, formato: 'lattina',  nome: "I'VE HAD WORSE",      birrificio: 'BUSA DEI BRIGANTI',         tipologia: 'Stout',    gradazione_alcolica: 5.0, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true, gluten_free: false, analcolico: false, immagine_url: '/images/worse.png' },
  { id: 71, formato: 'lattina',  nome: 'NO SMOKING',      birrificio: 'RETORTO',         tipologia: 'Porter',    gradazione_alcolica: 5.2, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true, gluten_free: false, analcolico: false, immagine_url: '/images/nosmoking.png' },
  { id: 72, formato: 'lattina',  nome: 'FARO',      birrificio: 'LINDEMANS',         tipologia: 'Lambic',    gradazione_alcolica: 4.5, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true, gluten_free: false, analcolico: false, immagine_url: '/images/faro.png' },
  { id: 73, formato: 'lattina',  nome: 'KRIEK',      birrificio: 'LINDEMANS',         tipologia: 'Fruit Beer',    gradazione_alcolica: 3.5, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true, gluten_free: false, analcolico: false, immagine_url: '/images/kriek.png' },
  { id: 74, formato: 'lattina',  nome: 'BUSH DE NOËL',      birrificio: 'DUBUISSON',         tipologia: 'Belgian Strong Ale',    gradazione_alcolica: 12.0, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 6.00, disponibile: true, gluten_free: false, analcolico: false, immagine_url: '/images/noel.png' },
  { id: 76, formato: 'lattina',  nome: 'SCARBOROUGH FAIR IPA',      birrificio: 'WOLD TOP BREWERY',         tipologia: 'English Style IPA',    gradazione_alcolica: 6.0, prezzo_piccola: null, prezzo_media: null, prezzo_unico: 7.00, disponibile: true, gluten_free: false, analcolico: false, immagine_url: '/images/woldtop.png' },
  

  


];

const SEED_SPINE = [
  { numero_spina: 1, birra_id: 1 },
  { numero_spina: 2, birra_id: 2 },
  { numero_spina: 3, birra_id: 3 },
  { numero_spina: 4, birra_id: 4 },
  { numero_spina: 5, birra_id: 5 },
  { numero_spina: 6, birra_id: 6 },
  { numero_spina: 7, birra_id: 7 },
  { numero_spina: 8, birra_id: 8 },
];

// =============================================================================
// INIT DB — verifica connessione e crea spine default se vuote
// =============================================================================

async function initDB() {
  const { error: errTest } = await supabase.from('birre').select('id').limit(1);
  if (errTest) {
    console.error('[DB] Tabella "birre" non trovata:', errTest.message);
    console.error('[DB] Crea le tabelle con lo script in supabase/schema.sql');
    process.exit(1);
  }

  // Upsert birre del SEED — aggiunge quelle mancanti, aggiorna le esistenti
  // NON elimina birre aggiunte dall'admin tramite il pannello
  const { error: errBirre } = await supabase
    .from('birre')
    .upsert(SEED_BIRRE, { onConflict: 'id', ignoreDuplicates: false });
  if (errBirre) {
    console.error('[DB] Upsert birre fallito:', errBirre.message);
    process.exit(1);
  }
  logger.info(`Catalogo sincronizzato: ${SEED_BIRRE.length} birre dal seed.`);

  // Spine — inserisce solo se vuote (non sovrascrive cambio fusto admin)
  const { data: spineEsistenti } = await supabase.from('spine').select('numero_spina').limit(1);
  if (!spineEsistenti || spineEsistenti.length === 0) {
    await supabase.from('spine').insert(SEED_SPINE);
    logger.info('Spine create (primo avvio).');
  }

  logger.info('Database pronto.');
}

// =============================================================================
// DATA ACCESS LAYER
// =============================================================================

const db = {

  getCatalogoCompleto: async () => {
    const { data, error } = await supabase.from('birre').select('*').order('id');
    if (error) throw new Error(error.message);
    return data;
  },

  getLattineDisponibili: async () => {
    const { data, error } = await supabase
      .from('birre').select('*').eq('formato', 'lattina').eq('disponibile', true).order('id');
    if (error) throw new Error(error.message);
    return data;
  },

  getSpine: async () => {
    const { data: spine, error: e1 } = await supabase
      .from('spine').select('numero_spina, birra_id').order('numero_spina');
    if (e1) throw new Error(e1.message);

    const { data: birre, error: e2 } = await supabase
      .from('birre').select('*').eq('formato', 'spina');
    if (e2) throw new Error(e2.message);

    const map = Object.fromEntries(birre.map(b => [b.id, b]));
    return spine.map(s => ({
      numero_spina: s.numero_spina,
      birra: s.birra_id ? (map[s.birra_id] || null) : null,
    }));
  },

  aggiornaSpina: async (numero, birraId) => {
    if (birraId !== null) {
      const { data, error } = await supabase.from('birre').select('id').eq('id', birraId).single();
      if (error || !data) throw new Error('Birra non trovata nel catalogo');
    }
    const { error } = await supabase
      .from('spine').update({ birra_id: birraId }).eq('numero_spina', numero);
    if (error) throw new Error(error.message);
    const spine = await db.getSpine();
    return spine.find(s => s.numero_spina === numero);
  },

  toggleLattina: async (id) => {
    const { data: birra, error: e1 } = await supabase
      .from('birre').select('id, nome, disponibile, formato').eq('id', id).single();
    if (e1 || !birra) throw new Error('Lattina non trovata');
    if (birra.formato !== 'lattina') throw new Error('La birra non è una lattina');
    const { data, error: e2 } = await supabase
      .from('birre').update({ disponibile: !birra.disponibile }).eq('id', id).select().single();
    if (e2) throw new Error(e2.message);
    return data;
  },

  aggiornaImmagine: async (id, url) => {
    const { data, error } = await supabase
      .from('birre').update({ immagine_url: url || null }).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  // ── CRUD catalogo ────────────────────────────────────────────────────────

  creaBirra: async (payload) => {
    const { nome, birrificio, tipologia, gradazione_alcolica, formato,
            prezzo_piccola, prezzo_media, prezzo_unico,
            gluten_free, analcolico, disponibile, immagine_url } = payload;
    if (!nome || !birrificio || !formato)
      throw new Error('nome, birrificio e formato sono obbligatori');
    if (!['spina','lattina'].includes(formato))
      throw new Error('formato deve essere "spina" o "lattina"');
    const { data, error } = await supabase
      .from('birre')
      .insert({
        // id omesso — generato automaticamente da Supabase (SERIAL)
        nome, birrificio, tipologia: tipologia || null,
        gradazione_alcolica: parseFloat(gradazione_alcolica) || 0,
        formato,
        prezzo_piccola: prezzo_piccola != null && prezzo_piccola !== '' ? parseFloat(prezzo_piccola) : null,
        prezzo_media:   prezzo_media   != null && prezzo_media   !== '' ? parseFloat(prezzo_media)   : null,
        prezzo_unico:   prezzo_unico   != null && prezzo_unico   !== '' ? parseFloat(prezzo_unico)   : null,
        gluten_free:    !!gluten_free,
        analcolico:     !!analcolico,
        disponibile:    disponibile !== false,
        immagine_url:   immagine_url || null,
      })
      .select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  aggiornaBirra: async (id, payload) => {
    const allowed = ['nome','birrificio','tipologia','gradazione_alcolica',
                     'prezzo_piccola','prezzo_media','prezzo_unico',
                     'gluten_free','analcolico','disponibile','immagine_url','formato'];
    const patch = {};
    for (const k of allowed) {
      if (payload[k] !== undefined) patch[k] = payload[k];
    }
    if (!Object.keys(patch).length) throw new Error('Nessun campo da aggiornare');
    const { data, error } = await supabase
      .from('birre').update(patch).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  eliminaBirra: async (id) => {
    // Svuota le spine che usano questa birra prima di eliminarla
    await supabase.from('spine').update({ birra_id: null }).eq('birra_id', id);
    const { error } = await supabase.from('birre').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  toggleDisponibilita: async (id) => {
    const { data: birra, error: e1 } = await supabase
      .from('birre').select('id, nome, disponibile').eq('id', id).single();
    if (e1 || !birra) throw new Error('Birra non trovata');
    const { data, error: e2 } = await supabase
      .from('birre').update({ disponibile: !birra.disponibile }).eq('id', id).select().single();
    if (e2) throw new Error(e2.message);
    return data;
  },
};

// =============================================================================
// ROUTES — PUBLIC
// =============================================================================

app.get('/api/spine', async (req, res) => {
  try { res.json({ success: true, data: await db.getSpine() }); }
  catch (err) { logger.error('GET /api/spine', err); res.status(500).json({ success: false, message: 'Errore interno' }); }
});

app.get('/api/lattine', async (req, res) => {
  try { res.json({ success: true, data: await db.getLattineDisponibili() }); }
  catch (err) { logger.error('GET /api/lattine', err); res.status(500).json({ success: false, message: 'Errore interno' }); }
});

// =============================================================================
// ROUTES — ADMIN
// =============================================================================

app.get('/api/admin/catalogo', requireAdmin, async (req, res) => {
  try { res.json({ success: true, data: await db.getCatalogoCompleto() }); }
  catch (err) { logger.error('GET /api/admin/catalogo', err); res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/spine/aggiorna', requireAdmin, async (req, res) => {
  try {
    const { numero_spina, birra_id } = req.body;
    const numero = parseInt(numero_spina, 10);
    if (isNaN(numero) || numero < 1 || numero > 8)
      return res.status(400).json({ success: false, message: 'numero_spina non valido (1-8)' });
    if (birra_id !== null && typeof birra_id !== 'number')
      return res.status(400).json({ success: false, message: 'birra_id deve essere un numero o null' });
    const spinaAggiornata = await db.aggiornaSpina(numero, birra_id);
    io.emit('menu_spine_aggiornato', await db.getSpine());
    logger.info(`Spina ${numero} → birra_id=${birra_id}`);
    res.json({ success: true, message: 'Spina aggiornata', data: spinaAggiornata });
  } catch (err) { logger.error('POST /api/spine/aggiorna', err); res.status(400).json({ success: false, message: err.message }); }
});

app.post('/api/lattine/toggle', requireAdmin, async (req, res) => {
  try {
    const { birra_id } = req.body;
    if (!birra_id || typeof birra_id !== 'number')
      return res.status(400).json({ success: false, message: 'birra_id obbligatorio (numero)' });
    const aggiornata = await db.toggleLattina(birra_id);
    io.emit('menu_lattine_aggiornato', await db.getLattineDisponibili());
    logger.info(`Lattina ${birra_id} (${aggiornata.nome}) → disponibile=${aggiornata.disponibile}`);
    res.json({ success: true, data: aggiornata });
  } catch (err) { logger.error('POST /api/lattine/toggle', err); res.status(400).json({ success: false, message: err.message }); }
});

app.post('/api/admin/immagine', requireAdmin, async (req, res) => {
  try {
    const { birra_id, immagine_url } = req.body;
    if (!birra_id || typeof birra_id !== 'number')
      return res.status(400).json({ success: false, message: 'birra_id obbligatorio (numero)' });
    const aggiornata = await db.aggiornaImmagine(birra_id, immagine_url);
    if (aggiornata.formato === 'spina') io.emit('menu_spine_aggiornato', await db.getSpine());
    else io.emit('menu_lattine_aggiornato', await db.getLattineDisponibili());
    logger.info(`Immagine aggiornata: id=${birra_id}`);
    res.json({ success: true, data: aggiornata });
  } catch (err) { logger.error('POST /api/admin/immagine', err); res.status(400).json({ success: false, message: err.message }); }
});

// ── CRUD catalogo birre ──────────────────────────────────────────────────────

// Crea nuova birra
app.post('/api/admin/birre', requireAdmin, async (req, res) => {
  try {
    const nuova = await db.creaBirra(req.body);
    // Broadcast aggiornato
    if (nuova.formato === 'lattina') io.emit('menu_lattine_aggiornato', await db.getLattineDisponibili());
    logger.info(`Birra creata: ${nuova.nome} (id=${nuova.id})`);
    res.status(201).json({ success: true, data: nuova });
  } catch (err) { logger.error('POST /api/admin/birre', err); res.status(400).json({ success: false, message: err.message }); }
});

// Aggiorna birra esistente
app.put('/api/admin/birre/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID non valido' });
    const aggiornata = await db.aggiornaBirra(id, req.body);
    if (aggiornata.formato === 'spina') io.emit('menu_spine_aggiornato', await db.getSpine());
    else io.emit('menu_lattine_aggiornato', await db.getLattineDisponibili());
    logger.info(`Birra aggiornata: id=${id}`);
    res.json({ success: true, data: aggiornata });
  } catch (err) { logger.error('PUT /api/admin/birre/:id', err); res.status(400).json({ success: false, message: err.message }); }
});

// Elimina birra
app.delete('/api/admin/birre/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID non valido' });
    await db.eliminaBirra(id);
    io.emit('menu_spine_aggiornato', await db.getSpine());
    io.emit('menu_lattine_aggiornato', await db.getLattineDisponibili());
    logger.info(`Birra eliminata: id=${id}`);
    res.json({ success: true });
  } catch (err) { logger.error('DELETE /api/admin/birre/:id', err); res.status(400).json({ success: false, message: err.message }); }
});

// Toggle disponibile (funziona sia per spina che lattina)
app.post('/api/admin/birre/:id/toggle', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID non valido' });
    const aggiornata = await db.toggleDisponibilita(id);
    if (aggiornata.formato === 'spina') io.emit('menu_spine_aggiornato', await db.getSpine());
    else io.emit('menu_lattine_aggiornato', await db.getLattineDisponibili());
    logger.info(`Toggle disponibilità: id=${id} → ${aggiornata.disponibile}`);
    res.json({ success: true, data: aggiornata });
  } catch (err) { logger.error('POST /api/admin/birre/:id/toggle', err); res.status(400).json({ success: false, message: err.message }); }
});

// Stato iniziale birre a ogni nuovo client (il menu cibo/drink ha il suo handler in server.js)
io.on('connection', async (socket) => {
  logger.info(`Socket connesso: ${socket.id}`);
  try {
    socket.emit('menu_spine_aggiornato',   await db.getSpine());
    socket.emit('menu_lattine_aggiornato', await db.getLattineDisponibili());
  } catch (err) {
    logger.error('Socket init error', err);
  }
  socket.on('disconnect', () => logger.info(`Socket disconnesso: ${socket.id}`));
});

return initDB();
};
