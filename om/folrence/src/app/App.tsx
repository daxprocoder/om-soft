import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Services from './components/Services';
import Doctor from './components/Doctor';
import Appointment from './components/Appointment';
import Footer from './components/Footer';

import MobileBottomNav from './components/MobileBottomNav';
import MobileBookingDashboard from './components/MobileBookingDashboard';
import { Browser } from '@capacitor/browser';
import { Clipboard } from '@capacitor/clipboard';

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const handleLoadingComplete = () => {
    setFadeOut(true);
    setTimeout(() => setLoading(false), 800);
  };

  const handleJoinCall = async (url: string) => {
    try {
      // 1. Copy to clipboard for easy manual pasting if needed
      await Clipboard.write({ string: url });
      
      // 2. Open in system browser
      if (window.location.protocol === 'file:' || /Android|iPhone|iPad/i.test(navigator.userAgent)) {
        await Browser.open({ url });
      } else {
        window.open(url, '_blank');
      }
      
      alert('Video link copied! Opening your browser...');
    } catch (err) {
      window.open(url, '_blank');
    }
  };

  return (
    <>
      {loading && (
        <div className={`transition-opacity duration-800 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <LoadingScreen onComplete={handleLoadingComplete} />
        </div>
      )}
      <div className={`min-h-screen transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Desktop View (Full Scroll) */}
        <div className="hidden md:block max-w-[1440px] mx-auto shadow-2xl bg-white min-h-screen">
          <Navbar />
          <Hero />
          <Stats />
          <Services />
          <Doctor />
          <Appointment />
          <Footer />
        </div>

        {/* Mobile View (Tabbed) */}
        <div className="md:hidden pb-16 pt-20">
          <Navbar />
          {activeTab === 'home' && (
            <>
              <Hero onBookClick={() => setActiveTab('appointment')} />
              <Stats />
              <div className="border-t border-slate-100 bg-white pt-6 mt-6">
                <Doctor />
              </div>
            </>
          )}
          {activeTab === 'services' && <Services />}
          {activeTab === 'appointment' && <MobileBookingDashboard onJoinCall={handleJoinCall} />}
          
          <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}