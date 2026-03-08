// =============================================
// GOOGLE APPS SCRIPT — FORM BACKEND
// Arunachala Digi World
// =============================================
//
// SETUP INSTRUCTIONS:
// 1. Go to https://script.google.com
// 2. Create a New Project
// 3. Paste this entire code
// 4. Click "Deploy" → "New Deployment"
// 5. Select Type: "Web App"
// 6. Execute as: "Me"
// 7. Who has access: "Anyone"
// 8. Click Deploy, Copy the URL
// 9. Paste URL into main.js → APPS_SCRIPT_URL variable
// =============================================

const NOTIFICATION_EMAIL = 'shivshakti.2004.29.15@gmail.com';
const SHEET_NAME = 'Inquiries';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Save to Google Sheet
    saveToSheet(data);
    
    // Send email notification
    sendEmailNotification(data);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Inquiry received!' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Arunachala Digi World Form Backend is running!' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function saveToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Add headers
    sheet.getRange(1, 1, 1, 9).setValues([[
      'Timestamp', 'Name', 'Mobile', 'Email', 
      'Brand Name', 'Services Required', 'Address', 'Message', 'Source Page'
    ]]);
    // Style header row
    const headerRange = sheet.getRange(1, 1, 1, 9);
    headerRange.setBackground('#00D4FF');
    headerRange.setFontColor('#03050D');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  
  // Append data row
  sheet.appendRow([
    new Date(data.timestamp || new Date()),
    data.name || '',
    data.mobile || '',
    data.email || '',
    data.brand || '',
    data.services || '',
    data.address || '',
    data.message || '',
    data.page || 'Unknown'
  ]);
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, 9);
}

function sendEmailNotification(data) {
  const subject = `🚀 New Inquiry — ${data.name || 'Unknown'} | Arunachala Digi World`;
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #0066FF, #00D4FF); padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 32px; }
    .field { margin-bottom: 20px; border-bottom: 1px solid #f0f0f0; padding-bottom: 16px; }
    .field:last-child { border-bottom: none; }
    .label { font-size: 12px; font-weight: bold; color: #0066FF; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
    .value { font-size: 16px; color: #1a1a1a; }
    .services { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .service-tag { background: #e8f4ff; color: #0066FF; padding: 4px 12px; border-radius: 100px; font-size: 13px; }
    .footer { background: #f9f9f9; padding: 20px 32px; text-align: center; }
    .footer p { color: #999; font-size: 12px; margin: 0; }
    .cta { display: inline-block; background: linear-gradient(135deg, #0066FF, #00D4FF); color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 New Inquiry Received!</h1>
      <p>Arunachala Digi World — Form Submission</p>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">👤 Name</div>
        <div class="value">${data.name || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">📱 Mobile</div>
        <div class="value">${data.mobile || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">📧 Email</div>
        <div class="value">${data.email || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">🏢 Brand / Company</div>
        <div class="value">${data.brand || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">⚡ Services Required</div>
        <div class="value">${data.services || 'Not specified'}</div>
      </div>
      <div class="field">
        <div class="label">📍 Address</div>
        <div class="value">${data.address || 'Not provided'}</div>
      </div>
      ${data.message ? `
      <div class="field">
        <div class="label">💬 Message</div>
        <div class="value">${data.message}</div>
      </div>` : ''}
      <div class="field">
        <div class="label">🕐 Submitted At</div>
        <div class="value">${new Date(data.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</div>
      </div>
    </div>
    <div class="footer">
      <p>This email was sent automatically from Arunachala Digi World website.</p>
      <p style="margin-top:8px">© 2025 Arunachala Digi World</p>
    </div>
  </div>
</body>
</html>
  `;
  
  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: subject,
    htmlBody: htmlBody
  });
}
