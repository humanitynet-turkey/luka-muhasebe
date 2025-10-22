import { supabase } from '../supabaseClient';

/**
 * Supabase CRUD servisleri
 * Multi-tenant yapı için company_id otomatik eklenir
 */

class SupabaseService {
  /**
   * Kullanıcı bilgisini ve company_id'yi al
   */
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: userData } = await supabase
        .from('users')
        .select('*, companies(*)')
        .eq('id', user.id)
        .single();

      return userData;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Tüm kayıtları getir
   */
  async getAll(table, orderBy = 'id', ascending = false) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('Kullanıcı bulunamadı');

      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('company_id', user.company_id)
        .order(orderBy, { ascending });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error(`Error fetching ${table}:`, error);
      return { success: false, error: error.message, data: [] };
    }
  }

  /**
   * ID'ye göre tek kayıt getir
   */
  async getById(table, id) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('Kullanıcı bulunamadı');

      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('company_id', user.company_id)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error(`Error fetching ${table} by ID:`, error);
      return { success: false, error: error.message, data: null };
    }
  }

  /**
   * Yeni kayıt ekle
   */
  async insert(table, item) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('Kullanıcı bulunamadı');

      // id'yi çıkar, company_id ve created_by ekle
      const { id, ...itemWithoutId } = item;

      const newItem = {
        ...itemWithoutId,
        company_id: user.company_id,
        created_by: user.id,
      };

      const { data, error } = await supabase
        .from(table)
        .insert([newItem])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error);
      return { success: false, error: error.message, data: null };
    }
  }

  /**
   * Kayıt güncelle
   */
  async update(table, id, updates) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('Kullanıcı bulunamadı');

      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq('company_id', user.company_id)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      return { success: false, error: error.message, data: null };
    }
  }

  /**
   * Kayıt sil
   */
  async delete(table, id) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('Kullanıcı bulunamadı');

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('company_id', user.company_id)
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Özel filtreleme ile kayıt getir
   */
  async getByFilter(table, filters, orderBy = 'id', ascending = false) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('Kullanıcı bulunamadı');

      let query = supabase
        .from(table)
        .select('*')
        .eq('company_id', user.company_id);

      // Filtreleri uygula
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { data, error } = await query.order(orderBy, { ascending });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error(`Error fetching ${table} with filters:`, error);
      return { success: false, error: error.message, data: [] };
    }
  }

  /**
   * Realtime subscription oluştur
   */
  subscribe(table, callback) {
    const channel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return channel;
  }

  /**
   * Subscription'ı kapat
   */
  unsubscribe(channel) {
    if (channel) {
      supabase.removeChannel(channel);
    }
  }
}

export const supabaseService = new SupabaseService();

// Tablo isimleri için constants
export const TABLES = {
  CARI: 'cari_list',
  STOK: 'stok_list',
  FATURA: 'fatura_list',
  KASA: 'kasa_list',
  USERS: 'users',
  COMPANIES: 'companies',
};
