/**
 * BODA — RECEPCIÓN DE CONFIRMACIONES EN GOOGLE SHEETS
 * Pegar este código en Extensiones > Apps Script de la hoja destino.
 * Publicar como APLICACIÓN WEB > Ejecutar como: Yo > Acceso: Cualquier persona.
 * Copiar la URL terminada en /exec a script.js > wedding.googleSheetsWebApp.
 *
 * El GET JSONP retorna EXCLUSIVAMENTE {ok,found}; NO expone nombres,
 * mensajes ni la lista de asistentes.
 */
const SHEET_NAME = 'Confirmaciones';
const HEADERS = ['Fecha de registro', 'Nombre completo', 'Asistencia', 'Mensaje', 'ID de envío'];

function doPost(e) {
  const data = (e && e.parameter) || {};
  if (String(data.website || '').trim()) return text_('IGNORADO'); // Antispam.
  const id = String(data.requestId || '').trim();
  const name = String(data.guestName || '').trim();
  const attendance = String(data.attendance || '').trim();
  const message = String(data.message || '').trim();

  if (!/^[A-Za-z0-9-]{10,90}$/.test(id)) return text_('ID INVALIDO');
  if (name.length < 2 || name.length > 100) return text_('NOMBRE INVALIDO');
  if (!['Sí, asistiré', 'No podré asistir'].includes(attendance)) return text_('ASISTENCIA INVALIDA');
  if (message.length > 500) return text_('MENSAJE DEMASIADO LARGO');

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const sheet = sheet_();
    if (!isRecorded_(sheet, id)) {
      sheet.appendRow([
        new Date(), safeCell_(name), attendance, safeCell_(message), id
      ]);
      SpreadsheetApp.flush();
    }
    return text_('OK');
  } catch (error) {
    console.error(error);
    return text_('ERROR');
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function doGet(e) {
  const data = (e && e.parameter) || {};
  if (data.action !== 'status') {
    return text_('Servicio de confirmaciones de boda activo.');
  }
  const callback = String(data.callback || '');
  const id = String(data.requestId || '').trim();
  // Evitar la inyección de JavaScript mediante el nombre de callback.
  if (!/^bodaStatus_[A-Za-z0-9]{10,90}$/.test(callback)) return text_('CALLBACK INVALIDO');
  const validId = /^[A-Za-z0-9-]{10,90}$/.test(id);
  let found = false;
  try {
    if (validId) found = isRecorded_(sheet_(), id);
  } catch (error) {
    console.error(error);
  }
  const result = JSON.stringify({ ok: true, found: Boolean(found) });
  return ContentService.createTextOutput(callback + '(' + result + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function sheet_() {
  // Este código debe estar VINCULADO a la hoja de cálculo correspondiente.
  const book = SpreadsheetApp.getActiveSpreadsheet();
  if (!book) throw new Error('Abre Apps Script desde Extensiones de Google Sheets.');
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm');
    sheet.getRange('A1:E1').setFontWeight('bold').setBackground('#B7BB88');
    sheet.autoResizeColumns(1, 5);
  }
  return sheet;
}

function isRecorded_(sheet, id) {
  if (sheet.getLastRow() < 2) return false;
  return Boolean(sheet.getRange(2, 5, sheet.getLastRow() - 1, 1)
    .createTextFinder(id).matchEntireCell(true).findNext());
}

function safeCell_(value) {
  // Evitar que un mensaje escrito por un invitado ejecute fórmulas de Sheets.
  const text = String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function text_(message) {
  return ContentService.createTextOutput(String(message))
    .setMimeType(ContentService.MimeType.TEXT);
}
