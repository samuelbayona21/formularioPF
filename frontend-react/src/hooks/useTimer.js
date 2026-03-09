/**
 * Hook: Timer
 * Maneja el temporizador del examen
 */
import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (initialTime, onTimeUp) => {
    const [timeRemaining, setTimeRemaining] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const onTimeUpRef = useRef(onTimeUp);

    // Actualizar la referencia cuando cambie onTimeUp
    useEffect(() => {
        onTimeUpRef.current = onTimeUp;
    }, [onTimeUp]);

    useEffect(() => {
        if (isRunning && timeRemaining > 0) {
            intervalRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        if (onTimeUpRef.current) {
                            onTimeUpRef.current();
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRunning, timeRemaining]);

    const start = useCallback(() => {
        console.log('Timer iniciado');
        setIsRunning(true);
    }, []);

    const stop = useCallback(() => {
        console.log('Timer detenido');
        setIsRunning(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const reset = useCallback((newTime) => {
        stop();
        setTimeRemaining(newTime);
    }, [stop]);

    const formatTime = useCallback(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, [timeRemaining]);

    return {
        timeRemaining,
        isRunning,
        start,
        stop,
        reset,
        formatTime,
        setTimeRemaining
    };
};
