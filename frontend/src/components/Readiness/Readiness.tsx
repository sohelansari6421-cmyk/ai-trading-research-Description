import "./Readiness.css";

interface ReadinessProps {
    isReady: boolean;
}

function Readiness({ isReady }: ReadinessProps) {
    return (
        <div className={`readiness ${isReady ? "ready" : "not-ready"}`}>
            <div className="readiness-icon">
                {isReady ? "✓" : "!"}
            </div>

            <div className="readiness-content">
                <p className="readiness-title">
                    {isReady
                        ? "Experiment is ready"
                        : "Experiment needs more information"}
                </p>

                <p className="readiness-description">
                    {isReady
                        ? "All required parameters have been defined. You can now run the research."
                        : "Answer the missing questions before testing this strategy."}
                </p>
            </div>
        </div>
    );
}

export default Readiness;