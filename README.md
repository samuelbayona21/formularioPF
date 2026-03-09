# Prueba de Conocimiento GAF

Sistema de exámenes en línea desarrollado con PHP, MySQL, HTML, CSS y JavaScript.

## Características

- Sistema de exámenes con temporizador
- Persistencia de tiempo en caso de recarga (F5)
- Panel administrativo con dashboard de resultados
- Visualización detallada de respuestas
- Top 10 mejores resultados
- Validación de cédula solo números
- Mensajes diferenciados según tipo de finalización

## Requisitos

- PHP 7.4 o superior
- MySQL 5.7 o superior
- Apache (XAMPP recomendado)

## Instalación

1. Clonar el repositorio en `C:\xampp\htdocs\`
2. Importar `database/setup_completo.sql` en MySQL
3. Configurar credenciales de BD en `config/database.php`
4. Acceder a `http://localhost/examen_contadores/`

## Estructura del Proyecto

```
examen_contadores/
├── api/                    # Endpoints REST
├── app/
│   ├── controllers/       # Controladores
│   ├── models/            # Modelos
│   └── core/              # Database, Security
├── config/                # Configuración
├── database/              # Scripts SQL
├── public/                # Assets (CSS, JS, imágenes)
├── views/                 # Vistas HTML
└── index.html             # Punto de entrada
```

## Credenciales Admin

- Usuario: `admin` / Contraseña: `admin123`
- Usuario: `Oscar Solano` / Contraseña: `oscar2026*`

## URLs

- **Inicio (Estudiantes):** `http://localhost/examen_contadores/`
- **Panel Admin:** `http://localhost/examen_contadores/views/admin/login.html`

## Tecnologías

- Backend: PHP 7.4+
- Base de datos: MySQL
- Frontend: HTML5, CSS3, JavaScript (Vanilla)
- Arquitectura: MVC con API REST

## Autor

G.F. SISTEMAS - 2026
