-- ============================================================
-- BlackOut Pub — Schema Supabase
-- Esegui questo script nell'SQL Editor di Supabase
-- ============================================================

CREATE TABLE IF NOT EXISTS birre (
  id                  INTEGER PRIMARY KEY,
  formato             TEXT    NOT NULL CHECK (formato IN ('spina', 'lattina')),
  nome                TEXT    NOT NULL,
  birrificio          TEXT    NOT NULL,
  tipologia           TEXT,
  gradazione_alcolica NUMERIC(4,1) NOT NULL DEFAULT 0,
  prezzo_piccola      NUMERIC(5,2),
  prezzo_media        NUMERIC(5,2),
  prezzo_unico        NUMERIC(5,2),
  disponibile         BOOLEAN NOT NULL DEFAULT TRUE,
  gluten_free         BOOLEAN NOT NULL DEFAULT FALSE,
  analcolico          BOOLEAN NOT NULL DEFAULT FALSE,
  immagine_url        TEXT
);

CREATE TABLE IF NOT EXISTS spine (
  numero_spina  INTEGER PRIMARY KEY CHECK (numero_spina BETWEEN 1 AND 8),
  birra_id      INTEGER REFERENCES birre(id) ON DELETE SET NULL
);

-- Aggiungi colonne mancanti su tabelle esistenti (se stai aggiornando)
ALTER TABLE birre ADD COLUMN IF NOT EXISTS analcolico BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE birre ADD COLUMN IF NOT EXISTS tipologia  TEXT;

-- Disabilita RLS se usi service_role key
-- ALTER TABLE birre DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE spine DISABLE ROW LEVEL SECURITY;
