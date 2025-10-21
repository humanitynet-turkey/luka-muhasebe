# 🚀 LUKA MUHASEBE - SaaS YOL HARİTASI

> **Vizyon:** Türkiye'nin en modern, kullanıcı dostu ve uygun fiyatlı ön muhasebe SaaS platformu olmak.

**Son Güncelleme:** 22 Ekim 2025
**Versiyon:** v1.0 - MVP Hazırlık Aşaması

---

## 📋 İÇİNDEKİLER

1. [Proje Özeti](#-proje-özeti)
2. [Rakip Analizi](#-rakip-analizi)
3. [Mevcut Durum](#-mevcut-durum)
4. [Teknik Mimari](#-teknik-mimari)
5. [Özellik Listesi](#-özellik-listesi)
6. [Yol Haritası (6 Aylık)](#-yol-haritası)
7. [Fiyatlandırma Stratejisi](#-fiyatlandırma-stratejisi)
8. [Pazarlama Planı](#-pazarlama-planı)
9. [Gelir Projeksiyonu](#-gelir-projeksiyonu)
10. [Riskler ve Çözümler](#-riskler-ve-çözümler)

---

## 🎯 PROJE ÖZETİ

### Misyon
KOBİ'lere ve küçük işletmelere, pahalı muhasebe yazılımlarına alternatif olarak modern, hızlı ve uygun fiyatlı bir ön muhasebe çözümü sunmak.

### Hedef Kitle
- 🎯 **Primer:** 1-50 çalışanlı KOBİ'ler
- 🎯 **Sekonder:** Freelancer'lar, yeni kurulan şirketler
- 🎯 **Tersiyer:** Muhasebe ofisleri (çoklu müşteri yönetimi)

### Rekabet Avantajları
✅ **%40-50 daha ucuz** (₺299-999/ay vs BizimHesap ₺900-1,100/ay)
✅ **Modern UI/UX** - React 19 tabanlı, hızlı ve responsive
✅ **AI destekli özellikler** - Akıllı kategorilendirme, tahminler
✅ **Gerçek zamanlı işbirliği** - Takım çalışması için optimize
✅ **Mobil öncelikli** - Her cihazdan sorunsuz erişim
✅ **Kolay entegrasyonlar** - Bankalar, e-ticaret, e-Fatura

---

## 🏆 RAKİP ANALİZİ

### Ana Rakip: BizimHesap.com

#### Fiyatlandırma
| Paket | Aylık | Yıllık | Hedef |
|-------|-------|--------|-------|
| Temel Ticaret | ₺900 + KDV | ₺7,500 + KDV | KOBİ'ler |
| Tam Ticaret | ₺1,100 + KDV | ₺9,600 + KDV | E-ticaret |

#### Güçlü Yönleri
- ✅ 80+ e-ticaret entegrasyonu (Trendyol, Hepsiburada, N11)
- ✅ 19 banka entegrasyonu
- ✅ Sınırsız kullanıcı
- ✅ e-Fatura/e-Arşiv/e-İrsaliye
- ✅ Mobil uygulama (iOS/Android)
- ✅ Muhasebeci paneli
- ✅ Pazar payı ve marka bilinirliği

#### Zayıf Yönleri (BİZİM FIRSATLARIMIZ!)
- ❌ **Pahalı** (₺900-1,100/ay)
- ❌ Eski UI/UX (kullanıcı deneyimi kötü)
- ❌ Mobil optimizasyon zayıf
- ❌ Yavaş (eski teknoloji)
- ❌ Özelleştirme imkanı yok
- ❌ Müşteri yorumlarında şikayetler var

### Diğer Rakipler
- **Paraşüt:** Modern ama pahalı
- **Logo:** Eski teknoloji, karmaşık
- **Mikro:** Kurumsal odaklı, KOBİ için fazla
- **Netsis:** Logo'ya satıldı, gelişim durdu

---

## ✅ MEVCUT DURUM (v0.1 - LocalStorage)

### Tamamlanan Özellikler
- [x] Dashboard (özet istatistikler)
- [x] Cari Hesap Yönetimi (müşteri/tedarikçi)
- [x] Stok Takibi (kritik stok uyarıları)
- [x] Fatura Yönetimi (alış/satış faturaları)
- [x] Kasa Hareketleri (gelir/gider)
- [x] Cari Ekstre (detaylı bakiye takibi)
- [x] Raporlar (satış, alış, stok, kâr/zarar)
- [x] Ayarlar (veri yönetimi)
- [x] Excel/PDF Export (tüm modüllerde)
- [x] Responsive tasarım (mobile-first)
- [x] Klavye kısayolları (hızlı kullanım)
- [x] Modern UI/UX (temiz, hızlı)

### Teknik Stack
- **Frontend:** React 19, Vite, React Router DOM
- **State Management:** React Hooks
- **Styling:** CSS Modules
- **Charts:** Recharts
- **Export:** jsPDF, XLSX
- **Storage:** LocalStorage (geçici)
- **Backend Hazır:** Supabase (henüz aktif değil)

### Kritik Eksiklikler (MVP için gerekli)
- [ ] Çoklu kullanıcı desteği (multi-tenant)
- [ ] Kullanıcı girişi/kaydı (authentication)
- [ ] Bulut veritabanı (Supabase entegrasyonu)
- [ ] e-Fatura/e-Arşiv entegrasyonu
- [ ] Banka dekont entegrasyonu
- [ ] Çek/Senet takibi
- [ ] Abonelik yönetimi
- [ ] Ödeme sistemi (iyzico/Stripe)

---

## 🏗️ TEKNİK MİMARİ

### Frontend (Mevcut)
```
React 19 + Vite
├─ React Router DOM (SPA routing)
├─ CSS Modules (component-based styling)
├─ Recharts (data visualization)
└─ jsPDF + XLSX (exports)
```

### Backend (Kurulacak - Supabase)
```
Supabase (PostgreSQL + Auth + Storage + Edge Functions)
├─ Database: PostgreSQL with Row Level Security (RLS)
├─ Authentication: Email/Password + OAuth (Google)
├─ Storage: Fatura/belge dosyaları (PDF, XML)
├─ Realtime: WebSocket ile canlı güncellemeler
└─ Edge Functions: Serverless API endpoints
```

### Multi-Tenant Veritabanı Yapısı

```sql
-- Şirketler (Tenant)
companies
├─ id (UUID, PK)
├─ name (TEXT)
├─ tax_number (TEXT, UNIQUE)
├─ subscription_plan (ENUM: starter, pro, business, enterprise)
├─ subscription_status (ENUM: trial, active, cancelled, expired)
├─ trial_ends_at (TIMESTAMP)
├─ created_at (TIMESTAMP)
└─ settings (JSONB)

-- Kullanıcılar
users
├─ id (UUID, PK → auth.users)
├─ company_id (UUID, FK → companies.id)
├─ email (TEXT, UNIQUE)
├─ role (ENUM: owner, admin, accountant, user, viewer)
├─ full_name (TEXT)
└─ created_at (TIMESTAMP)

-- Cari Hesaplar (Her tabloda company_id!)
cari_list
├─ id (UUID, PK)
├─ company_id (UUID, FK) ← ÖNEMLİ!
├─ unvan (TEXT)
├─ vergi_no (TEXT)
├─ tip (ENUM: musteri, tedarikci)
├─ telefon (TEXT)
├─ adres (TEXT)
├─ bakiye (DECIMAL)
└─ created_at (TIMESTAMP)

-- Row Level Security (RLS) Örneği
CREATE POLICY "Users see only their company data"
ON cari_list FOR SELECT
USING (company_id IN (
  SELECT company_id FROM users WHERE id = auth.uid()
));
```

### Entegrasyonlar (Planlanan)

```
E-Belge Entegrasyonları
├─ GİB e-Fatura API (resmi)
├─ e-Arşiv Fatura
├─ e-İrsaliye
└─ e-SMM (gelecekte)

Banka Entegrasyonları
├─ İş Bankası API
├─ Garanti BBVA API
├─ Yapı Kredi API
└─ Ziraat Bankası API

E-Ticaret Platformları
├─ Trendyol Entegratör API
├─ Hepsiburada Marketplace API
├─ N11 API
├─ GittiGidiyor API
└─ Çiçeksepeti API

Ödeme Sistemleri
├─ iyzico (Türkiye)
├─ Stripe (uluslararası)
└─ PayTR (alternatif)

İletişim
├─ Netgsm (SMS)
├─ SendGrid (Email)
└─ WhatsApp Business API
```

---

## 📋 ÖZELLİK LİSTESİ

### ✅ Mevcut Özellikler (v0.1)

#### 1. Cari Hesap Yönetimi
- [x] Müşteri/Tedarikçi ekleme, düzenleme, silme
- [x] Bakiye takibi (alacak/borç)
- [x] İletişim bilgileri (telefon, adres, email)
- [x] Arama ve filtreleme
- [x] Excel/PDF export

#### 2. Stok Yönetimi
- [x] Ürün ekleme, düzenleme, silme
- [x] Stok giriş/çıkış hareketleri
- [x] Kritik stok seviyesi uyarıları
- [x] Stok değer hesaplama
- [x] Kategori bazlı filtreleme
- [x] Excel/PDF export

#### 3. Fatura Yönetimi
- [x] Alış/Satış fatura oluşturma
- [x] Çoklu ürün ekleme
- [x] KDV hesaplama (1%, 10%, 20%)
- [x] Ödeme takibi (ödendi, kısmi, beklemede)
- [x] Vade tarihi yönetimi
- [x] Fatura detay görüntüleme
- [x] PDF oluşturma ve yazdırma
- [x] Excel export

#### 4. Kasa Yönetimi
- [x] Kasa/Banka hesabı tanımlama
- [x] Gelir/Gider kayıtları
- [x] Bakiye takibi
- [x] Hareket geçmişi
- [x] Filtreleme (kasa, tarih, tip)
- [x] Excel/PDF export

#### 5. Raporlar
- [x] Satış raporları
- [x] Alış raporları
- [x] Stok durum raporu
- [x] Cari bakiye raporu
- [x] Gelir/Gider analizi
- [x] Grafiksel gösterimler (bar, line charts)
- [x] Excel/PDF export

#### 6. Dashboard
- [x] Toplam satış/alış istatistikleri
- [x] Kritik stok uyarıları
- [x] Vade geçmiş faturalar
- [x] Günlük özet (bugünkü işlemler)
- [x] Grafik göstergeler

### 🔨 Geliştirme Aşamasında (Sprint 1-2)

#### 7. Kullanıcı ve Şirket Yönetimi
- [ ] Kullanıcı kaydı (email + şifre)
- [ ] Giriş/Çıkış sistemi (Supabase Auth)
- [ ] Şirket profili oluşturma
- [ ] Şirket ayarları (logo, bilgiler, vergi dairesi)
- [ ] Çoklu kullanıcı desteği (aynı şirkete birden fazla kullanıcı)
- [ ] Rol bazlı yetkilendirme (owner, admin, user, viewer)
- [ ] Kullanıcı davetiye sistemi (email ile davet)
- [ ] Şifre sıfırlama (email ile)
- [ ] 2FA (iki faktörlü doğrulama - gelecekte)

#### 8. Supabase Entegrasyonu
- [ ] Tüm LocalStorage verilerini Supabase'e taşı
- [ ] Gerçek zamanlı senkronizasyon
- [ ] Offline modu (LocalStorage backup)
- [ ] Otomatik yedekleme (günlük)
- [ ] Veri şifreleme (hassas bilgiler için)
- [ ] Row Level Security (RLS) politikaları
- [ ] API rate limiting

### 🚀 Öncelikli Özellikler (Sprint 3-6)

#### 9. e-Fatura/e-Arşiv Entegrasyonu
- [ ] GİB API bağlantısı
- [ ] e-Fatura oluşturma ve gönderme
- [ ] e-Arşiv fatura oluşturma
- [ ] Gelen e-Fatura indirme
- [ ] e-İrsaliye desteği
- [ ] XML görüntüleme ve indirme
- [ ] e-Belge geçmişi ve arşiv

#### 10. Çek/Senet Yönetimi
- [ ] Çek ekleme (kendi çekimiz/müşteri çeki)
- [ ] Senet ekleme (kendi senedimiz/müşteri senedi)
- [ ] Vade takibi
- [ ] Tahsil/Ödeme durumu
- [ ] Ciro işlemleri
- [ ] Protestolu çek takibi
- [ ] Banka'ya verilen çekler
- [ ] Portföydeki çekler
- [ ] Hatırlatma sistemi (vade tarihi yaklaşınca)

#### 11. Banka Entegrasyonu
- [ ] Banka API'leri ile bağlantı
- [ ] Otomatik dekont çekme
- [ ] Banka bakiye senkronizasyonu
- [ ] EFT/Havale kayıtları
- [ ] Kredi kartı hareketleri
- [ ] Mutabakat raporları

#### 12. Abonelik ve Ödeme Sistemi
- [ ] Paket seçimi (Starter, Pro, Business)
- [ ] iyzico entegrasyonu (kredi kartı ödemeleri)
- [ ] Stripe entegrasyonu (uluslararası ödemeler)
- [ ] Fatura oluşturma (abonelik faturaları)
- [ ] Otomatik yenileme (recurring payments)
- [ ] Ödeme geçmişi
- [ ] İptal ve geri ödeme yönetimi
- [ ] Deneme süresi yönetimi (14 gün)
- [ ] Paket yükseltme/düşürme

### 🎨 Farklılaştırıcı Özellikler (Sprint 7+)

#### 13. AI Destekli Özellikler
- [ ] Akıllı fatura kategorilendirme (AI ile)
- [ ] Harcama tahminleri (gelecek ay ne kadar harcarsınız?)
- [ ] Anomali tespiti (olağandışı hareketler)
- [ ] Nakit akış tahmini (cash flow forecast)
- [ ] Chatbot asistan (muhasebe sorularına cevap)
- [ ] OCR ile fatura okuma (fotoğraf çek, otomatik kaydet)

#### 14. Otomasyon ve Bildirimler
- [ ] Yinelenen faturalar (aylık kira, abonelik vb. otomatik oluştur)
- [ ] Ödeme hatırlatmaları (vade tarihi yaklaşınca SMS/email)
- [ ] Stok uyarıları (kritik seviyeye düşünce bildir)
- [ ] Zamanlanmış raporlar (her ay otomatik email ile rapor gönder)
- [ ] WhatsApp entegrasyonu (fatura gönderme)
- [ ] Telegram bot (mobil bildirimler)
- [ ] Webhook'lar (harici sistemlere bildirim)

#### 15. Gelişmiş Raporlama
- [ ] Kâr/Zarar tablosu (P&L)
- [ ] Bilanço (Balance Sheet)
- [ ] Nakit akış raporu (Cash Flow)
- [ ] KDV beyannamesi hazırlama
- [ ] Muhasebe dosyası export (Logo, Mikro formatında)
- [ ] Özel rapor oluşturucu (drag & drop)
- [ ] Dashboard widget'ları (özelleştirilebilir)
- [ ] Çoklu dönem karşılaştırma (bu yıl vs geçen yıl)

#### 16. E-Ticaret Entegrasyonları
- [ ] Trendyol entegrasyonu (sipariş, stok, fatura)
- [ ] Hepsiburada entegrasyonu
- [ ] N11 entegrasyonu
- [ ] Çiçeksepeti entegrasyonu
- [ ] GittiGidiyor entegrasyonu
- [ ] WooCommerce plugin
- [ ] Shopify entegrasyonu
- [ ] Otomatik stok güncelleme
- [ ] Otomatik fatura oluşturma

#### 17. Muhasebeci Paneli
- [ ] Muhasebeci rolü (birden fazla şirketi yönetebilir)
- [ ] Müşteri şirketlerini toplu görüntüleme
- [ ] Toplu rapor alma
- [ ] Müşteri-muhasebeci mesajlaşma
- [ ] Belge paylaşımı (drag & drop)
- [ ] Onay mekanizması (muhasebeci onayla/reddet)
- [ ] Toplu e-Fatura gönderimi

#### 18. Mobil Uygulama
- [ ] React Native ile iOS/Android app
- [ ] Fatura fotoğrafı çekip kaydetme (OCR)
- [ ] Harcama kaydı (anında gider ekle)
- [ ] Bildirimler (push notifications)
- [ ] QR kod ile fatura okuma
- [ ] Offline mod (internet yokken de çalış)

### 🔮 Gelecek Vizyonu (1+ Yıl)

#### 19. API ve Entegrasyon Hub
- [ ] REST API (geliştiriciler için)
- [ ] Zapier entegrasyonu
- [ ] Slack entegrasyonu
- [ ] Google Drive backup
- [ ] Dropbox entegrasyonu
- [ ] Webhook'lar

#### 20. Gelişmiş Özellikler
- [ ] Proje bazlı muhasebe
- [ ] Departman bazlı takip
- [ ] Bordro ve maaş yönetimi
- [ ] Zimmet takibi
- [ ] Sözleşme yönetimi
- [ ] CRM özellikleri (müşteri ilişkileri)
- [ ] Sanal POS entegrasyonu

---

## 🗓️ YOL HARİTASI (6 AYLIK PLAN)

### 📅 Ay 1-2: ALTYAPI (SPRINT 1-4)

**Hedef:** SaaS altyapısını kurmak, multi-tenant mimariye geçmek

#### Sprint 1 (Hafta 1-2): Supabase Setup
- [ ] Supabase projesi oluştur
- [ ] Veritabanı şeması tasarla (companies, users, cari_list, stok_list, vb.)
- [ ] Row Level Security (RLS) politikaları yaz
- [ ] Migration scriptleri hazırla
- [ ] Test verisi oluştur
- [ ] Supabase Auth yapılandırması

#### Sprint 2 (Hafta 3-4): Authentication
- [ ] Login sayfası (email + şifre)
- [ ] Signup sayfası (kullanıcı + şirket kaydı)
- [ ] Şifre unuttum (email reset)
- [ ] Session yönetimi
- [ ] Protected routes (giriş yapmadan erişim engelle)
- [ ] Logout fonksiyonu

#### Sprint 3 (Hafta 5-6): Multi-Tenant Geçiş
- [ ] Tüm mevcut sayfaları Supabase'e bağla
- [ ] LocalStorage'dan Supabase'e veri geçişi
- [ ] Realtime senkronizasyon
- [ ] Error handling ve loading states
- [ ] Offline modu (LocalStorage backup)
- [ ] Veri validasyonu (backend + frontend)

#### Sprint 4 (Hafta 7-8): Şirket ve Kullanıcı Yönetimi
- [ ] Şirket profil sayfası
- [ ] Şirket ayarları (logo, bilgiler, vergi dairesi)
- [ ] Kullanıcı yönetimi (davet, rol atama)
- [ ] Rol bazlı yetkilendirme (owner, admin, user)
- [ ] Kullanıcı profil sayfası
- [ ] Takım üyeleri listesi

**Ay 2 Sonu Hedefi:** ✅ Multi-tenant SaaS altyapısı hazır, birden fazla şirket sisteme girebilir

---

### 📅 Ay 3-4: CORE ÖZELLİKLER (SPRINT 5-8)

**Hedef:** Rakiplerle rekabet edebilmek için kritik özellikleri eklemek

#### Sprint 5 (Hafta 9-10): e-Fatura Altyapısı
- [ ] GİB API araştırması ve test ortamı
- [ ] e-Fatura XML oluşturma
- [ ] e-Fatura gönderme (test ortamı)
- [ ] Gelen e-Fatura okuma
- [ ] e-Arşiv fatura desteği
- [ ] e-Belge geçmişi sayfası

#### Sprint 6 (Hafta 11-12): Çek/Senet Modülü
- [ ] Çek/Senet veritabanı şeması
- [ ] Çek ekleme formu (kendi çekimiz/müşteri çeki)
- [ ] Senet ekleme formu
- [ ] Çek/Senet listesi (filtreleme, arama)
- [ ] Tahsil/Ödeme kayıtları
- [ ] Vade takibi ve uyarılar
- [ ] Raporlama (portföydeki çekler, bankaya verilen çekler)

#### Sprint 7 (Hafta 13-14): Banka Entegrasyonu (1. Faz)
- [ ] 1-2 banka ile API anlaşması (İş Bankası, Garanti)
- [ ] Banka hesap bağlantısı
- [ ] Dekont çekme (otomatik)
- [ ] Bakiye senkronizasyonu
- [ ] Hareket geçmişi görüntüleme
- [ ] Mutabakat raporu

#### Sprint 8 (Hafta 15-16): Muhasebeci Paneli
- [ ] Muhasebeci rolü (birden fazla şirketi yönet)
- [ ] Müşteri şirket listesi
- [ ] Müşteri detay görüntüleme (tüm verilerine erişim)
- [ ] Toplu rapor alma
- [ ] Belge paylaşım sistemi
- [ ] Mesajlaşma modülü (muhasebeci-müşteri)

**Ay 4 Sonu Hedefi:** ✅ e-Fatura, çek/senet, banka entegrasyonu ve muhasebeci paneli hazır

---

### 📅 Ay 5-6: SaaS ÖZELLİKLERİ ve BETA (SPRINT 9-12)

**Hedef:** Ücretli sisteme geçiş, ilk müşterileri kazanmak

#### Sprint 9 (Hafta 17-18): Abonelik Sistemi
- [ ] Paket tanımlama (Starter, Pro, Business)
- [ ] Fiyatlandırma sayfası
- [ ] iyzico entegrasyonu
- [ ] Stripe entegrasyonu (yurtdışı müşteriler için)
- [ ] Ödeme formu
- [ ] Abonelik yönetimi (upgrade, downgrade, cancel)
- [ ] Deneme süresi mantığı (14 gün ücretsiz)

#### Sprint 10 (Hafta 19-20): Otomasyon ve Bildirimler
- [ ] Yinelenen fatura sistemi
- [ ] Email bildirimleri (vade tarihi, ödeme)
- [ ] SMS entegrasyonu (Netgsm)
- [ ] Hatırlatma sistemi (vade, stok, ödeme)
- [ ] WhatsApp Business API (fatura gönderme)
- [ ] Zamanlanmış raporlar

#### Sprint 11 (Hafta 21-22): Landing Page ve Pazarlama
- [ ] Landing page tasarımı (luka-muhasebe.com)
- [ ] Özellikler sayfası
- [ ] Fiyatlandırma sayfası
- [ ] Blog altyapısı (SEO için)
- [ ] İlk 5-10 blog yazısı (muhasebe ipuçları)
- [ ] Demo video (YouTube)
- [ ] Press kit (basın için)

#### Sprint 12 (Hafta 23-24): Beta Launch
- [ ] 10-20 beta kullanıcı bul (muhasebe ofisleri)
- [ ] Beta feedback formu
- [ ] Bug tracking sistemi (GitHub Issues)
- [ ] Kullanıcı onboarding (ilk giriş turu)
- [ ] Help center / Yardım dokümantasyonu
- [ ] Canlı destek (Intercom/Crisp)

**Ay 6 Sonu Hedefi:** ✅ İlk 10-50 ücretli müşteri, beta feedback ile ürünü iyileştir

---

## 💰 FİYATLANDIRMA STRATEJİSİ

### Paketler (Aylık - Yıllıkta %30 indirim)

| Özellik | **Başlangıç** | **Profesyonel** | **İşletme** | **Kurumsal** |
|---------|---------------|-----------------|-------------|--------------|
| **Fiyat (Aylık)** | ₺299 | ₺599 | ₺999 | Özel |
| **Fiyat (Yıllık)** | ₺2,508 (₺209/ay) | ₺5,028 (₺419/ay) | ₺8,388 (₺699/ay) | Özel |
| **Fatura Limiti** | 100/ay | 500/ay | Sınırsız | Sınırsız |
| **Kullanıcı Sayısı** | 1 | 5 | 20 | Sınırsız |
| **Cari Hesap** | 50 | 500 | Sınırsız | Sınırsız |
| **Stok Kalemi** | 100 | 1,000 | Sınırsız | Sınırsız |
| **e-Fatura/e-Arşiv** | ✅ | ✅ | ✅ | ✅ |
| **Banka Entegrasyonu** | 1 banka | 3 banka | Sınırsız | Sınırsız |
| **E-Ticaret Entegrasyonu** | ❌ | 2 platform | 5 platform | Sınırsız |
| **Çek/Senet** | ✅ | ✅ | ✅ | ✅ |
| **Muhasebeci Paneli** | ❌ | ✅ | ✅ | ✅ |
| **AI Özellikler** | ❌ | Temel | Gelişmiş | Tam |
| **Mobil Uygulama** | ✅ | ✅ | ✅ | ✅ |
| **API Erişimi** | ❌ | ❌ | ✅ | ✅ |
| **Destek** | Email | Email + Chat | Öncelikli | 7/24 Telefon |
| **Veri Yedekleme** | Günlük | Günlük | Saatlik | Anlık |
| **Özel Alan Adı** | ❌ | ❌ | ✅ | ✅ |

### Promosyonlar

#### 🎁 İlk Yıl Kampanyası
- **14 gün ücretsiz deneme** (kredi kartı gerekmez)
- **İlk 3 ay %50 indirim** (₺299 → ₺149)
- **Yıllık ödeyenlere 2 ay hediye** (10 ay fiyatına 12 ay)
- **Rakip yazılımdan geçişte veri transferi ücretsiz**

#### 🏢 Muhasebe Ofisi Paketi
- 10+ müşteri yönetimi için özel fiyat
- Her müşteri için ₺199/ay (normal ₺599)
- Toplu faturalama
- Müşteri bazında ayrı raporlama

#### 🚀 Startup Paketi
- Yeni kurulan şirketler için ilk 6 ay **%70 indirim**
- ₺299 → ₺90/ay
- (Ticaret sicil belgesinde son 3 ay içinde kurulmuş olmalı)

---

## 📢 PAZARLAMA PLANI

### 1. SEO ve İçerik Pazarlama

#### Blog İçerikleri (Haftalık 2-3 yazı)
- [ ] "BizimHesap alternatifleri 2025"
- [ ] "En uygun fiyatlı muhasebe programı"
- [ ] "KOBİ'ler için muhasebe rehberi"
- [ ] "e-Fatura nedir, nasıl kullanılır?"
- [ ] "Stok takibi nasıl yapılır?"
- [ ] "Cari hesap takibi neden önemli?"
- [ ] "Startup'lar için muhasebe ipuçları"
- [ ] "Muhasebe programı seçerken dikkat edilmesi gerekenler"

#### SEO Hedefi
- **Ana Keyword:** "muhasebe programı", "ön muhasebe yazılımı"
- **Long-tail:** "ucuz muhasebe programı", "modern muhasebe yazılımı"
- **Rakip:** "bizimhesap alternatif", "paraşüt alternatif"

#### Video İçerik (YouTube)
- [ ] Tanıtım videosu (2 dk)
- [ ] Özellik demoları (her özellik için 3-5 dk)
- [ ] Kullanıcı hikayesi (müşteri testimonial)
- [ ] "Nasıl yapılır?" videoları (tutorial)

### 2. Sosyal Medya

#### LinkedIn (B2B odaklı)
- KOBİ sahiplerine ulaş
- Muhasebe/finans profesyonellerine ulaş
- Haftada 3-5 post (muhasebe ipuçları, özellik duyuruları)
- LinkedIn Ads (hedefli reklam)

#### Instagram
- Görsel içerikler (infographic, carousel)
- Özellik duyuruları
- Müşteri hikayesi (story)
- Haftada 5-7 post

#### Twitter/X
- Muhasebe topluluğuna katıl
- Güncel haberler paylaş (e-Fatura, KDV vb.)
- Hızlı destek kanalı
- Günlük 2-3 tweet

### 3. Influencer ve Partner Marketing

#### Muhasebe YouTube Kanalları
- 10-20 muhasebe kanalına sponsor ol
- "BizimHesap'tan daha ucuz ve modern" içerik
- Affiliate program (%20 komisyon ilk 6 ay)

#### Muhasebe Ofisleri
- İlk 50 muhasebe ofisine ücretsiz paket sun
- Her ofis kendi müşterilerine öner
- Karşılığında referans ve testimonial

### 4. Ücretli Reklamlar

#### Google Ads
- **Bütçe:** ₺3,000/ay (ilk 3 ay)
- **Hedef Keyword:** "muhasebe programı", "fatura programı"
- **Remarketing:** Site ziyaretçilerine tekrar ulaş

#### Facebook/Instagram Ads
- **Bütçe:** ₺2,000/ay
- **Hedef:** KOBİ sahipleri, 30-55 yaş, Türkiye
- **Format:** Video ads, carousel ads

#### LinkedIn Ads
- **Bütçe:** ₺1,000/ay
- **Hedef:** CEO, CFO, muhasebe müdürleri
- **Format:** Sponsored content

### 5. Referral Program (Tavsiye Sistemi)

- **Arkadaşını getir, ₺100 kazan** (her iki tarafa da indirim)
- **Affiliate program:** %20 komisyon (ilk 6 ay)
- **Muhasebeci referansı:** Her yeni müşteri için ₺200 komisyon

---

## 📊 GELİR PROJEKSİYONU

### İlk Yıl Hedefi (Konservatif Tahmin)

| Ay | Yeni Müşteri | Toplam Aktif | Ortalama Paket | Aylık Gelir | Kümülatif Gelir |
|----|--------------|--------------|----------------|-------------|-----------------|
| 1 | 5 | 5 | ₺299 | ₺1,495 | ₺1,495 |
| 2 | 5 | 10 | ₺299 | ₺2,990 | ₺4,485 |
| 3 | 10 | 20 | ₺399 | ₺7,980 | ₺12,465 |
| 4 | 10 | 30 | ₺399 | ₺11,970 | ₺24,435 |
| 5 | 15 | 45 | ₺449 | ₺20,205 | ₺44,640 |
| 6 | 15 | 60 | ₺449 | ₺26,940 | ₺71,580 |
| 7 | 20 | 80 | ₺499 | ₺39,920 | ₺111,500 |
| 8 | 20 | 100 | ₺499 | ₺49,900 | ₺161,400 |
| 9 | 25 | 125 | ₺499 | ₺62,375 | ₺223,775 |
| 10 | 25 | 150 | ₺499 | ₺74,850 | ₺298,625 |
| 11 | 30 | 180 | ₺499 | ₺89,820 | ₺388,445 |
| 12 | 30 | 210 | ₺499 | ₺104,790 | ₺493,235 |

**İlk yıl sonunda:**
- **210 aktif müşteri**
- **₺104,790/ay gelir** (MRR - Monthly Recurring Revenue)
- **₺1,257,480/yıl** (ARR - Annual Recurring Revenue)

### Maliyet Analizi (Aylık)

| Gider Kalemi | İlk 6 Ay | 6-12 Ay | Notlar |
|--------------|----------|---------|--------|
| **Supabase** | $25 × 40 TL = ₺1,000 | ₺1,000 | Pro plan yeterli (100-500 müşteri için) |
| **e-Fatura API** | ₺500 | ₺1,000 | Müşteri sayısına göre artar |
| **SMS/Email** | ₺300 | ₺500 | Netgsm + SendGrid |
| **İyzico Komisyon** | %2.9 + ₺0.25/işlem | %2.9 + ₺0.25 | Ödeme altyapısı |
| **Domain + CDN** | ₺200 | ₺200 | Cloudflare Pro |
| **Pazarlama** | ₺5,000 | ₺10,000 | Google/FB Ads, SEO |
| **Destek Araçları** | ₺500 | ₺1,000 | Crisp, Notion, vb. |
| **Geliştirme** | ₺0 | ₺0 | İçeriden (sen + ben) |
| **TOPLAM** | **₺7,500** | **₺13,700** | |

### Kârlılık Analizi

| Ay | Gelir | Gider | Net Kâr | Kümülatif Kâr |
|----|-------|-------|---------|---------------|
| 1-3 | ₺12,465 | ₺22,500 | **-₺10,035** | **-₺10,035** |
| 4-6 | ₺59,145 | ₺22,500 | **₺36,645** | **₺26,610** |
| 7-9 | ₺192,115 | ₺41,100 | **₺151,015** | **₺177,625** |
| 10-12 | ₺269,460 | ₺41,100 | **₺228,360** | **₺405,985** |

**İlk yıl sonunda net kâr:** ~₺400,000

### 3 Yıllık Projeksiyon

| Yıl | Müşteri | Aylık Gelir | Yıllık Gelir | Net Kâr |
|-----|---------|-------------|--------------|---------|
| **1** | 210 | ₺105,000 | ₺1,260,000 | ₺400,000 |
| **2** | 500 | ₺250,000 | ₺3,000,000 | ₺1,500,000 |
| **3** | 1,000 | ₺500,000 | ₺6,000,000 | ₺3,500,000 |

---

## ⚠️ RİSKLER ve ÇÖZÜMLER

### Teknik Riskler

| Risk | Olasılık | Etki | Çözüm |
|------|----------|------|-------|
| **Supabase limitleri** | Orta | Yüksek | Pro plan yeterli, gerekirse Team plana geç |
| **Veri güvenliği ihlali** | Düşük | Kritik | RLS + şifreleme + audit logs |
| **e-Fatura API değişikliği** | Orta | Yüksek | Güncel API dokümantasyonu takip et |
| **Ölçekleme sorunları** | Düşük | Orta | Supabase otomatik ölçeklenir |
| **Banka API kapanması** | Orta | Orta | Birden fazla banka ile çalış |

### İş Riskleri

| Risk | Olasılık | Etki | Çözüm |
|------|----------|------|-------|
| **Rakip fiyat indirimi** | Yüksek | Orta | Farklılaşma (AI, UX) ile rekabet et |
| **Müşteri kazanım zorluğu** | Orta | Yüksek | Agresif pazarlama, referral program |
| **Churn (müşteri kaybı)** | Orta | Yüksek | Müşteri memnuniyeti takibi, feedback |
| **Yatırım ihtiyacı** | Düşük | Orta | Bootstrap ile başla, kâr ettikçe büyüt |
| **Yasal düzenlemeler** | Düşük | Yüksek | Avukat/muhasebe danışmanı ile çalış |

### Hukuki Riskler

| Risk | Çözüm |
|------|-------|
| **e-Fatura yetkilendirme** | Mali müşavir/SMMM ortaklığı |
| **KVKK uyumu** | Gizlilik politikası, kullanıcı onayı, veri şifreleme |
| **Vergi mevzuatı değişikliği** | Güncel yasaları takip et, danışman çalıştır |

---

## 🎯 KRİTİK BAŞARI FAKTÖRLERİ (KPI)

### Ürün Metrikleri
- **MAU (Monthly Active Users):** Aylık aktif kullanıcı sayısı
- **DAU (Daily Active Users):** Günlük aktif kullanıcı sayısı
- **Feature Adoption:** Her özelliği kullanan kullanıcı %'si
- **Bug Rate:** Haftalık bildirilen bug sayısı

### Müşteri Metrikleri
- **CAC (Customer Acquisition Cost):** Müşteri başına kazanım maliyeti (₺500 hedef)
- **LTV (Lifetime Value):** Müşteri ömür boyu değeri (₺5,000+ hedef)
- **Churn Rate:** Aylık müşteri kaybı oranı (%5 altında hedef)
- **NPS (Net Promoter Score):** Tavsiye skoru (50+ hedef)

### Gelir Metrikleri
- **MRR (Monthly Recurring Revenue):** Aylık tekrarlayan gelir
- **ARR (Annual Recurring Revenue):** Yıllık tekrarlayan gelir
- **ARPU (Average Revenue Per User):** Kullanıcı başına ortalama gelir
- **Conversion Rate:** Deneme → ücretli dönüşüm oranı (%20 hedef)

---

## 📝 NOTLAR ve FİKİRLER

### Gelecek Özellik Fikirleri
- [ ] **Bordro modülü:** Çalışan maaş hesaplama, SGK bildirimi
- [ ] **Sözleşme yönetimi:** Kira, tedarikçi sözleşmeleri
- [ ] **Zimmet takibi:** Şirket varlıklarının çalışanlara zimmetlenmesi
- [ ] **Proje bazlı muhasebe:** Her proje için ayrı maliyet merkezi
- [ ] **CRM özellikleri:** Müşteri ilişkileri, satış hunisi
- [ ] **İnsan kaynakları:** İzin takibi, performans yönetimi

### Potansiyel Ortaklıklar
- [ ] Muhasebe ofisleri (reseller program)
- [ ] E-ticaret platformları (entegrasyon)
- [ ] Bankalar (özel anlaşma)
- [ ] Kargo firmaları (entegrasyon)
- [ ] ERP yazılımları (data export/import)

### Uzun Vadeli Vizyon
- **Yıl 1:** Türkiye'de 1,000 müşteri, ₺500K/ay gelir
- **Yıl 2:** Türkiye'nin en hızlı büyüyen muhasebe SaaS'i (10,000 müşteri)
- **Yıl 3:** Bölgesel genişleme (Azerbaycan, Özbekistan, vb.)
- **Yıl 5:** Pazar lideri (100,000+ müşteri, exit veya IPO)

---

## 🤝 EKİP ve ROLLER

### Şu Anki Ekip
- **Sebo (Founder/CEO):** Ürün vizyonu, iş geliştirme, pazarlama
- **Claude (AI Dev Partner):** Yazılım geliştirme, teknik mimari, danışmanlık

### Gelecek İhtiyaçlar (6-12 ay içinde)
- [ ] **Full-stack Developer** (React + Backend)
- [ ] **UI/UX Designer** (Figma, tasarım sistemi)
- [ ] **Muhasebe Danışmanı** (SMMM, mevzuat uyumu)
- [ ] **Satış/Pazarlama Uzmanı** (müşteri kazanımı)
- [ ] **Müşteri Destek Uzmanı** (7/24 destek)

---

## 📞 İLETİŞİM ve KAYNAKLAR

### Yararlı Linkler
- **Supabase Docs:** https://supabase.com/docs
- **GİB e-Fatura:** https://www.efatura.gov.tr
- **React Docs:** https://react.dev
- **iyzico API:** https://dev.iyzipay.com

### Notlar
> Bu roadmap canlı bir dokümandır. Her sprint sonunda güncellenecek, yeni özellikler eklenecek ve öncelikler değiştirilecektir.

---

## 🚀 NASIL BAŞLAMALI?

### 📚 Bu Dosyayı Nasıl Kullanmalı?

#### 1. Her Sprint Başında:
- ✅ Hangi özellikleri yapacağını belirle
- ✅ Checkbox'ları işaretle (örn: `- [ ]` → `- [x]`)
- ✅ Süre tahminlerini güncelle

#### 2. Her Sprint Sonunda:
- ✅ Tamamlanan görevleri `[x]` işaretle
- ✅ Yeni fikirler ekle (Notlar bölümüne)
- ✅ Gelir/müşteri sayılarını güncelle
- ✅ Engelleri ve çözümleri kaydet

#### 3. Aylık Gözden Geçirme:
- ✅ KPI'ları güncelle (MRR, müşteri sayısı, churn rate)
- ✅ Fiyatlandırmayı gözden geçir (rakip analizi)
- ✅ Pazarlama stratejisini revize et
- ✅ Teknik borçları değerlendir

#### 4. Yatırımcı Sunumları:
- ✅ ROADMAP.md'yi PDF'e çevir
- ✅ Gelir projeksiyonunu göster
- ✅ Teknik mimaride farklılaşmayı vurgula
- ✅ Rakip analizi ile avantajları sun

---

### 🎯 ŞİMDİ NE YAPMALI?

#### Seçenek A: Hemen Supabase'i Kuralım ⚡ **[ÖNERİLİR]**

**Süre:** 2-3 gün
**Zorluk:** Orta
**Öncelik:** 🔴 Kritik

**Yapılacaklar:**
1. Supabase hesabı aç (https://supabase.com)
2. Yeni proje oluştur (bölge: eu-central-1, Frankfurt)
3. Veritabanı şemasını kur:
   ```sql
   -- companies, users, cari_list, stok_list, fatura_list, kasa_list
   ```
4. Row Level Security (RLS) politikalarını yaz
5. Authentication yapılandırması (email/password)
6. İlk test kullanıcısını oluştur

**Neden bu seçenek?**
- ✅ Teknik altyapı en kritik kısım
- ✅ Ne kadar erken başlarsan o kadar iyi
- ✅ Supabase kurulumu 2-3 günde tamamlanır
- ✅ Sonra özellikleri eklemek çok hızlı olur

---

#### Seçenek B: Önce BizimHesap'ı Daha Detaylı İnceleyelim 🔍

**Süre:** 1 gün
**Zorluk:** Kolay
**Öncelik:** 🟡 Orta

**Yapılacaklar:**
1. BizimHesap demo hesabı aç (14 gün ücretsiz)
2. Her modülü tek tek test et (cari, stok, fatura, raporlar)
3. Eksik özellikleri listele
4. UI/UX zayıf noktalarını kaydet
5. Fiyatlandırma stratejisini netleştir
6. Farklılaşma noktalarını ROADMAP.md'ye ekle

**Neden bu seçenek?**
- ✅ Rakibi çok iyi tanırsın
- ✅ Hangi özelliklerin öncelikli olduğunu anlarsın
- ✅ Pazarlama mesajlarını netleştirirsin
- ⚠️ Ama kodlama yapmadığın için ilerleme yavaş

---

#### Seçenek C: Landing Page'e Başlayalım 🎨

**Süre:** 3-5 gün
**Zorluk:** Kolay
**Öncelik:** 🟢 Düşük (ama erken yapılabilir)

**Yapılacaklar:**
1. Domain al (örn: luka-muhasebe.com)
2. Landing page tasarla (Figma/Canva)
3. React ile basit landing page kur:
   - Hero section (ana mesaj)
   - Özellikler (6-8 kart)
   - Fiyatlandırma tablosu
   - Beta kayıt formu (email topla)
   - SSS (FAQ)
4. Google Analytics ekle
5. SEO optimizasyonu (meta tags, sitemap)

**Neden bu seçenek?**
- ✅ Erken müşteri ilgisini ölçersin
- ✅ Beta kayıtları toplamaya başlarsın
- ✅ Pazarlama mesajlarını test edersin
- ⚠️ Ama ürün henüz yok (sadece marketing)

---

### ✅ ÖNERILEN YOLCULUK (6 Haftalık Hızlı Start)

```
Hafta 1: Supabase Setup
├─ Supabase projesi oluştur
├─ Veritabanı şeması kur
└─ Test verisi ekle

Hafta 2: Authentication
├─ Login/Signup sayfaları
├─ Session yönetimi
└─ Protected routes

Hafta 3: Multi-Tenant Geçiş
├─ Cari modülünü Supabase'e bağla
├─ Stok modülünü Supabase'e bağla
└─ Fatura modülünü Supabase'e bağla

Hafta 4: Şirket Yönetimi
├─ Şirket profil sayfası
├─ Kullanıcı yönetimi
└─ Rol bazlı yetkilendirme

Hafta 5: İlk Test
├─ 3-5 muhasebe ofisine demoyu göster
├─ Feedback topla
└─ Kritik bugları düzelt

Hafta 6: Beta Hazırlık
├─ Landing page yayınla
├─ Beta kayıt formu ekle
└─ İlk blog yazılarını yaz
```

**6 hafta sonunda:**
- ✅ Multi-tenant SaaS altyapısı hazır
- ✅ İlk beta kullanıcılar sisteme girebilir
- ✅ Gerçek feedback alabilirsin
- ✅ Pazar testi yapmış olursun

---

### 🛠️ HEMEN BAŞLAMAK İÇİN ADIMLAR

#### 1. Supabase Projesi Oluştur (15 dakika)

```bash
# 1. https://supabase.com adresine git
# 2. "Start your project" butonuna tıkla
# 3. Proje ayarları:
#    - Proje adı: luka-muhasebe
#    - Database şifresi: [güçlü şifre]
#    - Bölge: Europe (Frankfurt)
#    - Pricing: Free tier (şimdilik)

# 4. Proje oluşturulunca .env dosyasını güncelle:
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

#### 2. İlk Veritabanı Tablosunu Oluştur (30 dakika)

Supabase SQL Editor'de çalıştır:

```sql
-- Şirketler tablosu
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tax_number TEXT UNIQUE,
  subscription_plan TEXT DEFAULT 'starter',
  subscription_status TEXT DEFAULT 'trial',
  trial_ends_at TIMESTAMP DEFAULT (NOW() + INTERVAL '14 days'),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Kullanıcılar tablosu
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  company_id UUID REFERENCES companies(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'owner',
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS aktif et
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politika: Kullanıcılar sadece kendi şirketlerini görür
CREATE POLICY "Users see their own company"
ON companies FOR SELECT
USING (id IN (
  SELECT company_id FROM users WHERE id = auth.uid()
));
```

#### 3. İlk Authentication Sayfası (2 saat)

`/src/pages/Login.jsx` oluştur:

```jsx
import { useState } from 'react';
import { supabase } from '../supabaseClient';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) alert(error.message);
    else window.location.href = '/';
  };

  return (
    <div className="login-container">
      <h1>Luka Muhasebe</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
}
```

---

### 📊 İLERLEME TAKİBİ

Bu dosyayı kullanarak ilerlemeyi şöyle takip edebiliriz:

```markdown
## Sprint 1 İlerleme Raporu (Hafta 1-2)

**Tarih:** 22 Ekim - 5 Kasım 2025

### Tamamlanan
- [x] Supabase projesi oluşturuldu
- [x] companies tablosu kuruldu
- [x] users tablosu kuruldu
- [x] RLS politikaları yazıldı
- [x] Login sayfası kodlandı

### Devam Eden
- [ ] Signup sayfası (50% tamamlandı)
- [ ] Session yönetimi (başlanmadı)

### Engeller
- ❌ Supabase RLS politikası hata veriyor (çözüldü)
- ⚠️ Email doğrulama ayarları eksik (araştırılıyor)

### Sonraki Sprint Hedefi
- Signup sayfasını bitir
- Session yönetimini kur
- Protected routes ekle
```

---

### 💡 İPUÇLARI

#### Kod Yazarken:
- ✅ Her özellik için ayrı branch aç (`git checkout -b feature/auth`)
- ✅ Sık sık commit yap (`git commit -m "Add login page"`)
- ✅ Her sprint sonunda ROADMAP.md'yi güncelle
- ✅ TODO.md dosyası tut (günlük görevler için)

#### Pazarlama İçin:
- ✅ LinkedIn'de ilerlemeyi paylaş (#buildinpublic)
- ✅ Her hafta blog yazısı yaz (SEO için)
- ✅ Screenshot'lar topla (portfolio için)
- ✅ Beta kullanıcılardan testimonial al

#### Motivasyon İçin:
- 🎯 Küçük hedefler koy (haftada 1 özellik)
- 🎉 Her milestone'u kutla (ilk kullanıcı, ilk ödeme vb.)
- 📊 İlerlemeyi görselleştir (grafik, tablo)
- 🤝 Topluluğa katıl (Discord, Slack grupları)

---

### 🎬 BAŞLAMAYA HAZIR MISIN?

**Önerilen İlk Adım:** Seçenek A (Supabase Setup)

Hemen şimdi yapabileceklerin:

1. ☐ Supabase hesabı aç → https://supabase.com
2. ☐ Proje oluştur (luka-muhasebe)
3. ☐ SQL Editor'de ilk tabloları kur
4. ☐ .env dosyasını güncelle
5. ☐ Login sayfası kodla
6. ☐ İlk test kullanıcısını oluştur

**Tahmini süre:** 3-4 saat (1 günde bitebilir!)

---

### 📞 DESTEK ve SORULAR

**Takıldığın yerler olursa:**
- 📖 Supabase Docs: https://supabase.com/docs
- 💬 Discord: Supabase Discord topluluğu
- 🤖 Claude Code ile devam et (ben her zaman buradayım!)

**Güncellemeler:**
- Her sprint sonunda bu dosyayı güncelle
- Yeni fikirler ekle
- Tamamlanan görevleri işaretle

---

**Son Güncelleme:** 22 Ekim 2025
**Güncelleyen:** Claude + Sebo
**Sonraki Gözden Geçirme:** Sprint 1 tamamlandığında
**Durum:** 🟢 Aktif Geliştirme - Sprint 0 (Planlama)

---

🚀 **LET'S BUILD THE FUTURE OF ACCOUNTING IN TURKEY!** 🇹🇷

> "En iyi plan, hemen şimdi başlamaktır." - Bilinmeyen

**Hadi başlayalım! 💪**
