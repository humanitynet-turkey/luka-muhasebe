import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FileText, TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import { storage } from '../utils/storage';
import '../styles/Raporlar.css';

const Raporlar = () => {
  const [activeTab, setActiveTab] = useState('cari');
  const [raporData, setRaporData] = useState({
    cariList: [],
    stokList: [],
    faturaList: [],
    hareketList: [],
    kasaList: []
  });

  useEffect(() => {
    const cariList = storage.get('cariList') || [];
    const stokList = storage.get('stokList') || [];
    const faturaList = storage.get('faturaList') || [];
    const hareketList = storage.get('hareketList') || [];
    const kasaList = storage.get('kasaList') || [];

    setRaporData({
      cariList,
      stokList,
      faturaList,
      hareketList,
      kasaList
    });
    document.title = 'Raporlar - Hira Muhasebe';
  }, [activeTab]);

  // Cari Raporu
  const getCariRapor = () => {
    const musteri = raporData.cariList.filter(c => c.tip === 'musteri');
    const tedarikci = raporData.cariList.filter(c => c.tip === 'tedarikci');

    // Her carinin toplam fatura tutarı
    const cariDetay = raporData.cariList.map(cari => {
      const cariFaturalar = raporData.faturaList.filter(f => f.cariId === String(cari.id));
      const toplamTutar = cariFaturalar.reduce((sum, f) => sum + f.genelToplam, 0);
      const faturaSayisi = cariFaturalar.length;

      return {
        ...cari,
        toplamTutar,
        faturaSayisi
      };
    });

    // En çok alışveriş yapanlar (Top 5)
    const enCokAlan = [...cariDetay]
      .filter(c => c.toplamTutar > 0)
      .sort((a, b) => b.toplamTutar - a.toplamTutar)
      .slice(0, 5);

    return {
      musteri: musteri.length,
      tedarikci: tedarikci.length,
      toplam: raporData.cariList.length,
      enCokAlan,
      cariDetay
    };
  };

  // Stok Raporu
  const getStokRapor = () => {
    const kritikStok = raporData.stokList.filter(s => {
      const miktar = parseFloat(s.stokMiktar) || 0;
      const kritik = parseFloat(s.kritikStok) || 10;
      return miktar <= kritik;
    });

    const tukenenStok = raporData.stokList.filter(s => parseFloat(s.stokMiktar) === 0);

    // En değerli ürünler (stok değeri = miktar x satış fiyatı)
    const degerliUrunler = raporData.stokList.map(s => ({
      ...s,
      toplamDeger: parseFloat(s.stokMiktar) * parseFloat(s.satisFiyat)
    })).sort((a, b) => b.toplamDeger - a.toplamDeger).slice(0, 5);

    const toplamStokDeger = raporData.stokList.reduce((sum, s) => {
      return sum + (parseFloat(s.stokMiktar) * parseFloat(s.satisFiyat));
    }, 0);

    return {
      toplamUrun: raporData.stokList.length,
      kritikStok: kritikStok.length,
      tukenenStok: tukenenStok.length,
      toplamStokDeger,
      degerliUrunler,
      kritikStokList: kritikStok
    };
  };

  // Satış Raporu
  const getSatisRapor = () => {
    const satisFaturalar = raporData.faturaList.filter(f => f.faturaTipi === 'satis');
    const alisFaturalar = raporData.faturaList.filter(f => f.faturaTipi === 'alis');

    const toplamSatis = satisFaturalar.reduce((sum, f) => sum + f.genelToplam, 0);
    const toplamAlis = alisFaturalar.reduce((sum, f) => sum + f.genelToplam, 0);
    const kar = toplamSatis - toplamAlis;

    // Aylık satış grafiği (son 6 ay)
    const aylar = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const bugun = new Date();
    const aylikData = [];

    for (let i = 5; i >= 0; i--) {
      const tarih = new Date(bugun.getFullYear(), bugun.getMonth() - i, 1);
      const ay = tarih.getMonth();
      const yil = tarih.getFullYear();

      const ayinFaturalari = satisFaturalar.filter(f => {
        const fTarih = new Date(f.tarih);
        return fTarih.getMonth() === ay && fTarih.getFullYear() === yil;
      });

      const ayinAlislari = alisFaturalar.filter(f => {
        const fTarih = new Date(f.tarih);
        return fTarih.getMonth() === ay && fTarih.getFullYear() === yil;
      });

      aylikData.push({
        ay: aylar[ay],
        satis: ayinFaturalari.reduce((sum, f) => sum + f.genelToplam, 0),
        alis: ayinAlislari.reduce((sum, f) => sum + f.genelToplam, 0)
      });
    }

    return {
      satisSayisi: satisFaturalar.length,
      alisSayisi: alisFaturalar.length,
      toplamSatis,
      toplamAlis,
      kar,
      aylikData
    };
  };

  // Kasa Raporu
  const getKasaRapor = () => {
    const gelirler = raporData.hareketList.filter(h => h.islemTipi === 'gelir');
    const giderler = raporData.hareketList.filter(h => h.islemTipi === 'gider');

    const toplamGelir = gelirler.reduce((sum, h) => sum + h.tutar, 0);
    const toplamGider = giderler.reduce((sum, h) => sum + h.tutar, 0);
    const toplamBakiye = raporData.kasaList.reduce((sum, k) => sum + parseFloat(k.bakiye), 0);

    // Kategori bazlı dağılım (Gider)
    const giderKategoriler = {};
    giderler.forEach(g => {
      if (!giderKategoriler[g.kategori]) {
        giderKategoriler[g.kategori] = 0;
      }
      giderKategoriler[g.kategori] += g.tutar;
    });

    const kategoriData = Object.keys(giderKategoriler).map(key => ({
      name: key,
      value: giderKategoriler[key]
    }));

    return {
      toplamGelir,
      toplamGider,
      toplamBakiye,
      gelirSayisi: gelirler.length,
      giderSayisi: giderler.length,
      kategoriData
    };
  };

  const cariRapor = getCariRapor();
  const stokRapor = getStokRapor();
  const satisRapor = getSatisRapor();
  const kasaRapor = getKasaRapor();

  const COLORS = ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6', '#1abc9c'];

  const tabs = [
    { id: 'cari', label: 'Cari Raporu', icon: Users },
    { id: 'stok', label: 'Stok Raporu', icon: Package },
    { id: 'satis', label: 'Satış Raporu', icon: FileText },
    { id: 'kasa', label: 'Kasa Raporu', icon: DollarSign }
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">Raporlar</h1>

      <div className="rapor-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="rapor-content">
        {/* CARİ RAPORU */}
        {activeTab === 'cari' && (
          <div className="rapor-section">
            <div className="rapor-stats">
              <div className="rapor-card">
                <h3>Toplam Cari</h3>
                <p className="big-number">{cariRapor.toplam}</p>
              </div>
              <div className="rapor-card">
                <h3>Müşteri</h3>
                <p className="big-number green">{cariRapor.musteri}</p>
              </div>
              <div className="rapor-card">
                <h3>Tedarikçi</h3>
                <p className="big-number orange">{cariRapor.tedarikci}</p>
              </div>
            </div>

            {cariRapor.enCokAlan.length > 0 && (
              <div className="rapor-table-section">
                <h3>En Çok Alışveriş Yapan Cariler (Top 5)</h3>
                <table className="rapor-table">
                  <thead>
                    <tr>
                      <th>Ünvan</th>
                      <th>Tip</th>
                      <th>Fatura Sayısı</th>
                      <th>Toplam Tutar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cariRapor.enCokAlan.map((cari, index) => (
                      <tr key={index}>
                        <td><strong>{cari.unvan}</strong></td>
                        <td>
                          <span className={`mini-badge ${cari.tip}`}>
                            {cari.tip === 'musteri' ? 'Müşteri' : 'Tedarikçi'}
                          </span>
                        </td>
                        <td>{cari.faturaSayisi}</td>
                        <td><strong>{cari.toplamTutar.toFixed(2)} ₺</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* STOK RAPORU */}
        {activeTab === 'stok' && (
          <div className="rapor-section">
            <div className="rapor-stats">
              <div className="rapor-card">
                <h3>Toplam Ürün</h3>
                <p className="big-number">{stokRapor.toplamUrun}</p>
              </div>
              <div className="rapor-card">
                <h3>Kritik Stok</h3>
                <p className="big-number orange">{stokRapor.kritikStok}</p>
              </div>
              <div className="rapor-card">
                <h3>Tükenen</h3>
                <p className="big-number red">{stokRapor.tukenenStok}</p>
              </div>
              <div className="rapor-card">
                <h3>Toplam Stok Değeri</h3>
                <p className="big-number green">{stokRapor.toplamStokDeger.toFixed(2)} ₺</p>
              </div>
            </div>

            {stokRapor.degerliUrunler.length > 0 && (
              <div className="rapor-table-section">
                <h3>En Değerli Ürünler (Top 5)</h3>
                <table className="rapor-table">
                  <thead>
                    <tr>
                      <th>Ürün Adı</th>
                      <th>Ürün Kodu</th>
                      <th>Stok Miktarı</th>
                      <th>Satış Fiyatı</th>
                      <th>Toplam Değer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stokRapor.degerliUrunler.map((urun, index) => (
                      <tr key={index}>
                        <td><strong>{urun.urunAdi}</strong></td>
                        <td>{urun.urunKodu}</td>
                        <td>{urun.stokMiktar} {urun.birim}</td>
                        <td>{parseFloat(urun.satisFiyat).toFixed(2)} ₺</td>
                        <td><strong className="text-green">{urun.toplamDeger.toFixed(2)} ₺</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {stokRapor.kritikStokList.length > 0 && (
              <div className="rapor-table-section">
                <h3>⚠️ Kritik Stok Uyarısı</h3>
                <table className="rapor-table">
                  <thead>
                    <tr>
                      <th>Ürün Adı</th>
                      <th>Mevcut Stok</th>
                      <th>Kritik Seviye</th>
                      <th>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stokRapor.kritikStokList.map((urun, index) => (
                      <tr key={index}>
                        <td><strong>{urun.urunAdi}</strong></td>
                        <td>{urun.stokMiktar} {urun.birim}</td>
                        <td>{urun.kritikStok}</td>
                        <td>
                          <span className="mini-badge kritik">
                            {parseFloat(urun.stokMiktar) === 0 ? 'Tükendi' : 'Kritik'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SATIŞ RAPORU */}
        {activeTab === 'satis' && (
          <div className="rapor-section">
            <div className="rapor-stats">
              <div className="rapor-card">
                <h3>Satış Fatura</h3>
                <p className="big-number green">{satisRapor.satisSayisi}</p>
                <p className="sub-text">{satisRapor.toplamSatis.toFixed(2)} ₺</p>
              </div>
              <div className="rapor-card">
                <h3>Alış Fatura</h3>
                <p className="big-number red">{satisRapor.alisSayisi}</p>
                <p className="sub-text">{satisRapor.toplamAlis.toFixed(2)} ₺</p>
              </div>
              <div className="rapor-card">
                <h3>Net Kar/Zarar</h3>
                <p className={`big-number ${satisRapor.kar >= 0 ? 'green' : 'red'}`}>
                  {satisRapor.kar >= 0 ? '+' : ''}{satisRapor.kar.toFixed(2)} ₺
                </p>
              </div>
            </div>

            {satisRapor.aylikData.length > 0 && (
              <div className="chart-section">
                <h3>Son 6 Ay Satış/Alış Grafiği</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={satisRapor.aylikData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ay" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="satis" fill="#2ecc71" name="Satış" />
                    <Bar dataKey="alis" fill="#e74c3c" name="Alış" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* KASA RAPORU */}
        {activeTab === 'kasa' && (
          <div className="rapor-section">
            <div className="rapor-stats">
              <div className="rapor-card">
                <h3>Toplam Gelir</h3>
                <p className="big-number green">{kasaRapor.toplamGelir.toFixed(2)} ₺</p>
                <p className="sub-text">{kasaRapor.gelirSayisi} işlem</p>
              </div>
              <div className="rapor-card">
                <h3>Toplam Gider</h3>
                <p className="big-number red">{kasaRapor.toplamGider.toFixed(2)} ₺</p>
                <p className="sub-text">{kasaRapor.giderSayisi} işlem</p>
              </div>
              <div className="rapor-card">
                <h3>Toplam Bakiye</h3>
                <p className="big-number blue">{kasaRapor.toplamBakiye.toFixed(2)} ₺</p>
              </div>
            </div>

            {kasaRapor.kategoriData.length > 0 && (
              <div className="chart-section">
                <h3>Gider Kategorileri Dağılımı</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={kasaRapor.kategoriData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: %${(percent * 100).toFixed(0)}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {kasaRapor.kategoriData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Raporlar;