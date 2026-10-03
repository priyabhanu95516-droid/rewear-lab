/* ReWear Lab - interactions: mobile menu, search, idea guides, AI Style Lab demo,
   community challenges, impact counters and contact form. */

/* Optional: to really receive contact messages, create a free form at formspree.io
   and paste its ID here (the part after /f/). Leave empty for the concept demo. */
var FORMSPREE_ID = '';

var $ = function (i) { return document.getElementById(i); };

/* ---------- Ideas data ---------- */
var IDEAS = {
  crop: {
    t: 'Denim Jacket \u2192 Crop Top', cat: 'Outfit Idea', img: 'images/idea-denim-crop-top.jpg',
    time: '1\u20132 hours', lvl: 'Easy', kw: 'denim jacket crop top outfit jeans',
    d: 'Turn an old denim jacket into a trendy cropped jacket.',
    mat: ['Old denim jacket', 'Fabric chalk or a pencil', 'Sharp scissors', 'Needle and thread (or a sewing machine)'],
    steps: ['Wear the jacket and mark with chalk where you want the new hem (around the waist is classic).',
      'Lay the jacket flat and draw a straight line across, leaving 2 cm extra for the hem.',
      'Cut carefully along the line through both layers.',
      'Fold the raw edge in twice (about 1 cm) and stitch it, or leave it frayed for a raw look.',
      'Add patches, embroidery or pins to make it yours.']
  },
  tote: {
    t: 'Jeans \u2192 Tote Bag', cat: 'Accessory', img: 'images/idea-jeans-tote-bag.jpg',
    time: '1 hour', lvl: 'Easy', kw: 'jeans denim tote bag accessory',
    d: 'Give old jeans a new purpose as a strong, stylish tote.',
    mat: ['Old jeans', 'Scissors', 'Strong thread and needle (or a sewing machine)', 'Optional: patches or embroidery thread'],
    steps: ['Cut one leg off the jeans, just below the crotch seam.',
      'Turn the leg inside out and sew the cut end shut with strong stitches. This becomes the bottom of the bag.',
      'Cut two strips from the other leg for the handles and fold each strip into thirds.',
      'Stitch along the strips, then sew them to the inside of the bag opening.',
      'Turn the bag right side out and decorate it with patches or embroidery.']
  },
  cushion: {
    t: 'Shirt \u2192 Cushion Cover', cat: 'Home D\u00e9cor', img: 'images/idea-shirt-cushion.jpg',
    time: '45 minutes', lvl: 'Easy', kw: 'shirt cushion cover pillow home decor fabric',
    d: 'Add a cosy touch to your space with upcycled fabric.',
    mat: ['Old shirt or fabric', 'Cushion insert (for example 40 \u00d7 40 cm)', 'Scissors and pins', 'Thread and needle (or a sewing machine)'],
    steps: ['Cut two squares of fabric, each 2 cm larger than the cushion on every side.',
      'Place them with the good sides facing each other and pin the edges.',
      'Sew along three sides with a 1 cm seam.',
      'Turn the cover right side out and push the cushion inside.',
      'Close the last side with neat hand stitches, or sew on buttons from the shirt.']
  },
  dress: {
    t: 'Kurta \u2192 Dress', cat: 'Outfit Idea', img: 'images/idea-kurta-dress.jpg',
    time: '2\u20133 hours', lvl: 'Medium', kw: 'kurta dress outfit traditional wear',
    d: 'Reimagine traditional wear as a modern dress.',
    mat: ['Old kurta', 'Measuring tape, pins and chalk', 'Scissors', 'Needle and thread (or a sewing machine)', 'Optional: belt or elastic'],
    steps: ['Try the kurta on and pin the sides in to get the shape you like.',
      'Mark the new length with chalk and trim the extra fabric, leaving 2 cm for the hem.',
      'Sew the new side seams and hem the bottom edge.',
      'Define the waist with a belt, or sew in a thin elastic casing.',
      'Adjust the neckline or sleeves if you want a different look.']
  },
  scrunchie: {
    t: 'Scrunchies & Hair Bands', cat: 'Accessory', img: 'images/idea-scrunchies.jpg',
    time: '20 minutes', lvl: 'Easy', kw: 'scrunchies hair bands accessory leftover fabric scraps',
    d: 'Use leftover fabric to make cute, useful accessories.',
    mat: ['A fabric strip (about 10 \u00d7 45 cm)', 'Elastic (about 20 cm)', 'Safety pin', 'Needle and thread'],
    steps: ['Fold the strip in half lengthwise with the good side inside and sew the long edge.',
      'Turn the tube right side out.',
      'Attach a safety pin to the elastic and thread it through the tube.',
      'Tie the elastic ends in a firm knot.',
      'Tuck in the fabric ends and stitch them together neatly.']
  }
};
var ORDER = ['crop', 'tote', 'cushion', 'dress', 'scrunchie'];

var GARMENTS = {
  jacket: { label: 'Denim jacket', ids: ['crop', 'tote', 'scrunchie'] },
  jeans: { label: 'Jeans', ids: ['tote', 'cushion', 'scrunchie'] },
  shirt: { label: 'Shirt', ids: ['cushion', 'scrunchie', 'tote'] },
  kurta: { label: 'Kurta', ids: ['dress', 'cushion', 'scrunchie'] },
  scraps: { label: 'Fabric scraps', ids: ['scrunchie', 'cushion', 'tote'] }
};

var CHALLENGES = [
  { t: 'Denim Revival', s: 'This month: turn an old pair of jeans or a jacket into something new.' },
  { t: 'Zero-Waste Accessories', s: 'Next: make scrunchies, bags or bands from leftover fabric.' },
  { t: 'Cosy Home Edit', s: 'Coming soon: upcycle fabric into cushions and d\u00e9cor.' }
];

/* ---------- Dialog helpers ---------- */
var dlg = $('dlg'), dbody = $('dbody'), lastFocus = null;

function openDlg(html) {
  dbody.innerHTML = html;
  if (!dlg.open) {
    lastFocus = document.activeElement;
    dlg.showModal();
  }
  dlg.scrollTop = 0;
}
$('dclose').onclick = function () { dlg.close(); };
dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
dlg.addEventListener('close', function () {
  if (lastFocus && lastFocus.focus) lastFocus.focus();
});

function listHtml(ids) {
  return '<div class="res">' + ids.map(function (id) {
    var i = IDEAS[id];
    return '<button class="rc" type="button" data-open="' + id + '"><img alt="" src="' + i.img + '">' +
      '<div><b>' + i.t + '</b><span>' + i.time + ' \u00b7 ' + i.lvl + '</span></div></button>';
  }).join('') + '</div>';
}

/* ---------- Idea guide ---------- */
function showIdea(id, back) {
  var i = IDEAS[id];
  openDlg(
    (back ? '<button class="back" type="button" id="bk">\u2190 Back</button>' : '') +
    '<h2 id="dtitle">' + i.t + '</h2>' +
    '<div class="meta"><span>' + i.cat + '</span><span>\u23f1 ' + i.time + '</span><span>' + i.lvl + '</span></div>' +
    '<img class="dimg" alt="' + i.t + '" src="' + i.img + '">' +
    '<p>' + i.d + '</p>' +
    '<h3>What you need</h3><ul>' + i.mat.map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ul>' +
    '<h3>Steps</h3><ol>' + i.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>' +
    '<p class="note">Tip: practise on a small scrap first, and always cut a little longer than you need.</p>'
  );
  if (back) $('bk').onclick = back;
}

document.querySelectorAll('.c[data-idea]').forEach(function (c) {
  var open = function () { showIdea(c.dataset.idea, null); };
  c.addEventListener('click', open);
  c.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
});

/* open idea from any result button inside the dialog */
dbody.addEventListener('click', function (e) {
  var b = e.target.closest('[data-open]');
  if (!b) return;
  var back = dbody.__back || null;
  showIdea(b.dataset.open, back);
});

/* ---------- Search ---------- */
function showSearch(q) {
  q = q || '';
  openDlg('<h2 id="dtitle">Search ideas</h2>' +
    '<input class="sq" id="sq" type="search" placeholder="Try: jeans, bag, cushion, kurta\u2026" aria-label="Search ideas">' +
    '<ul class="sres" id="sres"></ul>');
  var input = $('sq'), out = $('sres');
  var back = function () { showSearch(input.value); };
  dbody.__back = back;
  function render() {
    var v = input.value.trim().toLowerCase();
    var ids = ORDER.filter(function (id) {
      var i = IDEAS[id];
      return !v || (i.t + ' ' + i.cat + ' ' + i.kw).toLowerCase().indexOf(v) !== -1;
    });
    out.innerHTML = '';
    if (!ids.length) {
      var li = document.createElement('li');
      li.className = 'note';
      li.textContent = 'No ideas found for "' + input.value + '". Try a word like jeans, shirt or fabric.';
      out.appendChild(li);
      return;
    }
    ids.forEach(function (id) {
      var i = IDEAS[id], li = document.createElement('li');
      li.innerHTML = '<button type="button" data-open="' + id + '"><img alt="" src="' + i.img + '"><span><b>' + i.t + '</b><br><span class="note">' + i.time + ' \u00b7 ' + i.lvl + '</span></span></button>';
      out.appendChild(li);
    });
  }
  input.value = q;
  input.addEventListener('input', render);
  render();
  input.focus();
}
$('searchBtn').onclick = function () { showSearch(''); };
$('viewAll').onclick = function (e) { e.preventDefault(); showSearch(''); };

/* ---------- AI Style Lab demo ---------- */
var demo = { url: null, g: null };

function guessGarment(name) {
  name = (name || '').toLowerCase();
  if (/jacket/.test(name)) return 'jacket';
  if (/jean|denim|pant/.test(name)) return 'jeans';
  if (/kurta|kurti/.test(name)) return 'kurta';
  if (/shirt|tee|top/.test(name)) return 'shirt';
  return null;
}

function showDemo() {
  var chips = Object.keys(GARMENTS).map(function (k) {
    return '<button type="button" data-g="' + k + '" aria-pressed="' + (demo.g === k) + '">' + GARMENTS[k].label + '</button>';
  }).join('');
  openDlg('<h2 id="dtitle">AI Style Lab</h2>' +
    '<p>Upload a photo of your old clothes, choose what it is, and get upcycling ideas.</p>' +
    '<div class="up"><label class="btn s" for="photo">\ud83d\udcf7 Upload photo</label>' +
    '<input id="photo" type="file" accept="image/*">' +
    '<div class="prev" id="prev">' + (demo.url ? '<img alt="Your uploaded photo" src="' + demo.url + '">' : '\ud83d\udc55') + '</div></div>' +
    '<h3>What is it?</h3><div class="pick" id="pick">' + chips + '</div>' +
    '<button class="btn s" type="button" id="go">Get ideas \u2192</button>' +
    '<p class="note">Demo: ideas are matched to the garment type you choose. Your photo stays on your device and is never uploaded.</p>' +
    '<div id="out" aria-live="polite"></div>');
  dbody.__back = showDemo;

  var photo = $('photo');
  photo.addEventListener('change', function () {
    var f = photo.files && photo.files[0];
    if (!f) return;
    if (demo.url) URL.revokeObjectURL(demo.url);
    demo.url = URL.createObjectURL(f);
    var g = guessGarment(f.name);
    if (g) demo.g = g;
    showDemo();
  });
  $('pick').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-g]');
    if (!b) return;
    demo.g = b.dataset.g;
    Array.prototype.forEach.call($('pick').children, function (c) {
      c.setAttribute('aria-pressed', c === b ? 'true' : 'false');
    });
  });
  $('go').onclick = function () {
    var out = $('out');
    if (!demo.g) {
      out.innerHTML = '<p class="err" style="display:block">Please choose what kind of clothing it is.</p>';
      return;
    }
    out.innerHTML = '<h3>Ideas for your ' + GARMENTS[demo.g].label.toLowerCase() + '</h3>' + listHtml(GARMENTS[demo.g].ids);
    out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
}
$('tryBtn').onclick = showDemo;

/* ---------- Community challenges ---------- */
var joined = {};
function showChallenges() {
  openDlg('<h2 id="dtitle">Community Challenges</h2>' +
    '<p>Monthly upcycling challenges. Join in, share your creation and get inspired.</p>' +
    CHALLENGES.map(function (c, n) {
      return '<div class="chal"><div><b>' + c.t + '</b><span>' + c.s + '</span></div>' +
        '<button class="btn s" type="button" data-join="' + n + '">' + (joined[n] ? 'Joined \u2713' : 'Join') + '</button></div>';
    }).join('') +
    '<p class="note">Concept project: joining is for demonstration only.</p>');
}
$('chBtn').onclick = showChallenges;
dbody.addEventListener('click', function (e) {
  var b = e.target.closest('[data-join]');
  if (!b) return;
  var n = b.dataset.join;
  joined[n] = !joined[n];
  b.textContent = joined[n] ? 'Joined \u2713' : 'Join';
});

/* ---------- Our story ---------- */
$('storyBtn').onclick = function () {
  openDlg('<h2 id="dtitle">Our Story</h2>' +
    '<p>ReWear Lab began with a simple thought: every piece of clothing has a story, and it does not have to end in a landfill.</p>' +
    '<p>This concept project imagines a place where anyone can upload a photo of an old outfit, get creative upcycling ideas, follow easy guides and share what they make with a caring community.</p>' +
    '<p>Small changes, repeated by many people, can make fashion more circular, creative and kind to the planet.</p>' +
    '<p class="note">ReWear Lab is a concept website created with AI for the InAmigos Foundation task.</p>');
};

/* ---------- Mobile menu ---------- */
var burger = $('burger'), menu = $('menu');
function setMenu(open) {
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  burger.textContent = open ? '\u2715' : '\u2630';
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
burger.onclick = function () { setMenu(!menu.classList.contains('open')); };
menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
window.addEventListener('resize', function () { if (window.innerWidth > 860) setMenu(false); });

/* ---------- Highlight current section in the menu ---------- */
var links = Array.prototype.slice.call(menu.querySelectorAll('a'));
function onScroll() {
  var best = links[0], bestTop = -Infinity;
  links.forEach(function (a) {
    var t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    var top = t.getBoundingClientRect().top;
    if (top <= 120 && top > bestTop) { bestTop = top; best = a; }
  });
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) best = links[links.length - 1];
  links.forEach(function (a) { a.classList.toggle('act', a === best); });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Impact counters ---------- */
var io = new IntersectionObserver(function (es) {
  es.forEach(function (e) {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    var el = e.target,
      t = +el.dataset.n,
      s = el.dataset.s || '+',
      c = 0,
      st = t / 40,
      id = setInterval(function () {
        c = Math.min(t, c + st);
        el.textContent = (t % 1 ? c.toFixed(1) : Math.round(c).toLocaleString('en-IN')) + s;
        if (c >= t) clearInterval(id);
      }, 30);
  });
});
document.querySelectorAll('[data-n]').forEach(function (e) { io.observe(e); });

/* ---------- Contact form ---------- */
$('f').addEventListener('submit', function (e) {
  e.preventDefault();
  var form = e.target, err = $('err'), ok = $('ok');
  var name = form.elements.name.value.trim(), msg = form.elements.message.value.trim();
  ok.style.display = 'none';
  err.style.display = 'none';
  if (name.length < 2) { err.textContent = 'Please enter your name.'; err.style.display = 'block'; form.elements.name.focus(); return; }
  if (msg.length < 10) { err.textContent = 'Please write a message of at least 10 characters.'; err.style.display = 'block'; form.elements.message.focus(); return; }

  if (!FORMSPREE_ID) {
    ok.textContent = 'Thanks! This is a concept form, so nothing was sent.';
    ok.style.display = 'block';
    form.reset();
    return;
  }
  fetch('https://formspree.io/f/' + FORMSPREE_ID, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, message: msg })
  }).then(function (r) {
    if (!r.ok) throw new Error('failed');
    ok.textContent = 'Thanks! Your message has been sent.';
    ok.style.display = 'block';
    form.reset();
  }).catch(function () {
    err.textContent = 'Sorry, something went wrong. Please try again.';
    err.style.display = 'block';
  });
});
