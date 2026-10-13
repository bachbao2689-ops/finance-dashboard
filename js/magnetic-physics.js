/**
 * Cyber-Organic Liquid Glass — Magnetic Physics & Spotlight Engine
 * Implements real-time cursor tracking, dynamic radial spotlights,
 * and spring-physics displacement for .hover-magnetic-card elements.
 */
(function() {
  const STRENGTH = 0.12;

  function initMagneticCards() {
    const cards = document.querySelectorAll('.hover-magnetic-card:not([data-magnetic-ready])');
    cards.forEach(card => {
      card.setAttribute('data-magnetic-ready', 'true');

      let isHovered = false;
      let rafId = null;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const px = Math.round((x / rect.width) * 100);
        const py = Math.round((y / rect.height) * 100);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (x - centerX) * STRENGTH;
        const deltaY = (y - centerY) * STRENGTH;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.style.setProperty('--mouse-x', `${px}%`);
          card.style.setProperty('--mouse-y', `${py}%`);
          card.style.setProperty('--mag-x', `${deltaX.toFixed(2)}px`);
          card.style.setProperty('--mag-y', `${deltaY.toFixed(2)}px`);
        });
      });

      card.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.removeProperty('--mouse-x');
        card.style.removeProperty('--mouse-y');
        card.style.removeProperty('--mag-x');
        card.style.removeProperty('--mag-y');
      });
    });
  }

  // Run on DOM loaded and expose globally for dynamic cards
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMagneticCards);
  } else {
    initMagneticCards();
  }

  window.initMagneticCards = initMagneticCards;
})();
