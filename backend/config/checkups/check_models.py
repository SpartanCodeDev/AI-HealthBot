"""
Quick script to check which Gemini models are available with your API key.
Run this to see what models you can use.
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
import google.generativeai as genai

# Get API key from settings
api_key = getattr(settings, 'GEMINI_API_KEY', '')
if not api_key or api_key == 'YOUR_API_KEY_HERE':
    print("ERROR: GEMINI_API_KEY not set in settings.py")
    sys.exit(1)

genai.configure(api_key=api_key)

print("Checking available Gemini models...\n")

try:
    models = list(genai.list_models())
    print(f"Found {len(models)} available models:\n")
    
    for model in models:
        print(f"  - {model.name}")
        if hasattr(model, 'supported_generation_methods'):
            print(f"    Methods: {model.supported_generation_methods}")
        print()
    
    # Suggest which model to use
    model_names = [m.name for m in models]
    if 'models/gemini-pro' in model_names:
        print("✅ Recommended: Use 'gemini-pro'")
    elif 'models/gemini-1.5-pro' in model_names:
        print("✅ Recommended: Use 'gemini-1.5-pro'")
    elif 'models/gemini-1.5-flash' in model_names:
        print("✅ Recommended: Use 'gemini-1.5-flash'")
    else:
        print("⚠️  No standard models found. Check the list above.")
        
except Exception as e:
    print(f"Error listing models: {e}")
    print("\nTrying to use gemini-pro directly...")
    try:
        model = genai.GenerativeModel('gemini-pro')
        print("✅ 'gemini-pro' works!")
    except Exception as e2:
        print(f"❌ 'gemini-pro' failed: {e2}")

