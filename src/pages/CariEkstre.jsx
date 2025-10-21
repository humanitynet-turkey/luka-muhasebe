import { useState, useEffect } from 'react';
import { Download, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { showSuccess, showError } from '../utils/toast';
import { storage } from '../utils/storage';
import * as XLSX from 'xlsx';
import '../styles/CariEkstre.css';

const CariEkstre = () => {
  const [cariList, setCariList] = useState([]);
  const [faturaList, setFaturaList] = useState([]);
  const [selectedCariId, setSelectedCariId] = useState('');
  const [selectedCari, setSelectedCari] = useState(null);
  const [cariFaturalar, setCariFaturalar] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const savedCari = storage.get('cariList') || [];
    const savedFatura = storage.get('faturaList') || [];
    
    setCariList(savedCari);
    setFaturaList(savedFatura);
  }, []);

  useEffect(() => {
    if (selectedCariId) {
      const cari = cariList.find(c => c.id === parseInt(selectedCariId));
      setSelectedCari(cari);

      let faturalar = faturaList.filter(f => f.cariId === selectedCariId);

      // Tarih filtresi
      if (startDate) {
        faturalar = faturalar.filter(f => f.tarih >= startDate);
      }
      if (endDate) {
        faturalar = faturalar.filter(f => f.tarih <= endDate);
      }

      // Tarihe göre sırala (en yeni en üstte)
      faturalar.sort((a, b) => new Date(b.tarih) - new Date(a.tarih));

      setCariFaturalar(faturalar);
    } else {
      setSelectedCari(null);
      setCariFaturalar([]);
    }
    document.title = 'Cari Ekstre - Luka Muhasebe';
  }, [selectedCariId, faturaList, cariList, startDate, endDate]);

  // Cari özet hesapla
  const calculateCariOzet = () => {
    if (!selectedCari) return null;

    const satisFaturalar = cariFaturalar.filter(f => f.faturaTipi === 'satis');
    const alisFaturalar = cariFaturalar.filter(f => f.faturaTipi === 'alis');

    const toplamSatis = satisFaturalar.reduce((sum, f) => sum + f.genelToplam, 0);
    const toplamAlis = alisFaturalar.reduce((sum, f) => sum + f.genelToplam, 0);

    const toplamOdenen = cariFaturalar.reduce((sum, f) => sum + (f.odenenTutar || 0), 0);
    const toplamBorc = cariFaturalar
      .filter(f => f.odemeDurumu !== 'tamam')
      .reduce((sum, f) => sum + (f.genelToplam - (f.odenenTutar || 0)), 0);

    return {
      toplamSatis,
      toplamAlis,
      toplamOdenen,
      toplamBorc,
      bakiye: toplamSatis - toplamAlis,
      faturaSayisi: cariFaturalar.length
    };
  };

  const ozet = calculateCariOzet();

  // Excel'e aktar
  const exportToExcel = () => {
    if (!selectedCari || cariFaturalar.length === 0) {
  showError('Ekstre verileri bulunamadı!');
  return;
}

    const data = cariFaturalar.map(f => ({
      'Fatura No': f.faturaNo,
      'Tarih': f.tarih,
      'Tip': f.faturaTipi === 'satis' ? 'Satış' : 'Alış',
      'Tutar': f.tutar.toFixed(2),
      'KDV': f.kdvToplam.toFixed(2),
      'Genel Toplam': f.genelToplam.toFixed(2),
      'Vade Tarihi': f.vadeTarihi || 'Peşin',
      'Ödeme Durumu': f.odemeDurumu === 'tamam' ? 'Ödendi' : 
                      f.odemeDurumu === 'kismi' ? 'Kısmi' : 'Bekliyor',
      'Ödenen': (f.odenenTutar || 0).toFixed(2),
      'Kalan': (f.genelToplam - (f.odenenTutar || 0)).toFixed(2)
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ekstre');
    XLSX.writeFile(wb, `Cari_Ekstre_${selectedCari.unvan}_${new Date().toISOString().split('T')[0]}.xlsx`);

    showSuccess('Cari ekstresi Excel\'e aktarıldı!');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Cari Hesap Ekstresi</h1>
        {selectedCari && cariFaturalar.length > 0 && (
          <button className="btn-primary" onClick={exportToExcel}>
            <Download size={20} />
            Excel'e Aktar
          </button>
        )}
      </div>

      {/* Cari Seçimi */}
      <div className="ekstre-filters">
        <div className="form-group" style={{ flex: 2 }}>
          <label>Cari Seçin</label>
          <select
            value={selectedCariId}
            onChange={(e) => setSelectedCariId(e.target.value)}
            className="cari-select"
          >
            <option value="">Lütfen cari seçiniz...</option>
            {cariList.map(cari => (
              <option key={cari.id} value={cari.id}>
                {cari.unvan} ({cari.tip === 'musteri' ? 'Müşteri' : 'Tedarikçi'})
              </option>
            ))}
          </select>
        </div>

        {selectedCariId && (
          <>
            <div className="form-group">
              <label>Başlangıç Tarihi</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Bitiş Tarihi</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            {(startDate || endDate) && (
              <button 
                className="btn-secondary"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                style={{ marginTop: '26px' }}
              >
                Filtreyi Temizle
              </button>
            )}
          </>
        )}
      </div>

      {/* Cari Özet */}
      {selectedCari && ozet && (
        <>
          <div className="cari-bilgi-card">
            <div className="cari-header">
              <div>
                <h2>{selectedCari.unvan}</h2>
                <p className="cari-tip">
                  {selectedCari.tip === 'musteri' ? '👤 Müşteri' : '🏢 Tedarikçi'}
                </p>
              </div>
              <div className="cari-iletisim">
                {selectedCari.telefon && <p>📞 {selectedCari.telefon}</p>}
                {selectedCari.email && <p>✉️ {selectedCari.email}</p>}
                {selectedCari.vergiNo && <p>🆔 {selectedCari.vergiNo}</p>}
              </div>
            </div>
          </div>

          <div className="ekstre-stats">
            <div className="ekstre-stat-card">
              <div className="stat-icon satis">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="stat-label">Toplam Satış</p>
                <p className="stat-value">{ozet.toplamSatis.toFixed(2)} ₺</p>
              </div>
            </div>

            <div className="ekstre-stat-card">
              <div className="stat-icon alis">
                <TrendingDown size={24} />
              </div>
              <div>
                <p className="stat-label">Toplam Alış</p>
                <p className="stat-value">{ozet.toplamAlis.toFixed(2)} ₺</p>
              </div>
            </div>

            <div className="ekstre-stat-card">
              <div className="stat-icon odenen">
                <FileText size={24} />
              </div>
              <div>
                <p className="stat-label">Ödenen</p>
                <p className="stat-value">{ozet.toplamOdenen.toFixed(2)} ₺</p>
              </div>
            </div>

            <div className="ekstre-stat-card">
              <div className={`stat-icon ${ozet.toplamBorc > 0 ? 'borc' : 'tamam'}`}>
                <TrendingDown size={24} />
              </div>
              <div>
                <p className="stat-label">Kalan Borç</p>
                <p className={`stat-value ${ozet.toplamBorc > 0 ? 'borc-text' : ''}`}>
                  {ozet.toplamBorc.toFixed(2)} ₺
                </p>
              </div>
            </div>

            <div className="ekstre-stat-card bakiye-card">
              <div className={`stat-icon ${ozet.bakiye >= 0 ? 'satis' : 'alis'}`}>
                {ozet.bakiye >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
              </div>
              <div>
                <p className="stat-label">Bakiye</p>
                <p className={`stat-value ${ozet.bakiye >= 0 ? 'pozitif' : 'negatif'}`}>
                  {ozet.bakiye >= 0 ? '+' : ''}{ozet.bakiye.toFixed(2)} ₺
                </p>
              </div>
            </div>
          </div>

          {/* Fatura Listesi */}
          {cariFaturalar.length > 0 ? (
            <div className="ekstre-table-section">
              <h3>Fatura Hareketleri ({ozet.faturaSayisi} Adet)</h3>
              <div className="table-container">
                <table className="ekstre-table">
                  <thead>
                    <tr>
                      <th>Fatura No</th>
                      <th>Tarih</th>
                      <th>Tip</th>
                      <th>Tutar</th>
                      <th>KDV</th>
                      <th>Genel Toplam</th>
                      <th>Vade</th>
                      <th>Ödenen</th>
                      <th>Kalan</th>
                      <th>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cariFaturalar.map(fatura => {
                      const kalan = fatura.genelToplam - (fatura.odenenTutar || 0);
                      const bugun = new Date().toISOString().split('T')[0];
                      const vadeGecti = fatura.vadeTarihi && fatura.vadeTarihi < bugun && fatura.odemeDurumu !== 'tamam';

                      return (
                        <tr key={fatura.id} className={vadeGecti ? 'vade-gecmis-row' : ''}>
                          <td><strong>{fatura.faturaNo}</strong></td>
                          <td>{fatura.tarih}</td>
                          <td>
                            <span className={`mini-badge ${fatura.faturaTipi}`}>
                              {fatura.faturaTipi === 'satis' ? 'Satış' : 'Alış'}
                            </span>
                          </td>
                          <td>{fatura.tutar.toFixed(2)} ₺</td>
                          <td>{fatura.kdvToplam.toFixed(2)} ₺</td>
                          <td><strong>{fatura.genelToplam.toFixed(2)} ₺</strong></td>
                          <td>
                            {fatura.vadeTarihi && fatura.vadeTarihi !== fatura.tarih ? (
                              <span className={vadeGecti ? 'vade-gecmis-text' : ''}>
                                {fatura.vadeTarihi}
                              </span>
                            ) : (
                              <span style={{ color: '#2ecc71' }}>Peşin</span>
                            )}
                          </td>
                          <td>{(fatura.odenenTutar || 0).toFixed(2)} ₺</td>
                          <td>
                            <strong className={kalan > 0 ? 'kalan-text' : ''}>
                              {kalan.toFixed(2)} ₺
                            </strong>
                          </td>
                          <td>
                            <span className={`durum-badge ${fatura.odemeDurumu}`}>
                              {fatura.odemeDurumu === 'tamam' ? '✓' : 
                               fatura.odemeDurumu === 'kismi' ? '◐' : '○'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <FileText size={48} color="#ccc" />
              <h3>Fatura Bulunamadı</h3>
              <p>Seçilen cari için {startDate || endDate ? 'bu tarih aralığında' : ''} fatura kaydı bulunmamaktadır.</p>
            </div>
          )}
        </>
      )}

      {/* Cari Seçilmemiş */}
      {!selectedCari && (
        <div className="empty-state">
          <FileText size={64} color="#ccc" />
          <h3>Cari Hesap Ekstresi</h3>
          <p>Yukarıdan bir cari seçerek hesap ekstresini görüntüleyebilirsiniz.</p>
        </div>
      )}
    </div>
  );
};

export default CariEkstre;