/**
 * Dependency Injection Container
 * Configura e inyecta todas las dependencias siguiendo Clean Architecture
 */

// Repositories
import { MySQLUsuarioRepository } from '../repositories/MySQLUsuarioRepository.js';
import { MySQLExamenRepository } from '../repositories/MySQLExamenRepository.js';
import { MySQLRespuestaRepository } from '../repositories/MySQLRespuestaRepository.js';

// Use Cases
import { IniciarExamenUseCase } from '../../domain/use-cases/IniciarExamenUseCase.js';
import { ObtenerPreguntasUseCase } from '../../domain/use-cases/ObtenerPreguntasUseCase.js';
import { GuardarRespuestaUseCase } from '../../domain/use-cases/GuardarRespuestaUseCase.js';
import { FinalizarExamenUseCase } from '../../domain/use-cases/FinalizarExamenUseCase.js';
import { GuardarTiempoUseCase } from '../../domain/use-cases/GuardarTiempoUseCase.js';
import { ObtenerTiempoUseCase } from '../../domain/use-cases/ObtenerTiempoUseCase.js';
import { LoginAdminUseCase } from '../../domain/use-cases/LoginAdminUseCase.js';
import { ObtenerResultadosUseCase } from '../../domain/use-cases/ObtenerResultadosUseCase.js';
import { ObtenerEstadisticasUseCase } from '../../domain/use-cases/ObtenerEstadisticasUseCase.js';
import { ObtenerDetalleResultadoUseCase } from '../../domain/use-cases/ObtenerDetalleResultadoUseCase.js';

// Controllers
import { ExamenController } from '../../presentation/controllers/ExamenController.js';
import { AdminController } from '../../presentation/controllers/AdminController.js';

class Container {
    constructor() {
        this.dependencies = {};
        this.setupDependencies();
    }

    setupDependencies() {
        // Repositories (Infrastructure Layer)
        this.dependencies.usuarioRepository = new MySQLUsuarioRepository();
        this.dependencies.examenRepository = new MySQLExamenRepository();
        this.dependencies.respuestaRepository = new MySQLRespuestaRepository();

        // Use Cases (Domain Layer)
        this.dependencies.iniciarExamenUseCase = new IniciarExamenUseCase(
            this.dependencies.usuarioRepository,
            this.dependencies.examenRepository
        );

        this.dependencies.obtenerPreguntasUseCase = new ObtenerPreguntasUseCase(
            this.dependencies.examenRepository
        );

        this.dependencies.guardarRespuestaUseCase = new GuardarRespuestaUseCase(
            this.dependencies.respuestaRepository
        );

        this.dependencies.finalizarExamenUseCase = new FinalizarExamenUseCase(
            this.dependencies.examenRepository,
            this.dependencies.respuestaRepository
        );

        this.dependencies.guardarTiempoUseCase = new GuardarTiempoUseCase(
            this.dependencies.examenRepository
        );

        this.dependencies.obtenerTiempoUseCase = new ObtenerTiempoUseCase(
            this.dependencies.examenRepository
        );

        // Admin Use Cases
        this.dependencies.loginAdminUseCase = new LoginAdminUseCase(
            this.dependencies.usuarioRepository
        );

        this.dependencies.obtenerResultadosUseCase = new ObtenerResultadosUseCase(
            this.dependencies.usuarioRepository
        );

        this.dependencies.obtenerEstadisticasUseCase = new ObtenerEstadisticasUseCase(
            this.dependencies.usuarioRepository
        );

        this.dependencies.obtenerDetalleResultadoUseCase = new ObtenerDetalleResultadoUseCase(
            this.dependencies.usuarioRepository
        );

        // Controllers (Presentation Layer)
        this.dependencies.examenController = new ExamenController(
            this.dependencies.iniciarExamenUseCase,
            this.dependencies.obtenerPreguntasUseCase,
            this.dependencies.guardarRespuestaUseCase,
            this.dependencies.finalizarExamenUseCase,
            this.dependencies.guardarTiempoUseCase,
            this.dependencies.obtenerTiempoUseCase
        );

        this.dependencies.adminController = new AdminController(
            this.dependencies.loginAdminUseCase,
            this.dependencies.obtenerResultadosUseCase,
            this.dependencies.obtenerEstadisticasUseCase,
            this.dependencies.obtenerDetalleResultadoUseCase
        );
    }

    get(name) {
        if (!this.dependencies[name]) {
            throw new Error(`Dependency '${name}' not found`);
        }
        return this.dependencies[name];
    }
}

export default new Container();
