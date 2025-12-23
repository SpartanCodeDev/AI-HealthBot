from rest_framework import serializers
from .models import Checkup


class CheckupCreateSerializer(serializers.Serializer):
    """Validate incoming checkup data from frontend."""

    age = serializers.IntegerField(min_value=0, max_value=120)
    gender = serializers.ChoiceField(choices=['male', 'female', 'other'])
    symptoms = serializers.CharField(min_length=5, max_length=2000)
    severity = serializers.IntegerField(min_value=1, max_value=10)


class CheckupSerializer(serializers.ModelSerializer):
    """Serialize checkup data including AI result."""

    class Meta:
        model = Checkup
        fields = [
            'id',
            'age',
            'gender',
            'symptoms',
            'severity',
            'result',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']



