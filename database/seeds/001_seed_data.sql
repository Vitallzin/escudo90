-- ============================================================
-- ESCUDO NOVENTA — Dados iniciais (Seed)
-- Compatível com PostgreSQL 15+ / Supabase
-- Versão: 001_seed_data
-- ============================================================
-- ATENÇÃO: Execute 001_initial_schema.sql ANTES deste arquivo.
-- Todos os INSERTs usam ON CONFLICT DO NOTHING para ser
-- idempotente — pode ser executado múltiplas vezes com segurança.
-- ============================================================

-- ============================================================
-- 1. CATEGORIES
-- ============================================================
INSERT INTO categories (id, name, slug, description, active) VALUES
  ('cat_brasileirao', 'Brasileirão',      'brasileirao',      'Clubes nacionais, clássicos e lançamentos.',            true),
  ('cat_premier',     'Premier League',   'premier-league',   'Camisas oficiais e especiais do futebol inglês.',       true),
  ('cat_laliga',      'La Liga',          'la-liga',          'Gigantes espanhóis com acabamento premium.',            true),
  ('cat_champions',   'Champions League', 'champions-league', 'Edições europeias para noites históricas.',             true),
  ('cat_selecoes',    'Seleções',         'selecoes',         'Brasil, Argentina, Itália, França e outras seleções.', true),
  ('cat_retro',       'Retrô',            'retro',            'Camisas clássicas para colecionadores.',                true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. USERS
-- ATENÇÃO: Senhas em texto puro apenas para demonstração.
-- Em produção, substitua por hashes bcrypt gerados pelo backend.
-- ============================================================
INSERT INTO users (id, name, email, password, role, phone) VALUES
  (
    'usr_admin',
    'Administrador Escudo Noventa',
    'admin@escudonoventa.com',
    'admin123',   -- substituir por hash bcrypt em produção
    'admin',
    '11900000000'
  ),
  (
    'usr_customer',
    'Marcos Oliveira',
    'cliente@escudonoventa.com',
    'cliente123', -- substituir por hash bcrypt em produção
    'customer',
    '21988887777'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. USER_ADDRESSES
-- ============================================================
INSERT INTO user_addresses (id, user_id, label, zip_code, street, number, district, city, state) VALUES
  (
    'addr_admin',
    'usr_admin',
    'Escritório',
    '01001-000',
    'Praça da Sé',
    '100',
    'Sé',
    'São Paulo',
    'SP'
  ),
  (
    'addr_customer',
    'usr_customer',
    'Casa',
    '22041-001',
    'Avenida Atlântica',
    '500',
    'Copacabana',
    'Rio de Janeiro',
    'RJ'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. PRODUCTS
-- ============================================================
INSERT INTO products (
  id, name, club, season, category_id, league, country,
  description, price, old_price, rating, reviews_count, stock, badge, active
) VALUES
  (
    'brasil-1970-retro',
    'Brasil Retrô 1970',
    'Seleção Brasileira',
    'Retrô 1970',
    'cat_selecoes',
    'Copa do Mundo',
    'Brasil',
    'Camisa amarela clássica com gola retrô, tecido premium e escudo bordado.',
    289.90, 349.90, 4.90, 328, 18, 'Coleção ouro', true
  ),
  (
    'chelsea-home-2026',
    'Chelsea Home 2026',
    'Chelsea',
    '2026 Home',
    'cat_premier',
    'Premier League',
    'Inglaterra',
    'Modelo azul intenso com respirabilidade alta e detalhes dourados discretos.',
    349.90, NULL, 4.80, 214, 27, 'Lançamento', true
  ),
  (
    'boca-juniors-home',
    'Boca Juniors Home',
    'Boca Juniors',
    '2026 Home',
    'cat_champions',
    'Libertadores',
    'Argentina',
    'Azul e ouro em uma das camisas mais reconhecidas do futebol sul-americano.',
    319.90, 379.90, 4.70, 176, 11, 'Mais vendida', true
  ),
  (
    'real-madrid-away',
    'Real Madrid Away',
    'Real Madrid',
    '2026 Away',
    'cat_laliga',
    'La Liga',
    'Espanha',
    'Camisa clara com visual limpo, escudo em relevo e composição premium.',
    359.90, NULL, 4.90, 251, 22, 'Premium', true
  ),
  (
    'milan-champions',
    'Milan Champions Night',
    'AC Milan',
    '2026 Especial',
    'cat_champions',
    'Champions League',
    'Itália',
    'Edição especial para noites europeias, com listras marcantes e selo de colecionador.',
    399.90, 449.90, 4.90, 143, 8, 'Limitada', true
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5. PRODUCT_IMAGES
-- ============================================================
INSERT INTO product_images (product_id, url, position) VALUES
  ('brasil-1970-retro', '/products/brasil-1970-retro.png', 0),
  ('chelsea-home-2026', '/products/chelsea-home-2026.png', 0),
  ('boca-juniors-home', '/products/boca-juniors-home.png', 0),
  ('real-madrid-away',  '/products/real-madrid-away.png',  0),
  ('milan-champions',   '/products/milan-champions.png',   0);

-- ============================================================
-- 6. PRODUCT_SIZES
-- ============================================================
INSERT INTO product_sizes (product_id, size) VALUES
  -- Brasil Retrô 1970
  ('brasil-1970-retro', 'P'),
  ('brasil-1970-retro', 'M'),
  ('brasil-1970-retro', 'G'),
  ('brasil-1970-retro', 'GG'),
  ('brasil-1970-retro', 'XG'),
  -- Chelsea Home 2026
  ('chelsea-home-2026', 'P'),
  ('chelsea-home-2026', 'M'),
  ('chelsea-home-2026', 'G'),
  ('chelsea-home-2026', 'GG'),
  -- Boca Juniors Home
  ('boca-juniors-home', 'M'),
  ('boca-juniors-home', 'G'),
  ('boca-juniors-home', 'GG'),
  ('boca-juniors-home', 'XG'),
  -- Real Madrid Away
  ('real-madrid-away', 'P'),
  ('real-madrid-away', 'M'),
  ('real-madrid-away', 'G'),
  ('real-madrid-away', 'GG'),
  ('real-madrid-away', 'XG'),
  -- Milan Champions Night
  ('milan-champions', 'M'),
  ('milan-champions', 'G'),
  ('milan-champions', 'GG')
ON CONFLICT (product_id, size) DO NOTHING;

-- ============================================================
-- 7. PRODUCT_COLORS (valores hex)
-- ============================================================
INSERT INTO product_colors (product_id, color) VALUES
  ('brasil-1970-retro', '#FFD700'),
  ('brasil-1970-retro', '#0047A1'),
  ('chelsea-home-2026', '#0047A1'),
  ('chelsea-home-2026', '#FFD700'),
  ('boca-juniors-home', '#001A3D'),
  ('boca-juniors-home', '#FFD700'),
  ('real-madrid-away',  '#F5F5F5'),
  ('real-madrid-away',  '#0047A1'),
  ('milan-champions',   '#333333'),
  ('milan-champions',   '#C62828')
ON CONFLICT (product_id, color) DO NOTHING;

-- ============================================================
-- 8. USER_FAVORITES
-- ============================================================
INSERT INTO user_favorites (user_id, product_id) VALUES
  ('usr_admin',    'brasil-1970-retro'),
  ('usr_admin',    'milan-champions'),
  ('usr_customer', 'boca-juniors-home')
ON CONFLICT (user_id, product_id) DO NOTHING;

-- ============================================================
-- 9. COUPONS
-- ============================================================
INSERT INTO coupons (id, code, description, percent, active, expires_at) VALUES
  (
    'cpn_torcida10',
    'TORCIDA10',
    '10% de desconto em camisas selecionadas.',
    10,
    true,
    '2026-12-31T23:59:59Z'
  ),
  (
    'cpn_retro15',
    'RETRO15',
    '15% de desconto em camisas retrô.',
    15,
    true,
    '2026-12-31T23:59:59Z'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 10. REVIEWS
-- ============================================================
INSERT INTO reviews (id, product_id, user_id, rating, comment) VALUES
  (
    'rev_1',
    'brasil-1970-retro',
    'usr_customer',
    5,
    'Qualidade excelente, tecido confortável e acabamento premium.'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- orders e payments estão vazios no seed inicial
-- (gerados dinamicamente pelas rotas POST /orders e POST /payments/intent)
-- ============================================================

-- ============================================================
-- VERIFICAÇÃO: Execute após o seed para confirmar os dados
-- ============================================================
-- SELECT 'categories'   AS tabela, COUNT(*) AS registros FROM categories
-- UNION ALL
-- SELECT 'users',         COUNT(*) FROM users
-- UNION ALL
-- SELECT 'user_addresses',COUNT(*) FROM user_addresses
-- UNION ALL
-- SELECT 'products',      COUNT(*) FROM products
-- UNION ALL
-- SELECT 'product_images',COUNT(*) FROM product_images
-- UNION ALL
-- SELECT 'product_sizes', COUNT(*) FROM product_sizes
-- UNION ALL
-- SELECT 'product_colors',COUNT(*) FROM product_colors
-- UNION ALL
-- SELECT 'user_favorites',COUNT(*) FROM user_favorites
-- UNION ALL
-- SELECT 'coupons',       COUNT(*) FROM coupons
-- UNION ALL
-- SELECT 'reviews',       COUNT(*) FROM reviews
-- ORDER BY tabela;
