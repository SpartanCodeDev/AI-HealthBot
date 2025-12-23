"""
Service layer for AI checkup processing.
Currently returns mock data; replace with Ollama/LLM later.
"""


def run_ai_checkup(data):
    """
    Process checkup data and return an AI-like diagnosis.

    Args:
        data: dict with keys: age, gender, symptoms, severity

    Returns:
        dict: {
            'summary': str,
            'conditions': [...],
            'pharmacies': [...]
        }
    """
    symptoms_lower = data.get('symptoms', '').lower()

    if any(keyword in symptoms_lower for keyword in ['chest', 'heart', 'crushing']):
        return {
            'summary': 'Based on the reported chest pain, immediate attention is required to rule out cardiac events.',
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
                        'Rest sitting up',
                    ],
                },
                {
                    'id': 'c2',
                    'name': 'GERD (Acid Reflux)',
                    'probability': 0.45,
                    'urgency': 'low',
                    'explanation': 'Burning sensation can mimic heart pain, but cardiac issues must be ruled out first.',
                    'recommendations': [
                        'Take antacids',
                        'Avoid lying down',
                    ],
                },
            ],
            'pharmacies': [
                {'id': 'p1', 'name': 'HealthPlus Pharmacy', 'distance': '0.4 miles', 'openUntil': '9:00 PM'},
                {'id': 'p2', 'name': 'City Meds 24/7', 'distance': '1.2 miles', 'openUntil': '24 Hours'},
            ],
        }

    return {
        'summary': 'Your symptoms correspond strongly with a viral upper respiratory infection.',
        'conditions': [
            {
                'id': 'c3',
                'name': 'Common Cold',
                'probability': 0.92,
                'urgency': 'low',
                'explanation': 'Sneezing, congestion, and mild fatigue are classic signs.',
                'recommendations': [
                    'Rest and hydration',
                    'OTC Decongestants',
                    'Saline nasal spray',
                ],
            },
            {
                'id': 'c4',
                'name': 'Seasonal Allergies',
                'probability': 0.60,
                'urgency': 'low',
                'explanation': 'If symptoms persist only outdoors or around pets.',
                'recommendations': [
                    'Antihistamines',
                    'Avoid allergens',
                ],
            },
        ],
        'pharmacies': [
            {'id': 'p1', 'name': 'HealthPlus Pharmacy', 'distance': '0.4 miles', 'openUntil': '9:00 PM'},
            {'id': 'p2', 'name': 'City Meds 24/7', 'distance': '1.2 miles', 'openUntil': '24 Hours'},
        ],
    }



