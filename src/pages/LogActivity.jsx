import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, CheckCircle2, AlertTriangle } from 'lucide-react';
import { emissionFactors } from '../data/mockData';
import { saveActivity } from '../utils/storage';

export default function LogActivity() {
  useEffect(() => {
    document.title = 'Log Activity — CarbonSense';
  }, []);

  const navigate = useNavigate();

  // Base fields
  const [category, setCategory] = useState('Transport');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));

  // Category-specific sub-fields
  const [transportDistance, setTransportDistance] = useState('');
  const [transportVehicle, setTransportVehicle] = useState('Car');

  const [foodMealType, setFoodMealType] = useState('Veg meal');

  const [energyUsage, setEnergyUsage] = useState('');

  const [shoppingType, setShoppingType] = useState('Electronics');
  const [shoppingAmount, setShoppingAmount] = useState('');

  const [otherManualCo2, setOtherManualCo2] = useState('');

  // UI States
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Live emissions calculation is derived from the current form state.
  const estimatedEmissions = (() => {
    let emissions = 0;

    if (category === 'Transport') {
      const distance = parseFloat(transportDistance) || 0;
      const factor = emissionFactors.transport[transportVehicle] || 0;
      emissions = distance * factor;
    } else if (category === 'Food') {
      emissions = emissionFactors.food[foodMealType] || 0;
    } else if (category === 'Energy') {
      const usage = parseFloat(energyUsage) || 0;
      const factor = emissionFactors.energy.electricity || 0.82;
      emissions = usage * factor;
    } else if (category === 'Shopping') {
      const amount = parseFloat(shoppingAmount) || 0;
      const factor = emissionFactors.shopping[shoppingType] || 0;
      emissions = amount * factor;
    } else if (category === 'Other') {
      emissions = parseFloat(otherManualCo2) || 0;
    }

    return Math.round(emissions * 1000) / 1000;
  })();

  // Clean up toast timeout on unmount
  useEffect(() => {
    return () => {
      if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
      }
    };
  }, []);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setErrors({}); // Clear validation errors on category swap
  };

  const validate = () => {
    const newErrors = {};

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (category === 'Transport') {
      if (!transportDistance || parseFloat(transportDistance) <= 0 || isNaN(parseFloat(transportDistance))) {
        newErrors.transportDistance = 'Enter distance in km (> 0)';
      }
    } else if (category === 'Energy') {
      if (!energyUsage || parseFloat(energyUsage) <= 0 || isNaN(parseFloat(energyUsage))) {
        newErrors.energyUsage = 'Enter usage in kWh (> 0)';
      }
    } else if (category === 'Shopping') {
      if (!shoppingAmount || parseFloat(shoppingAmount) <= 0 || isNaN(parseFloat(shoppingAmount))) {
        newErrors.shoppingAmount = 'Enter amount in ₹ (> 0)';
      }
    } else if (category === 'Other') {
      if (otherManualCo2 === '' || parseFloat(otherManualCo2) < 0 || isNaN(parseFloat(otherManualCo2))) {
        newErrors.otherManualCo2 = 'Enter valid emissions in kg (>= 0)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Build activity payload with a unique id
    const activity = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      category,
      description: description.trim(),
      date,
      emissions: estimatedEmissions,
      details: {}
    };

    if (category === 'Transport') {
      activity.details = { distance: parseFloat(transportDistance), vehicle: transportVehicle };
    } else if (category === 'Food') {
      activity.details = { mealType: foodMealType };
    } else if (category === 'Energy') {
      activity.details = { usageKWh: parseFloat(energyUsage) };
    } else if (category === 'Shopping') {
      activity.details = { itemType: shoppingType, amountSpend: parseFloat(shoppingAmount) };
    } else if (category === 'Other') {
      activity.details = { manualInput: parseFloat(otherManualCo2) };
    }

    // Persist to localStorage
    saveActivity(activity);

    // Trigger Success Toast
    setToastMessage('Activity logged! Redirecting to Dashboard…');
    setShowToast(true);

    if (window.toastTimeout) {
      clearTimeout(window.toastTimeout);
    }
    window.toastTimeout = setTimeout(() => {
      setShowToast(false);
      navigate('/');
    }, 1500);

    // Reset Form Fields (keep Category and Date for easier consecutive logs)
    setDescription('');
    setTransportDistance('');
    setEnergyUsage('');
    setShoppingAmount('');
    setOtherManualCo2('');
    setErrors({});
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn relative">
      {/* Toast Alert */}
      <div role="status" aria-live="polite" aria-atomic="true">
        {showToast && (
          <div className="fixed top-4 right-4 z-50 bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3.5 shadow-xl flex items-center gap-3 animate-slideIn transition-all duration-300">
            <div className="p-1 bg-[#1D9E75] rounded-full text-white">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">{toastMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* Header section */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-[#1D9E75]/10 rounded-xl text-[#1D9E75]">
          <PenTool size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Log an Activity</h1>
          <p className="text-sm text-gray-500 mt-1">Record daily choices to estimate and offset your environmental impact.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-[12px] border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
            
            {/* Category selection */}
            <div>
              <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={handleCategoryChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] transition-all cursor-pointer"
              >
                <option value="Transport">🚗 Transport</option>
                <option value="Food">🍔 Food</option>
                <option value="Energy">⚡ Energy</option>
                <option value="Shopping">🛍️ Shopping</option>
                <option value="Other">⚙️ Other</option>
              </select>
            </div>

            {/* Description Text field */}
            <div>
              <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Description
              </label>
              <input
                id="description"
                type="text"
                value={description}
                maxLength={200}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  category === 'Transport' ? 'e.g. Drove 15 km to work' :
                  category === 'Food' ? 'e.g. Hamburger lunch with drinks' :
                  category === 'Energy' ? 'e.g. Monthly electricity usage' :
                  category === 'Shopping' ? 'e.g. Purchased leather jacket' : 'e.g. Miscellaneous carbon item'
                }
                className={`w-full bg-gray-50 border text-gray-800 rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] transition-all ${
                  errors.description ? 'border-red-500 bg-red-50/10 focus:ring-red-100' : 'border-gray-200'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500 font-semibold flex items-center gap-1">
                  <AlertTriangle size={12} /> {errors.description}
                </p>
              )}
            </div>

            {/* DYNAMIC SUB-FIELDS */}
            {category === 'Transport' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div>
                  <label htmlFor="vehicle-type" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Vehicle Type
                  </label>
                  <select
                    id="vehicle-type"
                    value={transportVehicle}
                    onChange={(e) => setTransportVehicle(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-800 rounded-lg px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] transition-all cursor-pointer"
                  >
                    <option value="Car">Car (Gasoline)</option>
                    <option value="Bus">Bus</option>
                    <option value="Train">Train</option>
                    <option value="Flight">Flight (Airplane)</option>
                    <option value="Bike">Bicycle / Walk</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="distance" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Distance (km)
                  </label>
                  <input
                    id="distance"
                    type="number"
                    step="any"
                    value={transportDistance}
                    onChange={(e) => setTransportDistance(e.target.value)}
                    placeholder="e.g. 15"
                    className={`w-full bg-white border text-gray-800 rounded-lg px-3.5 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] transition-all ${
                      errors.transportDistance ? 'border-red-500 bg-red-50/10 focus:ring-red-100' : 'border-gray-200'
                    }`}
                  />
                  {errors.transportDistance && (
                    <p className="mt-1 text-xs text-red-500 font-semibold flex items-center gap-1">
                      <AlertTriangle size={12} /> {errors.transportDistance}
                    </p>
                  )}
                </div>
              </div>
            )}

            {category === 'Food' && (
              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <label htmlFor="meal-type" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Meal Type
                </label>
                <select
                  id="meal-type"
                  value={foodMealType}
                  onChange={(e) => setFoodMealType(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-gray-800 rounded-lg px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] transition-all cursor-pointer"
                >
                  <option value="Veg meal">Vegetarian Meal (1.5 kg CO₂)</option>
                  <option value="Non-veg meal">Non-Veg Meal (3.3 kg CO₂)</option>
                  <option value="Beef meal">Beef-Heavy Meal (6.8 kg CO₂)</option>
                  <option value="Dairy-heavy">Dairy-Heavy Meal (2.5 kg CO₂)</option>
                </select>
              </div>
            )}

            {category === 'Energy' && (
              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <label htmlFor="energy-usage" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Electricity Usage (kWh)
                </label>
                <input
                  id="energy-usage"
                  type="number"
                  step="any"
                  value={energyUsage}
                  onChange={(e) => setEnergyUsage(e.target.value)}
                  placeholder="e.g. 120"
                  className={`w-full bg-white border text-gray-800 rounded-lg px-3.5 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] transition-all ${
                    errors.energyUsage ? 'border-red-500 bg-red-50/10 focus:ring-red-100' : 'border-gray-200'
                  }`}
                />
                {errors.energyUsage && (
                  <p className="mt-1 text-xs text-red-500 font-semibold flex items-center gap-1">
                    <AlertTriangle size={12} /> {errors.energyUsage}
                  </p>
                )}
              </div>
            )}

            {category === 'Shopping' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div>
                  <label htmlFor="shopping-type" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Item Type
                  </label>
                  <select
                    id="shopping-type"
                    value={shoppingType}
                    onChange={(e) => setShoppingType(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-800 rounded-lg px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] transition-all cursor-pointer"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Other">Other / Miscellaneous</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="spent-amount" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Amount Spent (₹)
                  </label>
                  <input
                    id="spent-amount"
                    type="number"
                    step="any"
                    value={shoppingAmount}
                    onChange={(e) => setShoppingAmount(e.target.value)}
                    placeholder="e.g. 1500"
                    className={`w-full bg-white border text-gray-800 rounded-lg px-3.5 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] transition-all ${
                      errors.shoppingAmount ? 'border-red-500 bg-red-50/10 focus:ring-red-100' : 'border-gray-200'
                    }`}
                  />
                  {errors.shoppingAmount && (
                    <p className="mt-1 text-xs text-red-500 font-semibold flex items-center gap-1">
                      <AlertTriangle size={12} /> {errors.shoppingAmount}
                    </p>
                  )}
                </div>
              </div>
            )}

            {category === 'Other' && (
              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <label htmlFor="manual-co2" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Manual CO₂ Input (kg)
                </label>
                <input
                  id="manual-co2"
                  type="number"
                  step="any"
                  value={otherManualCo2}
                  onChange={(e) => setOtherManualCo2(e.target.value)}
                  placeholder="e.g. 5.5"
                  className={`w-full bg-white border text-gray-800 rounded-lg px-3.5 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] transition-all ${
                    errors.otherManualCo2 ? 'border-red-500 bg-red-50/10 focus:ring-red-100' : 'border-gray-200'
                  }`}
                />
                {errors.otherManualCo2 && (
                  <p className="mt-1 text-xs text-red-500 font-semibold flex items-center gap-1">
                    <AlertTriangle size={12} /> {errors.otherManualCo2}
                  </p>
                )}
              </div>
            )}

            {/* Date Selection */}
            <div>
              <label htmlFor="activity-date" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Date
              </label>
              <div className="relative">
                <input
                  id="activity-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75] transition-all cursor-pointer"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#1D9E75] text-white py-3.5 px-6 font-bold rounded-xl shadow-md hover:bg-[#0F6E56] active:translate-y-0.5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              Add Log Entry
            </button>
          </form>
        </div>

        {/* Dynamic Calculator Preview Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[12px] border border-gray-100 shadow-sm p-6 sticky top-24 space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Calculated Impact</h2>
            
            <div className="bg-[#F8FAF9] rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center text-center py-10 transition-all duration-500 hover:shadow-inner relative overflow-hidden group">
              {/* Soft decorative background glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#1D9E75]/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
              
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#1D9E75] bg-[#1D9E75]/5 px-3 py-1 rounded-full border border-[#1D9E75]/10 mb-4">
                Estimated Emissions
              </span>
              
              <div className="flex items-baseline justify-center gap-1.5 mb-1.5">
                <span className="text-5xl font-black text-gray-900 tracking-tight transition-all duration-300">
                  {estimatedEmissions}
                </span>
                <span className="text-base font-extrabold text-gray-400">kg</span>
              </div>
              <span className="text-xs font-semibold text-gray-500">CO₂ Equivalent</span>

              {/* Equivalence descriptors to create premium visual engagement */}
              {estimatedEmissions > 0 && (
                <div className="mt-6 pt-5 border-t border-gray-200/60 w-full text-left space-y-2.5 animate-fadeIn">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Environmental Equivalence</p>
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                      🌲 <span>Requires <b>{Math.max(1, Math.round(estimatedEmissions * 0.045 * 10) / 10)}</b> tree-days to absorb</span>
                    </p>
                    <p className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                      💡 <span>Same as running a LED bulb for <b>{Math.round(estimatedEmissions * 110)}</b> hours</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#1D9E75]/5 border border-[#1D9E75]/10 rounded-xl">
              <h4 className="text-xs font-bold text-[#1D9E75] uppercase tracking-wider mb-1">Calculation Method</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                {category === 'Transport' && `Calculated as: Distance (${transportDistance || 0} km) × Factor (${emissionFactors.transport[transportVehicle] || 0} kg/km) based on vehicle selection.`}
                {category === 'Food' && `Static factor based on average regional food-cycle emissions for a ${foodMealType}.`}
                {category === 'Energy' && `Calculated as: Electricity (${energyUsage || 0} kWh) × Factor (${emissionFactors.energy.electricity} kg/kWh).`}
                {category === 'Shopping' && `Calculated as: Amount spent (₹${shoppingAmount || 0}) × Item-cycle multiplier (${emissionFactors.shopping[shoppingType] || 0} kg/₹).`}
                {category === 'Other' && `Direct emissions override entered manually: ${otherManualCo2 || 0} kg CO₂.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
