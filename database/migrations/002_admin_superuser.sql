-- ============================================================
-- ESCUDO NOVENTA - Recursos do Superusuario Admin
-- Compatível com Supabase (PostgreSQL 15+)
-- Versao: 002_admin_superuser
-- ============================================================
-- Instrucoes:
--   1. Execute 001_initial_schema.sql primeiro.
--   2. Execute este arquivo no SQL Editor do Supabase.
--   3. Todas as estruturas usam IF NOT EXISTS quando possivel.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Campos extras para atender cadastro completo de camisas.
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS sku VARCHAR(80),
  ADD COLUMN IF NOT EXISTS product_type VARCHAR(40),
  ADD COLUMN IF NOT EXISTS gender VARCHAR(30),
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku_unique
  ON products(sku)
  WHERE sku IS NOT NULL;

-- ============================================================
-- CATALOGOS
-- ============================================================
CREATE TABLE IF NOT EXISTS catalogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_catalogs_updated_at'
      AND tgrelid = 'catalogs'::regclass
  ) THEN
    CREATE TRIGGER trg_catalogs_updated_at
      BEFORE UPDATE ON catalogs
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS catalog_products (
  catalog_id UUID NOT NULL REFERENCES catalogs(id) ON DELETE CASCADE,
  product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (catalog_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_catalog_products_product_id ON catalog_products(product_id);

-- ============================================================
-- ESTOQUE E HISTORICO DE PRODUTO
-- ============================================================
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id VARCHAR(100) NOT NULL REFERENCES products(id),
  size VARCHAR(10),
  movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('entry', 'exit', 'adjustment', 'import')),
  quantity INTEGER NOT NULL,
  previous_stock INTEGER,
  new_stock INTEGER,
  reason TEXT,
  actor_user_id VARCHAR(50) REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at);

CREATE TABLE IF NOT EXISTS product_change_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id VARCHAR(100) NOT NULL REFERENCES products(id),
  actor_user_id VARCHAR(50) REFERENCES users(id),
  action VARCHAR(80) NOT NULL,
  field_name VARCHAR(80),
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_change_logs_product_id ON product_change_logs(product_id);

-- ============================================================
-- PRECOS, PROMOCOES E CUPONS AVANCADOS
-- ============================================================
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(140) NOT NULL,
  promotion_type VARCHAR(30) NOT NULL CHECK (
    promotion_type IN ('percent', 'fixed_amount', 'quantity', 'period', 'automatic')
  ),
  discount_percent NUMERIC(5,2),
  discount_amount NUMERIC(10,2),
  buy_quantity INTEGER,
  pay_quantity INTEGER,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_promotions_updated_at'
      AND tgrelid = 'promotions'::regclass
  ) THEN
    CREATE TRIGGER trg_promotions_updated_at
      BEFORE UPDATE ON promotions
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS promotion_products (
  promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (promotion_id, product_id)
);

CREATE TABLE IF NOT EXISTS price_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(140) NOT NULL,
  category_id VARCHAR(50) REFERENCES categories(id),
  size VARCHAR(10),
  minimum_price NUMERIC(10,2),
  suggested_price NUMERIC(10,2),
  monthly_inflation_percent NUMERIC(5,2),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_price_rules_updated_at'
      AND tgrelid = 'price_rules'::regclass
  ) THEN
    CREATE TRIGGER trg_price_rules_updated_at
      BEFORE UPDATE ON price_rules
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

ALTER TABLE coupons
  ADD COLUMN IF NOT EXISTS max_uses_per_user INTEGER,
  ADD COLUMN IF NOT EXISTS max_total_uses INTEGER,
  ADD COLUMN IF NOT EXISTS used_count INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS coupon_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id VARCHAR(50) NOT NULL REFERENCES coupons(id),
  user_id VARCHAR(50) REFERENCES users(id),
  order_id VARCHAR(50) REFERENCES orders(id),
  discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon_id ON coupon_usages(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user_id ON coupon_usages(user_id);

-- ============================================================
-- LOGS OBRIGATORIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id VARCHAR(50) REFERENCES users(id),
  actor_email VARCHAR(255),
  action VARCHAR(120) NOT NULL,
  entity_type VARCHAR(80),
  entity_id VARCHAR(120),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_action_logs_created_at ON admin_action_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_action_logs_actor_user_id ON admin_action_logs(actor_user_id);

CREATE TABLE IF NOT EXISTS system_error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(120) NOT NULL,
  message TEXT NOT NULL,
  stack_trace TEXT,
  severity VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_system_error_logs_created_at ON system_error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_error_logs_severity ON system_error_logs(severity);

CREATE TABLE IF NOT EXISTS access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(50) REFERENCES users(id),
  email VARCHAR(255),
  route TEXT,
  method VARCHAR(12),
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_access_logs_created_at ON access_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON access_logs(user_id);

-- ============================================================
-- CONFIGURACOES, CONTEUDO, SEGURANCA E BACKUPS
-- ============================================================
CREATE TABLE IF NOT EXISTS site_content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(120) NOT NULL UNIQUE,
  title VARCHAR(180),
  body TEXT,
  image_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  updated_by VARCHAR(50) REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_site_content_blocks_updated_at'
      AND tgrelid = 'site_content_blocks'::regclass
  ) THEN
    CREATE TRIGGER trg_site_content_blocks_updated_at
      BEFORE UPDATE ON site_content_blocks
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS system_settings (
  key VARCHAR(120) PRIMARY KEY,
  value JSONB NOT NULL,
  group_name VARCHAR(80) NOT NULL,
  is_secret BOOLEAN NOT NULL DEFAULT false,
  updated_by VARCHAR(50) REFERENCES users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_security_settings (
  id BOOLEAN PRIMARY KEY DEFAULT true CHECK (id = true),
  exclusive_admin_user_id VARCHAR(50) REFERENCES users(id),
  require_2fa BOOLEAN NOT NULL DEFAULT false,
  max_failed_login_attempts INTEGER NOT NULL DEFAULT 5,
  lockout_minutes INTEGER NOT NULL DEFAULT 30,
  session_timeout_minutes INTEGER NOT NULL DEFAULT 30,
  strong_password_min_length INTEGER NOT NULL DEFAULT 12,
  require_letters BOOLEAN NOT NULL DEFAULT true,
  require_numbers BOOLEAN NOT NULL DEFAULT true,
  require_symbols BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO admin_security_settings (id)
VALUES (true)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS backup_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_type VARCHAR(20) NOT NULL CHECK (backup_type IN ('automatic', 'manual', 'restore')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'success', 'failed')),
  file_url TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  actor_user_id VARCHAR(50) REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS maintenance_mode (
  id BOOLEAN PRIMARY KEY DEFAULT true CHECK (id = true),
  enabled BOOLEAN NOT NULL DEFAULT false,
  message TEXT,
  updated_by VARCHAR(50) REFERENCES users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO maintenance_mode (id, enabled, message)
VALUES (true, false, 'Voltamos em instantes.')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- NOTIFICACOES, AVALIACOES, FIDELIDADE E IDIOMAS
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(160) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(40) NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS loyalty_accounts (
  user_id VARCHAR(50) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 0,
  level_name VARCHAR(80) NOT NULL DEFAULT 'Torcedor',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale VARCHAR(10) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id VARCHAR(120) NOT NULL,
  field_name VARCHAR(80) NOT NULL,
  translated_value TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (locale, entity_type, entity_id, field_name)
);

-- ============================================================
-- VIEWS DE APOIO PARA RELATORIOS
-- ============================================================
CREATE OR REPLACE VIEW admin_dashboard_summary
WITH (security_invoker = true) AS
SELECT
  (SELECT COUNT(*) FROM orders) AS total_orders,
  (SELECT COALESCE(SUM(total), 0) FROM orders WHERE status <> 'cancelled') AS gross_revenue,
  (SELECT COUNT(*) FROM products WHERE stock < 10 AND active = true) AS critical_stock_products,
  (SELECT COUNT(*) FROM users WHERE role = 'customer') AS total_customers,
  (SELECT COUNT(*) FROM coupons WHERE active = true) AS active_coupons;

CREATE OR REPLACE VIEW admin_logs_export
WITH (security_invoker = true) AS
SELECT
  id::text,
  'admin_action' AS log_type,
  actor_email AS actor,
  action,
  ip_address::text,
  created_at
FROM admin_action_logs
UNION ALL
SELECT
  id::text,
  'system_error' AS log_type,
  source AS actor,
  message AS action,
  NULL AS ip_address,
  created_at
FROM system_error_logs
UNION ALL
SELECT
  id::text,
  'access' AS log_type,
  email AS actor,
  COALESCE(method, '') || ' ' || COALESCE(route, '') AS action,
  ip_address::text,
  created_at
FROM access_logs;

-- ============================================================
-- FIM DA MIGRACAO
-- ============================================================
