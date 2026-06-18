-- ============================================================
-- ESCUDO NOVENTA - Migracao 002: carrinho persistente
-- Execute este arquivo em bancos que ja tinham o schema inicial.
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

DROP TRIGGER IF EXISTS trg_user_cart_items_updated_at ON user_cart_items;

CREATE TRIGGER trg_user_cart_items_updated_at
  BEFORE UPDATE ON user_cart_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
