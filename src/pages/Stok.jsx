import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, AlertTriangle, FileText } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import { exportStokToExcel } from '../utils/exportUtils';
import { showSuccess, showError, showWarning } from '../utils/toast';
import { storage } from '../utils/storage';
import '../styles/Stok.css';

const Stok = () => {
  const [stokList, setStokList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStok, setEditingStok] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tumu');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const [formData, setFormData] = useState({
    urunAdi: '',
    urunKodu: '',
    birim: 'adet',
    alisFiyat: '',
    satisFiyat: '',
    stokMiktar: '',
    kritikStok: '10',
    aciklama: ''
  });

  // LocalStorage'dan verileri yükle
  useEffect(() => {
    const savedStok = storage.get('stokList');
    if (savedStok) {
      setStokList(savedStok);
    }
    document.title = 'Stok Yönetimi - Hira Muhasebe';
  }, []);

  // Veri değiştiğinde kaydet
  useEffect(() => {
    if (stokList.length > 0) {
      storage.save('stokList', stokList);
    }
  }, [stokList]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingStok) {
      // Güncelleme
      setStokList(stokList.map(stok => 
        stok.id === editingStok.id 
          ? { ...formData, id: editingStok.id } 
          : stok
      ));
    } else {
      // Yeni ekleme
      const newStok = {
        ...formData,
        id: Date.now(),
        tarih: new Date().toLocaleDateString('tr-TR')
      };
      setStokList([...stokList, newStok]);
    }
    showSuccess(editingStok ? 'Ürün başarıyla güncellendi!' : 'Yeni ürün eklendi!');
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      urunAdi: '',
      urunKodu: '',
      birim: 'adet',
      alisFiyat: '',
      satisFiyat: '',
      stokMiktar: '',
      kritikStok: '10',
      aciklama: ''
    });
    setShowModal(false);
    setEditingStok(null);
  };

  const handleEdit = (stok) => {
    setEditingStok(stok);
    setFormData(stok);
    setShowModal(true);
  };

  const handleDelete = (id) => {
  setDeleteId(id);
  setShowConfirm(true);
};

const confirmDelete = () => {
  setStokList(stokList.filter(stok => stok.id !== deleteId));
  showSuccess('Ürün silindi!');
  setShowConfirm(false);
  setDeleteId(null);
};

const cancelDelete = () => {
  setShowConfirm(false);
  setDeleteId(null);
};

  // Stok durumu kontrolü
  const getStokStatus = (stok) => {
    const miktar = parseFloat(stok.stokMiktar) || 0;
    const kritik = parseFloat(stok.kritikStok) || 10;
    
    if (miktar === 0) return 'tukendi';
    if (miktar <= kritik) return 'kritik';
    return 'normal';
  };

  // Filtreleme
  const filteredStok = stokList.filter(stok => {
    const matchesSearch = stok.urunAdi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stok.urunKodu.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'tumu') return matchesSearch;
    return matchesSearch && getStokStatus(stok) === filterStatus;
  });

  // İstatistikler
  const stats = {
    toplam: stokList.length,
    kritik: stokList.filter(s => getStokStatus(s) === 'kritik').length,
    tukenen: stokList.filter(s => getStokStatus(s) === 'tukendi').length,
    toplamDeger: stokList.reduce((sum, s) => {
      return sum + (parseFloat(s.satisFiyat) || 0) * (parseFloat(s.stokMiktar) || 0);
    }, 0)
  };

  return (
    <div className="page-container">
      <div className="page-header">
  <h1 className="page-title">Stok Yönetimi</h1>
  <div style={{ display: 'flex', gap: '10px' }}>
    <button 
      className="btn-secondary" 
      onClick={() => {
        if (exportStokToExcel(stokList)) {
          showSuccess('Stok listesi Excel\'e aktarıldı!');
        } else {
        showError('Excel aktarımı başarısız!');
        }
      }}
      disabled={stokList.length === 0}
    >
      <FileText size={20} />
      Excel'e Aktar
    </button>
    <button className="btn-primary" onClick={() => setShowModal(true)}>
      <Plus size={20} />
      Yeni Ürün Ekle
    </button>
  </div>
</div>

      {/* İstatistikler */}
      <div className="stok-stats">
        <div className="stat-item">
          <div className="stat-label">Toplam Ürün</div>
          <div className="stat-value">{stats.toplam}</div>
        </div>
        <div className="stat-item kritik">
          <div className="stat-label">Kritik Stok</div>
          <div className="stat-value">{stats.kritik}</div>
        </div>
        <div className="stat-item tukenen">
          <div className="stat-label">Tükenen</div>
          <div className="stat-value">{stats.tukenen}</div>
        </div>
        <div className="stat-item deger">
          <div className="stat-label">Toplam Değer</div>
          <div className="stat-value">{stats.toplamDeger.toFixed(2)} ₺</div>
        </div>
      </div>

      <div className="filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Ürün adı veya kodu ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-buttons">
          <button 
            className={filterStatus === 'tumu' ? 'active' : ''} 
            onClick={() => setFilterStatus('tumu')}
          >
            Tümü ({stokList.length})
          </button>
          <button 
            className={filterStatus === 'normal' ? 'active' : ''} 
            onClick={() => setFilterStatus('normal')}
          >
            Normal Stok
          </button>
          <button 
            className={filterStatus === 'kritik' ? 'active kritik-btn' : 'kritik-btn'} 
            onClick={() => setFilterStatus('kritik')}
          >
            Kritik ({stats.kritik})
          </button>
          <button 
            className={filterStatus === 'tukendi' ? 'active tukenen-btn' : 'tukenen-btn'} 
            onClick={() => setFilterStatus('tukendi')}
          >
            Tükenen ({stats.tukenen})
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Ürün Kodu</th>
              <th>Ürün Adı</th>
              <th>Birim</th>
              <th>Alış Fiyat</th>
              <th>Satış Fiyat</th>
              <th>Stok Miktar</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredStok.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                  {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz ürün kaydı yok'}
                </td>
              </tr>
            ) : (
              filteredStok.map(stok => {
                const status = getStokStatus(stok);
                return (
                  <tr key={stok.id} className={status}>
                    <td><strong>{stok.urunKodu}</strong></td>
                    <td>{stok.urunAdi}</td>
                    <td>{stok.birim}</td>
                    <td>{parseFloat(stok.alisFiyat).toFixed(2)} ₺</td>
                    <td>{parseFloat(stok.satisFiyat).toFixed(2)} ₺</td>
                    <td>
                      <strong>{stok.stokMiktar}</strong> {stok.birim}
                    </td>
                    <td>
                      <span className={`stok-badge ${status}`}>
                        {status === 'tukendi' && <AlertTriangle size={14} />}
                        {status === 'kritik' && <AlertTriangle size={14} />}
                        {status === 'tukendi' ? 'Tükendi' : 
                         status === 'kritik' ? 'Kritik Seviye' : 'Normal'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit" onClick={() => handleEdit(stok)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(stok.id)}>
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingStok ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h2>
              <button className="btn-close" onClick={resetForm}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Ürün Adı *</label>
                  <input
                    type="text"
                    name="urunAdi"
                    value={formData.urunAdi}
                    onChange={handleInputChange}
                    required
                    placeholder="Ürün adını giriniz"
                  />
                </div>

                <div className="form-group">
                  <label>Ürün Kodu *</label>
                  <input
                    type="text"
                    name="urunKodu"
                    value={formData.urunKodu}
                    onChange={handleInputChange}
                    required
                    placeholder="Örn: URN001"
                  />
                </div>

                <div className="form-group">
                  <label>Birim *</label>
                  <select
                    name="birim"
                    value={formData.birim}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="adet">Adet</option>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="lt">Litre (lt)</option>
                    <option value="m">Metre (m)</option>
                    <option value="m2">Metrekare (m²)</option>
                    <option value="paket">Paket</option>
                    <option value="koli">Koli</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Alış Fiyatı (₺) *</label>
                  <input
                    type="number"
                    name="alisFiyat"
                    value={formData.alisFiyat}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Satış Fiyatı (₺) *</label>
                  <input
                    type="number"
                    name="satisFiyat"
                    value={formData.satisFiyat}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Stok Miktarı *</label>
                  <input
                    type="number"
                    name="stokMiktar"
                    value={formData.stokMiktar}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Kritik Stok Seviyesi</label>
                  <input
                    type="number"
                    name="kritikStok"
                    value={formData.kritikStok}
                    onChange={handleInputChange}
                    step="1"
                    min="0"
                    placeholder="10"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Açıklama</label>
                  <textarea
                    name="aciklama"
                    value={formData.aciklama}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Ürün hakkında ek bilgi..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  İptal
                </button>
                <button type="submit" className="btn-primary">
                  {editingStok ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmDialog
        show={showConfirm}
        title="Ürünü Sil"
        message="Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        type="danger"
      />
    </div>
  );
};

export default Stok;