/**
 * Contact-form log — Google Apps Script web app.
 *
 * Web3Forms emails each submission but keeps no copy, so its delivery cannot be
 * audited: if a message is ever missing, there is nothing to check but an inbox.
 * This appends every submission to a spreadsheet as a second, inspectable record.
 *
 * The site posts to BOTH destinations and only reports "Message sent" if at
 * least one accepted, so a failure here never costs a message — it just costs
 * the audit trail, and the browser console says which channel failed.
 *
 * ── Deploy (once) ─────────────────────────────────────────────────────────
 *  1. Create a Google Sheet. Name it something like "Portfolio contact form".
 *  2. Extensions → Apps Script. Delete the placeholder code, paste this file.
 *  3. Deploy → New deployment → type: Web app.
 *       Execute as:        Me
 *       Who has access:    Anyone            <-- required; "Anyone with Google
 *                                                account" will NOT work, the
 *                                                visitor is not signed in
 *  4. Authorise when prompted (it is your own script writing to your own sheet).
 *  5. Copy the deployment URL — it ends in /exec — and paste it into SHEET_URL
 *     in assets/js/main.js.
 *
 * Re-deploying after an edit: Deploy → Manage deployments → edit (pencil) →
 * Version: New version → Deploy. Editing the code alone does not update the
 * live /exec URL.
 */

var SHEET_NAME = 'Messages';

function doPost(e) {
  var out = ContentService.createTextOutput();
  try {
    var d = JSON.parse(e.postData.contents);
    getSheet_().appendRow([
      new Date(),
      clip_(d.name, 200),
      clip_(d.email, 200),
      clip_(d.subject, 300),
      clip_(d.message, 5000)
    ]);
    out.setContent(JSON.stringify({ ok: true }));
  } catch (err) {
    // Still 200 — Apps Script cannot set a status code, and the site treats a
    // rejected fetch as the failure signal anyway.
    out.setContent(JSON.stringify({ ok: false, error: String(err) }));
  }
  return out.setMimeType(ContentService.MimeType.JSON);
}

/** Lets you open the /exec URL in a browser to confirm the deployment is live. */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'portfolio contact log' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Received', 'Name', 'Email', 'Subject', 'Message']);
    sheet.setFrozenRows(1);
    sheet.getRange('A1:E1').setFontWeight('bold');
  }
  return sheet;
}

/** Truncates so one oversized paste cannot break the row. */
function clip_(v, n) {
  return String(v == null ? '' : v).slice(0, n);
}
