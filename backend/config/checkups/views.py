from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .gemini_service import get_gemini_diagnosis


class CheckupViewSet(viewsets.ViewSet):
    """
    Endpoint that receives checkup data and returns AI-generated diagnosis from Gemini.
    
    POST /api/checkups/
    Body: { "age": 25, "gender": "male", "symptoms": "...", "severity": 5 }
    Returns: { "result": { "summary": "...", "conditions": [...], "pharmacies": [...] } }
    """

    permission_classes = [AllowAny]

    def create(self, request):
        # Validate input (basic checks)
        age = request.data.get('age')
        gender = request.data.get('gender')
        symptoms = request.data.get('symptoms', '')
        severity = request.data.get('severity')

        if not age or not gender or not symptoms or severity is None:
            return Response(
                {'detail': 'Missing required fields: age, gender, symptoms, severity'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Convert age and severity to integers
        try:
            age = int(age)
            severity = int(severity)
        except (ValueError, TypeError):
            return Response(
                {'detail': 'Age and severity must be valid numbers'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate ranges
        if age < 0 or age > 120:
            return Response(
                {'detail': 'Age must be between 0 and 120'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if severity < 1 or severity > 10:
            return Response(
                {'detail': 'Severity must be between 1 and 10'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Call Gemini API to get diagnosis
        try:
            result = get_gemini_diagnosis(
                age=age,
                gender=gender,
                symptoms=symptoms,
                severity=severity
            )
        except Exception as e:
            # If Gemini fails, return error
            return Response(
                {
                    'detail': f'Error getting diagnosis: {str(e)}',
                    'error': 'Please check your Gemini API key is set correctly in settings.py'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Return in format frontend expects
        return Response({'result': result}, status=status.HTTP_200_OK)
