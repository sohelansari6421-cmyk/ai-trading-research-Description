from django.urls import path
from .views import (
    analyze_experiment_view,
    update_experiment_view,
    history_view,
    run_research_view,
)

urlpatterns = [
    path("analyze/", analyze_experiment_view, name="analyze-experiment"),
    path("update/", update_experiment_view, name="update-experiment"),
    path("history/", history_view, name="experiment-history"),
    path("<int:experiment_id>/research/", run_research_view, name="run-research"),
]
