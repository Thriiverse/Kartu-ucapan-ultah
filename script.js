/* ===================================================================
   Happy Birthday Angel — interactions
=================================================================== */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------
     1. Starry background
  ------------------------------------------------------------*/
  const sky = document.getElementById("sky");
  const STAR_COUNT = window.innerWidth < 600 ? 45 : 80;

  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDuration = 2 + Math.random() * 3 + "s";
    star.style.animationDelay = Math.random() * 4 + "s";
    sky.appendChild(star);
  }

  /* -----------------------------------------------------------
     2. Fireworks effect
  ----------------------------------------------------------*/
  const breadContainer = document.getElementById("breadContainer");
  const FIREWORKS_COUNT = window.innerWidth < 600 ? 8 : 12;

  if (!reduceMotion) {
    for (let i = 0; i < FIREWORKS_COUNT; i++) {
      const firework = document.createElement("div");
      firework.className = "bread";
      firework.textContent = "✨";
      firework.style.left = Math.random() * 100 + "%";
      firework.style.animationDuration = 3 + Math.random() * 2 + "s";
      firework.style.animationDelay = Math.random() * 8 + "s";
      breadContainer.appendChild(firework);
    }
  }

  /* -----------------------------------------------------------
     3. Floating balloons
  ------------------------------------------------------------*/
  const balloonsWrap = document.getElementById("balloons");
  const balloonColors = ["#ff8fab", "#ffd166", "#b185db", "#7eead4", "#ffc2d1"];
  const BALLOON_COUNT = window.innerWidth < 600 ? 6 : 10;

  if (!reduceMotion) {
    for (let i = 0; i < BALLOON_COUNT; i++) {
      const b = document.createElement("div");
      b.className = "balloon";
      b.style.left = Math.random() * 100 + "%";
      b.style.background = balloonColors[i % balloonColors.length];
      b.style.animationDuration = 9 + Math.random() * 8 + "s";
      b.style.animationDelay = Math.random() * 10 + "s";
      balloonsWrap.appendChild(b);
    }
  }

  /* -----------------------------------------------------------
     4. Confetti particle system (canvas)
  ------------------------------------------------------------*/
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let rafId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const confettiColors = ["#ff8fab", "#ffd166", "#b185db", "#7eead4", "#ffffff", "#ff6f91"];

  function burstConfetti() {
    const count = reduceMotion ? 0 : window.innerWidth < 600 ? 90 : 150;
    const originX = window.innerWidth / 2;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: originX + (Math.random() - 0.5) * 160,
        y: window.innerHeight * 0.32 + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 9,
        vy: -Math.random() * 9 - 4,
        size: 5 + Math.random() * 5,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
        shape: Math.random() > 0.5 ? "rect" : "circle",
        gravity: 0.22 + Math.random() * 0.08,
        drag: 0.992,
        life: 1
      });
    }
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vr;
      if (p.y > window.innerHeight * 0.78) p.life -= 0.02;

      ctx.save();
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    particles = particles.filter(
      (p) => p.life > 0 && p.y < window.innerHeight + 60
    );

    if (particles.length > 0) {
      rafId = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rafId = null;
    }
  }

  /* -----------------------------------------------------------
     5. Message reveal — word by word
  ------------------------------------------------------------*/
  const MESSAGE =
    "Happy Birthday, Angel! Semoga setahun ke depan ini, semua harapan dan keinginan you pelan-pelan terwujud one by one. Selalu jaga kesehatan jugaa jangan suka begadang muluu, banyakin minum air putih okeee";

  const messageTextEl = document.getElementById("messageText");

  function renderMessage() {
    if (messageTextEl.dataset.rendered === "true") return;
    const words = MESSAGE.split(" ");
    messageTextEl.innerHTML = words
      .map((w, i) => {
        const delay = reduceMotion ? 0 : i * 0.045;
        return `<span class="word" style="animation-delay:${delay}s">${w}</span>`;
      })
      .join(" ");
    messageTextEl.dataset.rendered = "true";
  }

  /* -----------------------------------------------------------
     6. Blow-the-candle interaction
  ------------------------------------------------------------*/
  const blowBtn = document.getElementById("blowBtn");
  const againBtn = document.getElementById("againBtn");
  const flame = document.getElementById("flame");
  const candle = document.getElementById("candle");
  const cakeScene = document.getElementById("cakeScene");
  const hint = document.getElementById("hint");
  const messageCard = document.getElementById("messageCard");

  function blowCandle() {
    flame.classList.add("out");
    candle.classList.add("smoking");
    cakeScene.classList.add("celebrate");
    hint.classList.add("fade-out");
    blowBtn.classList.add("hidden");

    burstConfetti();

    setTimeout(() => {
      renderMessage();
      messageCard.hidden = false;
      messageCard.classList.add("show");
    }, 350);

    setTimeout(() => {
      cakeScene.classList.remove("celebrate");
      candle.classList.remove("smoking");
    }, 1200);
  }

  function relightCandle() {
    flame.classList.remove("out");
    blowBtn.classList.remove("hidden");
    hint.classList.remove("fade-out");
    messageCard.classList.remove("show");
    messageCard.hidden = true;
    messageTextEl.dataset.rendered = "false";
    messageTextEl.innerHTML = "";
  }

  blowBtn.addEventListener("click", blowCandle);
  againBtn.addEventListener("click", relightCandle);

  // Allow keyboard "blow" via Enter/Space already handled natively by <button>.
})();
