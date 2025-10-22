# Luka Muhasebe - Ön Muhasebe Sistemi

Modern, bulut tabanlı ön muhasebe yazılımı. React + Vite + Supabase ile geliştirilmiştir.

## 🚀 Özellikler

- ✅ **Cari Hesap Yönetimi** - Müşteri ve tedarikçi takibi
- ✅ **Stok Yönetimi** - Ürün ve stok takibi
- ✅ **Fatura İşlemleri** - Alış/satış faturaları
- ✅ **Kasa/Banka** - Nakit akış yönetimi
- ✅ **Raporlar** - Detaylı finansal raporlar
- ✅ **Multi-tenant SaaS** - Şirket bazlı izolasyon
- ✅ **Authentication** - Güvenli kullanıcı girişi
- ✅ **Realtime** - Anlık veri senkronizasyonu

## 📋 Gereksinimler

- Node.js 18+
- npm veya yarn
- Supabase hesabı

## 🛠️ Kurulum

### 1. Projeyi klonlayın

```bash
git clone <repository-url>
cd luka-muhasebe
```

### 2. Bağımlılıkları yükleyin

```bash
npm install
```

### 3. Supabase Kurulumu

#### a) Supabase projesi oluşturun
1. [Supabase](https://supabase.com) üzerinden yeni bir proje oluşturun
2. Proje adı: `luka-muhasebe`
3. Bölge: **Europe (Frankfurt)** (Türkiye'ye en yakın)

#### b) Veritabanı şemasını çalıştırın
1. Supabase Dashboard → SQL Editor'e gidin
2. `supabase/schema.sql` dosyasındaki SQL komutlarını çalıştırın
3. Bu işlem şunları oluşturur:
   - Companies tablosu (şirketler)
   - Users tablosu (kullanıcılar)
   - Cari, Stok, Fatura, Kasa tabloları
   - Row Level Security (RLS) politikaları
   - Otomatik trigger'lar

#### c) Environment variables ayarlayın
1. `.env.example` dosyası zaten doğru bilgilerle doldurulmuş
2. Eğer farklı bir Supabase projesi kullanıyorsanız:
   ```bash
   # Supabase Dashboard → Settings → API
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### 4. Projeyi çalıştırın

```bash
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresine gidin.

## 🎯 İlk Kullanım

1. **Kayıt Ol** - `/signup` sayfasından yeni hesap oluşturun
2. **Şirket Bilgileri** - Kayıt sırasında şirket adınızı girin
3. **Giriş Yap** - Email ve şifrenizle giriş yapın
4. **Dashboard** - Anasayfadan modüllere erişin

## 📁 Proje Yapısı

```
luka-muhasebe/
├── src/
│   ├── components/        # React bileşenleri
│   │   ├── Sidebar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ...
│   ├── contexts/          # React Context (Auth)
│   │   └── AuthContext.jsx
│   ├── pages/             # Sayfa bileşenleri
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Cari.jsx
│   │   └── ...
│   ├── services/          # Supabase servisleri
│   │   └── supabaseService.js
│   ├── utils/             # Yardımcı fonksiyonlar
│   │   ├── validation.js
│   │   ├── storage.js
│   │   └── ...
│   ├── styles/            # CSS dosyaları
│   ├── supabaseClient.js  # Supabase client
│   └── App.jsx
├── supabase/
│   └── schema.sql         # Veritabanı şeması
├── .env.example           # Environment variables
└── package.json
```

## 🔒 Güvenlik

- **Row Level Security (RLS)** - Her şirket sadece kendi verilerine erişebilir
- **Authentication** - Supabase Auth ile güvenli giriş
- **Multi-tenant** - Şirketler arası veri izolasyonu
- **Protected Routes** - Yetkisiz erişim engelleme

## 🧪 Geliştirme

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## 📚 Teknolojiler

- **React 19** - UI framework
- **Vite** - Build tool
- **Supabase** - Backend (PostgreSQL + Auth + Realtime)
- **React Router** - Routing
- **Lucide React** - Icons
- **React Toastify** - Notifications
- **Recharts** - Charts
- **jsPDF** - PDF export
- **XLSX** - Excel export

## 🎨 Klavye Kısayolları

- **Alt+N** - Yeni kayıt ekle
- **Ctrl+S** - Kaydet
- **Ctrl+F** - Ara
- **Esc** - Modal kapat

## 📞 Destek

Bir sorun mu buldunuz? [Issue açın](../../issues)

## 📝 Lisans

Bu proje özel bir projedir.

---

**Luka Muhasebe** - Modern Ön Muhasebe Çözümü 🚀
