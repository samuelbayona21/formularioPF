-- ============================================
-- SISTEMA DE EXAMEN DE CONTABILIDAD EN LÍNEA
-- Script de Instalación Completo
-- Incluye: Estructura + Datos + 50 Preguntas
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS examen_contabilidad CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE examen_contabilidad;

-- ============================================
-- TABLAS
-- ============================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    tipo_usuario ENUM('estudiante', 'administrador') DEFAULT 'estudiante',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cedula (cedula)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de exámenes
CREATE TABLE IF NOT EXISTS examenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    duracion_minutos INT DEFAULT 20,
    total_preguntas INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de preguntas
CREATE TABLE IF NOT EXISTS preguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    examen_id INT NOT NULL,
    numero_pregunta INT NOT NULL,
    texto_pregunta TEXT NOT NULL,
    respuesta_correcta CHAR(1) NOT NULL,
    FOREIGN KEY (examen_id) REFERENCES examenes(id) ON DELETE CASCADE,
    INDEX idx_examen (examen_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de opciones
CREATE TABLE IF NOT EXISTS opciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pregunta_id INT NOT NULL,
    letra_opcion CHAR(1) NOT NULL,
    texto_opcion TEXT NOT NULL,
    FOREIGN KEY (pregunta_id) REFERENCES preguntas(id) ON DELETE CASCADE,
    INDEX idx_pregunta (pregunta_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de intentos
CREATE TABLE IF NOT EXISTS intentos_examen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    examen_id INT NOT NULL,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP NULL,
    tiempo_restante INT DEFAULT 1200,
    estado ENUM('en_progreso', 'finalizado', 'tiempo_agotado') DEFAULT 'en_progreso',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (examen_id) REFERENCES examenes(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de respuestas
CREATE TABLE IF NOT EXISTS respuestas_estudiante (
    id INT AUTO_INCREMENT PRIMARY KEY,
    intento_id INT NOT NULL,
    pregunta_id INT NOT NULL,
    respuesta_seleccionada CHAR(1),
    es_correcta BOOLEAN DEFAULT FALSE,
    fecha_respuesta TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (intento_id) REFERENCES intentos_examen(id) ON DELETE CASCADE,
    FOREIGN KEY (pregunta_id) REFERENCES preguntas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_respuesta (intento_id, pregunta_id),
    INDEX idx_intento (intento_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de resultados
CREATE TABLE IF NOT EXISTS resultados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    intento_id INT NOT NULL UNIQUE,
    total_preguntas INT NOT NULL,
    respuestas_correctas INT DEFAULT 0,
    respuestas_incorrectas INT DEFAULT 0,
    porcentaje DECIMAL(5,2) DEFAULT 0.00,
    fecha_calculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (intento_id) REFERENCES intentos_examen(id) ON DELETE CASCADE,
    INDEX idx_intento (intento_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de rangos de calificación
CREATE TABLE IF NOT EXISTS rangos_calificacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    examen_id INT NOT NULL,
    rango_min DECIMAL(5,2) NOT NULL,
    rango_max DECIMAL(5,2) NOT NULL,
    calificacion VARCHAR(50) NOT NULL,
    descripcion TEXT,
    FOREIGN KEY (examen_id) REFERENCES examenes(id) ON DELETE CASCADE,
    INDEX idx_examen (examen_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Usuarios administradores
INSERT INTO usuarios (nombre_completo, cedula, tipo_usuario) VALUES
('Administrador Sistema', 'admin', 'administrador'),
('Oscar Solano', 'oscar2026', 'administrador');

-- Examen
INSERT INTO examenes (titulo, descripcion, duracion_minutos, total_preguntas) 
VALUES ('Prueba de Conocimiento GAF', 'Evaluación de conocimientos generales', 25, 50);

-- Rangos de calificación
INSERT INTO rangos_calificacion (examen_id, rango_min, rango_max, calificacion, descripcion) VALUES
(1, 0, 40, 'Deficiente', 'Necesita mejorar significativamente'),
(1, 40, 60, 'Insuficiente', 'Requiere más estudio'),
(1, 60, 70, 'Aceptable', 'Aprobado nivel básico'),
(1, 70, 85, 'Bueno', 'Buen dominio del tema'),
(1, 85, 100, 'Excelente', 'Dominio sobresaliente');

-- ============================================
-- 50 PREGUNTAS DE CONTABILIDAD
-- ============================================

INSERT INTO preguntas (examen_id, numero_pregunta, texto_pregunta, respuesta_correcta) VALUES
(1, 1, 'Según el Código de Comercio, la escritura pública es obligatoria para la constitución de:', 'C'),
(1, 2, 'La Ley 222 de 1995 regula principalmente:', 'B'),
(1, 3, 'La matrícula mercantil tiene como finalidad principal:', 'B'),
(1, 4, '¿Cuál entidad ejerce inspección, vigilancia y control sobre sociedades comerciales no vigiladas por otra superintendencia?', 'C'),
(1, 5, 'La SAS se caracteriza por:', 'C'),
(1, 6, 'El representante legal de una sociedad es responsable de:', 'C'),
(1, 7, 'Según NIIF, el objetivo principal de los estados financieros es:', 'C'),
(1, 8, 'El principio de devengo implica que:', 'B'),
(1, 9, 'Un activo se reconoce cuando:', 'B'),
(1, 10, 'El costo de ventas en el estado de resultados corresponde a:', 'C'),
(1, 11, 'Las políticas contables deben ser:', 'B'),
(1, 12, 'La depreciación refleja:', 'B'),
(1, 13, 'Un pasivo se clasifica como corriente cuando:', 'B'),
(1, 14, 'El balance de prueba sirve para:', 'B'),
(1, 15, 'Las notas a los estados financieros tienen como finalidad:', 'B'),
(1, 16, 'Los marcos NIIF aplican en Colombia a:', 'C'),
(1, 17, 'El hecho generador del impuesto de renta es:', 'B'),
(1, 18, 'El IVA se causa generalmente cuando:', 'B'),
(1, 19, 'El impuesto de industria y comercio es de carácter:', 'C'),
(1, 20, 'La hoja de trabajo tributaria sirve para:', 'B'),
(1, 21, 'Un ingreso no constitutivo de renta se caracteriza por:', 'B'),
(1, 22, 'Las retenciones en la fuente tienen como finalidad:', 'B'),
(1, 23, 'El impuesto predial es:', 'B'),
(1, 24, 'Un descuento tributario se aplica sobre:', 'D'),
(1, 25, 'La depuración del impuesto de renta inicia con:', 'B'),
(1, 26, 'La información exógena tiene como finalidad:', 'B'),
(1, 27, 'La información exógena nacional se presenta ante:', 'B'),
(1, 28, 'Los formatos de información exógena son definidos por:', 'C'),
(1, 29, 'La información exógena territorial se presenta ante:', 'C'),
(1, 30, 'La información exógena debe coincidir con:', 'B'),
(1, 31, 'El error en información exógena puede generar:', 'B'),
(1, 32, 'La conciliación bancaria busca:', 'B'),
(1, 33, 'Las cuentas por cobrar deben conciliarse con:', 'B'),
(1, 34, 'Los libros principales son:', 'A'),
(1, 35, 'El comprobante de diario sirve para:', 'A'),
(1, 36, 'La teneduría de libros implica:', 'B'),
(1, 37, 'Una conciliación correcta debe:', 'B'),
(1, 38, 'El informe de gestión es responsabilidad de:', 'C'),
(1, 39, 'Los estados financieros de propósito general incluyen:', 'B'),
(1, 40, 'Los estados financieros deben presentarse:', 'B'),
(1, 41, 'La comparabilidad implica:', 'B'),
(1, 42, 'Los estados financieros consolidados aplican cuando:', 'B'),
(1, 43, 'Los reportes a la Superintendencia de Sociedades deben basarse en:', 'B'),
(1, 44, 'La clasificación correcta de cuentas permite:', 'B'),
(1, 45, 'El estado de resultados del costo permite analizar principalmente:', 'B'),
(1, 46, '¿Cuál de las siguientes cuentas corresponde a un ACTIVO?', 'C'),
(1, 47, '¿Cuál cuenta se clasifica como PASIVO?', 'B'),
(1, 48, '¿Cuál corresponde a una cuenta de PATRIMONIO?', 'C'),
(1, 49, '¿Cuál es una cuenta de COSTO?', 'B'),
(1, 50, '¿Cuál corresponde a un INGRESO OPERACIONAL?', 'A');

-- ============================================
-- OPCIONES PARA LAS 50 PREGUNTAS
-- ============================================

-- Pregunta 1
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(1, 'A', 'Empresa unipersonal'),
(1, 'B', 'Sociedad por acciones simplificada (SAS)'),
(1, 'C', 'Sociedad colectiva'),
(1, 'D', 'Comerciante persona natural');

-- Pregunta 2
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(2, 'A', 'El régimen laboral'),
(2, 'B', 'La inspección, vigilancia y control societario'),
(2, 'C', 'El régimen tributario'),
(2, 'D', 'La contabilidad pública');

-- Pregunta 3
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(3, 'A', 'Otorgar personería jurídica'),
(3, 'B', 'Registrar la existencia y dar publicidad al comerciante'),
(3, 'C', 'Autorizar operaciones financieras'),
(3, 'D', 'Validar estados financieros');

-- Pregunta 4
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(4, 'A', 'DIAN'),
(4, 'B', 'Superintendencia de Industria y Comercio'),
(4, 'C', 'Superintendencia de Sociedades'),
(4, 'D', 'DANE');

-- Pregunta 5
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(5, 'A', 'Exigir mínimo dos socios'),
(5, 'B', 'Responder solidariamente los accionistas'),
(5, 'C', 'Permitir constitución por documento privado'),
(5, 'D', 'Tener objeto social restringido');

-- Pregunta 6
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(6, 'A', 'Solo firmar contratos'),
(6, 'B', 'Elaborar personalmente la contabilidad'),
(6, 'C', 'Presentar informes de gestión'),
(6, 'D', 'Liquidar impuestos personales de los socios');

-- Pregunta 7
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(7, 'A', 'Determinar impuestos'),
(7, 'B', 'Informar a entidades de control'),
(7, 'C', 'Proporcionar información útil para la toma de decisiones'),
(7, 'D', 'Cumplir requisitos legales únicamente');

-- Pregunta 8
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(8, 'A', 'Los hechos se reconocen cuando se pagan'),
(8, 'B', 'Se reconocen cuando ocurre el hecho económico'),
(8, 'C', 'Solo se reconocen ingresos'),
(8, 'D', 'Aplica solo para impuestos');

-- Pregunta 9
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(9, 'A', 'Tiene forma legal'),
(9, 'B', 'Genera beneficios económicos futuros'),
(9, 'C', 'Está totalmente pagado'),
(9, 'D', 'Es tangible');

-- Pregunta 10
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(10, 'A', 'Gastos administrativos'),
(10, 'B', 'Gastos financieros'),
(10, 'C', 'Valor de los bienes vendidos'),
(10, 'D', 'Ingresos operacionales');

-- Pregunta 11
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(11, 'A', 'Variables cada año'),
(11, 'B', 'Uniformes y consistentes'),
(11, 'C', 'Definidas por la DIAN'),
(11, 'D', 'Opcionales');

-- Pregunta 12
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(12, 'A', 'La pérdida de valor de mercado'),
(12, 'B', 'El desgaste del activo en el tiempo'),
(12, 'C', 'La inflación'),
(12, 'D', 'El deterioro financiero');

-- Pregunta 13
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(13, 'A', 'Se paga en más de un año'),
(13, 'B', 'Se paga dentro del ciclo normal del negocio'),
(13, 'C', 'Es financiero'),
(13, 'D', 'Es con entidades vinculadas');

-- Pregunta 14
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(14, 'A', 'Determinar impuestos'),
(14, 'B', 'Verificar igualdad entre débitos y créditos'),
(14, 'C', 'Elaborar informes de gestión'),
(14, 'D', 'Presentar a la DIAN');

-- Pregunta 15
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(15, 'A', 'Reemplazar los estados financieros'),
(15, 'B', 'Ampliar y explicar la información financiera'),
(15, 'C', 'Registrar operaciones'),
(15, 'D', 'Liquidar impuestos');

-- Pregunta 16
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(16, 'A', 'Solo entidades públicas'),
(16, 'B', 'Solo grandes empresas'),
(16, 'C', 'Entidades obligadas según su grupo'),
(16, 'D', 'Solo personas naturales');

-- Pregunta 17
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(17, 'A', 'La facturación'),
(17, 'B', 'La obtención de ingresos susceptibles de incrementar el patrimonio'),
(17, 'C', 'El recaudo'),
(17, 'D', 'El pago del impuesto');

-- Pregunta 18
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(18, 'A', 'Se recibe el dinero'),
(18, 'B', 'Se realiza el hecho gravado'),
(18, 'C', 'Se presenta la declaración'),
(18, 'D', 'Se emite el RUT');

-- Pregunta 19
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(19, 'A', 'Nacional'),
(19, 'B', 'Departamental'),
(19, 'C', 'Municipal'),
(19, 'D', 'Internacional');

-- Pregunta 20
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(20, 'A', 'Registrar contabilidad'),
(20, 'B', 'Depurar bases gravables y determinar impuestos'),
(20, 'C', 'Elaborar contratos'),
(20, 'D', 'Presentar informes de gestión');

-- Pregunta 21
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(21, 'A', 'Estar gravado'),
(21, 'B', 'No incrementar el patrimonio'),
(21, 'C', 'Tener tarifa cero'),
(21, 'D', 'Ser un descuento tributario');

-- Pregunta 22
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(22, 'A', 'Aumentar costos'),
(22, 'B', 'Anticipar el recaudo del impuesto'),
(22, 'C', 'Eliminar el impuesto'),
(22, 'D', 'Reemplazar la declaración');

-- Pregunta 23
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(23, 'A', 'Nacional'),
(23, 'B', 'Municipal'),
(23, 'C', 'Departamental'),
(23, 'D', 'Aduanero');

-- Pregunta 24
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(24, 'A', 'Ingresos'),
(24, 'B', 'Costos'),
(24, 'C', 'La base gravable'),
(24, 'D', 'El impuesto a cargo');

-- Pregunta 25
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(25, 'A', 'Costos'),
(25, 'B', 'Ingresos'),
(25, 'C', 'Deducciones'),
(25, 'D', 'Descuentos');

-- Pregunta 26
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(26, 'A', 'Reemplazar la contabilidad'),
(26, 'B', 'Facilitar el control fiscal y cruces de información a la autoridad'),
(26, 'C', 'Elaborar balances'),
(26, 'D', 'Sustituir declaraciones');

-- Pregunta 27
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(27, 'A', 'Superintendencia de Sociedades'),
(27, 'B', 'DIAN'),
(27, 'C', 'DANE'),
(27, 'D', 'UGPP');

-- Pregunta 28
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(28, 'A', 'El contador'),
(28, 'B', 'El contribuyente'),
(28, 'C', 'La autoridad tributaria'),
(28, 'D', 'El revisor fiscal');

-- Pregunta 29
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(29, 'A', 'DIAN'),
(29, 'B', 'Cámara de Comercio'),
(29, 'C', 'Secretaría de Hacienda'),
(29, 'D', 'Superintendencia Financiera');

-- Pregunta 30
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(30, 'A', 'Estados financieros proyectados'),
(30, 'B', 'Registros contables'),
(30, 'C', 'Presupuestos'),
(30, 'D', 'Flujo de caja');

-- Pregunta 31
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(31, 'A', 'Ninguna consecuencia'),
(31, 'B', 'Sanciones'),
(31, 'C', 'Solo correcciones contables'),
(31, 'D', 'Pérdida del RUT');

-- Pregunta 32
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(32, 'A', 'Ajustar estados financieros'),
(32, 'B', 'Comparar saldo contable y bancario'),
(32, 'C', 'Liquidar impuestos'),
(32, 'D', 'Elaborar presupuestos');

-- Pregunta 33
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(33, 'A', 'Inventarios'),
(33, 'B', 'Clientes'),
(33, 'C', 'Proveedores'),
(33, 'D', 'Bancos');

-- Pregunta 34
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(34, 'A', 'Diario y mayor'),
(34, 'B', 'Inventarios'),
(34, 'C', 'Auxiliares'),
(34, 'D', 'Balances');

-- Pregunta 35
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(35, 'A', 'Registrar hechos económicos'),
(35, 'B', 'Conciliar bancos'),
(35, 'C', 'Elaborar informes'),
(35, 'D', 'Presentar impuestos');

-- Pregunta 36
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(36, 'A', 'Custodia física únicamente'),
(36, 'B', 'Registro cronológico y ordenado'),
(36, 'C', 'Archivo tributario'),
(36, 'D', 'Control presupuestal');

-- Pregunta 37
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(37, 'A', 'Eliminar diferencias'),
(37, 'B', 'Explicar diferencias'),
(37, 'C', 'Ignorar diferencias'),
(37, 'D', 'Ajustar sin soporte');

-- Pregunta 38
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(38, 'A', 'El contador'),
(38, 'B', 'El revisor fiscal'),
(38, 'C', 'El representante legal'),
(38, 'D', 'La DIAN');

-- Pregunta 39
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(39, 'A', 'Solo balance'),
(39, 'B', 'Estado de situación financiera y estado de resultados'),
(39, 'C', 'Presupuesto'),
(39, 'D', 'Declaraciones tributarias');

-- Pregunta 40
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(40, 'A', 'Sin notas'),
(40, 'B', 'Con notas y revelaciones'),
(40, 'C', 'Solo a la DIAN'),
(40, 'D', 'Solo internamente');

-- Pregunta 41
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(41, 'A', 'Usar diferentes criterios'),
(41, 'B', 'Comparar con periodos anteriores'),
(41, 'C', 'Cambiar políticas cada periodo'),
(41, 'D', 'Ajustar cifras arbitrariamente');

-- Pregunta 42
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(42, 'A', 'Hay sucursales'),
(42, 'B', 'Existe control sobre otras entidades'),
(42, 'C', 'Hay proveedores comunes'),
(42, 'D', 'Hay clientes comunes');

-- Pregunta 43
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(43, 'A', 'Información fiscal'),
(43, 'B', 'Información financiera'),
(43, 'C', 'Información proyectada'),
(43, 'D', 'Información presupuestal');

-- Pregunta 44
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(44, 'A', 'Ocultar errores'),
(44, 'B', 'Elaborar estados financieros confiables'),
(44, 'C', 'Reducir impuestos'),
(44, 'D', 'Evitar conciliaciones');

-- Pregunta 45
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(45, 'A', 'Liquidez'),
(45, 'B', 'Rentabilidad'),
(45, 'C', 'Endeudamiento'),
(45, 'D', 'Flujo de caja');

-- Pregunta 46
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(46, 'A', 'Proveedores'),
(46, 'B', 'Capital social'),
(46, 'C', 'Caja'),
(46, 'D', 'Ingresos por ventas');

-- Pregunta 47
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(47, 'A', 'Clientes'),
(47, 'B', 'Cuentas por pagar a proveedores'),
(47, 'C', 'Inventarios'),
(47, 'D', 'Utilidades retenidas');

-- Pregunta 48
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(48, 'A', 'Obligaciones financieras'),
(48, 'B', 'Costos de ventas'),
(48, 'C', 'Capital social'),
(48, 'D', 'Gastos administrativos');

-- Pregunta 49
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(49, 'A', 'Arrendamientos'),
(49, 'B', 'Compras de mercancía para la venta'),
(49, 'C', 'Honorarios'),
(49, 'D', 'Intereses pagados');

-- Pregunta 50
INSERT INTO opciones (pregunta_id, letra_opcion, texto_opcion) VALUES
(50, 'A', 'Venta de bienes o servicios'),
(50, 'B', 'Préstamo bancario recibido'),
(50, 'C', 'Aporte de socios'),
(50, 'D', 'Recuperación de cartera castigada');

-- ============================================
-- MENSAJE FINAL
-- ============================================
SELECT 'Base de datos creada exitosamente con 50 preguntas' AS mensaje;
SELECT COUNT(*) AS total_preguntas FROM preguntas;
SELECT COUNT(*) AS total_opciones FROM opciones;
