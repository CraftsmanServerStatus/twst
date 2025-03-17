document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("captchaCanvas");
  const ctx = canvas.getContext("2d");
  const reloadBtn = document.getElementById("reloadCaptcha");
  const verifyBtn = document.getElementById("verifyCaptcha");
  const input = document.getElementById("captchaInput");
  const message = document.getElementById("captchaMessage");
  canvas.width = 200;
  canvas.height = 70;
  let captchaLetters = [];
  let captchaCode = "";
  let noiseLines = [];
  let noiseCircles = [];
  let startTime = null;
  generateCaptcha();
  requestAnimationFrame(animate);
  function generateCaptcha() {
    captchaLetters = [];
    captchaCode = "";
    noiseLines = [];
    noiseCircles = [];
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(1, "#e6e6e6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let x = 20;
    for (let i = 0; i < 6; i++) {
      const letter = chars.charAt(Math.floor(Math.random() * chars.length));
      captchaCode += letter;
      let angle = (Math.random() * 50 - 25) * Math.PI / 180;
      let color = getRandomColor();
      captchaLetters.push({letter, x, baseY: 40, angle, color});
      x += 30;
    }
    for (let i = 0; i < 8; i++) {
      noiseLines.push({
        x1: Math.random() * canvas.width,
        y1: Math.random() * canvas.height,
        x2: Math.random() * canvas.width,
        y2: Math.random() * canvas.height,
        color: getRandomColor()
      });
    }
    for (let i = 0; i < 5; i++) {
      noiseCircles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 5,
        color: getRandomColor()
      });
    }
  }
  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    let elapsed = timestamp - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(1, "#e6e6e6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    noiseLines.forEach(function(line) {
      ctx.strokeStyle = line.color;
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
    });
    noiseCircles.forEach(function(circle) {
      ctx.fillStyle = circle.color;
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
      ctx.fill();
    });
    captchaLetters.forEach(function(item) {
      ctx.save();
      let offset = Math.sin((elapsed + item.x * 10) / 500) * 3;
      ctx.translate(item.x, item.baseY + offset);
      ctx.rotate(item.angle);
      ctx.font = "bold 30px Arial";
      ctx.fillStyle = item.color;
      ctx.fillText(item.letter, 0, 0);
      ctx.restore();
    });
    requestAnimationFrame(animate);
  }
  function getRandomColor() {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F033FF", "#33FFF0", "#FF33B5"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  reloadBtn.addEventListener("click", function() {
    generateCaptcha();
    message.innerHTML = "";
    input.value = "";
    startTime = null;
  });
  verifyBtn.addEventListener("click", function() {
    if (input.value === captchaCode) {
      message.innerHTML = '<div class="alert alert-success">¡QuantumCAPTCHA verificado!</div>';
    } else {
      message.innerHTML = '<div class="alert alert-danger">Código incorrecto. Intenta de nuevo.</div>';
      generateCaptcha();
    }
  });
});
