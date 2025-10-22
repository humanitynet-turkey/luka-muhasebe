import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { showSuccess, showError } from '../utils/toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Session kontrolü
    checkSession();

    // Auth state değişikliklerini dinle
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserData(session.user.id);
        } else {
          setUser(null);
          setCompany(null);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserData(session.user.id);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userId) => {
    try {
      // Kullanıcı bilgilerini al
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*, companies(*)')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      setUser(userData);
      setCompany(userData.companies);

      // Last login güncelle
      await supabase
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', userId);

    } catch (error) {
      console.error('Error loading user data:', error);
      setUser(null);
      setCompany(null);
    }
  };

  const signUp = async (email, password, fullName, companyName) => {
    try {
      // 1. Auth kullanıcısı oluştur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Kullanıcı oluşturulamadı');
      }

      // 2. Şirket oluştur
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([{ name: companyName }])
        .select()
        .single();

      if (companyError) throw companyError;

      // 3. User kaydı oluştur
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email,
          full_name: fullName,
          company_id: companyData.id,
          role: 'admin'
        }]);

      if (userError) throw userError;

      showSuccess('Kayıt başarılı! Lütfen giriş yapın.');
      return { success: true };

    } catch (error) {
      console.error('Signup error:', error);
      showError(error.message || 'Kayıt sırasında bir hata oluştu');
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      await loadUserData(data.user.id);
      showSuccess('Giriş başarılı!');
      return { success: true };

    } catch (error) {
      console.error('Signin error:', error);
      showError(error.message || 'Giriş yapılamadı');
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setCompany(null);
      showSuccess('Çıkış yapıldı');
      return { success: true };

    } catch (error) {
      console.error('Signout error:', error);
      showError('Çıkış yapılırken hata oluştu');
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      showSuccess('Şifre sıfırlama bağlantısı email adresinize gönderildi');
      return { success: true };

    } catch (error) {
      console.error('Reset password error:', error);
      showError('Şifre sıfırlama başarısız');
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      await loadUserData(user.id);
      showSuccess('Profil güncellendi');
      return { success: true };

    } catch (error) {
      console.error('Update profile error:', error);
      showError('Profil güncellenemedi');
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    company,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
