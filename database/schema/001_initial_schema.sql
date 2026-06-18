-- ============================================================
-- ESCUDO NOVENTA — Schema PostgreSQL completo
-- Compatível com Supabase (PostgreSQL 15+)
-- Versão: 001_initial_schema
-- ============================================================
-- Instruções de uso:
--   1. Acesse o Supabase Dashboard → SQL Editor → New Query
--   2. Cole este script inteiro e clique em "Run"
--   3. Em seguida, execute o arquivo 001_seed_data.sql
-- ============================================================

-- Habilitar extensão para funções de criptografia (disponível por padrão no Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- FUNÇÃO: atualiza updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 1. CATEGORIES
-- Categorias de produtos (Brasileirão, Premier League, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id          VARCHAR(50)  PRIMARY KEY,          -- ex: 'cat_brasileirao'
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  active      BOOLEAN      NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- 2. USERS
-- Usuários do sistema: clientes e administradores
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          VARCHAR(50)  PRIMARY KEY,          -- ex: 'usr_abc123'
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,             -- hash bcrypt
  role        VARCHAR(20)  NOT NULL DEFAULT 'customer'
                           CHECK (role IN ('customer', 'admin')),
  phone       VARCHAR(20),                       -- apenas dígitos
  document    VARCHAR(11)  UNIQUE,               -- CPF (11 dígitos)
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- 3. USER_ADDRESSES
-- Endereços de entrega dos usuários
-- Rota: POST /users/me/addresses
-- ============================================================
CREATE TABLE IF NOT EXISTS user_addresses (
  id          VARCHAR(50)  PRIMARY KEY,          -- ex: 'addr_abc123'
  user_id     VARCHAR(50)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label       VARCHAR(100) NOT NULL DEFAULT 'Endereço', -- ex: 'Casa', 'Escritório'
  zip_code    VARCHAR(10)  NOT NULL,             -- ex: '01001-000'
  street      VARCHAR(255) NOT NULL,
  number      VARCHAR(20)  NOT NULL,
  complement  VARCHAR(100),
  district    VARCHAR(100) NOT NULL,             -- bairro
  city        VARCHAR(100) NOT NULL,
  state       CHAR(2)      NOT NULL,             -- UF ex: 'SP'
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);

-- ============================================================
-- 4. PRODUCTS
-- Camisas esportivas à venda
-- Rotas: GET /products, GET /products/:id, POST/PATCH /admin/products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id              VARCHAR(100) PRIMARY KEY,       -- ex: 'brasil-1970-retro'
  name            VARCHAR(255) NOT NULL,
  club            VARCHAR(150) NOT NULL,          -- ex: 'Seleção Brasileira'
  season          VARCHAR(100) NOT NULL,          -- ex: 'Retrô 1970'
  category_id     VARCHAR(50)  NOT NULL REFERENCES categories(id),
  league          VARCHAR(150) NOT NULL,          -- ex: 'Copa do Mundo'
  country         VARCHAR(100) NOT NULL,          -- ex: 'Brasil'
  description     TEXT,
  price           NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  old_price       NUMERIC(10,2),                  -- preço original (quando em promoção)
  rating          NUMERIC(3,2)  NOT NULL DEFAULT 0
                                CHECK (rating >= 0 AND rating <= 5),
  reviews_count   INTEGER       NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
  stock           INTEGER       NOT NULL DEFAULT 0 CHECK (stock >= 0),
  badge           VARCHAR(100),                   -- ex: 'Lançamento', 'Limitada'
  active          BOOLEAN       NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active       ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_league       ON products(league);

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- 5. PRODUCT_IMAGES
-- URLs das imagens de cada produto (array no tipo TypeScript)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_images (
  id          SERIAL        PRIMARY KEY,
  product_id  VARCHAR(100)  NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT          NOT NULL,
  position    INTEGER       NOT NULL DEFAULT 0,   -- ordem de exibição
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- ============================================================
-- 6. PRODUCT_SIZES
-- Tamanhos disponíveis por produto (ex: P, M, G, GG, XG)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_sizes (
  id          SERIAL        PRIMARY KEY,
  product_id  VARCHAR(100)  NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size        VARCHAR(10)   NOT NULL,
  UNIQUE (product_id, size)
);

CREATE INDEX IF NOT EXISTS idx_product_sizes_product_id ON product_sizes(product_id);

-- ============================================================
-- 7. PRODUCT_COLORS
-- Cores disponíveis por produto (valores hex, ex: '#FFD700')
-- ============================================================
CREATE TABLE IF NOT EXISTS product_colors (
  id          SERIAL        PRIMARY KEY,
  product_id  VARCHAR(100)  NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color       VARCHAR(20)   NOT NULL,             -- hex ex: '#FFD700'
  UNIQUE (product_id, color)
);

CREATE INDEX IF NOT EXISTS idx_product_colors_product_id ON product_colors(product_id);

-- ============================================================
-- 8. USER_FAVORITES
-- Produtos favoritados por cada usuário (N:M)
-- Rotas: GET /favorites, POST /favorites/:productId, DELETE /favorites/:productId
-- ============================================================
CREATE TABLE IF NOT EXISTS user_favorites (
  user_id     VARCHAR(50)   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  VARCHAR(100)  NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);

-- ============================================================
-- 9. USER_CART_ITEMS
-- Carrinho persistente por usuario antes da compra
-- Rotas: GET /cart, POST /cart/items, DELETE /cart/items/:productId/:size, DELETE /cart
-- ============================================================
CREATE TABLE IF NOT EXISTS user_cart_items (
  user_id     VARCHAR(50)   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  VARCHAR(100)  NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size        VARCHAR(10)   NOT NULL,
  quantity    INTEGER       NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id, size)
);

CREATE INDEX IF NOT EXISTS idx_user_cart_items_user_id ON user_cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cart_items_product_id ON user_cart_items(product_id);

CREATE TRIGGER trg_user_cart_items_updated_at
  BEFORE UPDATE ON user_cart_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- 10. COUPONS
-- Cupons de desconto por percentual
-- Rotas: GET /coupons/validate, GET/POST /admin/coupons
-- ============================================================
CREATE TABLE IF NOT EXISTS coupons (
  id          VARCHAR(50)   PRIMARY KEY,          -- ex: 'cpn_torcida10'
  code        VARCHAR(50)   NOT NULL UNIQUE,       -- ex: 'TORCIDA10' (case-insensitive na busca)
  description TEXT,
  percent     NUMERIC(5,2)  NOT NULL CHECK (percent > 0 AND percent <= 80),
  active      BOOLEAN       NOT NULL DEFAULT true,
  expires_at  TIMESTAMPTZ   NOT NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- 11. ORDERS
-- Pedidos realizados pelos clientes
-- O endereço de entrega é desnormalizado para preservar histórico
-- Rotas: GET /orders, GET /orders/:id, POST /orders, PATCH /admin/orders/:id/status
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id                  VARCHAR(50)   PRIMARY KEY,   -- ex: 'ord_abc123'
  user_id             VARCHAR(50)   NOT NULL REFERENCES users(id),
  coupon_id           VARCHAR(50)   REFERENCES coupons(id),
  coupon_code         VARCHAR(50),                 -- código usado (para histórico)
  subtotal            NUMERIC(10,2) NOT NULL,
  discount            NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping            NUMERIC(10,2) NOT NULL DEFAULT 0,
  total               NUMERIC(10,2) NOT NULL,
  status              VARCHAR(30)   NOT NULL DEFAULT 'pending_payment'
                                    CHECK (status IN (
                                      'pending_payment',
                                      'paid',
                                      'separating',
                                      'shipped',
                                      'delivered',
                                      'cancelled'
                                    )),
  payment_method      VARCHAR(30)   NOT NULL DEFAULT 'credit_card'
                                    CHECK (payment_method IN (
                                      'credit_card',
                                      'pix',
                                      'mercado_pago'
                                    )),
  tracking_code       VARCHAR(50),                 -- código de rastreio (quando shipped)
  -- Endereço de entrega desnormalizado (snapshot no momento do pedido)
  shipping_label      VARCHAR(100),
  shipping_zip_code   VARCHAR(10)   NOT NULL,
  shipping_street     VARCHAR(255)  NOT NULL,
  shipping_number     VARCHAR(20)   NOT NULL,
  shipping_complement VARCHAR(100),
  shipping_district   VARCHAR(100)  NOT NULL,
  shipping_city       VARCHAR(100)  NOT NULL,
  shipping_state      CHAR(2)       NOT NULL,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status  ON orders(status);

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- 12. ORDER_ITEMS
-- Itens de cada pedido (snapshot do preço no momento da compra)
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id          SERIAL        PRIMARY KEY,
  order_id    VARCHAR(50)   NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  VARCHAR(100)  NOT NULL REFERENCES products(id),
  size        VARCHAR(10)   NOT NULL,
  quantity    INTEGER       NOT NULL CHECK (quantity > 0),
  unit_price  NUMERIC(10,2) NOT NULL,              -- preço unitário no momento da compra
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id   ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ============================================================
-- 13. PAYMENTS
-- Transações de pagamento vinculadas a pedidos
-- Rotas: POST /payments/intent, POST /payments/webhook
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id          VARCHAR(50)   PRIMARY KEY,           -- ex: 'pay_abc123'
  order_id    VARCHAR(50)   NOT NULL REFERENCES orders(id),
  method      VARCHAR(30)   NOT NULL
              CHECK (method IN ('credit_card', 'pix', 'mercado_pago')),
  status      VARCHAR(20)   NOT NULL DEFAULT 'created'
              CHECK (status IN ('created', 'approved', 'rejected', 'refunded')),
  amount      NUMERIC(10,2) NOT NULL,
  provider    VARCHAR(100),                        -- ex: 'Escudo Pay', 'Mercado Pago'
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);

CREATE TRIGGER trg_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- 14. REVIEWS
-- Avaliações de produtos por usuários autenticados
-- Rotas: GET /products/:productId/reviews, POST /products/:productId/reviews
-- Regra: 1 review por usuário por produto (UNIQUE constraint)
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id          VARCHAR(50)   PRIMARY KEY,           -- ex: 'rev_abc123'
  product_id  VARCHAR(100)  NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     VARCHAR(50)   NOT NULL REFERENCES users(id),
  rating      SMALLINT      NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
  UNIQUE (product_id, user_id)                     -- 1 avaliação por usuário por produto
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id    ON reviews(user_id);

-- ============================================================
-- FIM DO SCHEMA
-- Execute 001_seed_data.sql para inserir os dados iniciais
-- ============================================================
