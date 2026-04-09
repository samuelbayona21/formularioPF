/**
 * Controller: Examen
 * Maneja las peticiones HTTP relacionadas con exámenes
 */
import { IniciarExamenDTO } from '../../application/dtos/IniciarExamenDTO.js';
import { GuardarRespuestaDTO } from '../../application/dtos/GuardarRespuestaDTO.js';

export class ExamenController {
    constructor(iniciarExamenUseCase, obtenerPreguntasUseCase, guardarRespuestaUseCase, finalizarExamenUseCase, guardarTiempoUseCase, obtenerTiempoUseCase) {
        this.iniciarExamenUseCase = iniciarExamenUseCase;
        this.obtenerPreguntasUseCase = obtenerPreguntasUseCase;
        this.guardarRespuestaUseCase = guardarRespuestaUseCase;
        this.finalizarExamenUseCase = finalizarExamenUseCase;
        this.guardarTiempoUseCase = guardarTiempoUseCase;
        this.obtenerTiempoUseCase = obtenerTiempoUseCase;
    }

    async iniciar(req, res) {
        try {
            const dto = new IniciarExamenDTO(req.body);
            
            const validation = dto.validate();
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    errors: validation.errors
                });
            }

            const resultado = await this.iniciarExamenUseCase.execute(
                dto.nombreCompleto,
                dto.cedula
            );

            // Guardar en sesión
            req.session.usuarioId = resultado.usuarioId;
            req.session.intentoId = resultado.intentoId;
            req.session.nombreCompleto = resultado.nombreCompleto;

            res.json({
                success: true,
                message: 'Examen iniciado correctamente',
                data: resultado
            });
        } catch (error) {
            console.error('Error en iniciar:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async preguntas(req, res) {
        try {
            const preguntas = await this.obtenerPreguntasUseCase.execute();
            
            res.json({
                success: true,
                preguntas
            });
        } catch (error) {
            console.error('Error en preguntas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al cargar preguntas'
            });
        }
    }

    async guardarRespuesta(req, res) {
        try {
            console.log('💾 Guardar respuesta:', {
                intentoId: req.intentoId,
                body: req.body,
                session: req.session
            });

            const dto = new GuardarRespuestaDTO(req.body);
            
            const validation = dto.validate();
            if (!validation.isValid) {
                console.error('❌ Validación fallida:', validation.errors);
                return res.status(400).json({
                    success: false,
                    errors: validation.errors
                });
            }

            await this.guardarRespuestaUseCase.execute(
                req.intentoId,
                dto.preguntaId,
                dto.respuesta
            );

            console.log('✅ Respuesta guardada exitosamente');

            res.json({
                success: true,
                message: 'Respuesta guardada'
            });
        } catch (error) {
            console.error('❌ Error en guardarRespuesta:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async obtenerTiempo(req, res) {
        try {
            const resultado = await this.obtenerTiempoUseCase.execute(req.intentoId);
            
            res.json({
                success: true,
                ...resultado
            });
        } catch (error) {
            console.error('Error en obtenerTiempo:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async guardarTiempo(req, res) {
        try {
            const { tiempo_segundos } = req.body;
            
            console.log('📝 Guardar tiempo:', {
                intentoId: req.intentoId,
                tiempo_segundos,
                session: req.session
            });

            if (!req.intentoId) {
                return res.status(400).json({
                    success: false,
                    message: 'No hay sesión activa'
                });
            }

            if (tiempo_segundos === undefined || tiempo_segundos === null) {
                return res.status(400).json({
                    success: false,
                    message: 'Tiempo requerido'
                });
            }
            
            await this.guardarTiempoUseCase.execute(req.intentoId, tiempo_segundos);
            
            res.json({ success: true });
        } catch (error) {
            console.error('Error en guardarTiempo:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async finalizar(req, res) {
        try {
            const { tiempo_agotado } = req.body;
            
            console.log('🏁 Finalizar examen:', {
                intentoId: req.intentoId,
                tiempo_agotado,
                session: req.session,
                body: req.body
            });

            if (!req.intentoId) {
                console.error('❌ No hay intentoId en la sesión');
                return res.status(400).json({
                    success: false,
                    message: 'No hay sesión activa. Por favor, inicia sesión nuevamente.'
                });
            }
            
            const resultado = await this.finalizarExamenUseCase.execute(
                req.intentoId,
                tiempo_agotado
            );

            console.log('✅ Examen finalizado exitosamente:', resultado);

            res.json({
                success: true,
                resultado
            });
        } catch (error) {
            console.error('❌ Error en finalizar:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}
