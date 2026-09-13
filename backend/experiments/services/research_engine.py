def run_research(experiment):
    """
    Prototype research engine.

    This currently returns simulated research results.
    A real market-data/backtesting engine can replace this
    service later without changing the frontend flow.
    """

    return {
        "status": "completed",
        "is_simulated": True,
        "experiment_summary": {
            "instrument": experiment.get("instrument"),
            "timeframe": experiment.get("timeframe"),
            "entry_condition": experiment.get("entry_condition"),
            "exit_condition": experiment.get("exit_condition"),
            "holding_period": experiment.get("holding_period"),
            "filters": experiment.get("filters", []),
        },
        "performance": {
            "sample_period": "2018–2025",
            "total_occurrences": 184,
            "successful_outcomes": 113,
            "recovery_rate": 61.4,
            "average_return": 1.27,
            "median_return": 0.84,
        },
        "recovery_by_day": [
            {"day": "Day 1", "recovery_rate": 32},
            {"day": "Day 2", "recovery_rate": 47},
            {"day": "Day 3", "recovery_rate": 55},
            {"day": "Day 4", "recovery_rate": 59},
            {"day": "Day 5", "recovery_rate": 61},
        ],
        "conclusion": (
            "The prototype indicates that the defined recovery "
            "condition occurred in 61.4% of observed cases within "
            "the specified holding period. This is simulated "
            "research data and should not be interpreted as "
            "actual historical market performance."
        ),
    }
