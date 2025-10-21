import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, FileText } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import { validateTaxNumber, validatePhone, validateEmail, validateRequired } from '../utils/validation';
import { showSuccess, showError, showWarning } from '../utils/toast';
import { exportCariToExcel } from '../utils/exportUtils';
import { storage } from '../utils/storage';
import Loading from '../components/Loading';
import { useKeyboard } from '../utils/useKeyboard';
import '../styles/Cari.css';

const Cari = () => {
  const [loading, setLoading] = useState(true);
  const [cariList, setCariList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCari, setEditingCari] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tumu');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    unvan: '',
    tip: 'musteri',
    vergiNo: '',
    telefon: '',
    email: '',
    adres: '',
    yetkili: ''
  });

  // Keyboard shortcuts
  useKeyboard({
    altN: () => {
      if (!showModal) {
        setShowModal(true);
      }
    },
    escape: () => {
      if (showModal) {
        resetForm();
      }
    },
    ctrlS: () => {
      if (showModal) {
        document.querySelector('form')?.requestSubmit();
      }
    },
    ctrlF: () => {
      document.querySelector('.search-box input')?.focus();
    }
  }, [showModal]);

  // LocalStorage'dan verileri yükle
  useEffect(() => {
    document.title = 'Cari Hesaplar - Luka Muhasebe';
    
    const savedCari = storage.get('cariList');
    if (savedCari) {
      setCariList(savedCari);
    }
    
  // Loading'i kapat
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  // Veri değiştiğinde kaydet
  useEffect(() => {
    if (cariList.length > 0) {
      storage.save('cariList', cariList);
    }
  }, [cariList]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
  // Validasyon kontrolleri
    const newErrors = {};
    
    const unvanValidation = validateRequired(formData.unvan, 'Ünvan');
    if (!unvanValidation.valid) newErrors.unvan = unvanValidation.message;
    
    const vergiValidation = validateTaxNumber(formData.vergiNo);
    if (!vergiValidation.valid) newErrors.vergiNo = vergiValidation.message;
    
    const telefonValidation = validatePhone(formData.telefon);
    if (!telefonValidation.valid) newErrors.telefon = telefonValidation.message;
    
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) newErrors.email = emailValidation.message;
    
    setErrors(newErrors);
    
  // Hata varsa submit etme
    if (Object.keys(newErrors).length > 0) {
      showWarning('Lütfen form hatalarını düzeltin!');
      return;
    }
    
  // Mevcut submit kodu devam eder...
    
    if (editingCari) {
      // Güncelleme
      setCariList(cariList.map(cari => 
        cari.id === editingCari.id 
        ? { ...formData, id: editingCari.id } 
        : cari
        ));
    } else {
      // Yeni ekleme
      const newCari = {
        ...formData,
        id: Date.now(),
        tarih: new Date().toLocaleDateString('tr-TR')
      };
      setCariList([...cariList, newCari]);
    }
    showSuccess(editingCari ? 'Cari başarıyla güncellendi!' : 'Yeni cari eklendi!');
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      unvan: '',
      tip: 'musteri',
      vergiNo: '',
      telefon: '',
      email: '',
      adres: '',
      yetkili: ''
    });
  setErrors({}); // ← BU SATIRI EKLE
  setShowModal(false);
  setEditingCari(null);
};

const handleEdit = (cari) => {
  setEditingCari(cari);
  setFormData(cari);
  setShowModal(true);
};

const handleDelete = (id) => {
  setDeleteId(id);
  setShowConfirm(true);
};

const confirmDelete = () => {
  setCariList(cariList.filter(cari => cari.id !== deleteId));
  showSuccess('Cari silindi!');
  setShowConfirm(false);
  setDeleteId(null);
};

const cancelDelete = () => {
  setShowConfirm(false);
  setDeleteId(null);
};

  // Filtreleme
const filteredCari = cariList.filter(cari => {
  const matchesSearch = cari.unvan.toLowerCase().includes(searchTerm.toLowerCase()) ||
  cari.vergiNo.includes(searchTerm);
  const matchesType = filterType === 'tumu' || cari.tip === filterType;
  return matchesSearch && matchesType;
});

return (
  <div className="page-container">
    <div className="page-header">      
      <div>
        <h1 className="page-title">Cari Hesaplar</h1>
        <p className="keyboard-hint">
          <kbd>Alt+N</kbd> Yeni • <kbd>Ctrl+F</kbd> Ara • <kbd>Esc</kbd> Kapat
        </p>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          className="btn-secondary" 
          onClick={() => {
            if (exportCariToExcel(cariList)) {
              showSuccess('Cari listesi Excel\'e aktarıldı!');
            } else {
              showError('Excel aktarımı başarısız!');
            }
          }}
          disabled={cariList.length === 0}
        > 
          <FileText size={20} />
          Excel'e Aktar
        </button>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Yeni Cari Ekle
        </button>
      </div>
    </div>

    <div className="filters">
      <div className="search-box">
        <Search size={20} />
        <input
          type="text"
          placeholder="Ünvan veya Vergi No ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="filter-buttons">
        <button 
          className={filterType === 'tumu' ? 'active' : ''} 
          onClick={() => setFilterType('tumu')}
        >
          Tümü ({cariList.length})
        </button>
        <button 
          className={filterType === 'musteri' ? 'active' : ''} 
          onClick={() => setFilterType('musteri')}
        >
          Müşteriler ({cariList.filter(c => c.tip === 'musteri').length})
        </button>
        <button 
          className={filterType === 'tedarikci' ? 'active' : ''} 
          onClick={() => setFilterType('tedarikci')}
        >
          Tedarikçiler ({cariList.filter(c => c.tip === 'tedarikci').length})
        </button>
      </div>
      </div> {/* filters kapanışı */}

      {loading ? (
        <Loading message="Cari listesi yükleniyor..." />
        ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ünvan</th>
                <th>Tip</th>
                <th>Vergi No</th>
                <th>Telefon</th>
                <th>Yetkili</th>
                <th>Kayıt Tarihi</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredCari.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz cari kaydı yok'}
                  </td>
                </tr>
                ) : (
                filteredCari.map(cari => (
                  <tr key={cari.id}>
                    <td><strong>{cari.unvan}</strong></td>
                    <td>
                      <span className={`badge ${cari.tip}`}>
                        {cari.tip === 'musteri' ? 'Müşteri' : 'Tedarikçi'}
                      </span>
                    </td>
                    <td>{cari.vergiNo}</td>
                    <td>{cari.telefon}</td>
                    <td>{cari.yetkili}</td>
                    <td>{cari.tarih}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit" onClick={() => handleEdit(cari)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(cari.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          )}      

      {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={resetForm}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingCari ? 'Cari Düzenle' : 'Yeni Cari Ekle'}</h2>
                <button className="btn-close" onClick={resetForm}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Ünvan *</label>
                    <input
                      type="text"
                      name="unvan"
                      value={formData.unvan}
                      onChange={handleInputChange}
                      required
                      placeholder="Firma/Şahıs adı"
                      className={errors.unvan ? 'input-error' : ''}
                    />
                    {errors.unvan && <span className="error-message">{errors.unvan}</span>}
                  </div>

                  <div className="form-group">
                    <label>Tip *</label>
                    <select
                      name="tip"
                      value={formData.tip}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="musteri">Müşteri</option>
                      <option value="tedarikci">Tedarikçi</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Vergi/TC No *</label>
                    <input
                      type="text"
                      name="vergiNo"
                      value={formData.vergiNo}
                      onChange={handleInputChange}
                      required
                      placeholder="10 veya 11 haneli"
                      className={errors.vergiNo ? 'input-error' : ''}
                    />
                    {errors.vergiNo && <span className="error-message">{errors.vergiNo}</span>}
                  </div>

                  <div className="form-group">
                    <label>Telefon</label>
                    <input
                      type="tel"
                      name="telefon"
                      value={formData.telefon}
                      onChange={handleInputChange}
                      placeholder="0555 555 55 55"
                      className={errors.telefon ? 'input-error' : ''}
                    />
                    {errors.telefon && <span className="error-message">{errors.telefon}</span>}
                  </div>

                  <div className="form-group">
                    <label>E-posta</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="ornek@firma.com"
                      className={errors.email ? 'input-error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Yetkili Kişi</label>
                    <input
                      type="text"
                      name="yetkili"
                      value={formData.yetkili}
                      onChange={handleInputChange}
                      placeholder="Ad Soyad"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Adres</label>
                    <textarea
                      name="adres"
                      value={formData.adres}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Tam adres bilgisi"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={resetForm}>
                    İptal
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingCari ? 'Güncelle' : 'Kaydet'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          )}
<ConfirmDialog
  show={showConfirm}
  title="Cariyi Sil"
  message="Bu cariyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
  type="danger"
/>
</div>
);
};

export default Cari;