function switchBrand(toggle) {
    const isCatering = toggle.checked;
    document.body.classList.toggle('catering', isCatering);
    document.getElementById('lbl-baking').classList.toggle('active', !isCatering);
    document.getElementById('lbl-catering').classList.toggle('active', isCatering);
    document.getElementById('navLogoText').textContent = isCatering ? 'TY Catering' : 'TY Creations';
    document.getElementById('footerLogo').textContent = isCatering ? 'TY Catering' : 'TY Creations';
    document.getElementById('footerTagline').textContent = isCatering
   ? 'Exceptional food for life\'s most memorable events.'
   : 'Handcrafted cakes for life\'s most beautiful moments.';
    document.getElementById('aboutImg').textContent = isCatering ? '🍽️' : '🎂';
  }

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
});
