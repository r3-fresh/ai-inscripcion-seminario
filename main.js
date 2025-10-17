const lookURL = (soughtValue, fil, col, fil2, col2) => {
  const sheet = SpreadsheetApp.getActive().getSheetByName('Enlaces de acceso');
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

const emailOnFormSubmit = (e) => {

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

  let descripcionTalleres = "";
  let enlaceAcceso = "#";

  let Capacitaciones = userResponse.list.split("., ");
  for (let i = 0; i < Capacitaciones.length; i++) {
    let nombreTaller = Capacitaciones[i].split(" / ")[0];
    let fechaTaller = Capacitaciones[i].split(" / ")[1].split(", ")[0] + ", " + Capacitaciones[i].split(" / ")[1].split(", ")[1];
    let horaTaller = Capacitaciones[i].split(" / ")[1].split(", ")[2];

    if (i + 1 == Capacitaciones.length) {
      enlaceAcceso = lookURL(Capacitaciones[i], 1, 1, 1, 2);
      descripcionTalleres += '<hr><p>Sesión: <strong>' + nombreTaller + '</strong></p>' +
        '<p>Fecha: <strong>' + fechaTaller + '</strong></p>' +
        '<p>Hora: <strong>' + horaTaller + '</strong></p>' +
        '<p>Tipo de sesión: <strong>Virtual</strong></p>' +
        '<p>Enlace de acceso: <strong><a href="' + enlaceAcceso + '" style="font-size:12px;">' + enlaceAcceso + '</a></strong></p><hr>';
    } else {
      enlaceAcceso = lookURL(Capacitaciones[i] + ".", 1, 1, 1, 2);
      descripcionTalleres += '<hr><p>Sesión: <strong>' + nombreTaller + '</strong></p>' +
        '<p>Fecha: <strong>' + fechaTaller + '</strong></p>' +
        '<p>Hora: <strong>' + horaTaller + '.</strong></p>' +
        '<p>Tipo de sesión: <strong>Virtual</strong></p>' +
        '<p>Enlace de acceso: <strong><a href="' + enlaceAcceso + '" style="font-size:12px;">' + enlaceAcceso + '</a></strong></p>';
    }

    //    Pasar información a pestaña dividida
    let newSheet = SpreadsheetApp.getActive().getSheetByName('respuestas');

    newSheet.appendRow([userResponse.timestamp, userResponse.email, userResponse.name, userResponse.type, userResponse.campus, userResponse.modalityOfStudies, userResponse.academicProgram, userResponse.phone, (i + 1 == Capacitaciones.length) ? Capacitaciones[i] : Capacitaciones[i] + ".", userResponse.dpp])
  }

  // emailBody es para aquellos dispositivos que no pueden renderizar HTML, es texto plano.
  const emailBody = `Hola: ${userResponse.name}, ¡Confirmamos tu inscripción en las sesiones solicitadas!
Cualquier consulta por favor no dudes en escribirnos a: researchsupport@continental.edu.pe o contactarte a nuestros números telefónicos según el campus o sede más cercano.`;

  // emailTemplate obtiene la plantilla HTML con formato.
  const emailTemplate = HtmlService.createTemplateFromFile("emailTemplate");
  emailTemplate.nombreUsuario = userResponse.name;
  emailTemplate.descripcionTalleres = descripcionTalleres;
  const htmlBody = emailTemplate.evaluate().getContent();

  const advancedOpts = {
    name: "Hub de Información | Apoyo a la Investigación",
    htmlBody: htmlBody,
    cc: "researchsupport@continental.edu.pe"
    // cc: "fromeror@continental.edu.pe"
  };

  MailApp.sendEmail(userResponse.email, "Confirmación de inscripción en seminario de investigación", emailBody, advancedOpts);
}

const hasScript = () => { SpreadsheetApp.getUi().alert("\nName: AI | Inscripción - Seminario") }

const onOpen = () => { SpreadsheetApp.getUi().createMenu("🟢").addItem("Ver información del script", "hasScript").addToUi() }

