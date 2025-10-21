// Vergi/TC No kontrolü
export const validateTaxNumber = (number) => {
  if (!number) return { valid: false, message: 'Vergi/TC No gereklidir' };
  
  const cleaned = number.replace(/\s/g, '');
  
  if (cleaned.length === 10) {
    // Vergi No (10 haneli)
    if (!/^\d{10}$/.test(cleaned)) {
      return { valid: false, message: 'Vergi No 10 haneli sayı olmalıdır' };
    }
    return { valid: true, message: '' };
  } else if (cleaned.length === 11) {
    // TC Kimlik No (11 haneli)
    if (!/^\d{11}$/.test(cleaned)) {
      return { valid: false, message: 'TC No 11 haneli sayı olmalıdır' };
    }
    
    // TC Kimlik No algoritması kontrolü
    const digits = cleaned.split('').map(Number);
    
    if (digits[0] === 0) {
      return { valid: false, message: 'TC No 0 ile başlayamaz' };
    }
    
    const sum10 = (digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7 - 
                  (digits[1] + digits[3] + digits[5] + digits[7]);
    const mod10 = sum10 % 10;
    
    if (mod10 !== digits[9]) {
      return { valid: false, message: 'Geçersiz TC Kimlik No' };
    }
    
    const sum11 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
    if (sum11 % 10 !== digits[10]) {
      return { valid: false, message: 'Geçersiz TC Kimlik No' };
    }
    
    return { valid: true, message: '' };
  } else {
    return { valid: false, message: 'Vergi No 10, TC No 11 haneli olmalıdır' };
  }
};

// Telefon kontrolü
export const validatePhone = (phone) => {
  if (!phone) return { valid: true, message: '' }; // Opsiyonel
  
  const cleaned = phone.replace(/[\s\(\)\-]/g, '');
  
  if (!/^0?\d{10}$/.test(cleaned)) {
    return { valid: false, message: 'Geçerli bir telefon numarası giriniz (10 haneli)' };
  }
  
  return { valid: true, message: '' };
};

// Email kontrolü
export const validateEmail = (email) => {
  if (!email) return { valid: true, message: '' }; // Opsiyonel
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Geçerli bir email adresi giriniz' };
  }
  
  return { valid: true, message: '' };
};

// Fiyat kontrolü (pozitif sayı)
export const validatePrice = (price) => {
  if (!price || price === '') return { valid: false, message: 'Fiyat gereklidir' };
  
  const numPrice = parseFloat(price);
  
  if (isNaN(numPrice)) {
    return { valid: false, message: 'Geçerli bir sayı giriniz' };
  }
  
  if (numPrice < 0) {
    return { valid: false, message: 'Fiyat negatif olamaz' };
  }
  
  return { valid: true, message: '' };
};

// Stok miktarı kontrolü
export const validateStock = (stock) => {
  if (!stock || stock === '') return { valid: false, message: 'Stok miktarı gereklidir' };
  
  const numStock = parseFloat(stock);
  
  if (isNaN(numStock)) {
    return { valid: false, message: 'Geçerli bir sayı giriniz' };
  }
  
  if (numStock < 0) {
    return { valid: false, message: 'Stok miktarı negatif olamaz' };
  }
  
  return { valid: true, message: '' };
};

// Boş alan kontrolü
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return { valid: false, message: `${fieldName} gereklidir` };
  }
  return { valid: true, message: '' };
};

// Ürün kodu kontrolü (benzersiz)
export const validateUniqueCode = (code, existingCodes, currentId = null) => {
  if (!code) return { valid: false, message: 'Ürün kodu gereklidir' };
  
  const isDuplicate = existingCodes.some(item => 
    item.urunKodu === code && item.id !== currentId
  );
  
  if (isDuplicate) {
    return { valid: false, message: 'Bu ürün kodu zaten kullanılıyor' };
  }
  
  return { valid: true, message: '' };
};