import { Ear, Wind, Mic, Skull, Radio, Flower2 } from 'lucide-react';

function ServiceCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="group bg-white p-8 rounded-2xl border-2 border-[#e3f2fd] hover:border-[#1565c0] hover:shadow-2xl transition-all duration-300">
      <div className="w-16 h-16 mb-6 bg-gradient-to-br from-[#e3f2fd] to-[#f0f9ff] rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#1565c0] group-hover:to-[#42a5f5] transition-all duration-300">
        <Icon className="w-8 h-8 text-[#1565c0] group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="font-['Cormorant_Garamond'] font-semibold text-2xl text-[#1a1a2e] mb-3">
        {title}
      </h3>
      <p className="text-[#64748b] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function Services() {
  const services = [
    {
      icon: Ear,
      title: "Ear Treatment",
      description: "Comprehensive care for ear infections, hearing loss, tinnitus, and balance disorders with advanced diagnostic tools."
    },
    {
      icon: Wind,
      title: "Nasal & Sinus Care",
      description: "Expert treatment for sinusitis, nasal obstruction, allergies, and breathing difficulties using minimally invasive techniques."
    },
    {
      icon: Mic,
      title: "Throat & Voice",
      description: "Specialized care for voice disorders, throat infections, swallowing difficulties, and vocal cord conditions."
    },
    {
      icon: Skull,
      title: "Head & Neck",
      description: "Advanced diagnosis and treatment of head and neck conditions including thyroid disorders and facial trauma."
    },
    {
      icon: Radio,
      title: "Hearing Tests",
      description: "State-of-the-art audiometric testing and hearing aid fitting services for all age groups."
    },
    {
      icon: Flower2,
      title: "Allergy Testing",
      description: "Comprehensive allergy testing and immunotherapy to identify and treat environmental and food allergies."
    }
  ];

  return (
    <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#f8fafc]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-[#e3f2fd] rounded-full text-[#1565c0] text-sm font-medium mb-4">
            Our Services
          </div>
          <h2 className="font-['Cormorant_Garamond'] font-bold text-4xl sm:text-5xl text-[#1a1a2e] mb-4">
            Comprehensive ENT Care
          </h2>
          <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
            We offer a full range of ear, nose, and throat services using cutting-edge technology and proven treatment methods.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className=""
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
