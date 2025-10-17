# AI Inscripción Seminario

Sistema automatizado de inscripción y confirmación para seminarios de investigación utilizando Google Apps Script.

## 📋 Descripción

Este proyecto automatiza el proceso completo de inscripción a seminarios de investigación de la Universidad Continental. Se integra con Google Forms y Google Sheets para procesar automáticamente las inscripciones y enviar correos de confirmación personalizados.

## 🚀 Funcionalidades

- ✅ **Procesamiento automático** de formularios de inscripción
- ✅ **Envío de correos** de confirmación con formato HTML profesional
- ✅ **Búsqueda automática** de enlaces de acceso a las sesiones virtuales
- ✅ **Registro detallado** en Google Sheets con una fila por cada taller inscrito
- ✅ **Soporte para múltiples inscripciones** por usuario
- ✅ **Interfaz de usuario** con menú personalizado en Google Sheets

## 🏗️ Estructura del Proyecto

```
ai-inscripcion-seminario/
├── main.js              # Lógica principal del sistema
├── emailTemplate.html   # Plantilla HTML para correos de confirmación
├── appsscript.json     # Configuración del proyecto Apps Script
├── package.json        # Configuración y dependencias del proyecto
└── pnpm-lock.yaml      # Lock file de dependencias
```

## 📊 Estructura de Google Sheets

El sistema requiere una hoja de cálculo de Google con las siguientes pestañas:

### Hoja "Enlaces de acceso"
- **Columna A**: Nombre del taller/capacitación
- **Columna B**: Enlace de acceso a la sesión virtual

### Hoja "respuestas"
Almacena las inscripciones procesadas con los siguientes campos:
1. Timestamp
2. Email
3. Nombre
4. Tipo de usuario
5. Campus
6. Modalidad de estudios
7. Programa académico
8. Teléfono
9. Taller inscrito
10. DPP

## 📧 Sistema de Correos

### Características del Email
- **Remitente**: "Hub de Información | Apoyo a la Investigación"
- **Formato**: HTML profesional con fallback a texto plano
- **CC automático**: researchsupport@continental.edu.pe
- **Contenido dinámico**: Detalles específicos de cada taller inscrito

### Plantilla HTML
La plantilla incluye:
- Branding institucional
- Información detallada de cada sesión
- Recomendaciones técnicas para participantes
- Enlaces directos a las sesiones virtuales

## 🔄 Flujo de Trabajo

1. **Usuario llena formulario** → Google Forms captura datos
2. **Trigger se activa** → `emailOnFormSubmit()` se ejecuta
3. **Procesamiento de datos**:
   - Extrae información del formulario
   - Procesa lista de talleres seleccionados
   - Busca enlaces de acceso correspondientes
4. **Registro en Sheets** → Guarda cada inscripción por separado
5. **Envío de correo** → Genera y envía confirmación personalizada

## 📝 Funciones Principales

### `emailOnFormSubmit(e)`
Función principal que procesa el envío del formulario:
- Extrae datos del evento de envío
- Procesa inscripciones múltiples
- Genera contenido del correo
- Envía confirmación

### `lookURL(soughtValue, fil, col, fil2, col2)`
Función auxiliar para buscar enlaces:
- Busca en la hoja "Enlaces de acceso"
- Retorna el enlace correspondiente al taller
- Maneja casos donde no se encuentra enlace

### `hasScript()` y `onOpen()`
Funciones de utilidad:
- Crean menú personalizado en Google Sheets
- Muestran información del script

## 🎯 Casos de Uso

- **Seminarios de investigación**
- **Capacitaciones institucionales**
- **Talleres virtuales**
- **Eventos académicos con inscripción previa**

## 📞 Soporte

Para consultas o soporte técnico:
- Desarrollador: Fredy Romero (romeroespinoza.fp@gmail.com)