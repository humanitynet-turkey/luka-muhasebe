-- ================================================
-- LUKA MUHASEBE - SUPABASE SCHEMA
-- Multi-Tenant SaaS Architecture
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. COMPANIES (Şirketler) - Multi-tenant için
-- ================================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  tax_number VARCHAR(20) UNIQUE,
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  logo_url TEXT,
  subscription_plan VARCHAR(50) DEFAULT 'free', -- free, pro, enterprise
  subscription_status VARCHAR(50) DEFAULT 'active', -- active, suspended, cancelled
  subscription_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 2. USERS (Kullanıcılar) - Auth ile bağlantılı
-- ================================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user', -- admin, user, viewer
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 3. CARI (Cari Hesaplar)
-- ================================================
CREATE TABLE cari_list (
  id BIGSERIAL PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id),
  unvan VARCHAR(255) NOT NULL,
  tip VARCHAR(50) NOT NULL, -- musteri, tedarikci
  vergi_no VARCHAR(20),
  telefon VARCHAR(20),
  email VARCHAR(255),
  adres TEXT,
  yetkili VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 4. STOK (Stok Yönetimi)
-- ================================================
CREATE TABLE stok_list (
  id BIGSERIAL PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id),
  kod VARCHAR(100) UNIQUE NOT NULL,
  ad VARCHAR(255) NOT NULL,
  kategori VARCHAR(100),
  birim VARCHAR(50) DEFAULT 'Adet',
  stok_miktari DECIMAL(15, 2) DEFAULT 0,
  birim_fiyat DECIMAL(15, 2) DEFAULT 0,
  kdv_orani INTEGER DEFAULT 20,
  aciklama TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 5. FATURA (Faturalar)
-- ================================================
CREATE TABLE fatura_list (
  id BIGSERIAL PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id),
  fatura_no VARCHAR(100) UNIQUE NOT NULL,
  tip VARCHAR(50) NOT NULL, -- alis, satis
  cari_id BIGINT REFERENCES cari_list(id) ON DELETE SET NULL,
  cari_unvan VARCHAR(255),
  tarih DATE NOT NULL,
  vade_tarihi DATE,
  toplam_tutar DECIMAL(15, 2) DEFAULT 0,
  kdv_tutari DECIMAL(15, 2) DEFAULT 0,
  genel_toplam DECIMAL(15, 2) DEFAULT 0,
  durum VARCHAR(50) DEFAULT 'beklemede', -- beklemede, odendi, iptal
  aciklama TEXT,
  kalemler JSONB, -- Fatura kalemleri JSON formatında
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 6. KASA (Kasa/Banka Hareketleri)
-- ================================================
CREATE TABLE kasa_list (
  id BIGSERIAL PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id),
  tarih DATE NOT NULL,
  tip VARCHAR(50) NOT NULL, -- giris, cikis
  kategori VARCHAR(100), -- nakit, banka, kredi_karti
  miktar DECIMAL(15, 2) NOT NULL,
  aciklama TEXT,
  fatura_id BIGINT REFERENCES fatura_list(id) ON DELETE SET NULL,
  cari_id BIGINT REFERENCES cari_list(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- INDEXES - Performans için
-- ================================================
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_cari_company_id ON cari_list(company_id);
CREATE INDEX idx_cari_tip ON cari_list(tip);
CREATE INDEX idx_stok_company_id ON stok_list(company_id);
CREATE INDEX idx_stok_kod ON stok_list(kod);
CREATE INDEX idx_fatura_company_id ON fatura_list(company_id);
CREATE INDEX idx_fatura_tip ON fatura_list(tip);
CREATE INDEX idx_fatura_tarih ON fatura_list(tarih);
CREATE INDEX idx_kasa_company_id ON kasa_list(company_id);
CREATE INDEX idx_kasa_tarih ON kasa_list(tarih);

-- ================================================
-- ROW LEVEL SECURITY (RLS) Politikaları
-- ================================================

-- Companies tablosu için RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own company"
  ON companies FOR SELECT
  USING (id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Company admins can update their company"
  ON companies FOR UPDATE
  USING (id IN (
    SELECT company_id FROM users
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Users tablosu için RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view company members"
  ON users FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- Cari tablosu için RLS
ALTER TABLE cari_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's cari"
  ON cari_list FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert cari for their company"
  ON cari_list FOR INSERT
  WITH CHECK (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their company's cari"
  ON cari_list FOR UPDATE
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can delete their company's cari"
  ON cari_list FOR DELETE
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- Stok tablosu için RLS
ALTER TABLE stok_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's stok"
  ON stok_list FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert stok for their company"
  ON stok_list FOR INSERT
  WITH CHECK (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their company's stok"
  ON stok_list FOR UPDATE
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can delete their company's stok"
  ON stok_list FOR DELETE
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- Fatura tablosu için RLS
ALTER TABLE fatura_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's fatura"
  ON fatura_list FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert fatura for their company"
  ON fatura_list FOR INSERT
  WITH CHECK (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their company's fatura"
  ON fatura_list FOR UPDATE
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can delete their company's fatura"
  ON fatura_list FOR DELETE
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- Kasa tablosu için RLS
ALTER TABLE kasa_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's kasa"
  ON kasa_list FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert kasa for their company"
  ON kasa_list FOR INSERT
  WITH CHECK (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their company's kasa"
  ON kasa_list FOR UPDATE
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can delete their company's kasa"
  ON kasa_list FOR DELETE
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- ================================================
-- TRIGGERS - Otomatik updated_at güncellemesi
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cari_updated_at BEFORE UPDATE ON cari_list
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stok_updated_at BEFORE UPDATE ON stok_list
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fatura_updated_at BEFORE UPDATE ON fatura_list
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kasa_updated_at BEFORE UPDATE ON kasa_list
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- SAMPLE DATA (İsteğe bağlı - Test için)
-- ================================================
-- Bir test şirketi oluştur
-- INSERT INTO companies (name, tax_number, phone, email)
-- VALUES ('Test Şirketi A.Ş.', '1234567890', '0532 123 45 67', 'info@test.com');
