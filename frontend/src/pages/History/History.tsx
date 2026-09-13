import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./History.css";

import { getExperiments } from "../../services/api";
import type { Experiment } from "../../types/experiment";

function History() {
    const [experiments, setExperiments] = useState<Experiment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const loadExperiments = async () => {
            try {
                const data = await getExperiments();
                setExperiments(data);
            } catch (error) {
                console.error(error);
                setError("Unable to load experiment history.");
            } finally {
                setLoading(false);
            }
        };

        loadExperiments();
    }, []);

    const openExperiment = (experiment: Experiment) => {
        sessionStorage.setItem(
            "currentExperiment",
            JSON.stringify(experiment)
        );

        navigate("/experiment");
    };

    return (
        <main className="history-page">
            <div className="history-container">

                <section className="history-header">
                    <p className="history-label">
                        RESEARCH HISTORY
                    </p>

                    <h2>Your experiments</h2>

                    <p>
                        Previously analyzed market ideas and their
                        current research definitions.
                    </p>
                </section>

                {loading && (
                    <div className="history-state">
                        Loading experiments...
                    </div>
                )}

                {error && (
                    <div className="history-error">
                        {error}
                    </div>
                )}

                {!loading && !error && experiments.length === 0 && (
                    <div className="history-empty">
                        <h3>No experiments yet</h3>

                        <p>
                            Start with a market research question and
                            your experiments will appear here.
                        </p>

                        <button
                            onClick={() => navigate("/")}
                        >
                            Start research →
                        </button>
                    </div>
                )}

                <div className="history-list">
                    {experiments.map((experiment) => (
                        <button
                            className="history-item"
                            key={experiment.id}
                            onClick={() =>
                                openExperiment(experiment)
                            }
                        >
                            <div className="history-item-main">
                                <p className="history-item-label">
                                    {experiment.instrument || "Unknown instrument"}
                                </p>

                                <h3>
                                    {experiment.research_question}
                                </h3>

                                <p className="history-date">
                                    {experiment.created_at
                                        ? new Date(
                                            experiment.created_at
                                        ).toLocaleString()
                                        : ""}
                                </p>
                            </div>

                            <div className="history-item-status">
                                {experiment.is_ready
                                    ? "Ready"
                                    : "Needs information"}

                                <span>→</span>
                            </div>
                        </button>
                    ))}
                </div>

            </div>
        </main>
    );
}

export default History;