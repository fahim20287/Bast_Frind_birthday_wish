let current = 0;
const total = 7;

function byId(id) {
  return document.getElementById(id);
}

function go(n) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  byId("screen" + n).classList.add("active");
  current = n;
  byId("progress").style.width = ((n + 1) / total * 100) + "%";
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (n === 6) makeConfetti();
}

function openGift() {
  const gift = byId("gift");
  gift.style.animation = "pop .7s ease both";
  setTimeout(() => go(1), 500);
}

function pickHeart(el) {
  document.querySelectorAll(".hearts button").forEach(b => b.style.opacity = ".35");
  el.style.opacity = "1";
  byId("gameMsg").textContent = "তুমি ঠিক heart-টাই বেছে নিয়েছো! 💖";
  byId("gameNext").classList.remove("hidden");
}

function restart() {
  go(0);
}

function makeConfetti() {
  const box = byId("confetti");
  box.innerHTML = "";
  for (let i = 0; i < 70; i++) {
    document.querySelectorAll(".finalName").forEach(x=>x.textContent=BIRTHDAY.finalName);
    const p = document.createElement("i");
    p.className = "piece";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDelay = (Math.random() * 1.5) + "s";
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    p.style.background = ["#d77ca5", "#f0b2cb", "#b86b96", "#f4d5e3", "#9e6c86"][Math.floor(Math.random() * 5)];
    box.appendChild(p);
  }
}

function loadConfig() {
  // Screen 1 (Hero card) — Dear [name],
  document.querySelectorAll(".name").forEach(x => x.textContent = BIRTHDAY.name);

  // Screen 6 (Final) — Happy Birthday, [finalName]!
  document.querySelectorAll(".finalName").forEach(x => x.textContent = BIRTHDAY.finalName);

  byId("introTitle").textContent = BIRTHDAY.introTitle;
  byId("introText").textContent = BIRTHDAY.introText;
  byId("thoughtTitle").textContent = BIRTHDAY.thoughtTitle;
  byId("thoughtText").textContent = BIRTHDAY.thoughtText;
  byId("memoryTitle").textContent = BIRTHDAY.memoryTitle;
  byId("memoryText").textContent = BIRTHDAY.memoryText;
  byId("letterTitle").textContent = BIRTHDAY.letterTitle;
  byId("letterText").textContent = BIRTHDAY.letterText;
  byId("fromName").textContent = BIRTHDAY.from;
  byId("finalTitle").textContent = BIRTHDAY.finalTitle;
  byId("finalText").textContent = BIRTHDAY.finalText;

  const holder = byId("photos");
  const dots = byId("dots");
  holder.innerHTML = "";
  dots.innerHTML = "";
  BIRTHDAY.photos.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "photo";
    card.innerHTML = `<img src="${item.src}" alt=""><div class="caption">${item.caption}</div>`;
    holder.appendChild(card);
    const dot = document.createElement("i");
    dots.appendChild(dot);
  });

  // ===== SWIPE / SLIDE LOGIC =====
  const photoEls = Array.from(holder.children);
  const dotEls = Array.from(dots.children);
  let photoStart = 0;

  function updatePhotos() {
    photoEls.forEach((el, i) => {
      el.className = 'photo';
      const pos = (i - photoStart + photoEls.length) % photoEls.length;
      if (pos < 3) {
        el.classList.add('pos-' + pos);
        el.style.opacity = '1';
        el.style.pointerEvents = 'auto';
      } else {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
      }
    });
    const topIndex = (photoStart + 2) % photoEls.length;
    dotEls.forEach((d, i) => d.classList.toggle('on', i === topIndex));
  }

  updatePhotos();

  if (photoEls.length <= 1) return;

  let startX = 0, startY = 0;

  holder.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  holder.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = startX - endX;
    const diffY = startY - endY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        photoStart = (photoStart - 1 + photoEls.length) % photoEls.length;
      } else {
        photoStart = (photoStart + 1) % photoEls.length;
      }
      updatePhotos();
    }
  }, { passive: true });

  let mouseDown = false;
  holder.addEventListener('mousedown', e => {
    mouseDown = true;
    startX = e.clientX;
  });
  holder.addEventListener('mouseup', e => {
    if (!mouseDown) return;
    mouseDown = false;
    const diffX = startX - e.clientX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        photoStart = (photoStart - 1 + photoEls.length) % photoEls.length;
      } else {
        photoStart = (photoStart + 1) % photoEls.length;
      }
      updatePhotos();
    }
  });
}

loadConfig();
go(0);
