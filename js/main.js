/* Battle House Hops — nav + scroll reveal */
document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Curated photos: swipe, keyboard scrolling, and optional arrow controls.
  var photoTrack = document.getElementById('farm-photos');
  if (photoTrack) {
    var photoControls = document.querySelector('.farm-social__controls');
    photoControls.hidden = false;
    var photoButtons = photoControls.querySelectorAll('button');
    function updatePhotoControls() {
      photoButtons[0].disabled = photoTrack.scrollLeft <= 2;
      photoButtons[1].disabled = photoTrack.scrollLeft + photoTrack.clientWidth >= photoTrack.scrollWidth - 2;
    }
    photoButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var card = photoTrack.querySelector('figure');
        var step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(photoTrack).gap);
        photoTrack.scrollBy({left: step * Number(button.dataset.photoDirection), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
      });
    });
    photoTrack.addEventListener('scroll', updatePhotoControls, {passive: true});
    window.addEventListener('resize', updatePhotoControls);
    updatePhotoControls();
  }

  // Scroll reveal
  var revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealables.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }
});
