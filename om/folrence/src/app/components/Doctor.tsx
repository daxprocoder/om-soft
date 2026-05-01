import { Award, GraduationCap, Star } from 'lucide-react';
import doctorImg from '/doctor.png?url';

export default function Doctor() {
  const specializations = [
    "Ear Surgery",
    "Sinus Treatment",
    "Voice Disorders",
    "Pediatric ENT",
    "Head & Neck Surgery",
    "Hearing Restoration"
  ];

  return (
    <section id="doctor" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Doctor Image */}
          <div className="relative">
            <div className="relative">
              {/* Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1565c0] to-[#42a5f5] rounded-3xl transform rotate-6"></div>

              {/* Doctor Avatar Container */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <div className="w-full aspect-square rounded-2xl overflow-hidden">
                  {/* Doctor Photo */}
                  <img
                    src={doctorImg}
                    alt="Dr. Sarah Anderson – ENT Specialist"
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                    fetchPriority="high"
                    width={500}
                    height={500}
                    style={{ backgroundColor: '#e3f2fd' }}
                  />
                </div>

                {/* Verified Badge */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              {/* Floating Rating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border-2 border-[#e3f2fd]">
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-sm text-[#64748b]">500+ Reviews</div>
              </div>
            </div>
          </div>

          {/* Right - Doctor Info */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-[#e3f2fd] rounded-full text-[#1565c0] text-sm font-medium">
              Meet Our Specialist
            </div>

            <div>
              <h2 className="font-['Cormorant_Garamond'] font-bold text-4xl sm:text-5xl text-[#1a1a2e] mb-3">
                Dr. Sarah Anderson
              </h2>
              <div className="flex items-center gap-2 text-[#1565c0] mb-4">
                <GraduationCap className="w-5 h-5" />
                <span className="font-semibold">MS ENT, FACS</span>
              </div>
            </div>

            <p className="text-lg text-[#64748b] leading-relaxed">
              With over 15 years of experience in otolaryngology, Dr. Anderson is a board-certified
              ENT specialist dedicated to providing exceptional care. She completed her residency at
              Johns Hopkins Hospital and has been recognized for her innovative approaches to minimally
              invasive ENT procedures.
            </p>

            {/* Specializations */}
            <div>
              <h3 className="font-['Cormorant_Garamond'] font-semibold text-xl text-[#1a1a2e] mb-4">
                Specializations
              </h3>
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-[#e3f2fd] text-[#1565c0] rounded-full text-sm font-medium hover:bg-[#1565c0] hover:text-white transition-colors duration-300 cursor-default"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Credentials */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-[#f8fafc] rounded-xl">
                <div className="font-['Cormorant_Garamond'] font-bold text-3xl text-[#1565c0] mb-1">15+</div>
                <div className="text-sm text-[#64748b]">Years Experience</div>
              </div>
              <div className="p-4 bg-[#f8fafc] rounded-xl">
                <div className="font-['Cormorant_Garamond'] font-bold text-3xl text-[#1565c0] mb-1">25K+</div>
                <div className="text-sm text-[#64748b]">Patients Treated</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
