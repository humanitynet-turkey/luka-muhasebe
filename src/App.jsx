import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Cari from './pages/Cari';
import CariEkstre from './pages/CariEkstre';
import Stok from './pages/Stok';
import Fatura from './pages/Fatura';
import Kasa from './pages/Kasa';
import Raporlar from './pages/Raporlar';
import Ayarlar from './pages/Ayarlar';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <Sidebar />
                  <div className="main-content">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/cari" element={<Cari />} />
                      <Route path="/cari-ekstre" element={<CariEkstre />} />
                      <Route path="/stok" element={<Stok />} />
                      <Route path="/fatura" element={<Fatura />} />
                      <Route path="/kasa" element={<Kasa />} />
                      <Route path="/raporlar" element={<Raporlar />} />
                      <Route path="/ayarlar" element={<Ayarlar />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;