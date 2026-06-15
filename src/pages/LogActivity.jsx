import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, CheckCircle2 } from 'lucide-react';
import { estimateEmissions } from '../utils/emissionsHelper';
import { UI } from '../constants';
import ActivityForm from '../components/ActivityForm';
import EmissionsPreview from '../components/EmissionsPreview';

export default function LogActivity() {
  useEffect(() => {
    document.title = 'Log Activity — CarbonSense';
  }, []);

  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    category: 'Transport',
    transportDistance: '',
    transportVehicle: 'Car',
    foodMealType: 'Veg meal',
    energyUsage: '',
    shoppingType: 'Electronics',
    shoppingAmount: '',
    otherManualCo2: ''
  });

  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastTimeoutRef = useRef(null);

  const estimatedEmissions = useMemo(() => estimateEmissions(formState), [formState]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const handleFormChange = useCallback((newState) => {
    setFormState(newState);
  }, []);

  const handleSuccess = useCallback(() => {
    setToastMessage('Activity logged! Redirecting to Dashboard…');
    setIsToastVisible(true);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setIsToastVisible(false);
      navigate('/');
    }, UI.TOAST_DURATION_MS);
  }, [navigate]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn relative">
      <div role="status" aria-live="polite" aria-atomic="true">
        {isToastVisible && (
          <div className="fixed top-4 right-4 z-50 bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3.5 shadow-xl flex items-center gap-3 animate-slideIn transition-all duration-300">
            <div className="p-1 bg-[#166E52] rounded-full text-white">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">{toastMessage}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-[#166E52]/10 rounded-xl text-[#166E52]">
          <PenTool size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Log an Activity</h1>
          <p className="text-sm text-gray-500 mt-1">Record daily choices to estimate and offset your environmental impact.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityForm 
            onFormChange={handleFormChange} 
            onSuccess={handleSuccess} 
            estimatedEmissions={estimatedEmissions} 
          />
        </div>

        <div className="lg:col-span-1">
          <EmissionsPreview 
            estimatedEmissions={estimatedEmissions} 
            {...formState} 
          />
        </div>
      </div>
    </div>
  );
}
