// config.js
// ==========================================
// Global configuration and general function 
// shared for all HTML files
// ==========================================

// Google Apps Scripts Web APP URL
const API_URL = "https://script.google.com/macros/s/AKfycbywt8Y5aqs-NwVU1L-FT_zB4BZXal7Kq3OfwHFkeAp5HyLS8XFit1DIj7F1oifusdBJ/exec";

// Notification function
function showNotification(message, type = "success") {

  // Check notification node exists or not
  let note = document.getElementById("notification");
  // const note = document.getElementById("notification");

  if (!note) {
    note = document.createElement("div");
    note.id = "notification";
    document.body.appendChild(note);
  }

  // Set contents and style
  note.textContent = message;
  note.className = `notication show ${type}`;
  
  setTimeout(() => {
    note.classList.remove("show");
    setTimeout(() => note.remove(),400);    
  }, 3000);
}

// General function
/**
* ✅ 日期格式化：将 ISO 格式 "2025-08-31T14:00:00.000Z" → "2025-08-31"
*/
function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

/**
 * ✅ 拨打电话功能（兼容移动端）
 */
function callNumber(phone) {
  if (!phone) {
    showNotification("⚠️ No phone number provided", "error");
    return;
  }
  window.location.href = `tel:${phone}`;
}

/**
 * ✅ 短信功能（兼容移动端）
 */
function smsNumber(phone, message = "") {
  if (!phone) {
    showNotification("⚠️ No phone number provided", "error");
    return;
  }
  const smsBody = message ? `?body=${encodeURIComponent(message)}` : "";
  window.location.href = `sms:${phone}${smsBody}`;
}
