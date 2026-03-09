/**
 * Entidad de Dominio: Examen
 */
export class Examen {
    constructor({ id, titulo, descripcion, duracionMinutos, totalPreguntas, activo }) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.duracionMinutos = duracionMinutos;
        this.totalPreguntas = totalPreguntas;
        this.activo = activo !== false;
    }

    getDuracionSegundos() {
        return this.duracionMinutos * 60;
    }

    estaActivo() {
        return this.activo === true;
    }
}
