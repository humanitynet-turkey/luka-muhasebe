import { useEffect, useState } from 'react';
import { TrendingUp, Users, Package, FileText, AlertTriangle, Clock, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { storage } from '../utils/storage';
import Loading from '../components/Loading';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    toplamCari: 0,
    toplamStok: 0,
    toplamStokMiktar: 0,
    aylikFatura: 0,
    kasaBakiye: 0
  });

  const [recentData, setRecentData] = useState({
    recentCari: [],
    recentStok: [],
    recentFatura: [],
    kritikStok: [],
    bugunFatura: [],
    bugunHareket: [],
    vadeYaklasan: [],
    vadeGecmis: []
  });

  const [chartData, setChartData] = useState([]);
  const [gelirGiderData, setGelirGiderData] = useState([]);

  useEffect(() => {
    document.title = 'Dashboard - Luka Muhasebe';
    
  // Supabase bağlantı testi
    const testSupabase = async () => {
      console.log('🔌 Supabase bağlantısı test ediliyor...');
      const data = await storage.fetchFromSupabase('cari_list');
      console.log('✅ Supabase bağlantısı başarılı! Cari sayısı:', data.length);
    };
    
    testSupabase();
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    setLoading(true);

    const cariList = storage.get('cariList') || [];
    const stokList = storage.get('stokList') || [];
    const faturaList = storage.get('faturaList') || [];
    const kasaList = storage.get('kasaList') || [];
    const hareketList = storage.get('hareketList') || [];

    // İstatistikler
    const buAy = new Date().getMonth();
    const buYil = new Date().getFullYear();
    const aylikFatura = faturaList.filter(f => {
      const faturaTarih = new Date(f.tarih);
      return faturaTarih.getMonth() === buAy && faturaTarih.getFullYear() === buYil;
    }).length;

    const kasaBakiye = kasaList.reduce((sum, k) => sum + parseFloat(k.bakiye || 0), 0);
    const toplamStokMiktar = stokList.reduce((sum, s) => sum + parseFloat(s.stokMiktar || 0), 0);

    setStats({
      toplamCari: cariList.length,
      toplamStok: stokList.length,
      toplamStokMiktar: toplamStokMiktar.toFixed(0),
      aylikFatura: aylikFatura,
      kasaBakiye: kasaBakiye.toFixed(2)
    });

    // Son eklenenler (en son 3)
    const recentCari = [...cariList].reverse().slice(0, 3);
    const recentStok = [...stokList].reverse().slice(0, 3);
    const recentFatura = [...faturaList].reverse().slice(0, 3);

    // Kritik stok
    const kritikStok = stokList.filter(s => {
      const miktar = parseFloat(s.stokMiktar) || 0;
      const kritik = parseFloat(s.kritikStok) || 10;
      return miktar <= kritik && miktar > 0;
    }).slice(0, 5);

    // Bugünün faturaları
    const bugun = new Date().toISOString().split('T')[0];
    const bugunFatura = faturaList.filter(f => f.tarih === bugun);
    const bugunHareket = hareketList.filter(h => h.tarih === bugun);

    // Vadesi yaklaşan faturalar (7 gün içinde)
    const bugununTarihi = new Date();
    const yediGunSonra = new Date();
    yediGunSonra.setDate(bugununTarihi.getDate() + 7);

    const vadeYaklasan = faturaList.filter(f => {
      if (!f.vadeTarihi || f.odemeDurumu === 'tamam') return false;
      const vadeTarih = new Date(f.vadeTarihi);
      return vadeTarih >= bugununTarihi && vadeTarih <= yediGunSonra;
    }).sort((a, b) => new Date(a.vadeTarihi) - new Date(b.vadeTarihi));

    // Vadesi geçmiş faturalar
    const vadeGecmis = faturaList.filter(f => {
      if (!f.vadeTarihi || f.odemeDurumu === 'tamam') return false;
      const vadeTarih = new Date(f.vadeTarihi);
      return vadeTarih < bugununTarihi;
    }).sort((a, b) => new Date(a.vadeTarihi) - new Date(b.vadeTarihi));

    setRecentData({
      recentCari,
      recentStok,
      recentFatura,
      kritikStok,
      bugunFatura,
      bugunHareket,
      vadeYaklasan,
      vadeGecmis
    });

    // Grafik verisi - Son 7 gün
    const son7Gun = [];
    for (let i = 6; i >= 0; i--) {
      const tarih = new Date();
      tarih.setDate(tarih.getDate() - i);
      const tarihStr = tarih.toISOString().split('T')[0];
      const gunAdi = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'][tarih.getDay()];

      const gunFaturalar = faturaList.filter(f => f.tarih === tarihStr);
      const satisTutar = gunFaturalar
      .filter(f => f.faturaTipi === 'satis')
      .reduce((sum, f) => sum + f.genelToplam, 0);

      son7Gun.push({
        gun: gunAdi,
        satis: satisTutar
      });
    }
    setChartData(son7Gun);

    // Gelir/Gider son 7 gün
    const gelirGider7Gun = [];
    for (let i = 6; i >= 0; i--) {
      const tarih = new Date();
      tarih.setDate(tarih.getDate() - i);
      const tarihStr = tarih.toISOString().split('T')[0];
      const gunAdi = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'][tarih.getDay()];

      const gunHareketler = hareketList.filter(h => h.tarih === tarihStr);
      const gelir = gunHareketler
      .filter(h => h.islemTipi === 'gelir')
      .reduce((sum, h) => sum + h.tutar, 0);
      const gider = gunHareketler
      .filter(h => h.islemTipi === 'gider')
      .reduce((sum, h) => sum + h.tutar, 0);

      gelirGider7Gun.push({
        gun: gunAdi,
        gelir: gelir,
        gider: gider
      });
    }
    setGelirGiderData(gelirGider7Gun);

    // Loading'i kapat
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const statsData = [
    { 
      title: 'Toplam Cari', 
      value: stats.toplamCari, 
      subtitle: null,
      icon: Users, 
      color: '#3498db' 
    },
    { 
      title: 'Toplam Stok', 
      value: `${stats.toplamStok} Ürün`, 
      subtitle: `${stats.toplamStokMiktar} Adet`,
      icon: Package, 
      color: '#2ecc71' 
    },
    { 
      title: 'Aylık Fatura', 
      value: stats.aylikFatura, 
      subtitle: null,
      icon: FileText, 
      color: '#e74c3c' 
    },
    { 
      title: 'Kasa Bakiye', 
      value: `${stats.kasaBakiye} ₺`, 
      subtitle: null,
      icon: TrendingUp, 
      color: '#f39c12' 
    },
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard</h1>
      
      {loading ? (
        <Loading message="Dashboard yükleniyor..." />
        ) : (
        <>
          {/* Ana İstatistikler */}
        <div className="stats-grid">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                  <Icon size={24} color="white" />
                </div>
                <div className="stat-info">
                  <p className="stat-title">{stat.title}</p>
                  <p className="stat-value">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="stat-subtitle">{stat.subtitle}</p>
                    )}
                </div>
              </div>
              );
          })}
        </div>

          {/* Bugünün Özeti */}
        {(recentData.bugunFatura.length > 0 || recentData.bugunHareket.length > 0) && (
          <div className="dashboard-section">
            <div className="section-header">
              <Clock size={20} />
              <h2>Bugünün Özeti</h2>
            </div>
            <div className="bugun-ozet">
              <div className="ozet-card">
                <h4>Bugün Kesilen Faturalar</h4>
                <p className="ozet-number">{recentData.bugunFatura.length}</p>
                <p className="ozet-detail">
                  Toplam: {recentData.bugunFatura.reduce((sum, f) => sum + f.genelToplam, 0).toFixed(2)} ₺
                </p>
              </div>
              <div className="ozet-card">
                <h4>Bugünkü Kasa Hareketleri</h4>
                <p className="ozet-number">{recentData.bugunHareket.length}</p>
                <p className="ozet-detail">
                  Gelir: {recentData.bugunHareket.filter(h => h.islemTipi === 'gelir').reduce((sum, h) => sum + h.tutar, 0).toFixed(2)} ₺
                </p>
              </div>
            </div>
          </div>
          )}

          {/* Vadesi Geçmiş Faturalar */}
        {recentData.vadeGecmis && recentData.vadeGecmis.length > 0 && (
          <div className="dashboard-section vade-gecmis-section">
            <div className="section-header">
              <AlertTriangle size={20} />
              <h2>⚠️ Vadesi Geçmiş Faturalar ({recentData.vadeGecmis.length})</h2>
            </div>
            <div className="vade-list">
              {recentData.vadeGecmis.slice(0, 5).map((fatura, index) => {
                const gunFarki = Math.floor((new Date() - new Date(fatura.vadeTarihi)) / (1000 * 60 * 60 * 24));
                const kalanBorc = fatura.genelToplam - (fatura.odenenTutar || 0);
                
                return (
                  <div key={index} className="vade-item gecmis">
                    <div className="vade-info">
                      <strong>{fatura.faturaNo}</strong>
                      <span className="vade-cari">{fatura.cariUnvan}</span>
                      <span className="vade-gun">{gunFarki} gün gecikmiş</span>
                    </div>
                    <div className="vade-tutar">
                      <span className="tutar-badge gecmis">{kalanBorc.toFixed(2)} ₺</span>
                      <span className="vade-tarih">{fatura.vadeTarihi}</span>
                    </div>
                  </div>
                  );
              })}
            </div>
          </div>
          )}

          {/* Vadesi Yaklaşan Faturalar */}
        {recentData.vadeYaklasan && recentData.vadeYaklasan.length > 0 && (
          <div className="dashboard-section vade-yaklasan-section">
            <div className="section-header">
              <Clock size={20} />
              <h2>Vadesi Yaklaşan Faturalar ({recentData.vadeYaklasan.length})</h2>
            </div>
            <div className="vade-list">
              {recentData.vadeYaklasan.slice(0, 5).map((fatura, index) => {
                const gunFarki = Math.floor((new Date(fatura.vadeTarihi) - new Date()) / (1000 * 60 * 60 * 24));
                const kalanBorc = fatura.genelToplam - (fatura.odenenTutar || 0);
                
                return (
                  <div key={index} className="vade-item yaklasan">
                    <div className="vade-info">
                      <strong>{fatura.faturaNo}</strong>
                      <span className="vade-cari">{fatura.cariUnvan}</span>
                      <span className="vade-gun">{gunFarki} gün kaldı</span>
                    </div>
                    <div className="vade-tutar">
                      <span className="tutar-badge yaklasan">{kalanBorc.toFixed(2)} ₺</span>
                      <span className="vade-tarih">{fatura.vadeTarihi}</span>
                    </div>
                  </div>
                  );
              })}
            </div>
          </div>
          )}

          {/* Kritik Stok Uyarıları */}
        {recentData.kritikStok.length > 0 && (
          <div className="dashboard-section kritik">
            <div className="section-header">
              <AlertTriangle size={20} />
              <h2>Kritik Stok Uyarıları</h2>
            </div>
            <div className="kritik-list">
              {recentData.kritikStok.map((stok, index) => (
                <div key={index} className="kritik-item">
                  <div>
                    <strong>{stok.urunAdi}</strong>
                    <span className="kritik-kod">{stok.urunKodu}</span>
                  </div>
                  <div className="kritik-miktar">
                    <span className="kritik-badge">
                      {stok.stokMiktar} {stok.birim}
                    </span>
                  </div>
                </div>
                ))}
            </div>
          </div>
          )}

          {/* Grafikler */}
        <div className="charts-grid">
            {/* Satış Trendi */}
          <div className="chart-card">
            <h3>Son 7 Gün Satış Trendi</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="gun" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="satis" stroke="#2ecc71" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

            {/* Gelir/Gider */}
          <div className="chart-card">
            <h3>Son 7 Gün Gelir/Gider</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={gelirGiderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="gun" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="gelir" fill="#2ecc71" name="Gelir" />
                <Bar dataKey="gider" fill="#e74c3c" name="Gider" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

          {/* Son İşlemler */}
        <div className="dashboard-row">
            {/* Son Cariler */}
          {recentData.recentCari.length > 0 && (
            <div className="recent-card">
              <h3>Son Eklenen Cariler</h3>
              <div className="recent-list">
                {recentData.recentCari.map((cari, index) => (
                  <div key={index} className="recent-item">
                    <div>
                      <strong>{cari.unvan}</strong>
                      <span className="recent-type">{cari.tip === 'musteri' ? 'Müşteri' : 'Tedarikçi'}</span>
                    </div>
                    <span className="recent-date">{cari.tarih}</span>
                  </div>
                  ))}
              </div>
            </div>
            )}

            {/* Son Ürünler */}
          {recentData.recentStok.length > 0 && (
            <div className="recent-card">
              <h3>Son Eklenen Ürünler</h3>
              <div className="recent-list">
                {recentData.recentStok.map((stok, index) => (
                  <div key={index} className="recent-item">
                    <div>
                      <strong>{stok.urunAdi}</strong>
                      <span className="recent-type">{stok.urunKodu}</span>
                    </div>
                    <span className="recent-amount">{stok.stokMiktar} {stok.birim}</span>
                  </div>
                  ))}
              </div>
            </div>
            )}

            {/* Son Faturalar */}
          {recentData.recentFatura.length > 0 && (
            <div className="recent-card">
              <h3>Son Faturalar</h3>
              <div className="recent-list">
                {recentData.recentFatura.map((fatura, index) => (
                  <div key={index} className="recent-item">
                    <div>
                      <strong>{fatura.faturaNo}</strong>
                      <span className={`recent-badge ${fatura.faturaTipi}`}>
                        {fatura.faturaTipi === 'satis' ? 'Satış' : 'Alış'}
                      </span>
                    </div>
                    <span className="recent-amount">{fatura.genelToplam.toFixed(2)} ₺</span>
                  </div>
                  ))}
              </div>
            </div>
            )}
        </div>

        <div className="welcome-message">
          <h2>Luka Muhasebe Sistemine Hoş Geldiniz</h2>
          <p>Sol menüden işlemlerinizi gerçekleştirebilirsiniz.</p>
        </div>
        </>
        )}
</div>
);
};

export default Dashboard;