import type { Experiment } from "../types/experiment";

const API_URL =
    "http://127.0.0.1:8000/api";


export async function analyzeExperiment(
    question: string
): Promise<Experiment> {

    const response = await fetch(
        `${API_URL}/experiments/analyze/`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                question,
            }),
        }
    );


    if (!response.ok) {

        throw new Error(
            "Failed to analyze experiment"
        );

    }


    return response.json();
}

export async function updateExperiment(
    experiment: Experiment,
    answers: Record<string, string>
): Promise<Experiment> {
    const response = await fetch(
        `${API_URL}/experiments/update/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                experiment,
                answers,
            }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update experiment");
    }

    return response.json();
}

export async function getExperiments(): Promise<Experiment[]> {
    const response = await fetch(
        `${API_URL}/experiments/history/`
    );

    if (!response.ok) {
        throw new Error("Failed to load experiments");
    }

    return response.json();
}
export interface ResearchResult {
    status: string;
    is_simulated: boolean;

    experiment_summary: {
        instrument: string | null;
        timeframe: string | null;
        entry_condition: string | null;
        exit_condition: string | null;
        holding_period: string | null;
        filters: string[];
    };

    performance: {
        sample_period: string;
        total_occurrences: number;
        successful_outcomes: number;
        recovery_rate: number;
        average_return: number;
        median_return: number;
    };

    recovery_by_day: {
        day: string;
        recovery_rate: number;
    }[];

    conclusion: string;
}

export async function runResearch(
    experimentId: number
): Promise<ResearchResult> {
    const response = await fetch(
        `${API_URL}/experiments/${experimentId}/research/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to run research");
    }

    return response.json();
}