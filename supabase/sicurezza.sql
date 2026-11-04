-- ============================================================
-- BlackOut Pub — Blindatura Supabase
-- Esegui nell'SQL Editor di Supabase (in ENTRAMBI i progetti, se birre e menu stanno in due progetti).
--
-- PRIMA controlla nei log di Render la riga "SUPABASE_KEY: chiave server (service_role) OK".
-- Se invece dice publishable/anon NON eseguire questo script: il server non potrebbe più salvare.
--
-- Cosa fa: sulle tabelle del menu nessuno tranne il server (chiave service_role/secret, che bypassa RLS)
-- può leggere o scrivere. Chi trovasse l'URL del progetto e la chiave anon/publishable, o si creasse
-- un utente finto, non vede e non modifica niente.
-- È sicuro da rieseguire; salta le tabelle che nel progetto non esistono.
-- ============================================================

DO $$
DECLARE
  t text;
  p record;
BEGIN
  FOREACH t IN ARRAY ARRAY['birre', 'spine', 'menu_generale'] LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      -- RLS attivo e senza policy = accesso negato a anon e authenticated
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
      FOR p IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = t LOOP
        EXECUTE format('DROP POLICY %I ON public.%I', p.policyname, t);
      END LOOP;
      -- e in più niente permessi diretti per i ruoli pubblici
      EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', t);
      RAISE NOTICE 'Blindata: %', t;
    END IF;
  END LOOP;
END $$;

-- Verifica: deve risultare rowsecurity = true e nessuna policy
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND tablename IN ('birre', 'spine', 'menu_generale');
SELECT tablename, policyname FROM pg_policies
WHERE schemaname = 'public' AND tablename IN ('birre', 'spine', 'menu_generale');
