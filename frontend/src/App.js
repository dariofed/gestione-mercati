import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { DBProvider } from '@/contexts/DBContext';
import SalesPage from '@/pages/SalesPage';
import HistoryPage from '@/pages/HistoryPage';
import SettingsPage from '@/pages/SettingsPage';
import Navigation from '@/components/Navigation';
import '@/App.css';

function App() {
  return (
    <DBProvider>
      <div className="App">
        <BrowserRouter>
          <div className="min-h-screen" style={{ backgroundColor: '#FDFBF7' }}>
            <Navigation />
            <Routes>
              <Route path="/" element={<SalesPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </BrowserRouter>
        <Toaster position="bottom-center" duration={2000} />
      </div>
    </DBProvider>
  );
}

export default App;