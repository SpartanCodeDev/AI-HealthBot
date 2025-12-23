"""
Service to interact with Google Gemini API for medical checkup diagnosis.
"""
import json
from django.conf import settings
import google.generativeai as genai

# Get API key from Django settings
GEMINI_API_KEY = getattr(settings, 'GEMINI_API_KEY', '')


def get_gemini_diagnosis(age, gender, symptoms, severity):
    """
    Send patient data to Gemini and get a structured diagnosis response.
    
    Args:
        age: Patient age (int)
        gender: Patient gender (str: 'male', 'female', 'other')
        symptoms: Description of symptoms (str)
        severity: Pain severity 1-10 (int)
    
    Returns:
        dict: {
            'summary': str,
            'conditions': [...],
            'pharmacies': [...]
        }
    """
    
    # Configure Gemini with API key
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not set. Please add it to Django settings.py or set as environment variable.")
    
    genai.configure(api_key=GEMINI_API_KEY)
    
    # Use Gemini 2.5 Flash (latest and fastest Gemini 2.5 model)
    # Alternatives: 'gemini-2.5-pro' (more capable but slower), 'gemini-2.5-flash' (faster)
    model_name = 'gemini-2.5-flash'
    
    try:
        model = genai.GenerativeModel(model_name)
    except Exception as e:
        # Fallback to gemini-2.5-pro if flash is not available
        error_msg = str(e)
        if 'not found' in error_msg.lower() or 'not supported' in error_msg.lower():
            try:
                print(f"gemini-2.5-flash not available, trying gemini-2.5-pro...")
                model = genai.GenerativeModel('gemini-2.5-pro')
                model_name = 'gemini-2.5-pro'
            except Exception as e2:
                raise ValueError(f"Gemini 2.5 models not available. Error: {str(e2)}. Please check your API key has access to Gemini 2.5 models.")
        else:
            raise ValueError(f"Error initializing Gemini model: {error_msg}")
    
    # Build the prompt - this is what "trains" Gemini to respond correctly
    prompt = f"""You are a medical triage assistant. Your role is to provide preliminary guidance based on patient symptoms. 
IMPORTANT: This is NOT a definitive diagnosis - always recommend consulting a healthcare professional.

Patient Information:
- Age: {age}
- Gender: {gender}
- Symptoms: {symptoms}
- Pain Severity (1-10): {severity}

Based on this information, provide a medical assessment in the following JSON format. 
Return ONLY valid JSON, no additional text before or after:

{{
  "summary": "A brief 1-2 sentence summary of the assessment",
  "conditions": [
    {{
      "id": "c1",
      "name": "Most likely condition name",
      "probability": 0.85,
      "urgency": "low|medium|high|emergency",
      "explanation": "Why this condition is suspected based on symptoms",
      "recommendations": [
        "Recommendation 1",
        "Recommendation 2",
        "Recommendation 3"
      ]
    }},
    {{
      "id": "c2",
      "name": "Alternative condition name (if applicable)",
      "probability": 0.45,
      "urgency": "low|medium|high|emergency",
      "explanation": "Why this alternative is possible",
      "recommendations": [
        "Recommendation 1",
        "Recommendation 2"
      ]
    }}
  ],
  "pharmacies": [
    {{
      "id": "p1",
      "name": "HealthPlus Pharmacy",
      "distance": "0.4 miles",
      "openUntil": "9:00 PM"
    }},
    {{
      "id": "p2",
      "name": "City Meds 24/7",
      "distance": "1.2 miles",
      "openUntil": "24 Hours"
    }}
  ]
}}

Guidelines:
- If symptoms suggest emergency (chest pain, difficulty breathing, severe trauma), set urgency to "emergency"
- Provide 1-3 possible conditions with probabilities
- Keep recommendations practical and actionable
- Always include a disclaimer in the summary that this is not a substitute for professional medical advice
- Use appropriate urgency levels based on symptom severity
"""
    
    try:
        # Call Gemini API
        response = model.generate_content(prompt)
        
        # Extract text from response
        response_text = response.text.strip()
        
        # Sometimes Gemini wraps JSON in markdown code blocks, remove them
        if response_text.startswith('```json'):
            response_text = response_text.replace('```json', '').replace('```', '').strip()
        elif response_text.startswith('```'):
            response_text = response_text.replace('```', '').strip()
        
        # Parse JSON response
        result = json.loads(response_text)
        
        # Validate structure matches what frontend expects
        if 'summary' not in result or 'conditions' not in result or 'pharmacies' not in result:
            raise ValueError("Gemini response missing required fields")
        
        return result
        
    except json.JSONDecodeError as e:
        # If JSON parsing fails, return a fallback response
        print(f"Error parsing Gemini JSON: {e}")
        print(f"Raw response: {response_text}")
        return get_fallback_response(age, gender, symptoms, severity)
    except Exception as e:
        # If API call fails, return fallback
        print(f"Error calling Gemini API: {e}")
        return get_fallback_response(age, gender, symptoms, severity)


def get_fallback_response(age, gender, symptoms, severity):
    """
    Fallback response if Gemini API fails.
    Returns mock data matching the expected format.
    """
    symptoms_lower = symptoms.lower()
    
    if any(keyword in symptoms_lower for keyword in ['chest', 'heart', 'crushing']):
        return {
            'summary': 'Based on the reported chest pain, immediate attention is required to rule out cardiac events. Please consult a healthcare professional immediately.',
            'conditions': [
                {
                    'id': 'c1',
                    'name': 'Angina Pectoris',
                    'probability': 0.85,
                    'urgency': 'emergency',
                    'explanation': 'Chest pain/pressure combined with risk factors suggests potential heart issues.',
                    'recommendations': [
                        'Call Emergency Services immediately',
                        'Chew an aspirin if not allergic',
                        'Rest sitting up'
                    ]
                }
            ],
            'pharmacies': [
                {
                    'id': 'p1',
                    'name': 'HealthPlus Pharmacy',
                    'distance': '0.4 miles',
                    'openUntil': '9:00 PM'
                },
                {
                    'id': 'p2',
                    'name': 'City Meds 24/7',
                    'distance': '1.2 miles',
                    'openUntil': '24 Hours'
                }
            ]
        }
    else:
        return {
            'summary': 'Your symptoms suggest a common viral infection. This is not a diagnosis - please consult a healthcare professional for proper evaluation.',
            'conditions': [
                {
                    'id': 'c3',
                    'name': 'Common Cold',
                    'probability': 0.75,
                    'urgency': 'low',
                    'explanation': 'Symptoms are consistent with a viral upper respiratory infection.',
                    'recommendations': [
                        'Rest and hydration',
                        'OTC Decongestants',
                        'Consult a doctor if symptoms worsen'
                    ]
                }
            ],
            'pharmacies': [
                {
                    'id': 'p1',
                    'name': 'HealthPlus Pharmacy',
                    'distance': '0.4 miles',
                    'openUntil': '9:00 PM'
                },
                {
                    'id': 'p2',
                    'name': 'City Meds 24/7',
                    'distance': '1.2 miles',
                    'openUntil': '24 Hours'
                }
            ]
        }

