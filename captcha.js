/* =========================================================
   CAPTCHA.JS - Hỗ trợ 2 captcha (login + register)
========================================================= */
let currentCaptchaText  = "";
let currentCaptchaText2 = "";

function generateCaptchaText(length = 5) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let text = "";
  for (let i = 0; i < length; i++) text += chars.charAt(Math.floor(Math.random() * chars.length));
  return text;
}

function drawCaptchaOn(canvasId, text) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, "#f8f9fa");
  grad.addColorStop(1, "#e9ecef");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = `rgba(${Math.random()*255|0},${Math.random()*255|0},${Math.random()*255|0},0.3)`;
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }

  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = `rgba(${Math.random()*255|0},${Math.random()*255|0},${Math.random()*255|0},0.4)`;
    ctx.beginPath();
    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < text.length; i++) {
    ctx.save();
    const x = 22 + i * 26;
    const y = 34 + (Math.random() * 8 - 4);
    ctx.translate(x, y);
    ctx.rotate((Math.random() - 0.5) * 0.5);
    ctx.font = `${24 + Math.random()*4|0}px "Courier New", monospace`;
    ctx.fillStyle = `hsl(${Math.random()*60}, 70%, 35%)`;
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }
}

function drawCaptcha() {
  currentCaptchaText = generateCaptchaText();
  drawCaptchaOn("captchaCanvas", currentCaptchaText);
}
function refreshCaptcha() {
  drawCaptcha();
  const input = document.getElementById("captchaInput");
  if (input) input.value = "";
}
function verifyCaptcha() {
  const input = document.getElementById("captchaInput");
  if (!input) return false;
  const ok = input.value.trim().toUpperCase() === currentCaptchaText.toUpperCase();
  if (!ok) refreshCaptcha();
  return ok;
}

function drawCaptcha2() {
  currentCaptchaText2 = generateCaptchaText();
  drawCaptchaOn("captchaCanvas2", currentCaptchaText2);
}
function refreshCaptcha2() {
  drawCaptcha2();
  const input = document.getElementById("captchaInput2");
  if (input) input.value = "";
}
function verifyCaptcha2() {
  const input = document.getElementById("captchaInput2");
  if (!input) return false;
  const ok = input.value.trim().toUpperCase() === currentCaptchaText2.toUpperCase();
  if (!ok) refreshCaptcha2();
  return ok;
}