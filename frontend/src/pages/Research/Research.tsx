import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Research.css";
import type { ResearchResult } from "../../services/api";

function Research() {
    const navigate = useNavigate();
    const [result, setResult] = useState<ResearchResult | null>(null);

    useEffect(() => {
        const storedResult = sessionStorage.getItem("researchResult");

        if (!storedResult) {
            navigate("/");
            return;
        }

        try {
            setResult(JSON.parse(storedResult));
        } catch (error) {
            console.error("Invalid research result:", error);
            navigate("/");
        }
    }, [navigate]);

    if (!result) return null;

    const { performance, experiment_summary } = result;

    return (
        <main className="research-page">
            <div className="research-container">

                <button
                    className="research-back-button"
                    onClick={() => navigate("/experiment")}
                >
                    ← Back to experiment
                </button>

                <section className="research-header">
                    <p className="research-label">RESEARCH RESULTS</p>

                    <h1>
                        {experiment_summary.instrument} recovery analysis
                    </h1>

                    <p className="research-description">
                        Results generated from the defined experiment.
                    </p>

                    {result.is_simulated && (
                        <div className="simulated-badge">
                            SIMULATED PROTOTYPE DATA
                        </div>
                    )}
                </section>

                <section className="research-summary-card">
                    <div>
                        <span>Instrument</span>
                        <strong>{experiment_summary.instrument || "—"}</strong>
                    </div>

                    <div>
                        <span>Timeframe</span>
                        <strong>{experiment_summary.timeframe || "—"}</strong>
                    </div>

                    <div>
                        <span>Entry</span>
                        <strong>{experiment_summary.entry_condition || "—"}</strong>
                    </div>

                    <div>
                        <span>Exit</span>
                        <strong>{experiment_summary.exit_condition || "—"}</strong>
                    </div>

                    <div>
                        <span>Holding period</span>
                        <strong>{experiment_summary.holding_period || "—"}</strong>
                    </div>
                </section>

                <section className="performance-section">
                    <div className="section-heading">
                        <p>PERFORMANCE</p>
                        <h2>Experiment outcome</h2>
                    </div>

                    <div className="metrics-grid">

                        <div className="metric-card">
                            <span>Recovery rate</span>
                            <strong>{performance.recovery_rate}%</strong>
                        </div>

                        <div className="metric-card">
                            <span>Total occurrences</span>
                            <strong>{performance.total_occurrences}</strong>
                        </div>

                        <div className="metric-card">
                            <span>Successful outcomes</span>
                            <strong>{performance.successful_outcomes}</strong>
                        </div>

                        <div className="metric-card">
                            <span>Average return</span>
                            <strong>{performance.average_return}%</strong>
                        </div>

                        <div className="metric-card">
                            <span>Median return</span>
                            <strong>{performance.median_return}%</strong>
                        </div>

                        <div className="metric-card">
                            <span>Sample period</span>
                            <strong>{performance.sample_period}</strong>
                        </div>

                    </div>
                </section>

                <section className="chart-card">
                    <div className="section-heading">
                        <p>RECOVERY PROGRESSION</p>
                        <h2>Recovery rate by day</h2>
                    </div>

                    <div className="chart">

                        {result.recovery_by_day.map((item) => (
                            <div className="chart-row" key={item.day}>

                                <div className="chart-label">
                                    {item.day}
                                </div>

                                <div className="chart-bar-container">
                                    <div
                                        className="chart-bar"
                                        style={{
                                            width: `${item.recovery_rate}%`,
                                        }}
                                    />
                                </div>

                                <div className="chart-value">
                                    {item.recovery_rate}%
                                </div>

                            </div>
                        ))}

                    </div>
                </section>

                <section className="conclusion-card">
                    <p className="conclusion-label">AI RESEARCH CONCLUSION</p>

                    <h2>What the experiment suggests</h2>

                    <p>{result.conclusion}</p>
                </section>

                <div className="research-footer">
                    <button
                        className="new-research-button"
                        onClick={() => navigate("/")}
                    >
                        Start new research →
                    </button>
                </div>

            </div>
        </main>
    );
}

export default Research;