import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Trash2, X, ShoppingCart, FileText, Printer, Download, DollarSign } from 'lucide-react';
import { showSuccess, showError, showWarning } from '../utils/toast';
import ConfirmDialog from '../components/ConfirmDialog';
import { storage } from '../utils/storage';
import { exportFaturaToExcel, exportFaturaToPDF, printFaturaPDF } from '../utils/exportUtils';
import '../styles/Fatura.css';

const Fatura = () => {
  const [faturaList, setFaturaList] = useState([]);
  const [cariList, setCariList] = useState([]);
  const [stokList, setStokList] = useState([]);
  const [firmaData, setFirmaData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFatura, setSelectedFatura] = useState(null);
  const [selectedPaymentFatura, setSelectedPaymentFatura] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tumu');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const [formData, setFormData] = useState({
    faturaNo: '',
    faturaTipi: 'satis',
    cariId: '',
    tarih: new Date().toISOString().split('T')[0],
    vadeTarihi: '',
    odemeDurumu: 'beklemede',
    odenenTutar: 0,
    aciklama: '',
    urunler: []
  });

  const [currentUrun, setCurrentUrun] = useState({
    urunId: '',
    miktar: '1',
    birimFiyat: '',
    kdvOran: '20'
  });

  useEffect(() => {
    const savedFatura = storage.get('faturaList');
    const savedCari = storage.get('cariList');
    const savedStok = storage.get('stokList');
    const savedFirma = storage.get('firmaData');
    
    if (savedFatura) setFaturaList(savedFatura);
    if (savedCari) setCariList(savedCari);
    if (savedStok) setStokList(savedStok);
    if (savedFirma) setFirmaData(savedFirma);

    document.title = 'Fatura İşlemleri - Luka Muhasebe';
  }, []);

  useEffect(() => {
    if (faturaList.length > 0) {
      storage.save('faturaList', faturaList);
    }
  }, [faturaList]);

  const generateFaturaNo = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000);
    return `${year}${month}${random}`;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUrunChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'urunId') {
      const selectedStok = stokList.find(s => s.id === parseInt(value));
      if (selectedStok) {
        setCurrentUrun({
          ...currentUrun,
          urunId: value,
          birimFiyat: formData.faturaTipi === 'satis' 
            ? selectedStok.satisFiyat 
            : selectedStok.alisFiyat
        });
      }
    } else {
      setCurrentUrun({
        ...currentUrun,
        [name]: value
      });
    }
  };

  const addUrunToFatura = () => {
    if (!currentUrun.urunId || !currentUrun.miktar || !currentUrun.birimFiyat) {
      showWarning('Lütfen tüm alanları doldurun!');
      return;
    }

    const selectedStok = stokList.find(s => s.id === parseInt(currentUrun.urunId));
    const miktar = parseFloat(currentUrun.miktar);
    const birimFiyat = parseFloat(currentUrun.birimFiyat);
    const kdvOran = parseFloat(currentUrun.kdvOran);
    
    const tutar = miktar * birimFiyat;
    const kdvTutar = tutar * (kdvOran / 100);
    const genelToplam = tutar + kdvTutar;

    const yeniUrun = {
      id: Date.now(),
      urunId: currentUrun.urunId,
      urunAdi: selectedStok.urunAdi,
      urunKodu: selectedStok.urunKodu,
      birim: selectedStok.birim,
      miktar,
      birimFiyat,
      kdvOran,
      tutar,
      kdvTutar,
      genelToplam
    };

    setFormData({
      ...formData,
      urunler: [...formData.urunler, yeniUrun]
    });

    setCurrentUrun({
      urunId: '',
      miktar: '1',
      birimFiyat: '',
      kdvOran: '20'
    });
  };

  const removeUrunFromFatura = (urunId) => {
    setFormData({
      ...formData,
      urunler: formData.urunler.filter(u => u.id !== urunId)
    });
  };

  const calculateTotals = () => {
    const tutar = formData.urunler.reduce((sum, u) => sum + u.tutar, 0);
    const kdvToplam = formData.urunler.reduce((sum, u) => sum + u.kdvTutar, 0);
    const genelToplam = formData.urunler.reduce((sum, u) => sum + u.genelToplam, 0);
    
    return { tutar, kdvToplam, genelToplam };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.urunler.length === 0) {
      showWarning('Lütfen en az bir ürün ekleyin!');
      return;
    }

    const totals = calculateTotals();
    const selectedCari = cariList.find(c => c.id === parseInt(formData.cariId));

    const newFatura = {
      id: Date.now(),
      faturaNo: formData.faturaNo || generateFaturaNo(),
      faturaTipi: formData.faturaTipi,
      cariId: formData.cariId,
      cariUnvan: selectedCari ? selectedCari.unvan : '',
      tarih: formData.tarih,
      vadeTarihi: formData.vadeTarihi || formData.tarih,
      odemeDurumu: formData.vadeTarihi ? 'beklemede' : 'tamam',
      odenenTutar: formData.vadeTarihi ? 0 : totals.genelToplam,
      aciklama: formData.aciklama,
      urunler: formData.urunler,
      tutar: totals.tutar,
      kdvToplam: totals.kdvToplam,
      genelToplam: totals.genelToplam,
      olusturmaTarihi: new Date().toLocaleDateString('tr-TR')
    };

    setFaturaList([...faturaList, newFatura]);
    updateStok(newFatura);
    showSuccess('Fatura başarıyla kaydedildi!');
    resetForm();
  };

  const updateStok = (fatura) => {
    const updatedStokList = stokList.map(stok => {
      const faturaUrun = fatura.urunler.find(u => u.urunId === String(stok.id));
      
      if (faturaUrun) {
        const yeniMiktar = fatura.faturaTipi === 'satis'
          ? parseFloat(stok.stokMiktar) - faturaUrun.miktar
          : parseFloat(stok.stokMiktar) + faturaUrun.miktar;
        
        return {
          ...stok,
          stokMiktar: String(Math.max(0, yeniMiktar))
        };
      }
      
      return stok;
    });
    
    setStokList(updatedStokList);
    storage.save('stokList', updatedStokList);
  };

  const resetForm = () => {
    setFormData({
      faturaNo: '',
      faturaTipi: 'satis',
      cariId: '',
      tarih: new Date().toISOString().split('T')[0],
      vadeTarihi: '',
      odemeDurumu: 'beklemede',
      odenenTutar: 0,
      aciklama: '',
      urunler: []
    });
    setCurrentUrun({
      urunId: '',
      miktar: '1',
      birimFiyat: '',
      kdvOran: '20'
    });
    setShowModal(false);
  };

  const handleDelete = (id) => {
  setDeleteId(id);
  setShowConfirm(true);
};

const confirmDelete = () => {
  setFaturaList(faturaList.filter(f => f.id !== deleteId));
  showSuccess('Fatura silindi!');
  setShowConfirm(false);
  setDeleteId(null);
};

const cancelDelete = () => {
  setShowConfirm(false);
  setDeleteId(null);
};

  const viewFatura = (fatura) => {
    setSelectedFatura(fatura);
    setShowDetailModal(true);
  };

  const openPaymentModal = (fatura) => {
    setSelectedPaymentFatura(fatura);
    const kalanBorc = fatura.genelToplam - (fatura.odenenTutar || 0);
    setPaymentAmount(kalanBorc.toFixed(2));
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    if (!selectedPaymentFatura || !paymentAmount) return;

    const odemeMiktari = parseFloat(paymentAmount);
    const kalanBorc = selectedPaymentFatura.genelToplam - (selectedPaymentFatura.odenenTutar || 0);

    if (odemeMiktari <= 0) {
  showError('Ödeme miktarı 0\'dan büyük olmalı!');
  return;
}

if (odemeMiktari > kalanBorc) {
  showError('Ödeme miktarı kalan borçtan fazla olamaz!');
  return;
}

    const yeniOdenenTutar = (selectedPaymentFatura.odenenTutar || 0) + odemeMiktari;
    let yeniOdemeDurumu = 'kismi';

    if (yeniOdenenTutar >= selectedPaymentFatura.genelToplam) {
      yeniOdemeDurumu = 'tamam';
    }

    const updatedFaturaList = faturaList.map(f =>
      f.id === selectedPaymentFatura.id
        ? {
            ...f,
            odenenTutar: yeniOdenenTutar,
            odemeDurumu: yeniOdemeDurumu
          }
        : f
    );

    setFaturaList(updatedFaturaList);
    storage.save('faturaList', updatedFaturaList);
    setShowPaymentModal(false);
    setSelectedPaymentFatura(null);
    setPaymentAmount('');

    showSuccess(`${odemeMiktari.toFixed(2)} ₺ ödeme kaydedildi!`);
  };

  const filteredFatura = faturaList.filter(fatura => {
    const matchesSearch = fatura.faturaNo.includes(searchTerm) ||
                         fatura.cariUnvan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'tumu' || fatura.faturaTipi === filterType;
    return matchesSearch && matchesType;
  });

  const stats = {
    toplam: faturaList.length,
    satis: faturaList.filter(f => f.faturaTipi === 'satis').length,
    alis: faturaList.filter(f => f.faturaTipi === 'alis').length,
    satisTop: faturaList.filter(f => f.faturaTipi === 'satis').reduce((sum, f) => sum + f.genelToplam, 0),
    alisTop: faturaList.filter(f => f.faturaTipi === 'alis').reduce((sum, f) => sum + f.genelToplam, 0)
  };

  const totals = formData.urunler.length > 0 ? calculateTotals() : { tutar: 0, kdvToplam: 0, genelToplam: 0 };
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Fatura İşlemleri</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn-secondary" 
            onClick={() => {
              if (exportFaturaToExcel(faturaList)) {
                showSuccess('Fatura listesi Excel\'e aktarıldı!');
              } else {
                showError('Excel aktarımı başarısız!');
            }
          }}
            disabled={faturaList.length === 0}
          >
            <FileText size={20} />
            Excel'e Aktar
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            Yeni Fatura Kes
          </button>
        </div>
      </div>

      <div className="fatura-stats">
        <div className="stat-item">
          <div className="stat-label">Toplam Fatura</div>
          <div className="stat-value">{stats.toplam}</div>
        </div>
        <div className="stat-item satis">
          <div className="stat-label">Satış Faturaları</div>
          <div className="stat-value">{stats.satis} / {stats.satisTop.toFixed(2)} ₺</div>
        </div>
        <div className="stat-item alis">
          <div className="stat-label">Alış Faturaları</div>
          <div className="stat-value">{stats.alis} / {stats.alisTop.toFixed(2)} ₺</div>
        </div>
        <div className="stat-item kar">
          <div className="stat-label">Net Fark</div>
          <div className="stat-value">{(stats.satisTop - stats.alisTop).toFixed(2)} ₺</div>
        </div>
      </div>

      <div className="filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Fatura no veya cari ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-buttons">
          <button 
            className={filterType === 'tumu' ? 'active' : ''} 
            onClick={() => setFilterType('tumu')}
          >
            Tümü ({stats.toplam})
          </button>
          <button 
            className={filterType === 'satis' ? 'active satis-btn' : 'satis-btn'} 
            onClick={() => setFilterType('satis')}
          >
            Satış ({stats.satis})
          </button>
          <button 
            className={filterType === 'alis' ? 'active alis-btn' : 'alis-btn'} 
            onClick={() => setFilterType('alis')}
          >
            Alış ({stats.alis})
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fatura No</th>
              <th>Tip</th>
              <th>Cari</th>
              <th>Tarih</th>
              <th>Vade</th>
              <th>Genel Toplam</th>
              <th>Ödeme Durumu</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredFatura.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                  {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz fatura kaydı yok'}
                </td>
              </tr>
            ) : (
              filteredFatura.map(fatura => {
                const bugun = new Date().toISOString().split('T')[0];
                const vadeDurumu = fatura.vadeTarihi && fatura.vadeTarihi < bugun && fatura.odemeDurumu !== 'tamam' ? 'gecmis' : '';
                
                return (
                  <tr key={fatura.id} className={vadeDurumu}>
                    <td><strong>{fatura.faturaNo}</strong></td>
                    <td>
                      <span className={`badge ${fatura.faturaTipi}`}>
                        {fatura.faturaTipi === 'satis' ? 'Satış' : 'Alış'}
                      </span>
                    </td>
                    <td>{fatura.cariUnvan}</td>
                    <td>{fatura.tarih}</td>
                    <td>
                      {fatura.vadeTarihi && fatura.vadeTarihi !== fatura.tarih ? (
                        <span className={vadeDurumu === 'gecmis' ? 'vade-gecmis' : ''}>
                          {fatura.vadeTarihi}
                        </span>
                      ) : (
                        <span style={{ color: '#2ecc71' }}>Peşin</span>
                      )}
                    </td>
                    <td><strong>{fatura.genelToplam.toFixed(2)} ₺</strong></td>
                    <td>
                      <span className={`odeme-badge ${fatura.odemeDurumu}`}>
                        {fatura.odemeDurumu === 'tamam' ? '✓ Ödendi' : 
                         fatura.odemeDurumu === 'kismi' ? '◐ Kısmi' : 
                         '○ Bekliyor'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {fatura.odemeDurumu !== 'tamam' && fatura.vadeTarihi && fatura.vadeTarihi !== fatura.tarih && (
                          <button 
                            className="btn-edit" 
                            onClick={() => openPaymentModal(fatura)}
                            title="Ödeme Kaydet"
                          >
                            <DollarSign size={16} />
                          </button>
                        )}
                        <button className="btn-view" onClick={() => viewFatura(fatura)}>
                          <Eye size={16} />
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(fatura.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Yeni Fatura Kes</h2>
              <button className="btn-close" onClick={resetForm}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="fatura-form-header">
                <div className="form-group">
                  <label>Fatura No</label>
                  <input
                    type="text"
                    name="faturaNo"
                    value={formData.faturaNo}
                    onChange={handleInputChange}
                    placeholder="Otomatik oluşturulacak"
                  />
                </div>

                <div className="form-group">
                  <label>Fatura Tipi *</label>
                  <select
                    name="faturaTipi"
                    value={formData.faturaTipi}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="satis">Satış Faturası</option>
                    <option value="alis">Alış Faturası</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Cari Seçin *</label>
                  <select
                    name="cariId"
                    value={formData.cariId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seçiniz...</option>
                    {cariList.map(cari => (
                      <option key={cari.id} value={cari.id}>
                        {cari.unvan} ({cari.tip === 'musteri' ? 'Müşteri' : 'Tedarikçi'})
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

                <div className="form-group">
                  <label>Vade Tarihi (Opsiyonel)</label>
                  <input
                    type="date"
                    name="vadeTarihi"
                    value={formData.vadeTarihi}
                    onChange={handleInputChange}
                    min={formData.tarih}
                  />
                  <small style={{ fontSize: '11px', color: '#666', marginTop: '5px', display: 'block' }}>
                    Boş bırakılırsa peşin kabul edilir
                  </small>
                </div>
              </div>

              <div className="urun-ekleme-section">
                <h3><ShoppingCart size={20} /> Ürün Ekle</h3>
                
                <div className="urun-form">
                  <select
                    name="urunId"
                    value={currentUrun.urunId}
                    onChange={handleUrunChange}
                  >
                    <option value="">Ürün Seçin...</option>
                    {stokList.map(stok => (
                      <option key={stok.id} value={stok.id}>
                        {stok.urunAdi} ({stok.urunKodu}) - Stok: {stok.stokMiktar}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    name="miktar"
                    value={currentUrun.miktar}
                    onChange={handleUrunChange}
                    placeholder="Miktar"
                    step="0.01"
                    min="0.01"
                  />

                  <input
                    type="number"
                    name="birimFiyat"
                    value={currentUrun.birimFiyat}
                    onChange={handleUrunChange}
                    placeholder="Birim Fiyat"
                    step="0.01"
                    min="0"
                  />

                  <select
                    name="kdvOran"
                    value={currentUrun.kdvOran}
                    onChange={handleUrunChange}
                  >
                    <option value="0">%0 KDV</option>
                    <option value="1">%1 KDV</option>
                    <option value="10">%10 KDV</option>
                    <option value="20">%20 KDV</option>
                  </select>

                  <button 
                    type="button" 
                    className="btn-add-urun"
                    onClick={addUrunToFatura}
                  >
                    <Plus size={18} /> Ekle
                  </button>
                </div>
              </div>

              {formData.urunler.length > 0 && (
                <div className="urun-list-section">
                  <table className="urun-table">
                    <thead>
                      <tr>
                        <th>Ürün</th>
                        <th>Miktar</th>
                        <th>Birim Fiyat</th>
                        <th>KDV %</th>
                        <th>Tutar</th>
                        <th>KDV</th>
                        <th>Toplam</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.urunler.map(urun => (
                        <tr key={urun.id}>
                          <td>{urun.urunAdi}</td>
                          <td>{urun.miktar} {urun.birim}</td>
                          <td>{urun.birimFiyat.toFixed(2)} ₺</td>
                          <td>%{urun.kdvOran}</td>
                          <td>{urun.tutar.toFixed(2)} ₺</td>
                          <td>{urun.kdvTutar.toFixed(2)} ₺</td>
                          <td><strong>{urun.genelToplam.toFixed(2)} ₺</strong></td>
                          <td>
                            <button 
                              type="button"
                              className="btn-remove-urun"
                              onClick={() => removeUrunFromFatura(urun.id)}
                            >
                              <X size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'right' }}><strong>Ara Toplam:</strong></td>
                        <td><strong>{totals.tutar.toFixed(2)} ₺</strong></td>
                        <td><strong>{totals.kdvToplam.toFixed(2)} ₺</strong></td>
                        <td><strong>{totals.genelToplam.toFixed(2)} ₺</strong></td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              <div className="form-group full-width">
                <label>Açıklama</label>
                <textarea
                  name="aciklama"
                  value={formData.aciklama}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Fatura ile ilgili notlar..."
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  İptal
                </button>
                <button type="submit" className="btn-primary">
                  <FileText size={18} />
                  Faturayı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && selectedFatura && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Fatura Detayı</h2>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                  className="btn-pdf"
                  onClick={() => {
                    if (exportFaturaToPDF(selectedFatura, firmaData)) {
                      showSuccess('PDF dosyası indirildi!');
                    }
                  }}
                  title="PDF İndir"
                >
                  <Download size={18} />
                  PDF İndir
                </button>
                <button 
                  className="btn-print"
                  onClick={() => {
                    printFaturaPDF(selectedFatura, firmaData);
                  }}
                  title="Yazdır"
                >
                  <Printer size={18} />
                  Yazdır
                </button>
                <button className="btn-close" onClick={() => setShowDetailModal(false)}>
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="fatura-detail">
              <div className="detail-header">
                <div>
                  <h3>{selectedFatura.faturaTipi === 'satis' ? 'SATIŞ FATURASI' : 'ALIŞ FATURASI'}</h3>
                  <p>Fatura No: <strong>{selectedFatura.faturaNo}</strong></p>
                  <p>Tarih: {selectedFatura.tarih}</p>
                  {selectedFatura.vadeTarihi && selectedFatura.vadeTarihi !== selectedFatura.tarih && (
                    <p>Vade: <strong>{selectedFatura.vadeTarihi}</strong></p>
                  )}
                </div>
                <div>
                  <p><strong>Cari:</strong></p>
                  <p>{selectedFatura.cariUnvan}</p>
                </div>
              </div>

              <table className="detail-table">
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th>Miktar</th>
                    <th>Birim Fiyat</th>
                    <th>Tutar</th>
                    <th>KDV</th>
                    <th>Toplam</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedFatura.urunler.map(urun => (
                    <tr key={urun.id}>
                      <td>{urun.urunAdi}</td>
                      <td>{urun.miktar} {urun.birim}</td>
                      <td>{urun.birimFiyat.toFixed(2)} ₺</td>
                      <td>{urun.tutar.toFixed(2)} ₺</td>
                      <td>%{urun.kdvOran} ({urun.kdvTutar.toFixed(2)} ₺)</td>
                      <td><strong>{urun.genelToplam.toFixed(2)} ₺</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="detail-totals">
                <div className="total-row">
                  <span>Ara Toplam:</span>
                  <strong>{selectedFatura.tutar.toFixed(2)} ₺</strong>
                </div>
                <div className="total-row">
                  <span>KDV Toplamı:</span>
                  <strong>{selectedFatura.kdvToplam.toFixed(2)} ₺</strong>
                </div>
                <div className="total-row grand">
                  <span>GENEL TOPLAM:</span>
                  <strong>{selectedFatura.genelToplam.toFixed(2)} ₺</strong>
                </div>
              </div>

              {selectedFatura.aciklama && (
                <div className="detail-note">
                  <strong>Açıklama:</strong>
                  <p>{selectedFatura.aciklama}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && selectedPaymentFatura && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="odeme-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '20px' }}>Ödeme Kaydet</h2>
            
            <div className="odeme-info">
              <div className="odeme-info-row">
                <span>Fatura No:</span>
                <strong>{selectedPaymentFatura.faturaNo}</strong>
              </div>
              <div className="odeme-info-row">
                <span>Cari:</span>
                <strong>{selectedPaymentFatura.cariUnvan}</strong>
              </div>
              <div className="odeme-info-row">
                <span>Fatura Tutarı:</span>
                <strong>{selectedPaymentFatura.genelToplam.toFixed(2)} ₺</strong>
              </div>
              <div className="odeme-info-row">
                <span>Ödenen:</span>
                <strong>{(selectedPaymentFatura.odenenTutar || 0).toFixed(2)} ₺</strong>
              </div>
              <div className="odeme-info-row">
                <span>Kalan Borç:</span>
                <strong style={{ color: '#e74c3c' }}>
                  {(selectedPaymentFatura.genelToplam - (selectedPaymentFatura.odenenTutar || 0)).toFixed(2)} ₺
                </strong>
              </div>
            </div>

            <div className="odeme-form">
              <label>Ödeme Miktarı (₺)</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                max={(selectedPaymentFatura.genelToplam - (selectedPaymentFatura.odenenTutar || 0)).toFixed(2)}
              />
            </div>

            <div className="odeme-buttons">
              <button 
                className="btn-secondary" 
                onClick={() => setShowPaymentModal(false)}
              >
                İptal
              </button>
              <button 
                className="btn-odeme" 
                onClick={handlePayment}
                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
              >
                <DollarSign size={18} />
                Ödeme Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
  show={showConfirm}
  title="Faturayı Sil"
  message="Bu faturayı silmek istediğinize emin misiniz? ⚠️ DİKKAT: Stok miktarları geri alınmayacak!"
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
  type="danger"
/>
    </div>
  );
};

export default Fatura;