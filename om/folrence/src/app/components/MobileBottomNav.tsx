import { Home, Activity, Stethoscope, CalendarPlus } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MobileBottomNav({ activeTab, setActiveTab }: MobileBottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'services', label: 'Services', icon: Activity },
    { id: 'appointment', label: 'Appointments', icon: CalendarPlus },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-[#1565c0]' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon size={24} className={isActive ? 'stroke-2' : 'stroke-[1.5]'} />
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
