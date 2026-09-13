from experiments.services.research_engine import run_research

experiment = {
    "instrument": "NIFTY",
    "timeframe": "Daily",
    "entry_condition": "Buy when NIFTY falls 2% from previous day's close",
    "exit_condition": "Price recovers to previous day's close",
    "holding_period": "5 trading days",
    "filters": [],
}


result = run_research(experiment)

print(result)
