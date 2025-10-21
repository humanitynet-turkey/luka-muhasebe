import { useState, useEffect } from 'react';
import { Plus, Search, TrendingUp, TrendingDown, X, Wallet, FileText } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import { showSuccess, showError } from '../utils/toast';
import { exportKasaToExcel } from '../utils/exportUtils';
import { storage } from '../utils/storage';
import '../styles/Kasa.css';

const Kasa = () => {
  const [hareketList, setHareketList] = useState([]);
  const [kasaList, setKasaList] = useState([]);
  const [cariList, setCariList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showKasaModal, setShowKasaModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tumu');
  const [selectedKasa, setSelectedKasa] = useState('tumu');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const [formData, setFormData] = useState({
    kasaId: '',
    islemTipi: 'gelir',
    tutar: '',
    aciklama: '',
    cariId: '',
    tarih: new Date().toISOString().split('T')[0],
    kategori: 'diger'
  });

  const [kasaFormData, setKasaFormData] = useState({
    ad: '',
    tip: 'kasa',
    bakiye: '0'
  });

  // Verileri yükle
  useEffect(() => {
    const savedHareket = storage.get('hareketList');
    const savedKasa = storage.get('kasaList');
    const savedCari = storage.get('cariList');
    
    if (savedHareket) setHareketList(savedHareket);
    if (savedCari) setCariList(savedCari);
    
    if (savedKasa && savedKasa.length > 0) {
      setKasaList(savedKasa);
    } else {
      // İlk kullanımda varsayılan kasa oluştur
      const defaultKasa = [
        { id: 1, ad: 'Ana Kasa', tip: 'kasa', bakiye: 0 },
        { id: 2, ad: 'Banka Hesabı', tip: 'banka', bakiye: 0 }
      ];
      setKasaList(defaultKasa);
      storage.save('kasaList', defaultKasa);
    }
    document.title = 'Kasa/Banka - Luka Muhasebe';
  }, []);

  // Verileri kaydet
  useEffect(() => {
    if (hareketList.length > 0) {
      storage.save('hareketList', hareketList);
    }
  }, [hareketList]);

  useEffect(() => {
    if (kasaList.length > 0) {
      storage.save('kasaList', kasaList);
    }
  }, [kasaList]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleKasaInputChange = (e) => {
    setKasaFormData({
      ...kasaFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const tutar = parseFloat(formData.tutar);
    const selectedKasaObj = kasaList.find(k => k.id === parseInt(formData.kasaId));
    const selectedCari = cariList.find(c => c.id === parseInt(formData.cariId));

    const newHareket = {
      id: Date.now(),
      kasaId: formData.kasaId,
      kasaAd: selectedKasaObj ? selectedKasaObj.ad : '',
      islemTipi: formData.islemTipi,
      tutar,
      aciklama: formData.aciklama,
      cariId: formData.cariId || null,
      cariAd: selectedCari ? selectedCari.unvan : '',
      tarih: formData.tarih,
      kategori: formData.kategori,
      olusturmaTarihi: new Date().toLocaleDateString('tr-TR')
    };

    setHareketList([...hareketList, newHareket]);
    
    // Kasa bakiyesini güncelle
    updateKasaBakiye(formData.kasaId, tutar, formData.islemTipi);
    showSuccess('Hareket başarıyla kaydedildi!');
    resetForm();
  };

  const updateKasaBakiye = (kasaId, tutar, islemTipi) => {
    const updatedKasaList = kasaList.map(kasa => {
      if (kasa.id === parseInt(kasaId)) {
        const yeniBakiye = islemTipi === 'gelir'
          ? parseFloat(kasa.bakiye) + tutar
          : parseFloat(kasa.bakiye) - tutar;
        
        return {
          ...kasa,
          bakiye: yeniBakiye
        };
      }
      return kasa;
    });
    
    setKasaList(updatedKasaList);
  };

  const handleKasaSubmit = (e) => {
    e.preventDefault();
    
    const newKasa = {
      id: Date.now(),
      ad: kasaFormData.ad,
      tip: kasaFormData.tip,
      bakiye: parseFloat(kasaFormData.bakiye) || 0
    };

    setKasaList([...kasaList, newKasa]);
    showSuccess('Yeni hesap oluşturuldu!');
    resetKasaForm();
  };

  const resetForm = () => {
    setFormData({
      kasaId: '',
      islemTipi: 'gelir',
      tutar: '',
      aciklama: '',
      cariId: '',
      tarih: new Date().toISOString().split('T')[0],
      kategori: 'diger'
    });
    setShowModal(false);
  };

  const resetKasaForm = () => {
    setKasaFormData({
      ad: '',
      tip: 'kasa',
      bakiye: '0'
    });
    setShowKasaModal(false);
  };

  const handleDelete = (id) => {
  setDeleteId(id);
  setShowConfirm(true);
};

const confirmDelete = () => {
  // Silinecek hareketi bul ve kasa bakiyesini geri al
  const deletedHareket = hareketList.find(h => h.id === deleteId);
  if (deletedHareket) {
    // İşlem tersini yap: gelir ise çıkar, gider ise ekle
    const reverseIslemTipi = deletedHareket.islemTipi === 'gelir' ? 'gider' : 'gelir';
    updateKasaBakiye(deletedHareket.kasaId, deletedHareket.tutar, reverseIslemTipi);
  }

  setHareketList(hareketList.filter(h => h.id !== deleteId));
  showSuccess('Hareket silindi!');
  setShowConfirm(false);
  setDeleteId(null);
};

const cancelDelete = () => {
  setShowConfirm(false);
  setDeleteId(null);
};

  // Filtreleme
  const filteredHareket = hareketList.filter(hareket => {
    const matchesSearch = hareket.aciklama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hareket.cariAd.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'tumu' || hareket.islemTipi === filterType;
    const matchesKasa = selectedKasa === 'tumu' || hareket.kasaId === selectedKasa;
    
    return matchesSearch && matchesType && matchesKasa;
  });

  // İstatistikler
  const stats = {
    toplamGelir: hareketList.filter(h => h.islemTipi === 'gelir').reduce((sum, h) => sum + h.tutar, 0),
    toplamGider: hareketList.filter(h => h.islemTipi === 'gider').reduce((sum, h) => sum + h.tutar, 0),
    toplamBakiye: kasaList.reduce((sum, k) => sum + parseFloat(k.bakiye), 0),
    netDurum: 0
  };
  
  stats.netDurum = stats.toplamGelir - stats.toplamGider;

  const kategoriler = {
    gelir: ['Tahsilat', 'Satış', 'Diğer Gelir'],
    gider: ['Ödeme', 'Alış', 'Personel', 'Kira', 'Fatura', 'Diğer Gider']
  };

  return (
    <div className="page-container">
      <div className="page-header">
  <h1 className="page-title">Kasa/Banka Yönetimi</h1>
  <div style={{ display: 'flex', gap: '10px' }}>
    <button 
      className="btn-secondary" 
      onClick={() => {
        if (exportKasaToExcel(hareketList)) {
  showSuccess('Kasa hareketleri Excel\'e aktarıldı!');
} else {
  showError('Excel aktarımı başarısız!');
}
      }}
      disabled={hareketList.length === 0}
      style={{ background: '#27ae60' }}
    >
      <FileText size={20} />
      Excel'e Aktar
    </button>
    <button className="btn-secondary" onClick={() => setShowKasaModal(true)}>
      <Wallet size={20} />
      Yeni Hesap
    </button>
    <button className="btn-primary" onClick={() => setShowModal(true)}>
      <Plus size={20} />
      Yeni Hareket
    </button>
  </div>
</div>

      {/* Kasa Kartları */}
      <div className="kasa-cards">
        {kasaList.map(kasa => (
          <div key={kasa.id} className={`kasa-card ${kasa.tip}`}>
            <div className="kasa-icon">
              <Wallet size={24} />
            </div>
            <div className="kasa-info">
              <h3>{kasa.ad}</h3>
              <p className="kasa-tip">{kasa.tip === 'kasa' ? 'Kasa' : 'Banka'}</p>
              <p className="kasa-bakiye">{parseFloat(kasa.bakiye).toFixed(2)} ₺</p>
            </div>
          </div>
        ))}
      </div>

      {/* Genel İstatistikler */}
      <div className="kasa-stats">
        <div className="stat-item gelir">
          <TrendingUp size={24} />
          <div>
            <div className="stat-label">Toplam Gelir</div>
            <div className="stat-value">{stats.toplamGelir.toFixed(2)} ₺</div>
          </div>
        </div>
        <div className="stat-item gider">
          <TrendingDown size={24} />
          <div>
            <div className="stat-label">Toplam Gider</div>
            <div className="stat-value">{stats.toplamGider.toFixed(2)} ₺</div>
          </div>
        </div>
        <div className="stat-item bakiye">
          <Wallet size={24} />
          <div>
            <div className="stat-label">Toplam Bakiye</div>
            <div className="stat-value">{stats.toplamBakiye.toFixed(2)} ₺</div>
          </div>
        </div>
        <div className={`stat-item net ${stats.netDurum >= 0 ? 'pozitif' : 'negatif'}`}>
          {stats.netDurum >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
          <div>
            <div className="stat-label">Net Durum</div>
            <div className="stat-value">{stats.netDurum.toFixed(2)} ₺</div>
          </div>
        </div>
      </div>

      <div className="filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Açıklama veya cari ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-row">
          <div className="filter-buttons">
            <button 
              className={filterType === 'tumu' ? 'active' : ''} 
              onClick={() => setFilterType('tumu')}
            >
              Tümü ({hareketList.length})
            </button>
            <button 
              className={filterType === 'gelir' ? 'active gelir-btn' : 'gelir-btn'} 
              onClick={() => setFilterType('gelir')}
            >
              Gelir ({hareketList.filter(h => h.islemTipi === 'gelir').length})
            </button>
            <button 
              className={filterType === 'gider' ? 'active gider-btn' : 'gider-btn'} 
              onClick={() => setFilterType('gider')}
            >
              Gider ({hareketList.filter(h => h.islemTipi === 'gider').length})
            </button>
          </div>

          <select 
            className="kasa-filter"
            value={selectedKasa}
            onChange={(e) => setSelectedKasa(e.target.value)}
          >
            <option value="tumu">Tüm Hesaplar</option>
            {kasaList.map(kasa => (
              <option key={kasa.id} value={kasa.id}>{kasa.ad}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Hesap</th>
              <th>İşlem Tipi</th>
              <th>Kategori</th>
              <th>Cari</th>
              <th>Açıklama</th>
              <th>Tutar</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredHareket.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                  {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz hareket kaydı yok'}
                </td>
              </tr>
            ) : (
              filteredHareket.map(hareket => (
                <tr key={hareket.id}>
                  <td>{hareket.tarih}</td>
                  <td>{hareket.kasaAd}</td>
                  <td>
                    <span className={`badge ${hareket.islemTipi}`}>
                      {hareket.islemTipi === 'gelir' ? (
                        <><TrendingUp size={14} /> Gelir</>
                      ) : (
                        <><TrendingDown size={14} /> Gider</>
                      )}
                    </span>
                  </td>
                  <td>{hareket.kategori}</td>
                  <td>{hareket.cariAd || '-'}</td>
                  <td>{hareket.aciklama}</td>
                  <td>
                    <strong className={hareket.islemTipi === 'gelir' ? 'text-gelir' : 'text-gider'}>
                      {hareket.islemTipi === 'gelir' ? '+' : '-'}{hareket.tutar.toFixed(2)} ₺
                    </strong>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-delete" onClick={() => handleDelete(hareket.id)}>
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Hareket Ekleme Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Yeni Hareket Ekle</h2>
              <button className="btn-close" onClick={resetForm}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Hesap Seç *</label>
                  <select
                    name="kasaId"
                    value={formData.kasaId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seçiniz...</option>
                    {kasaList.map(kasa => (
                      <option key={kasa.id} value={kasa.id}>
                        {kasa.ad} ({parseFloat(kasa.bakiye).toFixed(2)} ₺)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>İşlem Tipi *</label>
                  <select
                    name="islemTipi"
                    value={formData.islemTipi}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="gelir">Gelir</option>
                    <option value="gider">Gider</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Kategori *</label>
                  <select
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seçiniz...</option>
                    <optgroup label="Gelir Kategorileri">
                      {kategoriler.gelir.map(k => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Gider Kategorileri">
                      {kategoriler.gider.map(k => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tutar (₺) *</label>
                  <input
                    type="number"
                    name="tutar"
                    value={formData.tutar}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Cari (Opsiyonel)</label>
                  <select
                    name="cariId"
                    value={formData.cariId}
                    onChange={handleInputChange}
                  >
                    <option value="">Yok</option>
                    {cariList.map(cari => (
                      <option key={cari.id} value={cari.id}>
                        {cari.unvan}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Tarih *</label>
                  <input
                    type="date"
                    name="tarih"
                    value={formData.tarih}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Açıklama *</label>
                  <textarea
                    name="aciklama"
                    value={formData.aciklama}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="İşlem açıklaması..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  İptal
                </button>
                <button type="submit" className="btn-primary">
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Yeni Kasa/Banka Modal */}
      {showKasaModal && (
        <div className="modal-overlay" onClick={resetKasaForm}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Yeni Hesap Ekle</h2>
              <button className="btn-close" onClick={resetKasaForm}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleKasaSubmit}>
              <div className="form-group">
                <label>Hesap Adı *</label>
                <input
                  type="text"
                  name="ad"
                  value={kasaFormData.ad}
                  onChange={handleKasaInputChange}
                  required
                  placeholder="Örn: Ana Kasa, Ziraat Bankası"
                />
              </div>

              <div className="form-group">
                <label>Hesap Tipi *</label>
                <select
                  name="tip"
                  value={kasaFormData.tip}
                  onChange={handleKasaInputChange}
                  required
                >
                  <option value="kasa">Kasa</option>
                  <option value="banka">Banka</option>
                </select>
              </div>

              <div className="form-group">
                <label>Başlangıç Bakiyesi (₺)</label>
                <input
                  type="number"
                  name="bakiye"
                  value={kasaFormData.bakiye}
                  onChange={handleKasaInputChange}
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={resetKasaForm}>
                  İptal
                </button>
                <button type="submit" className="btn-primary">
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmDialog
  show={showConfirm}
  title="Hareketi Sil"
  message="Bu hareketi silmek istediğinize emin misiniz? ⚠️ DİKKAT: Kasa bakiyesi geri alınmayacak!"
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
  type="danger"
/>
    </div>
  );
};

export default Kasa;