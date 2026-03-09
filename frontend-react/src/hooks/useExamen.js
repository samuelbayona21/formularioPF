/**
 * Hook: Examen
 * Maneja la lógica del examen
 */
import { useState, useEffect, useCallback } from 'react';
import { examenService } from '../services/examenService';

export const useExamen = () => {
    const [preguntas, setPreguntas] = useState([]);
    const [respuestas, setRespuestas] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarPreguntas();
    }, []);

    const cargarPreguntas = async () => {
        try {
            setLoading(true);
            const data = await examenService.obtenerPreguntas();
            setPreguntas(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const guardarRespuesta = useCallback(async (preguntaId, respuesta) => {
        try {
            await examenService.guardarRespuesta(preguntaId, respuesta);
            setRespuestas(prev => ({
                ...prev,
                [preguntaId]: respuesta
            }));
        } catch (err) {
            console.error('Error al guardar respuesta:', err);
        }
    }, []);

    const nextQuestion = () => {
        if (currentQuestion < preguntas.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const goToQuestion = (index) => {
        if (index >= 0 && index < preguntas.length) {
            setCurrentQuestion(index);
        }
    };

    const getProgress = () => {
        const answered = Object.keys(respuestas).length;
        const total = preguntas.length;
        return {
            answered,
            total,
            percentage: total > 0 ? (answered / total) * 100 : 0
        };
    };

    return {
        preguntas,
        respuestas,
        currentQuestion,
        loading,
        error,
        guardarRespuesta,
        nextQuestion,
        prevQuestion,
        goToQuestion,
        getProgress
    };
};
