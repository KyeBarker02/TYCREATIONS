// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
});

// ── ENQUIRY FORM — Formspree AJAX submission ──
// ── DELIVERY POSTCODE CHECKER ──
// These processes were shelved pending ICO regestration on the clients end, meaning no personal data is collected.
// To restore functionality, check V1 branch for Enquiry Form and Delivery Postcode Checker in js, and the form HTML in default_page.html, re-add the Formspree
// submission handler, the postcode checkDelivery() function, and the hCaptcha script

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});
