import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";

import { analyzeExperiment } from "../../services/api";
import type { Experiment } from "../../types/experiment";


function Home() {

    const [question, setQuestion] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const navigate = useNavigate();


    const handleAnalyze = async () => {

        if (!question.trim()) {
            return;
        }

        setLoading(true);

        setError("");


        try {

            const result: Experiment =
                await analyzeExperiment(question);

            /*
             * Store the experiment temporarily.
             *
             * Later we will save this through
             * the Django database.
             */

            sessionStorage.setItem(
                "currentExperiment",
                JSON.stringify(result)
            );

            sessionStorage.setItem(
                "originalQuestion",
                question
            );


            navigate("/experiment");

        } catch (error) {

            console.error(error);

            setError(
                "Unable to analyze the question. Please make sure the Django backend is running."
            );

        } finally {

            setLoading(false);

        }
    };


    const exampleQuestions = [

        "Does buying NIFTY after a 1% fall work better during high-volatility periods?",

        "Does NIFTY recover after a 2% fall?",

        "Does momentum work better during high-volatility periods?",

    ];


    return (

        <main className="home-page">

            <section className="home-hero">

                <div className="hero-badge">
                    AI-POWERED MARKET RESEARCH
                </div>


                <h2 className="home-title">
                    Turn a market idea into
                    <span> a testable experiment.</span>
                </h2>


                <p className="home-description">

                    Describe what you're curious about in
                    plain language. The research assistant will
                    structure your idea, identify missing
                    information, and prepare it for testing.

                </p>


                <div className="question-card">

                    <textarea
                        value={question}
                        onChange={(event) =>
                            setQuestion(event.target.value)
                        }
                        placeholder="Example: Does buying NIFTY after a 1% fall work better during high-volatility periods?"
                        className="question-textarea"
                        disabled={loading}
                    />


                    <div className="question-footer">

                        <span className="question-hint">
                            Describe the strategy you want to investigate.
                        </span>


                        <button
                            className="analyze-button"
                            onClick={handleAnalyze}
                            disabled={
                                loading ||
                                !question.trim()
                            }
                        >

                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    Analyze experiment
                                    <span>→</span>
                                </>
                            )}

                        </button>

                    </div>

                </div>


                {error && (

                    <div className="error-message">
                        {error}
                    </div>

                )}


                <div className="examples-section">

                    <p className="examples-title">
                        Try an example
                    </p>


                    <div className="examples-list">

                        {exampleQuestions.map(
                            (example) => (

                                <button
                                    key={example}
                                    className="example-question"
                                    onClick={() =>
                                        setQuestion(example)
                                    }
                                >

                                    {example}

                                </button>

                            )
                        )}

                    </div>

                </div>

            </section>


            <section className="how-it-works">

                <div className="section-heading">

                    <p className="section-label">
                        HOW IT WORKS
                    </p>

                    <h3>
                        From idea to experiment
                    </h3>

                </div>


                <div className="steps">

                    <div className="step">

                        <div className="step-number">
                            01
                        </div>

                        <h4>
                            Ask
                        </h4>

                        <p>
                            Describe a market hypothesis
                            using natural language.
                        </p>

                    </div>


                    <div className="step">

                        <div className="step-number">
                            02
                        </div>

                        <h4>
                            Structure
                        </h4>

                        <p>
                            AI identifies the instrument,
                            entry, filters, and other rules.
                        </p>

                    </div>


                    <div className="step">

                        <div className="step-number">
                            03
                        </div>

                        <h4>
                            Validate
                        </h4>

                        <p>
                            Missing information is surfaced
                            before the experiment can be tested.
                        </p>

                    </div>

                </div>

            </section>

        </main>

    );
}


export default Home;