-- ============================================================
-- BlackOut Pub — Menu Generale (Cibo & Drink)
-- Esegui questo script nell'SQL Editor di Supabase
-- ============================================================

-- ATTENZIONE: la riga sotto CANCELLA tutto il menu. Lasciala commentata (CREATE TABLE IF NOT EXISTS basta).
-- DROP TABLE IF EXISTS menu_generale;

-- Tabella menu_generale
CREATE TABLE IF NOT EXISTS menu_generale (
  id              BIGSERIAL    PRIMARY KEY,
  name            TEXT         NOT NULL,
  description     TEXT,
  price           NUMERIC(6,2) NOT NULL,
  macro_category  TEXT         NOT NULL CHECK (macro_category IN ('Cucina', 'Drink')),
  sub_category    TEXT         NOT NULL,
  -- Cucina: 'Hamburger', 'Fuori Menù', 'Piade e Panini', 'Fritti', 'Salse', 'Vegan', 'Insalate', 'Dolci Homemade', 'Dolci Classici'
  -- Drink: 'Cocktail list', 'Gin', 'Rum', 'Whisky', 'Tequila'/'Tekila', 'Vini', 'Analcolici', 'Bibite', 'Amari', 'Grappe', 'Kaffetteria', ...
  badge           TEXT,
  -- opzionale: 'BEST SELLER', 'NOVITÀ', 'CONSIGLIATO'
  available       BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Indici utili per le query più comuni
CREATE INDEX IF NOT EXISTS idx_menu_macro ON menu_generale (macro_category);
CREATE INDEX IF NOT EXISTS idx_menu_sub   ON menu_generale (sub_category);
CREATE INDEX IF NOT EXISTS idx_menu_avail ON menu_generale (available);

-- ── Row Level Security ──────────────────────────────────────

ALTER TABLE menu_generale ENABLE ROW LEVEL SECURITY;

-- Chiunque (utente cliente) può leggere
CREATE POLICY "Lettura pubblica menu_generale"
  ON menu_generale FOR SELECT USING (true);

-- Solo il service_role (il server Node.js) può scrivere
CREATE POLICY "Scrittura server menu_generale"
  ON menu_generale FOR ALL USING (auth.role() = 'service_role');

-- Abilita le notifiche Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE menu_generale;

-- Migrazione per database esistenti (esegui solo se la colonna badge non esiste):
-- ALTER TABLE menu_generale ADD COLUMN IF NOT EXISTS badge TEXT;

-- ── Dati di esempio ─────────────────────────────────────────
-- Rimuovi o commenta questa sezione se vuoi partire da zero

INSERT INTO menu_generale (name, description, price, macro_category, sub_category, available) VALUES
  -- Drink — Cocktail list
  ('KILL ME LITCHY', 'Gin Roku, Briottet Liquore ai Litchi, B4 Liquore Fiori di Sambuco, Lillet Blanc, Martini Extra Dry', 8.00, 'Drink', 'Cocktail list', true),
  ('MINTUKY', 'Wild Turkey Bourbon 101 Proof, Menta Fresca, Sciroppo Zucchero', 8.00, 'Drink', 'Cocktail list', true),
  ('BASITO', 'Vodka Skyy, Basilico, Fever Three Ginger Ale, Lime, Zucchero', 8.00, 'Drink', 'Cocktail list', true),
  ('PENTHOUSE', 'Gin Bulldog, Tequila Espolon Blanco, Mezcal Montelobos, Succo Lime, Sciroppo Mora', 8.00, 'Drink', 'Cocktail list', true),
  ('KOVER KLUB', 'Gin Roku - Lillet Blanc - Succo Limone - Sciroppo Lampone', 8.00, 'Drink', 'Cocktail list', true),
  ('PEKILA', 'Tequila Cazadores aromatizzata al peperone - Liquore Fiori di Sambuco Succo Lime - Cioccolato salato', 8.00, 'Drink', 'Cocktail list', true),
  ('SPICY MANGO', 'Rum Kingstone Gold - Liquore Fiori di Sambuco - Succo lime - Sciroppo mango - Tabasco', 8.00, 'Drink', 'Cocktail list', true),
  ('ROSSO B', 'Bickens London dry gin - Keglevich Vodka pesca - Succo ace Sciroppo fragola - Schweppes lemon', 8.00, 'Drink', 'Cocktail list', true),
  ('INFAME', 'Skyy vodka - Cointreau - Sciroppo maracuja - Succo limone Galvanina ginger ale', 8.00, 'Drink', 'Cocktail list', true),

  -- Drink — Analkolici
  ('BASIL INSTINCT', 'Basilico Fresco, Succo Pesca, Sciroppo Sambuco, Lime', 6.00, 'Drink', 'Analcolici', true),
  ('LIMORA', 'Galvanina Tea verde Bio, Sciroppo Mora, Foglie di Menta', 6.00, 'Drink', 'Analcolici', true),
  ('MYRA', 'Succo mirtillo, Succo di limone, Sciroppo Cannella Sciroppo fiori di sambuco', 6.00, 'Drink', 'Analcolici', true),
  ('SOL_E', 'Succo pesca, Succo di limone, Sciroppo Maracuja Soda Galvanina Pompelmo', 6.00, 'Drink', 'Analcolici', true),

  -- Drink — Vini
  ('VALPOLICELLA CLASSICO "CAMPAGNOLA 2021"', 'Veneto, Corvina, Rondinella, Molinara • Fresco e fruttato con sentori di ciliegia | Bottiglia € 20 - Calice € 5', 5.00, 'Drink', 'Vini', true),
  ('APPASSIMENTO "DOMINI VENETI 2025"', 'Veneto, uve appassite • Corposo, intenso, note di frutti rossi maturi | Bottiglia € 28 - Calice € 6', 6.00, 'Drink', 'Vini', true),
  ('AREO "SUSUMANIELLO ROSSO 2022"', 'Puglia, Susumaniello • Avvolgente e speziato, finale persistente | Bottiglia € 28 - Calice € 6', 6.00, 'Drink', 'Vini', true),
  ('GRECHETTO "PROPIZIO 2024"', 'Umbria, Grechetto • Fresco, minerale, lievi note floreali e fruttate | Bottiglia € 28 - Calice € 6', 6.00, 'Drink', 'Vini', true),
  ('MALVASIA PUNTINATA "CARDITO 2024"', 'Lazio, Malvasia • Aromatico, morbido, con sentori di frutta a polpa bianca | Bottiglia € 28 - Calice € 6', 6.00, 'Drink', 'Vini', true),
  ('BLANC DU LAC "VIN DE FRANCE 2024"', 'Francia, Blend Bianco • Delicato, agrumato e piacevolmente secco | Bottiglia € 28 - Calice € 6', 6.00, 'Drink', 'Vini', true),
  ('ETNA ROSATO "BARONE DI VILLAGRANDE 2024"', 'Sicilia, Nerello Mascalese • Elegante e sapido, profumi di fragolina e rosa | Bottiglia € 28 - Calice € 6', 6.00, 'Drink', 'Vini', true),
  ('TRENTODOC BRUT NATURE "PEDROTTI"', 'Trentino, Metodo Classico • Perlage fine, secco, note di crosta di pane | Bottiglia € 35 - Calice € 7', 7.00, 'Drink', 'Vini', true),
  ('CHAMPAGNE JAQUES BOLLAND "BRUT BLANC DE NOIR"', 'Francia, Pinot Noir • Strutturato, elegante, note di frutta rossa e brioche | Bottiglia € 45', 45.00, 'Drink', 'Vini', true),

  -- Drink — Gin
  ('KI NO - TEA', 'Gin Giapponese • Yuzu, Tè Sencha, Sansho, Shiso', 12.00, 'Drink', 'Gin', true),
  ('KI NO BI - SEI', 'Gin Giapponese • Pelle di Yuzu, Foglie di Shiso, Bambù, Ginger', 12.00, 'Drink', 'Gin', true),
  ('KI NO BI - DRY', 'Gin Giapponese • Botaniche secche, Hinoki, Gyokuro Tea', 12.00, 'Drink', 'Gin', true),
  ('CRAFTER''S LONDON DRY', 'London Dry • Ginepro, Coriandolo, Angelica', 9.00, 'Drink', 'Gin', true),
  ('CRAFTER''S AROMATIC', 'London Dry • Rosa, Lavanda, Arancio Amaro', 10.00, 'Drink', 'Gin', true),
  ('CRAFTER''S WILD FOREST', 'London Dry • Abete, Ginepro Selvatico, Muschio', 10.00, 'Drink', 'Gin', true),
  ('HOLYWATER', 'Contemporary • Ginepro, Agrumi Italiani, Fiore di Sambuco', 10.00, 'Drink', 'Gin', true),
  ('PORTOFINO DRY', 'Italian Riviera • Basilico Ligure, Rosa Canina, Salvia', 10.00, 'Drink', 'Gin', true),
  ('GIN ARTE', 'Spanish Dry • Ginepro, Citrus, Cardamomo, Coriandolo', 10.00, 'Drink', 'Gin', true),
  ('GLENDALOUGH', 'Wild Irish • Botaniche selvatiche stagionali irlandesi', 9.00, 'Drink', 'Gin', true),
  ('HAPUSA', 'Himalayan • Ginepro Himalayano, Mango, Turmeric, Cardamomo', 10.00, 'Drink', 'Gin', true),
  ('MAYFIELD', 'English Garden • Sambuco, Mela, Ginepro, Rosa', 10.00, 'Drink', 'Gin', true),
  ('NORDES', 'Atlantic Galician • Albariño, Eucalipto, Tè Verde, Verbena', 9.00, 'Drink', 'Gin', true),
  ('HAYMAN''S - OLD TOM', 'Old Tom Style • Leggermente dolce, Ginepro, Liquirizia', 9.00, 'Drink', 'Gin', true),
  ('JIN Q - OLD TOM', 'Old Tom • Dolce, Tè Bianco, Osmanto, Angelica', 9.00, 'Drink', 'Gin', true),
  ('PIERO - OLD TOM', 'Old Tom Italiano • Ginepro, Agrumi, Liquirizia, Vaniglia', 10.00, 'Drink', 'Gin', true),
  ('GUNPOWDER', 'Irish Gin • Tè Gunpowder, Cardamomo, Arancia Amara', 10.00, 'Drink', 'Gin', true),
  ('PLYMOUTH - NAVY STRENGHT', 'Navy Strength 57% • Ginepro, Coriandolo, Scorza Arancio', 10.00, 'Drink', 'Gin', true),
  ('LONEWOLF - PEACH & PASSION FRUIT', 'Scottish Contemporary • Pesca, Frutto della Passione, Ginepro', 9.00, 'Drink', 'Gin', true),
  ('LONEWOLF - CACTUS & LIME', 'Scottish Contemporary • Cactus, Lime, Ginepro, Citronella', 9.00, 'Drink', 'Gin', true),
  ('MATSUI', 'Japanese Craft • Ginepro, Yuzu, Sakura, Tè Bianco', 10.00, 'Drink', 'Gin', true),
  ('HENDRICK''S ORBIUM', 'Scottish • Quinino, Verbena, Loto Blu + base Hendrick''s', 9.00, 'Drink', 'Gin', true),
  ('HENDRICK''S', 'Scottish • Rosa, Cetriolo, Ginepro — il classico', 9.00, 'Drink', 'Gin', true),
  ('HENDRICK''S NEPTUNIA', 'Scottish Coastal • Alga Marina, Cetriolo, Brezza Salata', 9.00, 'Drink', 'Gin', true),
  ('HENDRICK''S AMAZONIA', 'Scottish • Fiori Amazzonici, Frutti Esotici, Rosa', 9.00, 'Drink', 'Gin', true),
  ('HENDRICK''S GRAND CABARET', 'Scottish • Ylang-Ylang, Fiori Esotici, Rosa e Cetriolo', 9.00, 'Drink', 'Gin', true),
  ('SIPSMITH SLOW', 'London Dry Slow Distilled • Ginepro, Scorza Limone, Cassia', 10.00, 'Drink', 'Gin', true),
  ('ALKKEMIST', 'Spanish • Rosa di Damasco, Lavanda, Camomilla, Lime', 10.00, 'Drink', 'Gin', true),
  ('GIN D''AZURE', 'French Riviera • Mimosa, Lavanda, Mandorla, Gelsomino', 10.00, 'Drink', 'Gin', true),
  ('THE KING OF SOHO', 'London • Bacche di Ginepro, Scorza Arancio, Angelica', 10.00, 'Drink', 'Gin', true),
  ('MOHN', 'Austrian • Papavero, Mela Selvatica, Lavanda, Ginepro', 9.00, 'Drink', 'Gin', true),
  ('BROOKLYN', 'American Dry • Ginepro, Lime, Coriandolo, Angelica', 9.00, 'Drink', 'Gin', true),
  ('ELEPHANT', 'African • 14 Botaniche Africane incl. Baobab e Buchu', 10.00, 'Drink', 'Gin', true),
  ('MY FAIR 6 PM', 'French Contemporary • Rosa, Pompelmo Rosa, Ginepro', 9.00, 'Drink', 'Gin', true),
  ('BLUE WHALE', 'Indian • Ginepro, Cubebe, Cardamomo Verde, Agrumi', 9.00, 'Drink', 'Gin', true),
  ('AMBROSIA', 'Italian • Ginepro, Bergamotto, Arancio, Mirto, Menta', 10.00, 'Drink', 'Gin', true),
  ('GIN KRISS', 'Italian Craft • Ginepro, Arancia Rossa, Melograno', 10.00, 'Drink', 'Gin', true),
  ('THE BOTANIST', 'Islay Scottish • 22 Botaniche Selvatiche delle Ebridi', 10.00, 'Drink', 'Gin', true),
  ('HYOGO DRY', 'Japanese • Yuzu, Sansho, Hinoki, Ginepro', 9.00, 'Drink', 'Gin', true),
  ('BOE', 'Scottish Premium • Fiore di Sambuco, Ginepro, Bergamotto', 10.00, 'Drink', 'Gin', true),
  ('ADAMUS', 'Portuguese • Lavanda, Rosa, Vino Bianco, Ginepro', 10.00, 'Drink', 'Gin', true),
  ('TENJAKU', 'Japanese • Ginepro, Yuzu, Sakura, Sansho Pepper', 8.00, 'Drink', 'Gin', true),
  ('HAYMANS OLD TOM', 'Old Tom • Dolce equilibrato, Ginepro, Coriandolo', 9.00, 'Drink', 'Gin', true),
  ('PEPE GIN', 'Italian Spicy • Pepe Nero, Ginepro, Agrumi, Cardamomo', 9.00, 'Drink', 'Gin', true),
  ('BAD GIN', 'Craft • Ginepro, Tè Verde, Ginger, Scorza Limone', 8.00, 'Drink', 'Gin', true),
  ('GIN SEA', 'Mediterranean • Sale Marino, Alghe, Agrumi Costieri, Ginepro', 10.00, 'Drink', 'Gin', true),

  -- Drink — Whisky
  ('GLENDALOUGH', 'Pot Still Irish Whiskey', 7.00, 'Drink', 'Whisky', true),
  ('THE KOSHI-NO SHINOBU', 'Mizunara Wood Japanese Oak Finish', 12.00, 'Drink', 'Whisky', true),
  ('WILD TURKEY 101', 'Kentucky Straight Bourbon Whiskey', 6.00, 'Drink', 'Whisky', true),
  ('WILD TURKEY BOURBON', 'Kentucky Straight Bourbon Whiskey', 5.00, 'Drink', 'Whisky', true),
  ('BERRY BROS & RUDD 12', 'Single Malt Scotch Whisky Speyside Sherry Cask', 10.00, 'Drink', 'Whisky', true),
  ('WEE BEASTIE - ARDBEG 10', 'Islay Single Malt Scotch Whisky', 10.00, 'Drink', 'Whisky', true),
  ('YAMAZAKURA', 'Fine Blended Japanese Whisky', 10.00, 'Drink', 'Whisky', true),
  ('SMOKEHEAD', 'Islay Single Malt Scotch Whisky', 9.00, 'Drink', 'Whisky', true),
  ('SMOKEHEAD - HIGH VOLTAGE', 'Islay Single Malt Scotch Whisky', 9.00, 'Drink', 'Whisky', true),
  ('BUFFALO TRACE', 'Kentucky Straight Bourbon Whiskey', 9.00, 'Drink', 'Whisky', true),
  ('WOODFORD RESERVE', 'Kentucky Straight Bourbon Whiskey', 7.00, 'Drink', 'Whisky', true),
  ('MAKER''S MARK', 'Kentucky Straight Bourboun', 6.00, 'Drink', 'Whisky', true),
  ('DEWAT''S WHITE LABEL', 'Blended Scotch Whisky', 7.00, 'Drink', 'Whisky', true),

  -- Drink — Rum
  ('PLANTATION', 'Artisanal Caribbean Rum - Original Dark', 6.00, 'Drink', 'Rum', true),
  ('PLANTATION O.F.T.D.', 'Artisanal Caribbean Rum - Overproof', 8.00, 'Drink', 'Rum', true),
  ('WORTHY PARK', 'Single Estate Reserve - Jamaican Rum', 8.00, 'Drink', 'Rum', true),
  ('RHUM J.M.', 'Rhum Vieux Agricole Martinique', 8.00, 'Drink', 'Rum', true),
  ('BARON SAMEDI', 'Caribbean Rum Spiced', 5.00, 'Drink', 'Rum', true),
  ('HAMPDEN', 'Pure Single Jamaican Rum', 10.00, 'Drink', 'Rum', true),
  ('CLARIN COMMUNAL', 'Blend Des Quatre Communes - Agricole', 8.00, 'Drink', 'Rum', true),
  ('PLANTATION PINEAPPLE', 'Artisanal Caribbean Rum -Ananas', 6.00, 'Drink', 'Rum', true),
  ('NUSA CANA', 'Imported Tropical Island - Spiced Rum', 7.00, 'Drink', 'Rum', true),
  ('KRAKEN', 'Black Spiced Rum', 5.00, 'Drink', 'Rum', true),

  -- Drink — Tekila
  ('GHOST SPICY BLANCO', 'TEQUILA', 5.00, 'Drink', 'Tekila', true),
  ('ESPOLÒN BLANCO', 'TEQUILA', 4.00, 'Drink', 'Tekila', true),
  ('ESPOLÒN REPOSADO', 'TEQUILA', 8.00, 'Drink', 'Tekila', true),
  ('PADRE DE LOS JAGUARES', 'SOTOL', 5.00, 'Drink', 'Tekila', true),
  ('YUU BAAL', 'MEZCAL', 5.00, 'Drink', 'Tekila', true),
  ('MONTELOBOS', 'MEZCAL', 5.00, 'Drink', 'Tekila', true),
  ('VIDA', 'MEZCAL', 6.00, 'Drink', 'Tekila', true),

  -- Drink — Amari
  ('LBR - BEVANDA SPIRITOSA', 'Liquore Al Luppolo Birrificio Lambrate', 5.00, 'Drink', 'Amari', true),
  ('SAMBUCA SBAGLIATA', NULL, 5.00, 'Drink', 'Amari', true),
  ('SCOPPER', 'Liquore Al Caramello Salato', 5.00, 'Drink', 'Amari', true),
  ('LUNA NERA', 'Liquore Alla Sambuca e Liquirizia', 5.00, 'Drink', 'Amari', true),
  ('AMARO FORMIDABILE', 'Elixir Amaricante Finissimo', 5.00, 'Drink', 'Amari', true),
  ('JEFFERSON', NULL, 5.00, 'Drink', 'Amari', true),
  ('AVERNA', NULL, 4.00, 'Drink', 'Amari', true),
  ('BRAULIO RISERVA', NULL, 4.00, 'Drink', 'Amari', true),
  ('SAMBUCA MOLINARI', NULL, 4.00, 'Drink', 'Amari', true),
  ('MONTENEGRO', NULL, 4.00, 'Drink', 'Amari', true),
  ('AMARO DEL CAPO', NULL, 4.00, 'Drink', 'Amari', true),
  ('JÄGERMEISTER', NULL, 4.00, 'Drink', 'Amari', true),
  ('FERNET BRANCA', NULL, 4.00, 'Drink', 'Amari', true),
  ('BRANCA MENTA', NULL, 4.00, 'Drink', 'Amari', true),
  ('FRANGELICO', NULL, 4.00, 'Drink', 'Amari', true),
  ('DISARONNO', NULL, 4.00, 'Drink', 'Amari', true),
  ('NOCINO', NULL, 4.00, 'Drink', 'Amari', true),
  ('BAILEYS', NULL, 4.00, 'Drink', 'Amari', true),
  ('LIQUIRIZIA', NULL, 4.00, 'Drink', 'Amari', true),

  -- Drink — Grappe
  ('POLI MORBIDA', NULL, 4.50, 'Drink', 'Grappe', true),
  ('POLI SECCA', NULL, 4.50, 'Drink', 'Grappe', true),
  ('18 LUNE - BARRIQUE', NULL, 4.50, 'Drink', 'Grappe', true),
  ('903 - BARRIQUE', NULL, 4.50, 'Drink', 'Grappe', true),

  -- Drink — Kaffetteria
  ('CAFFÈ', NULL, 1.50, 'Drink', 'Kaffetteria', true),
  ('CAFFÈ CORRETTO', NULL, 2.00, 'Drink', 'Kaffetteria', true),
  ('CAPPUCCINO', NULL, 2.50, 'Drink', 'Kaffetteria', true),
  ('CAFFÈ CON AMORE', 'Shakerato con Frangelico e Amaretto Disaronno', 6.00, 'Drink', 'Kaffetteria', true),
  ('TE CALDO / TISANA', 'Con biscotti € 5', 4.00, 'Drink', 'Kaffetteria', true),
  ('APONE', 'Caffè con Zabov, topping al cioccolato, panna', 7.00, 'Drink', 'Kaffetteria', true),
  ('CIOCCOLATA CALDA', NULL, 5.00, 'Drink', 'Kaffetteria', true),

  -- Drink — Bibite
  ('FEVER THREE INDIAN TONIC', NULL, 3.00, 'Drink', 'Bibite', true),
  ('GALVANINA POMPELMO ROSSO', NULL, 5.00, 'Drink', 'Bibite', true),
  ('GALVANINA THE VERDE', NULL, 5.00, 'Drink', 'Bibite', true),
  ('GALVANINA GINGER BEER', NULL, 5.00, 'Drink', 'Bibite', true),
  ('FEVER THREE GINGER ALE', NULL, 3.00, 'Drink', 'Bibite', true),
  ('SCHWEPPES LEMON', NULL, 3.00, 'Drink', 'Bibite', true),
  ('SCHWEPPES TONIC', NULL, 3.00, 'Drink', 'Bibite', true),
  ('COCA COLA', NULL, 3.00, 'Drink', 'Bibite', true),
  ('COCA COLA ZERO', NULL, 3.00, 'Drink', 'Bibite', true),
  ('FANTA', NULL, 3.00, 'Drink', 'Bibite', true),
  ('CHINOTTO', NULL, 3.00, 'Drink', 'Bibite', true),
  ('SPRITE', NULL, 3.00, 'Drink', 'Bibite', true),
  ('LEMON SODA', NULL, 3.00, 'Drink', 'Bibite', true),
  ('CEDRATA TASSONI', NULL, 3.00, 'Drink', 'Bibite', true),
  ('RED BULL', NULL, 4.00, 'Drink', 'Bibite', true),
  ('ESTATHÈ LIMONE/PESCA', NULL, 2.00, 'Drink', 'Bibite', true),
  ('FUZE TEA LIMONE/PESCA', NULL, 3.00, 'Drink', 'Bibite', true),
  ('CRODINO', NULL, 3.00, 'Drink', 'Bibite', true),

  -- Cucina — Fuori menù
  ('FIKATA', 'Pinsa, prosciutto crudo, fichi, stracchino, miele', 12.00, 'Cucina', 'Fuori menù', true),
  ('KIMCHI BURGER', 'Focaccia mediterranea, Hambuger vegano al Kimchi, BlackSauce (Salsa vegana homemade), insalata, Cipolla', 10.00, 'Cucina', 'Fuori menù', true),
  ('ROAST BEEF', 'Roast Beef, Ruola, Grana, Pane su richiesta (+1€)', 15.00, 'Cucina', 'Fuori menù', true),
  ('SALMON TOAST', 'Fetta di Pane Integrale ai cereali, Salmone Affumicato, Philadelpfia lime e cipolline, Rucola, Crema D''arancia, Semi Misti', 12.00, 'Cucina', 'Fuori menù', true),
  ('WRAP BLACK', 'Cotoletta, Cipolla, Pomodoro, Icerberg, Maio Vegan', 10.00, 'Cucina', 'Fuori menù', true),
  ('AVOCADO TOAST', 'Fetta di Pane Integrale ai cereali, Uovo All''occhio di bue, Avocado, Pomodorini Confit, Lime, Semi misti', 10.00, 'Cucina', 'Fuori menù', true),
  ('PICANHA', 'Piatto, Carpaccio di Pican''a affumicata al miele, Rucola, Pomodorini Confit, Pane su richiesta (+1€)', 12.00, 'Cucina', 'Fuori menù', true),
  ('WRAP', 'Straccetti di Pollo, Fagioli Neri, Avocado, Pomodori', 8.00, 'Cucina', 'Fuori menù', true),

  -- Cucina — Hamburger
  ('SMASH BURGER', 'Pane Bun Burger, Doppia Carne Di Bovino 100g+100g, Bacon, Cheddar, Salse a scelta', 10.00, 'Cucina', 'Hamburger', true),
  ('A-POLLO 13', 'Pane Burger di semola, Cotoletta di pollo*, cavolo rosso marinato, insalata iceberg, Maionese, salsa Teriyaki, lime', 10.00, 'Cucina', 'Hamburger', true),
  ('CHEESEBURGER', 'Pane Burger di semola, Carne di Bovino 100g, cheddar, insalata, pomodoro, salse a scelta', 8.00, 'Cucina', 'Hamburger', true),
  ('POLLON', 'Pane Burger di semola, Cotoletta di pollo*, insalata, pomodoro, cipolla, ketchup, maionese', 8.00, 'Cucina', 'Hamburger', true),
  ('HEIDI', 'Pane Malfatto, Carne di Bovino 150g, scamorza affumicata, speck croccante, rucola, salsa tartufata', 10.00, 'Cucina', 'Hamburger', true),
  ('GUNDAM', 'Pane Malfatto, Carne di Bovino 150g, bacon, scamorza affumicata, insalata, pomodoro, cipolla, salsa BBQ', 10.00, 'Cucina', 'Hamburger', true),
  ('FANTAMAN', 'PaneBurger di semola, Doppia Carne di Bovino 100g + 100g, bacon, insalata, pomodoro, cipolla, ketchup, maionese', 12.00, 'Cucina', 'Hamburger', true),
  ('PEPPO', 'Pane malfatto, Carne di Bovino 150g, scamorza affumicata, rucola, salsa ai peperoni affumicati', 10.00, 'Cucina', 'Hamburger', true),

  -- Cucina — Piade e panini
  ('ROMAGNOLA', 'Piada*, prosciutto crudo, stracchino, rucola', 8.00, 'Cucina', 'Piade e panini', true),
  ('SWITCH', 'Pane Multicereali*, prosciutto cotto, funghi porcini con crema, maionese', 7.00, 'Cucina', 'Piade e panini', true),
  ('GRIGLIATO', 'Ciabatta*, verdure grigliate: zucchine, melanzane, cipolle, peperoni*', 10.00, 'Cucina', 'Piade e panini', true),
  ('REATTORE', 'Pane Multicereali*, prosciutto crudo, rucola, scaglie di parmigiano, aceto balsamico', 7.00, 'Cucina', 'Piade e panini', true),
  ('T.S.O.', 'Pane Multicereali*, speck, fontina, insalata, funghi porcini con crema', 7.00, 'Cucina', 'Piade e panini', true),
  ('PLAFONIERA', 'Ciabatta*, speck, scamorza affumicata, crema di carciofi', 8.00, 'Cucina', 'Piade e panini', true),
  ('ANODO', 'Piada*, pancetta steccata, salsiccia luganega*, maionese', 9.00, 'Cucina', 'Piade e panini', true),
  ('BISUNTO', 'Ciabatta*, salsiccia luganega* o cotoletta di pollo*, cipolla, peperoni grigliati*', 9.00, 'Cucina', 'Piade e panini', true),
  ('CLUB SANDWICH', 'Sanwich Bread* a tre strati, prosciutto cotto, bacon, pomodoro, insalata, maionese, tabasco', 12.00, 'Cucina', 'Piade e panini', true),
  ('HOTDOG', 'Salse a scelta', 6.00, 'Cucina', 'Piade e panini', true),
  ('HOTDOG HDL', 'Würstel avvolto nel bacon, salse a scelta', 7.00, 'Cucina', 'Piade e panini', true),
  ('FOCACCIA ROMANA', 'Base margherita, + 1,00 € ad aggiunta di ingrediente/+2,00 € Prosciutto Crudo o Salsiccia', 8.00, 'Cucina', 'Piade e panini', true),

  -- Cucina — Insalate
  ('CAESAR SALAD', 'Insalata iceberg, straccetti di pollo, bacon, crostini di pane, scaglie di parmigiano, dressing senape e miele, Pane su richiesta (+1€)', 12.00, 'Cucina', 'Insalate', true),
  ('INSALAZZA', 'Insalata mista con verdure fresche e tonno, Pane su richiesta (+1€)', 12.00, 'Cucina', 'Insalate', true),

  -- Cucina — Vegan
  ('VEGGY BEANS BURGER', 'Pane malfatto*, Hamburger* di barbabietola rossa e fagioli rossi, cavolo rosso, Cipolla Croccante, insalata iceberg, mayonese vegana', 10.00, 'Cucina', 'Vegan', true),
  ('VEGGY GREASY', 'Ciabatta, Salsiccia vegana*, Peperoni, Cipolla', 10.00, 'Cucina', 'Vegan', true),
  ('VEGGY DOG', 'Pane Hot Dog, Salsiccia vegana*, cavolo viola marinato, vegan mayo con sriracha', 10.00, 'Cucina', 'Vegan', true),

  -- Cucina — Fritti
  ('MISTO DI TERRA', '3 porcini, 3 mozzarelline al tartufo, 4 frittelline patate pancetta e rosmarino, 4 pomodorini, maionese al fondo bruno', 8.00, 'Cucina', 'Fritti', true),
  ('KAPRESE FRITTA', 'Mozzarelline e Pomodori impanati fritti', 6.00, 'Cucina', 'Fritti', true),
  ('PATATE FRITTE*', NULL, 5.00, 'Cucina', 'Fritti', true),
  ('CRISPERS*', 'Patate fritte* con buccia', 5.00, 'Cucina', 'Fritti', true),
  ('OLIVE ALL''ASCOLANA*', NULL, 6.00, 'Cucina', 'Fritti', true),
  ('MOZZARELLINE AL TARTUFO*', NULL, 6.00, 'Cucina', 'Fritti', true),
  ('MOZZARELLINE*', NULL, 6.00, 'Cucina', 'Fritti', true),
  ('ANELLI DI CIPOLLA*', NULL, 6.00, 'Cucina', 'Fritti', true),
  ('JALABITE*', 'Jalapeno* piccanti con formaggio', 6.00, 'Cucina', 'Fritti', true),
  ('NUGGETS DI POLLO*', NULL, 6.00, 'Cucina', 'Fritti', true),
  ('MISTO FRITTO*', 'Patate fritte*, 3 mozzarelline*, 3 olive* e 3 anelli di cipolla*', 7.00, 'Cucina', 'Fritti', true),
  ('PATASPACCA*', 'Patate fritte*, wurstel, salsiccia luganega*', 7.00, 'Cucina', 'Fritti', true),
  ('PEPITE DI PULLED PORK*', 'Con salsa BBQ', 6.00, 'Cucina', 'Fritti', true),

  -- Cucina — Dolci
  ('PIADINA NUTELLA', NULL, 6.00, 'Cucina', 'Dolci classici', true),
  ('PANNA KOTTA', 'Servita a scelta con Composta di Albicocche/Duroni/Caramello salato', 6.00, 'Cucina', 'Dolci homemade', true),
  ('COOKIE GELATO', 'Biscotto con gocce di cioccolato e gelato al fiordilatte', 6.00, 'Cucina', 'Dolci homemade', true),
  ('CHEESECAKE', 'Caramello / Nutella / Composta di Fragole / Albiccoche / Duroni', 6.00, 'Cucina', 'Dolci homemade', true),

  -- Cucina — Salse
  ('MAIONESE', NULL, NULL, 'Cucina', 'Salse', true),
  ('KETCHUP', NULL, NULL, 'Cucina', 'Salse', true),
  ('SENAPE', NULL, NULL, 'Cucina', 'Salse', true),
  ('SALSA BBQ', NULL, NULL, 'Cucina', 'Salse', true),
  ('SALSA TARTUFATA', NULL, NULL, 'Cucina', 'Salse', true),
  ('SALSA AI PEPERONI AFFUMICATI', NULL, NULL, 'Cucina', 'Salse', true),
  ('BLACKSAUCE (VEGAN)', 'Salsa vegana homemade della casa', NULL, 'Cucina', 'Salse', true),
  ('SIRACHA', NULL, NULL, 'Cucina', 'Salse', true);
  ('SPICY MAYO', NULL, NULL, 'Cucina', 'Salse', true);
  ('MAYO VEGAN', NULL, NULL, 'Cucina', 'Salse', true);


