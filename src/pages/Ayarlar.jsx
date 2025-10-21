import { useState, useEffect } from 'react';
import { Save, Download, Upload, Trash2, AlertTriangle, Info, Building2, Settings as SettingsIcon } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import { showSuccess, showError, showWarning } from '../utils/toast';
import { storage } from '../utils/storage';
import '../styles/Ayarlar.css';

const Ayarlar = () => {
  const [activeTab, setActiveTab] = useState('firma');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [firmaData, setFirmaData] = useState({
    firmaAdi: '',
    yetkili: '',
    telefon: '',
    email: '',
    adres: '',
    vergiDairesi: '',
    vergiNo: ''
  });

  const [sistemData, setSistemData] = useState({
    varsayilanKdv: '20',
    kritikStokSeviye: '10',
    faturaOtomatikNo: true,
    tarihFormati: 'TR'
  });

  // Firma bilgilerini yükle
  useEffect(() => {
    document.title = 'Ayarlar - Hira Muhasebe';
  }, []);

  useEffect(() => {
    const savedFirma = storage.get('firmaData');
    const savedSistem = storage.get('sistemData');
    
    if (savedFirma) setFirmaData(savedFirma);
    if (savedSistem) setSistemData(savedSistem);
  }, []);

  const handleFirmaChange = (e) => {
    setFirmaData({
      ...firmaData,
      [e.target.name]: e.target.value
    });
  };

  const handleSistemChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSistemData({
      ...sistemData,
      [e.target.name]: value
    });
  };

  const saveFirmaData = () => {
    storage.save('firmaData', firmaData);
    showSuccess('Firma bilgileri kaydedildi!');
  };

  const saveSistemData = () => {
    storage.save('sistemData', sistemData);
    showSuccess('Sistem ayarları kaydedildi!');
  };

  // Yedekleme
  const exportData = () => {
    const allData = {
      cariList: storage.get('cariList') || [],
      stokList: storage.get('stokList') || [],
      faturaList: storage.get('faturaList') || [],
      hareketList: storage.get('hareketList') || [],
      kasaList: storage.get('kasaList') || [],
      firmaData: storage.get('firmaData') || {},
      sistemData: storage.get('sistemData') || {},
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `luka-yedek-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showSuccess('Yedek dosyası indirildi!');
  };

  // Geri Yükleme
  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        if (window.confirm('⚠️ Mevcut tüm veriler silinecek ve yedekten geri yüklenecek. Emin misiniz?')) {
          storage.save('cariList', data.cariList || []);
          storage.save('stokList', data.stokList || []);
          storage.save('faturaList', data.faturaList || []);
          storage.save('hareketList', data.hareketList || []);
          storage.save('kasaList', data.kasaList || []);
          storage.save('firmaData', data.firmaData || {});
          storage.save('sistemData', data.sistemData || {});
          
          showSuccess('Veriler başarıyla geri yüklendi! Sayfa yenilenecek.');
window.location.reload();
        }
      } catch (error) {
        showError('Geçersiz yedek dosyası!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Veri temizleme
  const clearAllData = () => {
  storage.clear();
  showSuccess('Tüm veriler temizlendi! Sayfa yenilenecek.');
  setShowDeleteConfirm(false);
  setTimeout(() => {
    window.location.reload();
  }, 1000);
};

  // İstatistikler
  const getDataStats = () => {
    return {
      cari: (storage.get('cariList') || []).length,
      stok: (storage.get('stokList') || []).length,
      fatura: (storage.get('faturaList') || []).length,
      hareket: (storage.get('hareketList') || []).length
    };
  };

  const stats = getDataStats();

  const tabs = [
    { id: 'firma', label: 'Firma Bilgileri', icon: Building2 },
    { id: 'sistem', label: 'Sistem Ayarları', icon: SettingsIcon },
    { id: 'veri', label: 'Veri Yönetimi', icon: Download },
    { id: 'hakkinda', label: 'Hakkında', icon: Info }
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">Ayarlar</h1>

      <div className="ayarlar-tabs">
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

      <div className="ayarlar-content">
        {/* FİRMA BİLGİLERİ */}
        {activeTab === 'firma' && (
          <div className="ayarlar-section">
            <div className="section-header">
              <h2>Firma Bilgileri</h2>
              <p>Faturalarda ve raporlarda görünecek firma bilgilerinizi girin.</p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Firma Adı *</label>
                <input
                  type="text"
                  name="firmaAdi"
                  value={firmaData.firmaAdi}
                  onChange={handleFirmaChange}
                  placeholder="Şirket Unvanı"
                />
              </div>

              <div className="form-group">
                <label>Yetkili Kişi</label>
                <input
                  type="text"
                  name="yetkili"
                  value={firmaData.yetkili}
                  onChange={handleFirmaChange}
                  placeholder="Ad Soyad"
                />
              </div>

              <div className="form-group">
                <label>Telefon</label>
                <input
                  type="tel"
                  name="telefon"
                  value={firmaData.telefon}
                  onChange={handleFirmaChange}
                  placeholder="0555 555 55 55"
                />
              </div>

              <div className="form-group">
                <label>E-posta</label>
                <input
                  type="email"
                  name="email"
                  value={firmaData.email}
                  onChange={handleFirmaChange}
                  placeholder="info@firma.com"
                />
              </div>

              <div className="form-group">
                <label>Vergi Dairesi</label>
                <input
                  type="text"
                  name="vergiDairesi"
                  value={firmaData.vergiDairesi}
                  onChange={handleFirmaChange}
                  placeholder="Vergi Dairesi Adı"
                />
              </div>

              <div className="form-group">
                <label>Vergi No</label>
                <input
                  type="text"
                  name="vergiNo"
                  value={firmaData.vergiNo}
                  onChange={handleFirmaChange}
                  placeholder="10 haneli vergi no"
                />
              </div>

              <div className="form-group full-width">
                <label>Adres</label>
                <textarea
                  name="adres"
                  value={firmaData.adres}
                  onChange={handleFirmaChange}
                  rows="3"
                  placeholder="Firma adresi"
                />
              </div>
            </div>

            <div className="section-footer">
              <button className="btn-primary" onClick={saveFirmaData}>
                <Save size={18} />
                Kaydet
              </button>
            </div>
          </div>
        )}

        {/* SİSTEM AYARLARI */}
        {activeTab === 'sistem' && (
          <div className="ayarlar-section">
            <div className="section-header">
              <h2>Sistem Ayarları</h2>
              <p>Uygulama davranışını özelleştirin.</p>
            </div>

            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Varsayılan KDV Oranı</h3>
                  <p>Fatura keserken varsayılan olarak seçilecek KDV oranı</p>
                </div>
                <select
                  name="varsayilanKdv"
                  value={sistemData.varsayilanKdv}
                  onChange={handleSistemChange}
                  className="setting-input"
                >
                  <option value="0">%0</option>
                  <option value="1">%1</option>
                  <option value="10">%10</option>
                  <option value="20">%20</option>
                </select>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Kritik Stok Seviyesi</h3>
                  <p>Ürün eklerken varsayılan kritik stok miktarı</p>
                </div>
                <input
                  type="number"
                  name="kritikStokSeviye"
                  value={sistemData.kritikStokSeviye}
                  onChange={handleSistemChange}
                  className="setting-input"
                  min="1"
                />
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Otomatik Fatura No</h3>
                  <p>Fatura numarası otomatik oluşturulsun mu?</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="faturaOtomatikNo"
                    checked={sistemData.faturaOtomatikNo}
                    onChange={handleSistemChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Tarih Formatı</h3>
                  <p>Tarihlerin görüntülenme biçimi</p>
                </div>
                <select
                  name="tarihFormati"
                  value={sistemData.tarihFormati}
                  onChange={handleSistemChange}
                  className="setting-input"
                >
                  <option value="TR">Türkçe (GG.AA.YYYY)</option>
                  <option value="US">ABD (MM/DD/YYYY)</option>
                  <option value="ISO">ISO (YYYY-MM-DD)</option>
                </select>
              </div>
            </div>

            <div className="section-footer">
              <button className="btn-primary" onClick={saveSistemData}>
                <Save size={18} />
                Kaydet
              </button>
            </div>
          </div>
        )}

        {/* VERİ YÖNETİMİ */}
        {activeTab === 'veri' && (
          <div className="ayarlar-section">
            <div className="section-header">
              <h2>Veri Yönetimi</h2>
              <p>Verilerinizi yedekleyin veya geri yükleyin.</p>
            </div>

            <div className="data-stats">
              <div className="stat-box">
                <h4>Toplam Kayıt</h4>
                <p className="stat-number">{stats.cari + stats.stok + stats.fatura + stats.hareket}</p>
              </div>
              <div className="stat-box">
                <h4>Cari</h4>
                <p className="stat-number">{stats.cari}</p>
              </div>
              <div className="stat-box">
                <h4>Stok</h4>
                <p className="stat-number">{stats.stok}</p>
              </div>
              <div className="stat-box">
                <h4>Fatura</h4>
                <p className="stat-number">{stats.fatura}</p>
              </div>
              <div className="stat-box">
                <h4>Kasa Hareketleri</h4>
                <p className="stat-number">{stats.hareket}</p>
              </div>
            </div>

            <div className="action-cards">
              <div className="action-card green">
                <Download size={32} />
                <h3>Yedek Al</h3>
                <p>Tüm verilerinizi JSON dosyası olarak indirin</p>
                <button className="btn-action" onClick={exportData}>
                  <Download size={18} />
                  Yedekle
                </button>
              </div>

              <div className="action-card blue">
                <Upload size={32} />
                <h3>Geri Yükle</h3>
                <p>Önceden aldığınız yedeği geri yükleyin</p>
                <label className="btn-action" style={{ cursor: 'pointer' }}>
                  <Upload size={18} />
                  Yükle
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <div className="action-card red">
                <Trash2 size={32} />
                <h3>Tümünü Temizle</h3>
                <p>Tüm verileri kalıcı olarak silin</p>
                <button 
                  className="btn-action"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 size={18} />
                  Temizle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HAKKINDA */}
        {activeTab === 'hakkinda' && (
          <div className="ayarlar-section">
            <div className="about-content">
              <div className="about-header">
                <h1>Luka Muhasebe</h1>
                <p className="version">Versiyon 1.0.0</p>
              </div>

              <div className="about-section">
                <h3>📊 Özellikler</h3>
                <ul>
                  <li>Cari Hesap Yönetimi (Müşteri/Tedarikçi)</li>
                  <li>Stok Takibi ve Kritik Stok Uyarıları</li>
                  <li>Fatura Kesme (Satış/Alış)</li>
                  <li>Kasa/Banka Hareketleri</li>
                  <li>Detaylı Raporlama ve Grafikler</li>
                  <li>Veri Yedekleme/Geri Yükleme</li>
                  <li>LocalStorage Veri Saklama</li>
                </ul>
              </div>

              <div className="about-section">
                <h3>💻 Teknoloji</h3>
                <ul>
                  <li>React 18</li>
                  <li>Vite</li>
                  <li>React Router DOM</li>
                  <li>Recharts (Grafikler)</li>
                  <li>Lucide React (İkonlar)</li>
                </ul>
              </div>

              <div className="about-section">
                <h3>📝 Notlar</h3>
                <ul>
                  <li>Bu uygulama tarayıcıda LocalStorage kullanır</li>
                  <li>Verileriniz sadece kendi bilgisayarınızda saklanır</li>
                  <li>Düzenli yedek almayı unutmayın</li>
                  <li>Tarayıcı önbelleğini temizlerseniz veriler silinir</li>
                </ul>
              </div>

              <div className="about-footer">
                <p>© 2024 Luka Muhasebe - Tüm hakları saklıdır.</p>
                <p className="made-with">Claude AI ile geliştirildi 🤖</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Silme Onay Modal */}
      <ConfirmDialog
  show={showDeleteConfirm}
  title="⚠️ Tüm Verileri Sil"
  message={`Tüm veriler kalıcı olarak silinecek:\n• ${stats.cari} Cari hesap\n• ${stats.stok} Stok kaydı\n• ${stats.fatura} Fatura\n• ${stats.hareket} Kasa hareketi\n\nBu işlem geri alınamaz!`}
  onConfirm={clearAllData}
  onCancel={() => setShowDeleteConfirm(false)}
  type="danger"
/>
    </div>
  );
};

export default Ayarlar;