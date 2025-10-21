import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';
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
    <Router>
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
  );
}

export default App;