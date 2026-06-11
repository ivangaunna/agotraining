-- ═══════════════════════════════════════════════════════
-- AGOTRAINING — SCHEMA COMPLETO
-- Ejecutar en Supabase SQL Editor en orden
-- ═══════════════════════════════════════════════════════


-- ─────────────────────────────────────────
-- PASO 1: TABLAS
-- ─────────────────────────────────────────

CREATE TABLE profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'user'
              CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE plans (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  benefits      TEXT[] NOT NULL DEFAULT '{}',
  price         NUMERIC(10, 2) NOT NULL,
  currency      TEXT NOT NULL DEFAULT 'ARS',
  goal          TEXT NOT NULL
                CHECK (goal IN ('fat_loss', 'hypertrophy', 'body_recomposition')),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE plan_files (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id       UUID REFERENCES plans(id) ON DELETE CASCADE NOT NULL,
  storage_path  TEXT NOT NULL,
  file_name     TEXT NOT NULL,
  file_size     BIGINT,
  version       INT NOT NULL DEFAULT 1,
  is_current    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE purchases (
  id                          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                     UUID REFERENCES auth.users(id) ON DELETE RESTRICT NOT NULL,
  plan_id                     UUID REFERENCES plans(id) ON DELETE RESTRICT NOT NULL,
  amount                      NUMERIC(10, 2) NOT NULL,
  currency                    TEXT NOT NULL DEFAULT 'ARS',
  status                      TEXT NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'refunded')),
  mercadopago_payment_id      TEXT UNIQUE,
  mercadopago_preference_id   TEXT,
  email_sent                  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payment_logs (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_id   UUID REFERENCES purchases(id) ON DELETE CASCADE,
  event_type    TEXT NOT NULL,
  mp_payment_id TEXT,
  payload       JSONB NOT NULL,
  ip_address    INET,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- PASO 2: ÍNDICES
-- ─────────────────────────────────────────

CREATE INDEX idx_plans_slug     ON plans(slug);
CREATE INDEX idx_plans_active   ON plans(is_active);

CREATE INDEX idx_plan_files_plan_id ON plan_files(plan_id);
CREATE INDEX idx_plan_files_current ON plan_files(plan_id, is_current);

CREATE INDEX idx_purchases_user_id    ON purchases(user_id);
CREATE INDEX idx_purchases_status     ON purchases(status);
CREATE INDEX idx_purchases_mp_payment ON purchases(mercadopago_payment_id);

CREATE INDEX idx_payment_logs_purchase_id ON payment_logs(purchase_id);
CREATE INDEX idx_payment_logs_mp_payment  ON payment_logs(mp_payment_id);


-- ─────────────────────────────────────────
-- PASO 3: TRIGGER (auto-crear perfil)
-- ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ─────────────────────────────────────────
-- PASO 4: ROW LEVEL SECURITY
-- ─────────────────────────────────────────

ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans       ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_files  ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases   ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles: usuario ve el suyo"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles: usuario edita el suyo"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- plans
CREATE POLICY "plans: lectura publica"
  ON plans FOR SELECT USING (is_active = TRUE);

CREATE POLICY "plans: admin todo"
  ON plans FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- plan_files
CREATE POLICY "plan_files: solo compradores aprobados"
  ON plan_files FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM purchases
      WHERE purchases.plan_id = plan_files.plan_id
        AND purchases.user_id = auth.uid()
        AND purchases.status = 'approved'
    )
  );

CREATE POLICY "plan_files: admin todo"
  ON plan_files FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- purchases
CREATE POLICY "purchases: usuario ve las suyas"
  ON purchases FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "purchases: admin todo"
  ON purchases FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- payment_logs
CREATE POLICY "payment_logs: admin todo"
  ON payment_logs FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ─────────────────────────────────────────
-- PASO 5: ASIGNAR ROL ADMIN
-- Ejecutar DESPUÉS de registrarte en la plataforma.
-- Reemplazá el email con el tuyo.
-- ─────────────────────────────────────────

-- UPDATE profiles
-- SET role = 'admin'
-- WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'TU-EMAIL@AQUI.COM'
-- );
