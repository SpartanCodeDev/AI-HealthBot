# Gemini Integration Setup Guide

## Complete Step-by-Step Instructions

### Step 1: Get Your Gemini API Key ✅

1. Go to **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"** button
4. Copy the API key (it starts with `AIza...`)
5. **Save it somewhere safe** - you'll need it in Step 2

---

### Step 2: Add API Key to Django Settings

1. Open the file: `backend/config/config/settings.py`
2. Find this line near the bottom (around line 158):
   ```python
   GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'YOUR_API_KEY_HERE')
   ```
3. Replace `'YOUR_API_KEY_HERE'` with your actual API key:
   ```python
   GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyC...your-actual-key...')
   ```
4. **Save the file**

**Important Security Note:** Never share your API key or commit it to public repositories!

---

### Step 3: Restart Django Server

1. **Stop** your Django server if it's running (press `Ctrl + C` in the terminal)
2. **Start** it again:
   ```powershell
   cd C:\Users\qasit\Downloads\healthbot\healthbot\backend\config
   ..\venv\Scripts\python.exe manage.py runserver
   ```
3. You should see: `Starting development server at http://127.0.0.1:8000/`

---

### Step 4: Test the Integration

#### Test 1: Test Backend Directly (Thunder Client / Postman)

1. Open Thunder Client (or Postman)
2. Create a new request:
   - **Method:** `POST`
   - **URL:** `http://127.0.0.1:8000/api/checkups/`
   - **Headers:**
     ```
     Content-Type: application/json
     ```
   - **Body (raw JSON):**
     ```json
     {
       "age": 25,
       "gender": "male",
       "symptoms": "I have a headache for two days and feel tired",
       "severity": 5
     }
     ```
3. **Send** the request
4. **Expected Result:**
   - Status: `200 OK`
   - Response should contain a `result` object with:
     - `summary` (text from Gemini)
     - `conditions` (array of possible diagnoses)
     - `pharmacies` (array of pharmacy info)

#### Test 2: Test Through Frontend

1. Make sure your React frontend is running:
   ```powershell
   cd C:\Users\qasit\Downloads\healthbot\healthbot
   npm run dev
   ```
2. Open `http://localhost:5173` in your browser
3. Fill out the form:
   - Age: `25`
   - Gender: `male`
   - Symptoms: `I have a headache for two days and feel tired`
   - Severity: `5`
4. Click **"Analyze Symptoms"**
5. **Expected Result:**
   - Shows "Analyzing Symptoms..." briefly
   - Then displays **real AI-generated diagnosis** from Gemini!

---

## How It Works (Explanation)

### The Flow:

```
1. User fills form in React frontend
   ↓
2. Frontend sends POST request to Django
   ↓
3. Django receives: age, gender, symptoms, severity
   ↓
4. Django calls Gemini API with a carefully crafted prompt
   ↓
5. Gemini analyzes symptoms and returns diagnosis
   ↓
6. Django formats response and sends back to frontend
   ↓
7. Frontend displays the AI-generated results!
```

### The "Training" (Prompt Engineering):

The "training" happens in the **prompt** we send to Gemini. In `gemini_service.py`, we tell Gemini:

- **Who it is:** "You are a medical triage assistant"
- **What to do:** Analyze patient symptoms and provide guidance
- **How to respond:** Return structured JSON with specific fields
- **Important disclaimers:** Always remind users this is not a diagnosis

This prompt "teaches" Gemini how to respond correctly without actually training a model.

---

## Troubleshooting

### Error: "GEMINI_API_KEY not set"

**Solution:** Make sure you added your API key in `settings.py` (Step 2) and restarted Django (Step 3).

### Error: "Error getting diagnosis" or 500 error

**Possible causes:**
1. API key is incorrect - double-check it in `settings.py`
2. API key has no credits/quota exceeded - check your Google AI Studio dashboard
3. Network issue - check your internet connection

**Solution:** Check Django terminal for the exact error message.

### Response is not in correct format

**Solution:** Gemini sometimes returns JSON wrapped in markdown. The code handles this automatically, but if you see issues, check the Django terminal logs.

### Frontend shows error or gets stuck

**Solution:**
1. Open browser DevTools (F12)
2. Check **Console** tab for errors
3. Check **Network** tab - look for the `checkups` request
4. If status is not `200`, check the error message

---

## What's Next?

Now that Gemini is integrated, you can:

1. **Improve the prompt** - Edit `gemini_service.py` to make Gemini responses more accurate
2. **Add more fields** - Ask Gemini for additional information (e.g., recommended tests, follow-up questions)
3. **Add error handling** - Make the frontend show better error messages
4. **Add loading states** - Show progress while waiting for Gemini response

---

## Files Changed

- ✅ `backend/config/checkups/gemini_service.py` - New file (handles Gemini API calls)
- ✅ `backend/config/checkups/views.py` - Updated (now calls Gemini instead of mock data)
- ✅ `backend/config/config/settings.py` - Updated (added GEMINI_API_KEY configuration)

---

## Success Checklist

- [ ] Got Gemini API key from Google AI Studio
- [ ] Added API key to `settings.py`
- [ ] Restarted Django server
- [ ] Tested with Thunder Client/Postman - got 200 OK response
- [ ] Tested through frontend - saw AI-generated diagnosis
- [ ] No errors in Django terminal
- [ ] No errors in browser console

If all checked, **you're done!** 🎉

