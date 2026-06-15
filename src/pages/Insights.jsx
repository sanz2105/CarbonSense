import { useEffect } from 'react';
import { Sparkles, Car, Utensils, Lightbulb, HelpCircle } from 'lucide-react';
import InsightsPanel from '../components/InsightsPanel';

export default function Insights() {
  useEffect(() => {
    document.title = 'AI Insights — CarbonSense';
  }, []);

  const facts = [
    {
      id: 1,
      icon: Car,
      text: 'An average car emits 4.6 metric tons of CO₂ per year',
      color: 'text-blue-500 bg-blue-50/50',
    },
    {
      id: 2,
      icon: Utensils,
      text: 'Beef production emits 27 kg CO₂ per kg of meat',
      color: 'text-orange-500 bg-orange-50/50',
    },
    {
      id: 3,
      icon: Lightbulb,
      text: 'Switching to LED bulbs saves ~40 kg CO₂ per year per bulb',
      color: 'text-amber-500 bg-amber-50/50',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn space-y-8">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-[#166E52]/10 rounded-xl text-[#166E52]">
          <Sparkles size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Personalized Insights</h1>
          <p className="text-sm text-gray-500 mt-1">Get custom AI coach suggestions and expand your ecological literacy.</p>
        </div>
      </div>

      {/* Embed InsightsPanel at the top */}
      <div className="w-full">
        <InsightsPanel />
      </div>

      {/* Did You Know? section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle size={20} className="text-[#166E52]" />
          Did You Know?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {facts.map((fact) => {
            const Icon = fact.icon;
            return (
              <div
                key={fact.id}
                className="bg-white border-l-4 border-[#166E52] rounded-r-xl border border-gray-100 shadow-sm p-5 flex flex-col items-start space-y-3.5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className={`p-2.5 rounded-xl ${fact.color}`}>
                  <Icon size={20} />
                </div>
                <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                  {fact.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
