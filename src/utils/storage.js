import { supabase } from '../supabaseClient';

// Supabase ile çalışan storage helper
export const storage = {
  // LocalStorage (yerel yedek olarak kalacak)
  local: {
    save: (key, data) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch (error) {
        // Error logging removed for production
        return false;
      }
    },
    get: (key) => {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        // Error logging removed for production
        return null;
      }
    },
    remove: (key) => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        // Error logging removed for production
        return false;
      }
    },
    clear: () => {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        // Error logging removed for production
        return false;
      }
    }
  },

  // Supabase CRUD işlemleri
  async fetchFromSupabase(table) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      // Error logging removed for production
      return [];
    }
  },

  async saveToSupabase(table, item) {
    try {
      // id'yi çıkar (Supabase otomatik oluşturur)
      const { id, ...dataWithoutId } = item;
      
      const { data, error } = await supabase
        .from(table)
        .insert([dataWithoutId])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      // Error logging removed for production
      return null;
    }
  },

  async updateInSupabase(table, id, updates) {
    try {
      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      // Error logging removed for production
      return null;
    }
  },

  async deleteFromSupabase(table, id) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      // Error logging removed for production
      return false;
    }
  },

  // Eski API ile uyumluluk (LocalStorage devam ediyor)
  save: (key, data) => {
    return storage.local.save(key, data);
  },
  
  get: (key) => {
    return storage.local.get(key);
  },
  
  remove: (key) => {
    return storage.local.remove(key);
  },
  
  clear: () => {
    return storage.local.clear();
  }
};