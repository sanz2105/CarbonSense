import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';
import { saveActivity } from '../utils/storage';
import { UI } from '../constants';

function ActivityForm({ onFormChange, onSuccess, estimatedEmissions }) {
  const [category, setCategory] = useState('Transport');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));

  const [transportDistance, setTransportDistance] = useState('');
  const [transportVehicle, setTransportVehicle] = useState('Car');
  const [foodMealType, setFoodMealType] = useState('Veg meal');
  const [energyUsage, setEnergyUsage] = useState('');
  const [shoppingType, setShoppingType] = useState('Electronics');
  const [shoppingAmount, setShoppingAmount] = useState('');
  const [otherManualCo2, setOtherManualCo2] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    onFormChange({
      category, transportDistance, transportVehicle, foodMealType, energyUsage, shoppingType, shoppingAmount, otherManualCo2
    });
  }, [category, transportDistance, transportVehicle, foodMealType, energyUsage, shoppingType, shoppingAmount, otherManualCo2, onFormChange]);

  const handleCategoryChange = useCallback((e) => {
    setCategory(e.target.value);
    setErrors({});
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length > UI.MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `Description cannot exceed ${UI.MAX_DESCRIPTION_LENGTH} characters`;
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
  }, [description, category, transportDistance, energyUsage, shoppingAmount, otherManualCo2]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

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

    saveActivity(activity);
    window.dispatchEvent(new Event('carbonsense-activity-saved'));
    onSuccess();

    setDescription('');
    setTransportDistance('');
    setEnergyUsage('');
    setShoppingAmount('');
    setOtherManualCo2('');
    setErrors({});
  }, [validate, category, description, date, estimatedEmissions, transportDistance, transportVehicle, foodMealType, energyUsage, shoppingType, shoppingAmount, otherManualCo2, onSuccess]);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[12px] border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
      <div>
        <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={handleCategoryChange}
          className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-[#166E52]/20 focus:border-[#166E52] transition-all cursor-pointer"
        >
          <option value="Transport">🚗 Transport</option>
          <option value="Food">🍔 Food</option>
          <option value="Energy">⚡ Energy</option>
          <option value="Shopping">🛍️ Shopping</option>
          <option value="Other">⚙️ Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          maxLength={UI.MAX_DESCRIPTION_LENGTH}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={
            category === 'Transport' ? 'e.g. Drove 15 km to work' :
            category === 'Food' ? 'e.g. Hamburger lunch with drinks' :
            category === 'Energy' ? 'e.g. Monthly electricity usage' :
            category === 'Shopping' ? 'e.g. Purchased leather jacket' : 'e.g. Miscellaneous carbon item'
          }
          className={`w-full bg-gray-50 border text-gray-800 rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#166E52]/20 focus:border-[#166E52] transition-all ${
            errors.description ? 'border-red-500 bg-red-50/10 focus:ring-red-100' : 'border-gray-200'
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500 font-semibold flex items-center gap-1">
            <AlertTriangle size={12} /> {errors.description}
          </p>
        )}
      </div>

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
              className="w-full bg-white border border-gray-200 text-gray-800 rounded-lg px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#166E52]/20 focus:border-[#166E52] transition-all cursor-pointer"
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
              className={`w-full bg-white border text-gray-800 rounded-lg px-3.5 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#166E52]/20 focus:border-[#166E52] transition-all ${
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
            className="w-full bg-white border border-gray-200 text-gray-800 rounded-lg px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#166E52]/20 focus:border-[#166E52] transition-all cursor-pointer"
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
            className={`w-full bg-white border text-gray-800 rounded-lg px-3.5 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#166E52]/20 focus:border-[#166E52] transition-all ${
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
              className="w-full bg-white border border-gray-200 text-gray-800 rounded-lg px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#166E52]/20 focus:border-[#166E52] transition-all cursor-pointer"
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
              className={`w-full bg-white border text-gray-800 rounded-lg px-3.5 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#166E52]/20 focus:border-[#166E52] transition-all ${
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
            className={`w-full bg-white border text-gray-800 rounded-lg px-3.5 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#166E52]/20 focus:border-[#166E52] transition-all ${
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
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-[#166E52]/20 focus:border-[#166E52] transition-all cursor-pointer"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#166E52] text-white py-3.5 px-6 font-bold rounded-xl shadow-md hover:bg-[#0F6E56] active:translate-y-0.5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      >
        Add Log Entry
      </button>
    </form>
  );
}

ActivityForm.propTypes = {
  onFormChange: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  estimatedEmissions: PropTypes.number.isRequired,
};

export default React.memo(ActivityForm);
