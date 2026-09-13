import json
import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()


EXPERIMENT_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "instrument": {"type": "STRING"},
        "timeframe": {"type": "STRING"},
        "entry_condition": {"type": "STRING"},
        "exit_condition": {"type": "STRING"},
        "holding_period": {"type": "STRING"},
        "filters": {"type": "ARRAY", "items": {"type": "STRING"}},
        "research_question": {"type": "STRING"},
        "missing_information": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "question": {"type": "STRING"},
                    "type": {"type": "STRING"},
                    "options": {"type": "ARRAY", "items": {"type": "STRING"}},
                },
                "required": ["question", "type", "options"],
            },
        },
        "is_ready": {"type": "BOOLEAN"},
    },
    "required": [
        "instrument",
        "timeframe",
        "entry_condition",
        "exit_condition",
        "holding_period",
        "filters",
        "research_question",
        "missing_information",
        "is_ready",
    ],
}


def clean_experiment_result(result: dict):
    nullable_fields = [
        "instrument",
        "timeframe",
        "entry_condition",
        "exit_condition",
        "holding_period",
    ]

    for field in nullable_fields:
        if result.get(field) == "null":
            result[field] = None

    return result


def analyze_experiment(question: str):
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise ValueError("GEMINI_API_KEY is missing")

    client = genai.Client(api_key=api_key)

    prompt = f"""
You are an AI assistant for a trading research platform.

Your job is to convert a user's natural-language trading research
question into a structured experiment.

IMPORTANT RULES:

1. Do not invent missing information.
2. If the user does not specify something important, return
   "null" as the value.
3. Identify ambiguity and list the missing information.
4. The experiment must be precise enough to eventually run a backtest.
5. Return ONLY valid JSON.
6. Do not use markdown.
7. Do not add explanations outside the JSON.

The JSON must have exactly these fields:

{{
    "instrument": string or null,
    "timeframe": string or null,
    "entry_condition": string or null,
    "exit_condition": string or null,
    "holding_period": string or null,
    "filters": array of strings,
    "research_question": string,
    "missing_information": array of clarification objects,
    
    "is_ready": boolean
}}

Each clarification object must contain:

- "question": a clear question that the user can answer
- "type": one of:
  - "multiple_choice"
  - "text_input"
  - "number"
- "options": an array of choices when the type is
  "multiple_choice", otherwise []

Use "multiple_choice" when there are reasonable predefined
choices.

Use "text_input" when the user needs to provide a custom
definition or trading rule.

Use "number" when the answer is primarily numeric.

Required information for a ready experiment:

- instrument
- timeframe
- entry condition
- exit condition
- holding period

IMPORTANT DISTINCTION:

If the user expresses a trading action or condition but leaves
its exact implementation ambiguous, still extract the general
condition.

For example:

"buy NIFTY after a 1% fall"

should produce:

"entry_condition": "Buy NIFTY after a 1% fall"

It should NOT produce null.

However, if the exact definition of the 1% fall is unclear,
mention that ambiguity in the clarification questions.

Do not confuse "missing implementation details" with a completely
missing trading condition.

Do not ask the user for the same concept twice.

For example, if "timeframe" already describes the timeframe
of the experiment, do not separately ask for another timeframe
unless they represent genuinely different concepts.

Prefer a small number of high-value clarification questions
rather than asking unnecessary questions.

For every item in missing_information, create a corresponding
clarification_questions object.

If there is no missing information, return:

"missing_information": [],
 
"is_ready": true

Use concise, human-readable descriptions for all fields.

The user's research question is:

"{question}"
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=EXPERIMENT_SCHEMA,
        ),
    )

    result = json.loads(response.text)

    return clean_experiment_result(result)


def update_experiment(experiment: dict, answers: dict):
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise ValueError("GEMINI_API_KEY is missing")

    client = genai.Client(api_key=api_key)

    prompt = f"""
You are an AI assistant for a trading research platform.

The user originally described a trading research idea.
The system converted it into a structured experiment.

Now the user has provided answers to clarification questions.

Your task is to update the existing experiment using those answers.

IMPORTANT RULES:

1. Do not invent information.
2. Use the user's answers where they clearly provide information.
3. Preserve information that was already correctly extracted.
4. If an answer is still ambiguous, keep the field unresolved.
5. Recalculate missing_information after applying the answers.
6. Recalculate clarification_questions after applying the answers.
7. Only mark is_ready=true when the experiment contains enough
   information to eventually run a backtest.
8. Do not ask the user for information that has already been provided.
9. Return ONLY valid JSON.
10. Do not use markdown.
11. Do not add explanations outside the JSON.

The JSON must contain exactly:

{{
    "instrument": string or null,
    "timeframe": string or null,
    "entry_condition": string or null,
    "exit_condition": string or null,
    "holding_period": string or null,
    "filters": array of strings,
    "research_question": string,
    "missing_information": array of clarification objects,
   
    "is_ready": boolean
}}

Each clarification object must contain:

- "question": a clear question that the user can answer
- "type": one of:
  - "multiple_choice"
  - "text_input"
  - "number"
- "options": an array of choices when the type is
  "multiple_choice", otherwise []

Only include clarification questions for information that is
still genuinely required or materially ambiguous.

CURRENT EXPERIMENT:

{json.dumps(experiment, indent=2)}

USER ANSWERS:

{json.dumps(answers, indent=2)}

Update the experiment now.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=EXPERIMENT_SCHEMA,
        ),
    )

    result = json.loads(response.text)

    return clean_experiment_result(result)
