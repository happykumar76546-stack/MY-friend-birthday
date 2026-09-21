(function () {
  const config = window.BIRTHDAY_SITE || {};
  const body = document.body;
  const reveal = document.getElementById("reveal-screen");
  const openButton = document.getElementById("open-surprise");
  const replayButton = document.getElementById("replay-button");
  const copyWishButton = document.getElementById("copy-wish");
  const reasonButton = document.getElementById("reason-button");
  const giftButton = document.getElementById("open-gift");
  const giftSection = document.getElementById("gift");
  const giftSurprise = document.getElementById("gift-surprise");
  const reasonText = document.getElementById("reason-text");
  const memoryGrid = document.getElementById("memory-grid");
  const photoGrid = document.getElementById("photo-grid");
  const countdown = document.getElementById("countdown");
  const canvas = document.getElementById("confetti-canvas");
  const context = canvas.getContext("2d");

  const colors = ["#f65f8d", "#f6c84e", "#009688", "#4657bd", "#ef5350", "#43a047"];
  let confettiPieces = [];
  let confettiUntil = 0;
  let animationFrame = 0;
  let reasonIndex = 0;

  body.classList.add("reveal-open");

  function setFields() {
    document.querySelectorAll("[data-field]").forEach((node) => {
      const key = node.dataset.field;
      if (config[key]) {
        node.textContent = config[key];
      }
    });

    document.title = `${config.friendName || "Birthday"} Surprise`;
  }

  function buildMemories() {
    const memories = Array.isArray(config.memories) ? config.memories : [];
    memoryGrid.innerHTML = "";

    memories.forEach((memory) => {
      const article = document.createElement("article");
      article.className = "memory-card";

      const title = document.createElement("h3");
      title.textContent = memory.title || "A favorite moment";

      const bodyText = document.createElement("p");
      bodyText.textContent = memory.body || "Replace this with a memory you both love.";

      article.append(title, bodyText);
      memoryGrid.appendChild(article);
    });
  }

  function buildPhotos() {
    const photos = Array.isArray(config.photos) ? config.photos : [];
    photoGrid.innerHTML = "";

    photos.forEach((photo, index) => {
      const figure = document.createElement("figure");
      figure.className = "photo-card";

      if (photo.src) {
        const image = document.createElement("img");
        image.src = photo.src;
        image.alt = photo.caption || `Birthday photo ${index + 1}`;
        image.onerror = () => {
          image.replaceWith(createPhotoSlot(index));
        };
        figure.appendChild(image);
      } else {
        figure.appendChild(createPhotoSlot(index));
      }

      const caption = document.createElement("figcaption");
      caption.textContent = photo.caption || "Add a caption";
      figure.appendChild(caption);
      photoGrid.appendChild(figure);
    });
  }

  function buildGift() {
    const gifts = Array.isArray(config.giftItems) ? config.giftItems : [];
    giftSurprise.innerHTML = "";

    gifts.forEach((gift) => {
      const item = document.createElement("span");
      item.textContent = gift;
      giftSurprise.appendChild(item);
    });
  }

  function createPhotoSlot(index) {
    const slot = document.createElement("div");
    slot.className = "photo-slot";
    slot.textContent = `Photo ${index + 1}`;
    return slot;
  }

  function updateReason() {
    const reasons = Array.isArray(config.reasons) ? config.reasons : [];
    if (!reasons.length) {
      return;
    }

    reasonIndex = (reasonIndex + 1) % reasons.length;
    reasonText.textContent = reasons[reasonIndex];
    burstConfetti(80);
  }

  function openGift() {
    giftSection.classList.add("is-open");
    giftButton.textContent = "Gift opened";
    giftButton.disabled = true;
    burstConfetti(260);
  }

  function updateCountdown() {
    if (!countdown || !config.birthdayDate) {
      return;
    }

    const target = new Date(config.birthdayDate).getTime();
    const now = Date.now();
    let diff = target - now;

    if (Number.isNaN(target)) {
      return;
    }

    if (diff < 0) {
      diff = 0;
      countdown.previousElementSibling.textContent = "Birthday mode";
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    countdown.querySelector('[data-unit="days"]').textContent = String(days);
    countdown.querySelector('[data-unit="hours"]').textContent = String(hours).padStart(2, "0");
    countdown.querySelector('[data-unit="minutes"]').textContent = String(minutes).padStart(2, "0");
    countdown.querySelector('[data-unit="seconds"]').textContent = String(seconds).padStart(2, "0");
  }

  function openSurprise() {
    reveal.classList.add("is-hidden");
    body.classList.remove("reveal-open");
    burstConfetti(220);

    window.setTimeout(() => {
      reveal.style.display = "none";
    }, 460);
  }

  function replaySurprise() {
    reveal.style.display = "grid";
    body.classList.add("reveal-open");
    requestAnimationFrame(() => {
      reveal.classList.remove("is-hidden");
    });
  }

  async function copyWish() {
    const wish = `${config.finalWish || ""}\n\n- ${config.fromName || ""}`.trim();
    try {
      await navigator.clipboard.writeText(wish);
      copyWishButton.textContent = "Copied";
      window.setTimeout(() => {
        copyWishButton.textContent = "Copy wish";
      }, 1300);
    } catch (error) {
      copyWishButton.textContent = "Select the wish above";
    }
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function burstConfetti(amount) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      return;
    }

    for (let index = 0; index < amount; index += 1) {
      confettiPieces.push({
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 120,
        width: 7 + Math.random() * 10,
        height: 4 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 2 + Math.random() * 5,
        spin: Math.random() * 0.25,
        angle: Math.random() * Math.PI
      });
    }

    confettiUntil = Date.now() + 2600;

    if (!animationFrame) {
      animationFrame = requestAnimationFrame(renderConfetti);
    }
  }

  function renderConfetti() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    confettiPieces = confettiPieces.filter((piece) => piece.y < window.innerHeight + 40);

    confettiPieces.forEach((piece) => {
      piece.y += piece.speed;
      piece.x += Math.sin(piece.angle) * 1.4;
      piece.angle += piece.spin;

      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.angle);
      context.fillStyle = piece.color;
      context.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
      context.restore();
    });

    if (Date.now() < confettiUntil || confettiPieces.length) {
      animationFrame = requestAnimationFrame(renderConfetti);
    } else {
      animationFrame = 0;
    }
  }

  setFields();
  buildMemories();
  buildPhotos();
  buildGift();
  updateCountdown();
  resizeCanvas();

  if (Array.isArray(config.reasons) && config.reasons.length) {
    reasonText.textContent = config.reasons[0];
  }

  openButton.addEventListener("click", openSurprise);
  replayButton.addEventListener("click", replaySurprise);
  copyWishButton.addEventListener("click", copyWish);
  reasonButton.addEventListener("click", updateReason);
  giftButton.addEventListener("click", openGift);
  window.addEventListener("resize", resizeCanvas);
  window.setInterval(updateCountdown, 1000);
})();
