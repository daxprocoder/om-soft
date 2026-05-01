import { Users, Award, Heart, Clock } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

function StatCard({ icon: Icon, value, label, suffix = '' }: { icon: any; value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp: number | null = null;
    const duration = 2000;
    const end = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isVisible, value]);

  return (
    <div ref={ref} className="text-center group">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#1565c0] to-[#42a5f5] rounded-2xl flex items-center justify-center transition-transform duration-300 shadow-lg">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <div className="font-['Cormorant_Garamond'] font-bold text-4xl text-[#1565c0] mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[#64748b] font-medium">{label}</div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#e3f2fd]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <StatCard icon={Users} value={25000} label="Patients Treated" suffix="+" />
          <StatCard icon={Award} value={15} label="Years Experience" suffix="+" />
          <StatCard icon={Heart} value={98} label="Satisfaction Rate" suffix="%" />
          <StatCard icon={Clock} value={20} label="Qualified Doctors" suffix="+" />
        </div>
      </div>
    </section>
  );
}
