from django.db import models

# Create your models here.
from django.db import models


class Experiment(models.Model):
    original_question = models.TextField()

    instrument = models.CharField(max_length=100, null=True, blank=True)

    timeframe = models.CharField(max_length=100, null=True, blank=True)

    entry_condition = models.TextField(null=True, blank=True)

    exit_condition = models.TextField(null=True, blank=True)

    holding_period = models.CharField(max_length=100, null=True, blank=True)

    filters = models.JSONField(default=list, blank=True)

    research_question = models.TextField()

    missing_information = models.JSONField(default=list, blank=True)

    is_ready = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.original_question[:50]
