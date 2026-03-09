/**
 * Componente: Mostrar Pregunta
 */
export default function QuestionDisplay({ pregunta, numeroPregunta, respuestaSeleccionada, onSelectRespuesta }) {
    return (
        <>
            <div className="question-header">
                <h2>Pregunta {numeroPregunta}</h2>
            </div>

            <div className="question-content">
                <p className="question-text">{pregunta.texto_pregunta}</p>

                <div className="options-container">
                    {pregunta.opciones.map((opcion) => (
                        <div key={opcion.id} className="option">
                            <input
                                type="radio"
                                name="answer"
                                id={`option${opcion.letra_opcion}`}
                                value={opcion.letra_opcion}
                                checked={respuestaSeleccionada === opcion.letra_opcion}
                                onChange={() => onSelectRespuesta(opcion.letra_opcion)}
                            />
                            <label htmlFor={`option${opcion.letra_opcion}`}>
                                {opcion.letra_opcion}. {opcion.texto_opcion}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
