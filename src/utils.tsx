import React, { useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, ShieldAlert, MapPin, Stethoscope, Mic, ChevronRight, 
  Phone, Navigation 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from './utils'; // Import the helper we just fixed

// --- TYPED UI COMPONENTS ---

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card = ({ children, className, onClick }: CardProps) => (
  <div onClick={onClick} className={cn("bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm p-6", className)}>
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
}

const Button = ({ variant = 'primary', className, loading, children, ...props }: ButtonProps) => {
  const base = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/20",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
    outline: "border-2 border-slate-200 hover:border-teal-500 text-slate-600 hover:text-teal-600",
    danger: "bg-red-500 hover:bg-red-600 text-white"
  };
  return (
    <button className={cn(base, variants[variant], className)} disabled={loading} {...props}>
      {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : children}
    </button>
  );
};

// --- MOCK DATA & API ---

type Urgency = 'low' | 'medium' | 'high' | 'emergency';

interface Pharmacy {
  id: string;
  name: string;
  distance: string;
  openUntil: string;
}

interface Condition {
  id: string;
  name: string;
  probability: number;
  explanation: string;
  urgency: Urgency;
  recommendations: string[];
}

interface CheckupResult {
  conditions: Condition[];
  summary: string;
  pharmacies: Pharmacy[];
}

interface CheckupFormData {
  age: string;
  gender: string;
  symptoms: string;
  severity: number;
}

const mockPharmacies: Pharmacy[] = [
  { id: 'p1', name: 'HealthPlus Pharmacy', distance: '0.4 miles', openUntil: '9:00 PM' },
  { id: 'p2', name: 'City Meds 24/7', distance: '1.2 miles', openUntil: '24 Hours' },
];

const mockCheckup = async (data: CheckupFormData): Promise<CheckupResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const symptoms = (data.symptoms || "").toLowerCase();
      
      if (symptoms.includes("chest") || symptoms.includes("heart") || symptoms.includes("crushing")) {
        resolve({
            summary: "Based on the reported chest pain, immediate attention is required to rule out cardiac events.",
            conditions: [
            {
                id: 'c1', name: 'Angina Pectoris', probability: 0.85, urgency: 'emergency',
                explanation: 'Chest pain/pressure combined with risk factors suggests potential heart issues.',
                recommendations: ['Call Emergency Services immediately', 'Chew an aspirin if not allergic', 'Rest sitting up']
            },
            {
                id: 'c2', name: 'GERD (Acid Reflux)', probability: 0.45, urgency: 'low',
                explanation: 'Burning sensation can mimic heart pain, but cardiac issues must be ruled out first.',
                recommendations: ['Take antacids', 'Avoid lying down']
            }
            ],
            pharmacies: mockPharmacies
        });
      } else {
        resolve({
            summary: "Your symptoms correspond strongly with a viral upper respiratory infection.",
            conditions: [
            {
                id: 'c3', name: 'Common Cold', probability: 0.92, urgency: 'low',
                explanation: 'Sneezing, congestion, and mild fatigue are classic signs.',
                recommendations: ['Rest and hydration', 'OTC Decongestants', 'Saline nasal spray']
            },
            {
                id: 'c4', name: 'Seasonal Allergies', probability: 0.60, urgency: 'low',
                explanation: 'If symptoms persist only outdoors or around pets.',
                recommendations: ['Antihistamines', 'Avoid allergens']
            }
            ],
            pharmacies: mockPharmacies
        });
      }
    }, 2000);
  });
};

// --- SUB-COMPONENTS ---

const Header = () => (
  <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 flex items-center justify-between px-6">
    <div className="flex items-center gap-2 text-teal-600">
      <div className="bg-teal-100 p-2 rounded-lg"><Activity size={24} /></div>
      <span className="font-bold text-xl tracking-tight text-slate-800">HealthBot</span>
    </div>
    <div className="flex gap-4 items-center">
      <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold text-slate-500">
        You
      </div>
    </div>
  </header>
);

const StepBasicInfo = () => {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-800">Let's start with the basics.</h2>
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-slate-700 font-medium">Age</span>
          <input 
            {...register('age', { required: true, min: 0, max: 120 })} 
            type="number" 
            className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 p-3 focus:ring-2 focus:ring-teal-500 outline-none" 
            placeholder="e.g. 29" 
          />
          {errors.age && <span className="text-red-500 text-sm">Age is required</span>}
        </label>
        <label className="block">
          <span className="text-slate-700 font-medium">Gender</span>
          <select {...register('gender')} className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>
    </div>
  );
};

const StepSymptoms = () => {
  const { register, watch, setValue } = useFormContext();
  const [isListening, setIsListening] = useState(false);
  
  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        const current = watch('symptoms') || "";
        setValue('symptoms', current + (current ? " " : "") + "I have a sharp pain in my chest.");
        setIsListening(false);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Describe your symptoms.</h2>
      <div className="relative">
        <textarea 
          {...register('symptoms', { required: true })}
          className="w-full h-32 rounded-xl border border-slate-200 bg-slate-50 p-4 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
          placeholder="e.g., I've had a headache for 2 days..."
        ></textarea>
        <button 
          type="button"
          onClick={toggleVoice}
          aria-label={isListening ? "Stop voice input" : "Start voice input"}
          className={cn("absolute bottom-4 right-4 p-2 rounded-full transition-colors", isListening ? "bg-red-500 text-white animate-pulse" : "bg-slate-200 text-slate-600 hover:bg-slate-300")}
        >
          <Mic size={20} />
        </button>
      </div>
      <div>
        <span className="block text-slate-700 font-medium mb-2">Severity (1-10)</span>
        <input {...register('severity')} type="range" min="1" max="10" className="w-full accent-teal-500" />
      </div>
    </div>
  );
};

const AnalyzingScreen = () => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div className="relative w-24 h-24 mb-6">
      <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
      <Stethoscope className="absolute inset-0 m-auto text-teal-500" size={32} />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing Symptoms...</h3>
    <p className="text-slate-500 max-w-xs">Comparing against medical database.</p>
  </motion.div>
);

const RiskGauge = ({ urgency }: { urgency: string }) => {
  const data = [
      { name: 'Safe', value: 30, color: '#2dd4bf' },
      { name: 'Caution', value: 30, color: '#facc15' },
      { name: 'Danger', value: 30, color: '#f87171' },
  ];
  return (
      <div className="h-32 w-full relative flex items-center justify-center flex-col">
          <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                  <Pie data={data} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                      {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
              </PieChart>
          </ResponsiveContainer>
          <div className="absolute bottom-0 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-widest">Risk Level</p>
              <p className={cn("text-lg font-bold capitalize", urgency === 'emergency' ? "text-red-500" : "text-slate-800")}>{urgency}</p>
          </div>
      </div>
  )
};

const ResultCard = ({ condition, isOpen, onToggle }: { condition: Condition, isOpen: boolean, onToggle: () => void }) => {
  const isUrgent = condition.urgency === 'emergency';
  return (
    <motion.div layout className={cn("border rounded-xl overflow-hidden mb-4 transition-colors", isUrgent ? "border-red-200 bg-red-50" : "border-slate-200 bg-white")}>
      <div className="p-4 flex items-center justify-between cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm", isUrgent ? "bg-red-100 text-red-600" : "bg-teal-50 text-teal-600")}>
            {(condition.probability * 100).toFixed(0)}%
          </div>
          <div>
            <h4 className="font-bold text-slate-800">{condition.name}</h4>
            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full uppercase", isUrgent ? "bg-red-200 text-red-700" : "bg-slate-100 text-slate-500")}>
              {condition.urgency}
            </span>
          </div>
        </div>
        <ChevronRight className={cn("text-slate-400 transition-transform", isOpen && "rotate-90")} />
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100/50"
          >
            <div className="p-4 pt-0 text-sm text-slate-600 space-y-3">
              <p className="mt-2"><strong>Reasoning:</strong> {condition.explanation}</p>
              <div className="bg-white/50 p-3 rounded-lg border border-slate-100">
                <strong className="block mb-1 text-slate-700">Recommended Steps:</strong>
                <ul className="list-disc pl-4 space-y-1">
                  {condition.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [view, setView] = useState<'landing' | 'wizard' | 'analyzing' | 'results'>('landing');
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<CheckupResult | null>(null);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);

  const methods = useForm<CheckupFormData>({ 
    defaultValues: { age: '', gender: 'male', symptoms: '', severity: 5 } 
  });

  const steps = [
    { title: "Basic Info", component: <StepBasicInfo /> },
    { title: "Symptoms", component: <StepSymptoms /> },
  ];

  const handleNext = async () => {
    const isValid = await methods.trigger();
    if (isValid) {
      if (step < steps.length - 1) {
        setStep(s => s + 1);
      } else {
        setView('analyzing');
        const data = await mockCheckup(methods.getValues());
        setResults(data);
        setView('results');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Header />
      
      <main className="pt-24 px-4 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* VIEW: LANDING */}
          {view === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="space-y-4">
                <div className="inline-block p-3 rounded-2xl bg-teal-50 text-teal-600 mb-4"><Activity size={48} /></div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                  Healthcare, <span className="text-teal-500">Simplified.</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-md mx-auto">
                  AI-powered symptom checker. Get instant insights, treatment suggestions, and find nearby care.
                </p>
              </div>
              
              <Button onClick={() => setView('wizard')} className="w-full md:w-auto text-lg py-4 px-8 shadow-xl shadow-teal-500/20 mx-auto">
                Start Free Checkup
              </Button>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800 flex items-start gap-3 text-left max-w-md mx-auto">
                <ShieldAlert className="shrink-0 mt-0.5" size={18} />
                <p><strong>Disclaimer:</strong> This is a demo. Not a substitute for professional medical advice. In emergencies, call 911.</p>
              </div>
            </motion.div>
          )}

          {/* VIEW: WIZARD */}
          {view === 'wizard' && (
            <FormProvider {...methods}>
              <motion.div 
                key="wizard"
                initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <button className="text-sm font-medium text-slate-500 hover:text-slate-800" onClick={() => step > 0 ? setStep(s => s-1) : setView('landing')}>← Back</button>
                  <div className="flex gap-2">
                    {steps.map((_, i) => (
                      <div key={i} className={cn("h-2 w-8 rounded-full transition-colors", i <= step ? "bg-teal-500" : "bg-slate-200")} />
                    ))}
                  </div>
                </div>

                <Card className="min-h-[400px] flex flex-col justify-between">
                  <form onSubmit={(e) => e.preventDefault()}>
                    {steps[step].component}
                  </form>
                  <div className="mt-8 flex justify-end">
                    <Button onClick={handleNext}>
                      {step === steps.length - 1 ? 'Analyze Symptoms' : 'Next Step'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </FormProvider>
          )}

          {/* VIEW: ANALYZING */}
          {view === 'analyzing' && <AnalyzingScreen key="analyzing" />}

          {/* VIEW: RESULTS */}
          {view === 'results' && results && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-teal-600" />
                <RiskGauge urgency={results.conditions[0]?.urgency || 'low'} />
                <p className="mt-4 text-slate-700 font-medium">{results.summary}</p>
              </div>

              <div>
                <h3 className="font-bold text-lg text-slate-800 mb-3 ml-1">Analysis Results</h3>
                {results.conditions.map((c) => (
                  <ResultCard 
                    key={c.id} 
                    condition={c} 
                    isOpen={expandedResult === c.id} 
                    onToggle={() => setExpandedResult(expandedResult === c.id ? null : c.id)} 
                  />
                ))}
              </div>

              <div>
                <h3 className="font-bold text-lg text-slate-800 mb-3 ml-1">Nearby Support</h3>
                <div className="grid gap-3">
                  {results.pharmacies.map(p => (
                    <Card key={p.id} className="flex justify-between items-center p-4">
                      <div>
                        <div className="font-bold text-slate-800">{p.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin size={12} /> {p.distance} • Open until {p.openUntil}
                        </div>
                      </div>
                      <div className="flex gap-2">
                         <Button variant="outline" aria-label="Call Pharmacy" className="p-2 h-10 w-10 rounded-full"><Phone size={16} /></Button>
                         <Button variant="primary" aria-label="Get Directions" className="p-2 h-10 w-10 rounded-full bg-teal-500"><Navigation size={16} /></Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="pt-4 pb-8">
                <Button variant="secondary" className="w-full" onClick={() => setView('landing')}>Start New Checkup</Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}