/**
 * Componente: Modal de Finalización
 */
export default function FinishModal({ onConfirm, onCancel }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>¿Finalizar Examen?</h2>
                <p>¿Estás seguro de que deseas finalizar el examen?</p>
                <p>No podrás volver a responder las preguntas.</p>
                <div className="modal-buttons">
                    <button onClick={onCancel} className="btn btn-secondary">
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className="btn btn-primary">
                        Sí, Finalizar
                    </button>
                </div>
            </div>
        </div>
    );
}
