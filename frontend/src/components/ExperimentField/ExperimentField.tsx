import "./ExperimentField.css";

interface ExperimentFieldProps {
    label: string;
    value: string | null;
}

function ExperimentField({
    label,
    value,
}: ExperimentFieldProps) {
    return (
        <div className="experiment-field">
            <p className="field-label">{label}</p>

            <div className={`field-value ${!value ? "empty" : ""}`}>
                {value || "Not specified"}
            </div>
        </div>
    );
}

export default ExperimentField;