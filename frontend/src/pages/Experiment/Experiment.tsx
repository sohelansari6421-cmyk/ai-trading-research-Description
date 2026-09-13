
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Experiment.css";

import ExperimentField from "../../components/ExperimentField/ExperimentField";
import Readiness from "../../components/Readiness/Readiness";
import MissingInformation from "../../components/MissingInformation/MissingInformation";

import { updateExperiment, runResearch } from "../../services/api";

import type {
    Experiment as ExperimentType,
} from "../../types/experiment";

function Experiment() {
    const navigate = useNavigate();

    const [experiment, setExperiment] =
        useState<ExperimentType | null>(null);

    const [updating, setUpdating] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        const storedExperiment =
            sessionStorage.getItem("currentExperiment");

        if (!storedExperiment) {
            navigate("/");
            return;
        }

        try {
            const parsedExperiment: ExperimentType =
                JSON.parse(storedExperiment);

            setExperiment(parsedExperiment);
        } catch (error) {
            console.error(
                "Invalid experiment data:",
                error
            );

            navigate("/");
        }
    }, [navigate]);

    const handleClarification = async (
        answers: Record<string, string>
    ) => {
        if (!experiment) {
            return;
        }

        setUpdating(true);
        setError("");

        try {
            const updatedExperiment =
                await updateExperiment(
                    experiment,
                    answers
                );

            setExperiment(updatedExperiment);

            sessionStorage.setItem(
                "currentExperiment",
                JSON.stringify(updatedExperiment)
            );
        } catch (error) {
            console.error(
                "Failed to update experiment:",
                error
            );

            setError(
                "Unable to update the experiment. Please try again."
            );
        } finally {
            setUpdating(false);
        }
    };

    if (!experiment) {
        return null;
    }

    return (
        <main className="experiment-page">
            <div className="experiment-container">

                <button
                    className="back-button"
                    onClick={() => navigate("/")}
                    disabled={updating}
                >
                    ← New research question
                </button>

                <section className="experiment-header">
                    <p className="experiment-label">
                        STRUCTURED EXPERIMENT
                    </p>

                    <h2>
                        {experiment.research_question}
                    </h2>

                    <p className="original-question">
                        Based on your original market question
                    </p>
                </section>

                <Readiness
                    isReady={experiment.is_ready}
                />

                <section className="experiment-card">
                    <div className="card-heading">
                        <div>
                            <p className="card-label">
                                EXPERIMENT PARAMETERS
                            </p>

                            <h3>Research definition</h3>
                        </div>
                    </div>

                    <div className="experiment-grid">
                        <ExperimentField
                            label="Instrument"
                            value={experiment.instrument}
                        />

                        <ExperimentField
                            label="Timeframe"
                            value={experiment.timeframe}
                        />

                        <ExperimentField
                            label="Entry condition"
                            value={experiment.entry_condition}
                        />

                        <ExperimentField
                            label="Exit condition"
                            value={experiment.exit_condition}
                        />

                        <ExperimentField
                            label="Holding period"
                            value={experiment.holding_period}
                        />

                        <ExperimentField
                            label="Filter"
                            value={
                                experiment.filters.length > 0
                                    ? experiment.filters.join(", ")
                                    : null
                            }
                        />
                    </div>
                </section>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {updating ? (
                    <div className="updating-message">
                        <span className="spinner"></span>
                        Updating experiment with AI...
                    </div>
                ) : (
                    <MissingInformation
                        items={experiment.missing_information}
                        onSubmit={handleClarification}
                    />
                )}

                {experiment.is_ready && (
                    <section className="research-action">
                        <div>
                            <p className="research-action-label">
                                READY TO RESEARCH
                            </p>

                            <h3>Run this experiment</h3>

                            <p>
                                The experiment has enough information to begin
                                research. In this prototype, the backtesting
                                engine is not connected yet.
                            </p>
                        </div>

                        <button
                            className="run-research-button"
                            disabled={updating}
                            onClick={async () => {
                                if (!experiment?.id) return;

                                setUpdating(true);
                                setError("");

                                try {
                                    const researchResult = await runResearch(experiment.id);

                                    sessionStorage.setItem(
                                        "researchResult",
                                        JSON.stringify(researchResult)
                                    );

                                    navigate("/research");
                                } catch (error) {
                                    console.error("Failed to run research:", error);
                                    setError("Unable to run research. Please try again.");
                                } finally {
                                    setUpdating(false);
                                }
                            }}
                        >
                            {updating ? "Running research..." : "Run research →"}


                        </button>
                    </section>
                )}

            </div>
        </main>
    );
}

export default Experiment;
