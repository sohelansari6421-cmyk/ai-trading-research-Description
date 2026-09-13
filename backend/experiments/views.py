from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .services.ai_parser import (
    analyze_experiment,
    update_experiment,
)
from .services.research_engine import run_research

from .models import Experiment
from .serializers import ExperimentSerializer


@api_view(["POST"])
def analyze_experiment_view(request):
    question = request.data.get("question")

    if not question:
        return Response(
            {"error": "Question is required."}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        result = analyze_experiment(question)

        experiment = Experiment.objects.create(
            original_question=question,
            instrument=result.get("instrument"),
            timeframe=result.get("timeframe"),
            entry_condition=result.get("entry_condition"),
            exit_condition=result.get("exit_condition"),
            holding_period=result.get("holding_period"),
            filters=result.get("filters", []),
            research_question=result.get("research_question", question),
            missing_information=result.get("missing_information", []),
            is_ready=result.get("is_ready", False),
        )

        saved_result = ExperimentSerializer(experiment).data

        return Response(saved_result, status=status.HTTP_200_OK)

    except Exception as error:
        return Response(
            {"error": str(error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
def update_experiment_view(request):
    experiment_data = request.data.get("experiment")

    answers = request.data.get("answers")

    if not experiment_data:
        return Response(
            {"error": "Experiment is required."}, status=status.HTTP_400_BAD_REQUEST
        )

    if not answers:
        return Response(
            {"error": "Answers are required."}, status=status.HTTP_400_BAD_REQUEST
        )

    experiment_id = experiment_data.get("id")

    if not experiment_id:
        return Response(
            {"error": "Experiment ID is required."}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        experiment = Experiment.objects.get(id=experiment_id)

        updated_result = update_experiment(experiment_data, answers)

        experiment.instrument = updated_result.get("instrument")

        experiment.timeframe = updated_result.get("timeframe")

        experiment.entry_condition = updated_result.get("entry_condition")

        experiment.exit_condition = updated_result.get("exit_condition")

        experiment.holding_period = updated_result.get("holding_period")

        experiment.filters = updated_result.get("filters", [])

        experiment.research_question = updated_result.get(
            "research_question", experiment.original_question
        )

        experiment.missing_information = updated_result.get("missing_information", [])

        experiment.is_ready = updated_result.get("is_ready", False)

        experiment.save()

        saved_result = ExperimentSerializer(experiment).data

        return Response(saved_result, status=status.HTTP_200_OK)

    except Experiment.DoesNotExist:
        return Response(
            {"error": "Experiment not found."}, status=status.HTTP_404_NOT_FOUND
        )

    except Exception as error:
        return Response(
            {"error": str(error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
def history_view(request):
    experiments = Experiment.objects.order_by("-created_at")

    serializer = ExperimentSerializer(experiments, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
def run_research_view(request, experiment_id):
    try:
        experiment = Experiment.objects.get(id=experiment_id)

        if not experiment.is_ready:
            return Response(
                {"error": "Experiment is not ready for research."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        experiment_data = ExperimentSerializer(experiment).data

        result = run_research(experiment_data)

        return Response(result, status=status.HTTP_200_OK)

    except Experiment.DoesNotExist:
        return Response(
            {"error": "Experiment not found."}, status=status.HTTP_404_NOT_FOUND
        )

    except Exception as error:
        return Response(
            {"error": str(error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
