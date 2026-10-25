/* =========================================================
   PORTFOLYO KART GEZGİNİ
   - Kartı çevirme, oklarla/noktalarla/klavyeyle/kaydırarak geçiş
   - Menüden gelen bağlantılar (portfolyo.html#yenidogan) ilgili kartı açar
   ========================================================= */
(function () {
  "use strict";

  /* DOLDUR: Her kart için başlık, açıklama, fotoğraf ve maddeleri değiştir.
     id değeri menü bağlantılarıyla aynı olmalı (portfolyo.html#dogum-ani gibi).
     Fotoğrafları images/portfolyo/ klasörüne koy. */
  var cards = [
    {
      id: "dogum-ani",
      title: ["Doğum", "Anı"],
      plainTitle: "Doğum Anı",
      subtitle: "Dünyaya merhaba dediği ilk anlar.",
      image: "images/portfolyo/foto-1.jpg",
      description: "Bebeğinizin dünyaya geldiği ilk anların hatırasını, yalın ve duygusal karelerle saklıyoruz. (Örnek metin: kendi cümlelerinle değiştir.)",
      features: ["Doğal ve duygusal anlatım", "Aileye özel, özenli kareler", "Hızlı ve düzenli teslim"]
    },
    {
      id: "taburcu",
      title: ["Taburcu"],
      plainTitle: "Taburcu",
      subtitle: "Eve dönüşün ilk fotoğrafı.",
      image: "images/portfolyo/foto-2.jpg",
      description: "Hastaneden eve geçişin heyecanını ve ilk günlerin sıcaklığını anlatan kareler. (Örnek metin: kendi cümlelerinle değiştir.)",
      features: ["Aileyi bir araya getiren kareler", "Sakin ve rahat çekim akışı", "Anıya dönüşen detaylar"]
    },
    {
      id: "hamilelik",
      title: ["Hamilelik"],
      plainTitle: "Hamilelik",
      subtitle: "Beklentinin en zarif hâli.",
      image: "images/portfolyo/foto-3.jpg",
      description: "Anne olma yolculuğunun en özel dönemini, şık ve zarif karelerle ölümsüzleştiriyoruz. (Örnek metin: kendi cümlelerinle değiştir.)",
      features: ["Konforlu ve rahat çekim", "Kıyafet ve konsept seçenekleri", "Zarif ışık ve kompozisyon"]
    },
    {
      id: "yenidogan",
      title: ["Yeni", "Doğan"],
      plainTitle: "Yenidoğan",
      subtitle: "İlk günlerin minik detayları.",
      image: "images/portfolyo/foto-4.jpg",
      description: "Bebeğinizin ilk günlerindeki minik ellerini, ayaklarını ve masum ifadesini sabırla ve özenle kaydediyoruz. (Örnek metin: kendi cümlelerinle değiştir.)",
      features: ["Bebeğe uygun, sıcak stüdyo ortamı", "Sabırlı ve özenli çekim", "Hijyenik konsept ve aksesuarlar"]
    },
    {
      id: "yas-cekimi",
      title: ["Yaş", "Çekimi"],
      plainTitle: "Yaş Çekimi",
      subtitle: "Büyüdükçe değişen güzellikler.",
      image: "images/portfolyo/foto-5.jpg",
      description: "Bebeğinizin büyüme sürecinin her aşamasını, konseptli ve eğlenceli çekimlerle saklıyoruz. (Örnek metin: kendi cümlelerinle değiştir.)",
      features: ["Yaşa uygun konseptler", "Eğlenceli ve rahat çekim", "Özenle hazırlanan albüm seçenekleri"]
    },
    {
      id: "aile",
      title: ["Aile"],
      plainTitle: "Aile",
      subtitle: "Birlikte olmanın en güzel hâli.",
      image: "images/portfolyo/foto-6.jpg",
      description: "Anne, baba, kardeşler ve bebek; ailenizin birlikteliğini samimi ve doğal karelerle anlatıyoruz. (Örnek metin: kendi cümlelerinle değiştir.)",
      features: ["Tüm aileye uygun, rahat ortam", "Doğal ve samimi pozlar", "Kişiye özel konsept"]
    }
  ];

  /* ---------- Elemanlar ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var card = $("pf-card"), front = $("pf-front"), back = $("pf-back");
  var image = $("pf-image"), title = $("pf-title"), subtitle = $("pf-subtitle");
  var number = $("pf-number"), backNumber = $("pf-back-number"), backTitle = $("pf-back-title");
  var description = $("pf-description"), features = $("pf-features");
  var dots = $("pf-dots"), current = $("pf-current"), total = $("pf-total"), faceStatus = $("pf-face-status");
  var stage = card.parentNode;

  var activeIndex = 0;
  var changeToken = 0;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FLIP_MS = 380; /* kart ters dönerken içerik, arka yüz gizlenince değişir */

  function pad(n) { return String(n).padStart(2, "0"); }

  /* ---------- Yüz durumu (ön / arka) ---------- */
  function setFlipped(flipped, moveFocus) {
    var hadFocus = card.contains(document.activeElement);
    card.classList.toggle("flipped", flipped);
    front.inert = flipped;
    back.inert = !flipped;
    front.setAttribute("aria-hidden", flipped ? "true" : "false");
    back.setAttribute("aria-hidden", flipped ? "false" : "true");
    faceStatus.textContent = flipped ? "Arka yüz" : "Ön yüz";
    if (moveFocus && hadFocus) {
      (flipped ? $("pf-return") : front).focus({ preventScroll: true });
    }
  }

  function toggleFlip() { setFlipped(!card.classList.contains("flipped"), true); }

  /* ---------- Kart içeriğini yaz ---------- */
  function renderCard() {
    var item = cards[activeIndex];
    image.src = item.image;
    image.alt = item.plainTitle;

    title.textContent = "";
    item.title.forEach(function (line, i) {
      if (i > 0) title.appendChild(document.createElement("br"));
      title.appendChild(document.createTextNode(line));
    });

    subtitle.textContent = item.subtitle;
    number.textContent = pad(activeIndex + 1) + " / " + pad(cards.length);
    backNumber.textContent = "DETAYLAR / " + pad(activeIndex + 1);
    backTitle.textContent = item.plainTitle;
    description.textContent = item.description;

    features.textContent = "";
    item.features.forEach(function (text) {
      var li = document.createElement("li");
      li.textContent = text;
      features.appendChild(li);
    });

    preload((activeIndex + 1) % cards.length);
    preload((activeIndex - 1 + cards.length) % cards.length);
  }

  /* Sayaç ve noktalar anında güncellenir */
  function updateMeta() {
    current.textContent = activeIndex + 1;
    Array.prototype.forEach.call(dots.children, function (dot, i) {
      dot.classList.toggle("active", i === activeIndex);
      dot.setAttribute("aria-current", i === activeIndex ? "true" : "false");
    });
  }

  function preload(index) { var img = new Image(); img.src = cards[index].image; }

  /* ---------- Kart değiştir ---------- */
  function goTo(index, silent) {
    activeIndex = (index + cards.length) % cards.length;
    var token = ++changeToken;
    var wasFlipped = card.classList.contains("flipped");
    updateMeta();
    setFlipped(false, false);

    /* Arka yüz açıksa, kart dönüp gizlenene kadar bekle: yeni metin bir an bile görünmesin */
    if (wasFlipped && !reduceMotion) {
      setTimeout(function () { if (token === changeToken) renderCard(); }, FLIP_MS);
    } else {
      renderCard();
    }
    if (!silent) updateHash();
  }

  function changeCard(direction) { goTo(activeIndex + direction); }

  /* ---------- Adres çubuğu (#yenidogan gibi) ---------- */
  function indexFromHash() {
    var id = decodeURIComponent(location.hash.replace("#", ""));
    for (var i = 0; i < cards.length; i++) if (cards[i].id === id) return i;
    return -1;
  }

  function updateHash() {
    if (history.replaceState) history.replaceState(null, "", "#" + cards[activeIndex].id);
  }

  window.addEventListener("hashchange", function () {
    var i = indexFromHash();
    if (i !== -1 && i !== activeIndex) goTo(i, true);
  });

  /* ---------- Noktalar ---------- */
  cards.forEach(function (item, index) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.className = "pf-dot";
    dot.setAttribute("aria-label", item.plainTitle + " kartına git");
    dot.addEventListener("click", function () { goTo(index); });
    dots.appendChild(dot);
  });
  total.textContent = cards.length;

  /* ---------- Olaylar ---------- */
  card.addEventListener("click", function (e) {
    if (e.target.closest("a, button")) return; /* bağlantı ve düğmeler kartı çevirmesin */
    toggleFlip();
  });

  front.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleFlip(); }
  });

  $("pf-return").addEventListener("click", function () { setFlipped(false, true); });
  $("pf-prev").addEventListener("click", function () { changeCard(-1); });
  $("pf-next").addEventListener("click", function () { changeCard(1); });

  /* Klavye okları: yazı alanlarında çalışmasın */
  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === "ArrowLeft") changeCard(-1);
    if (e.key === "ArrowRight") changeCard(1);
  });

  /* Telefonda sağa/sola kaydırma */
  var startX = 0, startY = 0, tracking = false;
  stage.addEventListener("touchstart", function (e) {
    if (e.touches.length !== 1) { tracking = false; return; }
    startX = e.touches[0].clientX; startY = e.touches[0].clientY; tracking = true;
  }, { passive: true });

  stage.addEventListener("touchend", function (e) {
    if (!tracking) return;
    tracking = false;
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) changeCard(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* ---------- Başlangıç ---------- */
  var start = indexFromHash();
  activeIndex = start === -1 ? 0 : start;
  setFlipped(false, false);
  updateMeta();
  renderCard();
})();
