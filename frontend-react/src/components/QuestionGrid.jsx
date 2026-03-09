/**
 * Componente: Grid de Preguntas
 */
export default function QuestionGrid({ total, current, answered, preguntas, onSelect }) {
    return (
        <div className="questions-grid-section">
            <h3>Preguntas</h3>
            <div className="questions-grid">
                {Array.from({ length: total }, (_, index) => {
                    const preguntaId = preguntas[index]?.id;
                    const isAnswered = answered[preguntaId] !== undefined;
                    const isCurrent = index === current;

                    return (
                        <button
                            key={index}
                            className={`question-number ${isAnswered ? 'answered' : ''} ${isCurrent ? 'current' : ''}`}
                            onClick={() => onSelect(index)}
                        >
                            {index + 1}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
