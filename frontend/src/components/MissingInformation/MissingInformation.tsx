import { useState } from "react";
import "./MissingInformation.css";
import type { ClarificationQuestion } from "../../types/experiment";

interface MissingInformationProps {
    items: ClarificationQuestion[];
    onSubmit: (answers: Record<string, string>) => void;
}

function MissingInformation({
    items,
    onSubmit,
}: MissingInformationProps) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [error, setError] = useState("");

    if (items.length === 0) return null;

    const handleChange = (question: string, value: string) => {
        setAnswers((previous) => ({
            ...previous,
            [question]: value,
        }));

        setError("");
    };

    const handleSubmit = () => {
        const unanswered = items.filter(
            (item) => !answers[item.question]?.trim()
        );

        if (unanswered.length > 0) {
            setError(
                `Please answer all ${unanswered.length} clarification ${unanswered.length === 1 ? "question" : "questions"
                }.`
            );
            return;
        }

        onSubmit(answers);
    };

    return (
        <div className="missing-card">
            <div className="missing-header">
                <div>
                    <p className="missing-label">CLARIFICATION NEEDED</p>
                    <h3>Complete the experiment</h3>
                </div>

                <span className="missing-count">
                    {items.length}
                </span>
            </div>

            <p className="missing-description">
                A few details are missing. Answer them below so we can
                create a precise experiment.
            </p>

            <div className="missing-list">
                {items.map((item) => (
                    <div
                        className="missing-question"
                        key={item.question}
                    >
                        <label>{item.question}</label>

                        {item.type === "multiple_choice" ? (
                            <select
                                value={answers[item.question] || ""}
                                onChange={(event) =>
                                    handleChange(
                                        item.question,
                                        event.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Select an option
                                </option>

                                {item.options.map((option) => (
                                    <option
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={
                                    item.type === "number"
                                        ? "number"
                                        : "text"
                                }
                                placeholder="Enter your answer..."
                                value={answers[item.question] || ""}
                                onChange={(event) =>
                                    handleChange(
                                        item.question,
                                        event.target.value
                                    )
                                }
                            />
                        )}
                    </div>
                ))}
            </div>

            {error && (
                <div className="missing-error">
                    {error}
                </div>
            )}

            <button
                className="clarification-button"
                onClick={handleSubmit}
            >
                Update experiment →
            </button>
        </div>
    );
}

export default MissingInformation;