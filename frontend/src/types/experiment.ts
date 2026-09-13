export interface ClarificationQuestion {
    question: string;
    type: "multiple_choice" | "text_input" | "number";
    options: string[];
}

export interface Experiment {
    id?: number;
    original_question?: string;
    instrument: string | null;
    timeframe: string | null;
    entry_condition: string | null;
    exit_condition: string | null;
    holding_period: string | null;
    filters: string[];
    research_question: string;
    missing_information: ClarificationQuestion[];
    is_ready: boolean;
    created_at?: string;
}

