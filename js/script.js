/* ReWear Lab - impact counter animation and demo contact form */
var $ = function(i) {
  return document.getElementById(i)
};

var io = new IntersectionObserver(function(es) {
  es.forEach(function(e) {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    var el = e.target,
      t = +el.dataset.n,
      s = el.dataset.s || '+',
      c = 0,
      st = t / 40,
      id = setInterval(function() {
        c = Math.min(t, c + st);
        el.textContent = (t % 1 ? c.toFixed(1) : Math.round(c).toLocaleString('en-IN')) + s;
        if (c >= t) clearInterval(id)
      }, 30)
  })
});
document.querySelectorAll('[data-n]').forEach(function(e) {
  io.observe(e)
});
$('f').onsubmit = function(e) {
  e.preventDefault();
  $('ok').style.display = 'block';
  e.target.reset()
};
