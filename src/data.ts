export interface CheckupFormData {
    age: string;
    gender: string;
    symptoms: string;
    severity: number;
  }
  
  export type Urgency = 'low' | 'medium' | 'high' | 'emergency';
  
  export interface Pharmacy {
    id: string;
    name: string;
    distance: string;
    openUntil: string;
  }
  
  export interface Condition {
    id: string;
    name: string;
    probability: number;
    explanation: string;
    urgency: Urgency;
    recommendations: string[];
  }
  
  export interface CheckupResult {
    conditions: Condition[];
    summary: string;
    pharmacies: Pharmacy[];
  }
  
  const mockPharmacies: Pharmacy[] = [
    { id: 'p1', name: 'HealthPlus Pharmacy', distance: '0.4 miles', openUntil: '9:00 PM' },
    { id: 'p2', name: 'City Meds 24/7', distance: '1.2 miles', openUntil: '24 Hours' },
  ];
  
  export const mockCheckup = async (data: CheckupFormData): Promise<CheckupResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const symptoms = (data.symptoms || "").toLowerCase();
        if (symptoms.includes("chest") || symptoms.includes("heart") || symptoms.includes("crushing")) {
          resolve({
              summary: "Based on reported symptoms, immediate attention is required.",
              conditions: [
              {
                  id: 'c1', name: 'Angina Pectoris', probability: 0.85, urgency: 'emergency',
                  explanation: 'Chest pain/pressure combined with risk factors suggests potential heart issues.',
                  recommendations: ['Call Emergency Services immediately', 'Chew an aspirin if not allergic', 'Rest sitting up']
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
                  recommendations: ['Rest and hydration', 'OTC Decongestants']
              }
              ],
              pharmacies: mockPharmacies
          });
        }
      }, 1500); 
    });
  };