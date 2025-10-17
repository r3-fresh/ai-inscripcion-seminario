// =============================================================================
// CONFIGURACIÓN
// =============================================================================

const CONFIG = {
  sheets: {
    enlaces: 'Enlaces de acceso',
    respuestas: 'respuestas'
  },
  email: {
    asunto: "Confirmación de inscripción en seminario de investigación",
    remitente: "Hub de Información | Apoyo a la Investigación",
    cc: "researchsupport@continental.edu.pe"
  }
};

// =============================================================================
// FUNCIONES AUXILIARES
// =============================================================================

/**
 * Busca el enlace de acceso para un taller
 */
const lookURL = (soughtValue, fil, col, fil2, col2) => {
  const sheet = SpreadsheetApp.getActive().getSheetByName(CONFIG.sheets.enlaces);
  let comparativeValue;
  while ((comparativeValue = sheet.getRange(fil, col).getValue()) !== "") {
    if (soughtValue === comparativeValue) {
      return sheet.getRange(fil2, col2).getValue();
    }
    fil++;
    fil2++;
  }
  return null;
};

/**
 * Parsea la información de un taller
 */
const parsearInfoTaller = (tallerString) => {
  const partes = tallerString.split(" / ");
  const nombre = partes[0];
  const fechaHoraParts = partes[1].split(", ");
  const fecha = `${fechaHoraParts[0]}, ${fechaHoraParts[1]}`;
  const hora = fechaHoraParts[2];
  return { nombre, fecha, hora };
};

/**
 * Genera el HTML de un taller
 */
const generarHTMLTaller = (taller, enlace, esUltimo) => {
  const horaDisplay = esUltimo ? taller.hora : `${taller.hora}.`;
  return `<hr><p>Sesión: <strong>${taller.nombre}</strong></p>` +
    `<p>Fecha: <strong>${taller.fecha}</strong></p>` +
    `<p>Hora: <strong>${horaDisplay}</strong></p>` +
    `<p>Tipo de sesión: <strong>Virtual</strong></p>` +
    `<p>Enlace de acceso: <strong><a href="${enlace}" style="font-size:12px;">${enlace}</a></strong></p>` +
    (esUltimo ? '<hr>' : '');
};

// =============================================================================
// FUNCIÓN PRINCIPAL
// =============================================================================

const emailOnFormSubmit = (e) => {
  // Extraer datos del formulario
  const userResponse = {
    timestamp: e.values[0],
    email: e.values[1],
    name: e.values[2].toUpperCase(),
    type: e.values[3],
    campus: e.values[4],
    modalityOfStudies: e.values[5],
    academicProgram: e.values[6] + e.values[7] + e.values[8],
    phone: e.values[9],
    list: e.values[10],
    dpp: e.values[11],
  };

  // Procesar talleres
  const capacitaciones = userResponse.list.split("., ");
  const responsesSheet = SpreadsheetApp.getActive().getSheetByName(CONFIG.sheets.respuestas);
  let descripcionTalleres = "";

  capacitaciones.forEach((capacitacion, index) => {
    const esUltimo = index === capacitaciones.length - 1;
    const taller = parsearInfoTaller(capacitacion);

    // Buscar enlace
    const claveEnlace = esUltimo ? capacitacion : capacitacion + ".";
    const enlaceAcceso = lookURL(claveEnlace, 1, 1, 1, 2) || "#";

    // Generar HTML
    descripcionTalleres += generarHTMLTaller(taller, enlaceAcceso, esUltimo);

    // Guardar en hoja de respuestas
    responsesSheet.appendRow([
      userResponse.timestamp,
      userResponse.email,
      userResponse.name,
      userResponse.type,
      userResponse.campus,
      userResponse.modalityOfStudies,
      userResponse.academicProgram,
      userResponse.phone,
      claveEnlace,
      userResponse.dpp
    ]);
  });

  // Preparar correo
  const emailBody = `Hola: ${userResponse.name}, ¡Confirmamos tu inscripción en las sesiones solicitadas!
Cualquier consulta por favor no dudes en escribirnos a: ${CONFIG.email.cc} o contactarte a nuestros números telefónicos según el campus o sede más cercano.`;

  const emailTemplate = HtmlService.createTemplateFromFile("emailTemplate");
  emailTemplate.nombreUsuario = userResponse.name;
  emailTemplate.descripcionTalleres = descripcionTalleres;
  const htmlBody = emailTemplate.evaluate().getContent();

  const emailOptions = {
    name: CONFIG.email.remitente,
    htmlBody: htmlBody,
    cc: CONFIG.email.cc
  };

  // Enviar correo
  MailApp.sendEmail(userResponse.email, CONFIG.email.asunto, emailBody, emailOptions);
};

// =============================================================================
// FUNCIONES DE INTERFAZ
// =============================================================================

const hasScript = () => {
  SpreadsheetApp.getUi().alert("Información del Script\n\nName: AI | Inscripción - Seminario\nVersión: 2.0");
};

const onOpen = () => {
  SpreadsheetApp.getUi()
    .createMenu("🟢 Seminario")
    .addItem("Ver información del script", "hasScript")
    .addToUi();
};

