import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Excel Export Fonksiyonu
export const exportToExcel = (data, fileName, sheetName = 'Sayfa1') => {
  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
    return true;
  } catch (error) {
    console.error('Excel export hatası:', error);
    return false;
  }
};

// Cari Listesi Excel Export
export const exportCariToExcel = (cariList) => {
  const data = cariList.map(cari => ({
    'Ünvan': cari.unvan,
    'Tip': cari.tip === 'musteri' ? 'Müşteri' : 'Tedarikçi',
    'Vergi No': cari.vergiNo,
    'Telefon': cari.telefon,
    'Email': cari.email,
    'Yetkili': cari.yetkili,
    'Adres': cari.adres,
    'Kayıt Tarihi': cari.tarih
  }));
  
  return exportToExcel(data, 'Cari_Listesi', 'Cari Hesaplar');
};

// Stok Listesi Excel Export
export const exportStokToExcel = (stokList) => {
  const data = stokList.map(stok => ({
    'Ürün Kodu': stok.urunKodu,
    'Ürün Adı': stok.urunAdi,
    'Birim': stok.birim,
    'Alış Fiyat': parseFloat(stok.alisFiyat).toFixed(2),
    'Satış Fiyat': parseFloat(stok.satisFiyat).toFixed(2),
    'Stok Miktar': stok.stokMiktar,
    'Kritik Stok': stok.kritikStok,
    'Toplam Değer': (parseFloat(stok.stokMiktar) * parseFloat(stok.satisFiyat)).toFixed(2)
  }));
  
  return exportToExcel(data, 'Stok_Listesi', 'Stok');
};

// Fatura Listesi Excel Export
export const exportFaturaToExcel = (faturaList) => {
  const data = faturaList.map(fatura => ({
    'Fatura No': fatura.faturaNo,
    'Tip': fatura.faturaTipi === 'satis' ? 'Satış' : 'Alış',
    'Cari': fatura.cariUnvan,
    'Tarih': fatura.tarih,
    'Tutar': fatura.tutar.toFixed(2),
    'KDV': fatura.kdvToplam.toFixed(2),
    'Genel Toplam': fatura.genelToplam.toFixed(2)
  }));
  
  return exportToExcel(data, 'Fatura_Listesi', 'Faturalar');
};

// Kasa Hareketleri Excel Export
export const exportKasaToExcel = (hareketList) => {
  const data = hareketList.map(hareket => ({
    'Tarih': hareket.tarih,
    'Hesap': hareket.kasaAd,
    'İşlem Tipi': hareket.islemTipi === 'gelir' ? 'Gelir' : 'Gider',
    'Kategori': hareket.kategori,
    'Cari': hareket.cariAd || '-',
    'Açıklama': hareket.aciklama,
    'Tutar': hareket.tutar.toFixed(2)
  }));
  
  return exportToExcel(data, 'Kasa_Hareketleri', 'Kasa');
};

// PDF Fatura Oluştur
export const exportFaturaToPDF = (fatura, firmaData = {}) => {
  try {
    const doc = new jsPDF();
    
    // Başlık
    doc.setFontSize(20);
    doc.text(fatura.faturaTipi === 'satis' ? 'SATIS FATURASI' : 'ALIS FATURASI', 105, 20, { align: 'center' });
    
    // Firma Bilgileri
    doc.setFontSize(10);
    if (firmaData.firmaAdi) {
      doc.text(firmaData.firmaAdi, 14, 35);
      if (firmaData.adres) {
        const adresSplit = doc.splitTextToSize(firmaData.adres, 100);
        doc.text(adresSplit, 14, 40);
      }
      const yPos = firmaData.adres ? 40 + (doc.splitTextToSize(firmaData.adres, 100).length * 5) : 40;
      if (firmaData.telefon) doc.text(`Tel: ${firmaData.telefon}`, 14, yPos + 5);
      if (firmaData.vergiNo) doc.text(`Vergi No: ${firmaData.vergiNo}`, 14, yPos + 10);
    }
    
    // Fatura Bilgileri (sola kaydırıldı)
    doc.text('Fatura No:', 120, 35);
    doc.text('Tarih:', 120, 40);
    doc.text('Cari:', 120, 45);
    
    doc.text(fatura.faturaNo, 145, 35);
    doc.text(fatura.tarih, 145, 40);
    // Cari adını kısalt
    const cariUnvan = fatura.cariUnvan.length > 35 
      ? fatura.cariUnvan.substring(0, 35) + '...' 
      : fatura.cariUnvan;
    doc.text(cariUnvan, 145, 45);
    
    // Ürün Tablosu
    const tableData = fatura.urunler.map(urun => [
      urun.urunAdi,
      `${urun.miktar} ${urun.birim}`,
      `${parseFloat(urun.birimFiyat).toFixed(2)} TL`,
      `%${urun.kdvOran}`,
      `${parseFloat(urun.tutar).toFixed(2)} TL`,
      `${parseFloat(urun.kdvTutar).toFixed(2)} TL`,
      `${parseFloat(urun.genelToplam).toFixed(2)} TL`
    ]);
    
    autoTable(doc, {
      startY: 60,
      head: [['Urun', 'Miktar', 'Birim Fiyat', 'KDV', 'Tutar', 'KDV Tutari', 'Toplam']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [52, 152, 219], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 15 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 }
      }
    });
    
    // Toplam Bölümü
    const finalY = doc.lastAutoTable.finalY + 10;
    
    doc.text('Ara Toplam:', 140, finalY);
    doc.text('KDV Toplami:', 140, finalY + 7);
    doc.text('GENEL TOPLAM:', 140, finalY + 14);
    
    doc.text(`${parseFloat(fatura.tutar).toFixed(2)} TL`, 180, finalY);
    doc.text(`${parseFloat(fatura.kdvToplam).toFixed(2)} TL`, 180, finalY + 7);
    
    doc.setFontSize(12);
    doc.text(`${parseFloat(fatura.genelToplam).toFixed(2)} TL`, 180, finalY + 14);
    
    // Açıklama
    if (fatura.aciklama) {
      doc.setFontSize(9);
      doc.text('Aciklama:', 14, finalY + 25);
      const splitText = doc.splitTextToSize(fatura.aciklama, 180);
      doc.text(splitText, 14, finalY + 30);
    }
    
    // Alt Bilgi
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Luka Muhasebe Sistemi', 105, 285, { align: 'center' });
    
    doc.save(`Fatura_${fatura.faturaNo}.pdf`);
    
    return true;
  } catch (error) {
    console.error('PDF olusturma hatasi:', error);
    return false;
  }
};

// PDF Yazdırma
export const printFaturaPDF = (fatura, firmaData = {}) => {
  try {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text(fatura.faturaTipi === 'satis' ? 'SATIS FATURASI' : 'ALIS FATURASI', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    if (firmaData.firmaAdi) {
      doc.text(firmaData.firmaAdi, 14, 35);
      if (firmaData.adres) {
        const adresSplit = doc.splitTextToSize(firmaData.adres, 100);
        doc.text(adresSplit, 14, 40);
      }
      const yPos = firmaData.adres ? 40 + (doc.splitTextToSize(firmaData.adres, 100).length * 5) : 40;
      if (firmaData.telefon) doc.text(`Tel: ${firmaData.telefon}`, 14, yPos + 5);
      if (firmaData.vergiNo) doc.text(`Vergi No: ${firmaData.vergiNo}`, 14, yPos + 10);
    }
    
    doc.text('Fatura No:', 120, 35);
    doc.text('Tarih:', 120, 40);
    doc.text('Cari:', 120, 45);
    
    doc.text(fatura.faturaNo, 145, 35);
    doc.text(fatura.tarih, 145, 40);
    const cariUnvan = fatura.cariUnvan.length > 35 
      ? fatura.cariUnvan.substring(0, 35) + '...' 
      : fatura.cariUnvan;
    doc.text(cariUnvan, 145, 45);
    
    const tableData = fatura.urunler.map(urun => [
      urun.urunAdi,
      `${urun.miktar} ${urun.birim}`,
      `${parseFloat(urun.birimFiyat).toFixed(2)} TL`,
      `%${urun.kdvOran}`,
      `${parseFloat(urun.tutar).toFixed(2)} TL`,
      `${parseFloat(urun.kdvTutar).toFixed(2)} TL`,
      `${parseFloat(urun.genelToplam).toFixed(2)} TL`
    ]);
    
    autoTable(doc, {
      startY: 60,
      head: [['Urun', 'Miktar', 'Birim Fiyat', 'KDV', 'Tutar', 'KDV Tutari', 'Toplam']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [52, 152, 219], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 15 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 }
      }
    });
    
    const finalY = doc.lastAutoTable.finalY + 10;
    
    doc.text('Ara Toplam:', 140, finalY);
    doc.text('KDV Toplami:', 140, finalY + 7);
    doc.text('GENEL TOPLAM:', 140, finalY + 14);
    
    doc.text(`${parseFloat(fatura.tutar).toFixed(2)} TL`, 180, finalY);
    doc.text(`${parseFloat(fatura.kdvToplam).toFixed(2)} TL`, 180, finalY + 7);
    
    doc.setFontSize(12);
    doc.text(`${parseFloat(fatura.genelToplam).toFixed(2)} TL`, 180, finalY + 14);
    
    if (fatura.aciklama) {
      doc.setFontSize(9);
      doc.text('Aciklama:', 14, finalY + 25);
      const splitText = doc.splitTextToSize(fatura.aciklama, 180);
      doc.text(splitText, 14, finalY + 30);
    }
    
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Luka Muhasebe Sistemi', 105, 285, { align: 'center' });
    
    window.open(doc.output('bloburl'), '_blank');
    
    return true;
  } catch (error) {
    console.error('PDF yazdirma hatasi:', error);
    return false;
  }
};