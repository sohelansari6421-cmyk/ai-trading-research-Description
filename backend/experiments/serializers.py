from rest_framework import serializers

from .models import Experiment


class ExperimentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Experiment

        fields = [
            "id",
            "original_question",
            "instrument",
            "timeframe",
            "entry_condition",
            "exit_condition",
            "holding_period",
            "filters",
            "research_question",
            "missing_information",
            "is_ready",
            "created_at",
        ]
