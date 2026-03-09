"""
MÓDULO DE ANÁLISIS DE RESULTADOS
Proporciona funciones de análisis estadístico y generación de reportes
"""

import mysql.connector
from datetime import datetime
import json

class AnalizadorResultados:
    """Clase para analizar resultados de exámenes"""
    
    def __init__(self, host='localhost', user='root', password='', database='examen_contabilidad'):
        """Inicializar conexión a la base de datos"""
        self.config = {
            'host': host,
            'user': user,
            'password': password,
            'database': database
        }
    
    def conectar(self):
        """Establecer conexión con la base de datos"""
        try:
            return mysql.connector.connect(**self.config)
        except mysql.connector.Error as err:
            print(f"Error de conexión: {err}")
            return None
    
    def obtener_estadisticas_generales(self):
        """Obtener estadísticas generales del sistema"""
        conn = self.conectar()
        if not conn:
            return None
        
        cursor = conn.cursor(dictionary=True)
        
        try:
            # Total de estudiantes
            cursor.execute("SELECT COUNT(DISTINCT usuario_id) as total FROM intentos_examen WHERE estado IN ('finalizado', 'tiempo_agotado')")
            total_estudiantes = cursor.fetchone()['total']
            
            # Promedio general
            cursor.execute("SELECT AVG(porcentaje) as promedio FROM resultados")
            promedio = cursor.fetchone()['promedio']
            
            # Aprobados y reprobados
            cursor.execute("SELECT COUNT(*) as aprobados FROM resultados WHERE porcentaje >= 60")
            aprobados = cursor.fetchone()['aprobados']
            
            cursor.execute("SELECT COUNT(*) as reprobados FROM resultados WHERE porcentaje < 60")
            reprobados = cursor.fetchone()['reprobados']
            
            # Mejor y peor puntaje
            cursor.execute("SELECT MAX(porcentaje) as mejor, MIN(porcentaje) as peor FROM resultados")
            puntajes = cursor.fetchone()
            
            return {
                'total_estudiantes': total_estudiantes,
                'promedio_general': round(promedio, 2) if promedio else 0,
                'aprobados': aprobados,
                'reprobados': reprobados,
                'mejor_puntaje': puntajes['mejor'],
                'peor_puntaje': puntajes['peor'],
                'tasa_aprobacion': round((aprobados / (aprobados + reprobados) * 100), 2) if (aprobados + reprobados) > 0 else 0
            }
        
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            return None
        
        finally:
            cursor.close()
            conn.close()
    
    def analizar_preguntas_dificiles(self):
        """Identificar las preguntas más difíciles"""
        conn = self.conectar()
        if not conn:
            return None
        
        cursor = conn.cursor(dictionary=True)
        
        try:
            query = """
                SELECT 
                    p.numero_pregunta,
                    p.texto_pregunta,
                    COUNT(*) as total_respuestas,
                    SUM(CASE WHEN re.es_correcta = 1 THEN 1 ELSE 0 END) as correctas,
                    SUM(CASE WHEN re.es_correcta = 0 THEN 1 ELSE 0 END) as incorrectas,
                    ROUND((SUM(CASE WHEN re.es_correcta = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as porcentaje_acierto
                FROM preguntas p
                LEFT JOIN respuestas_estudiante re ON p.id = re.pregunta_id
                WHERE re.respuesta_seleccionada IS NOT NULL
                GROUP BY p.id
                ORDER BY porcentaje_acierto ASC
                LIMIT 5
            """
            
            cursor.execute(query)
            return cursor.fetchall()
        
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            return None
        
        finally:
            cursor.close()
            conn.close()
    
    def analizar_preguntas_faciles(self):
        """Identificar las preguntas más fáciles"""
        conn = self.conectar()
        if not conn:
            return None
        
        cursor = conn.cursor(dictionary=True)
        
        try:
            query = """
                SELECT 
                    p.numero_pregunta,
                    p.texto_pregunta,
                    COUNT(*) as total_respuestas,
                    SUM(CASE WHEN re.es_correcta = 1 THEN 1 ELSE 0 END) as correctas,
                    ROUND((SUM(CASE WHEN re.es_correcta = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as porcentaje_acierto
                FROM preguntas p
                LEFT JOIN respuestas_estudiante re ON p.id = re.pregunta_id
                WHERE re.respuesta_seleccionada IS NOT NULL
                GROUP BY p.id
                ORDER BY porcentaje_acierto DESC
                LIMIT 5
            """
            
            cursor.execute(query)
            return cursor.fetchall()
        
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            return None
        
        finally:
            cursor.close()
            conn.close()
    
    def obtener_distribucion_calificaciones(self):
        """Obtener distribución de calificaciones por rangos"""
        conn = self.conectar()
        if not conn:
            return None
        
        cursor = conn.cursor(dictionary=True)
        
        try:
            rangos = [
                (0, 40, 'Deficiente'),
                (40, 60, 'Insuficiente'),
                (60, 70, 'Aceptable'),
                (70, 85, 'Bueno'),
                (85, 100, 'Excelente')
            ]
            
            distribucion = []
            
            for min_val, max_val, categoria in rangos:
                query = f"""
                    SELECT COUNT(*) as cantidad 
                    FROM resultados 
                    WHERE porcentaje >= {min_val} AND porcentaje < {max_val}
                """
                cursor.execute(query)
                cantidad = cursor.fetchone()['cantidad']
                
                distribucion.append({
                    'categoria': categoria,
                    'rango': f'{min_val}-{max_val}%',
                    'cantidad': cantidad
                })
            
            return distribucion
        
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            return None
        
        finally:
            cursor.close()
            conn.close()
    
    def generar_reporte_completo(self):
        """Generar un reporte completo en formato JSON"""
        reporte = {
            'fecha_generacion': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'estadisticas_generales': self.obtener_estadisticas_generales(),
            'preguntas_dificiles': self.analizar_preguntas_dificiles(),
            'preguntas_faciles': self.analizar_preguntas_faciles(),
            'distribucion_calificaciones': self.obtener_distribucion_calificaciones()
        }
        
        return json.dumps(reporte, indent=2, ensure_ascii=False)


# Ejemplo de uso
if __name__ == '__main__':
    analizador = AnalizadorResultados()
    
    print("=" * 60)
    print("REPORTE DE ANÁLISIS DE RESULTADOS")
    print("=" * 60)
    print()
    
    # Estadísticas generales
    stats = analizador.obtener_estadisticas_generales()
    if stats:
        print("ESTADÍSTICAS GENERALES:")
        print(f"  Total de estudiantes: {stats['total_estudiantes']}")
        print(f"  Promedio general: {stats['promedio_general']}%")
        print(f"  Aprobados: {stats['aprobados']}")
        print(f"  Reprobados: {stats['reprobados']}")
        print(f"  Tasa de aprobación: {stats['tasa_aprobacion']}%")
        print(f"  Mejor puntaje: {stats['mejor_puntaje']}%")
        print(f"  Peor puntaje: {stats['peor_puntaje']}%")
        print()
    
    # Preguntas difíciles
    dificiles = analizador.analizar_preguntas_dificiles()
    if dificiles:
        print("PREGUNTAS MÁS DIFÍCILES:")
        for p in dificiles:
            print(f"  Pregunta {p['numero_pregunta']}: {p['porcentaje_acierto']}% de acierto")
        print()
    
    # Preguntas fáciles
    faciles = analizador.analizar_preguntas_faciles()
    if faciles:
        print("PREGUNTAS MÁS FÁCILES:")
        for p in faciles:
            print(f"  Pregunta {p['numero_pregunta']}: {p['porcentaje_acierto']}% de acierto")
        print()
    
    # Distribución
    distribucion = analizador.obtener_distribucion_calificaciones()
    if distribucion:
        print("DISTRIBUCIÓN DE CALIFICACIONES:")
        for d in distribucion:
            print(f"  {d['categoria']} ({d['rango']}): {d['cantidad']} estudiantes")
        print()
    
    # Generar reporte JSON
    print("Generando reporte completo en JSON...")
    reporte_json = analizador.generar_reporte_completo()
    
    with open('reporte_resultados.json', 'w', encoding='utf-8') as f:
        f.write(reporte_json)
    
    print("Reporte guardado en: reporte_resultados.json")
