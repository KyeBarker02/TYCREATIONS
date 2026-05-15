// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
});

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

// ── NAV DROPDOWN — toggle on click/tap for touch devices ──
document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', e => {
        const dropdown = toggle.closest('.nav-dropdown');
        const isOpen = dropdown.classList.contains('open');
        document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
        if (!isOpen) {
            e.preventDefault();
            dropdown.classList.add('open');
        }
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', e => {
    if (!e.target.closest('.nav-dropdown')) {
        document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
    }
});

document.fonts.ready.then(() => {
    document.documentElement.classList.add('fonts-loaded');
});


// ══════════════════════════════════════════════════════
// ENQUIRY MODAL
// ══════════════════════════════════════════════════════

const enquiryModal = document.getElementById('enquiryModal');

function openEnquiryModal() {
    if (!enquiryModal) return;
    enquiryModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Scroll modal inner to top on re-open
    const inner = enquiryModal.querySelector('.enquiry-modal-inner');
    if (inner) inner.scrollTop = 0;
    // Lazy-load hCaptcha the first time the modal opens so it never
    // injects DOM elements (or stray links) before the form is visible.
    if (!window._hcaptchaLoaded) {
        window._hcaptchaLoaded = true;
        const s = document.createElement('script');
        s.src = 'https://js.hcaptcha.com/1/api.js';
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);
    }
}

function closeEnquiryModal() {
    if (!enquiryModal) return;
    enquiryModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close on backdrop click
if (enquiryModal) {
    enquiryModal.addEventListener('click', e => {
        if (e.target === enquiryModal) closeEnquiryModal();
    });
}

// Close on Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && enquiryModal && enquiryModal.classList.contains('active')) {
        closeEnquiryModal();
    }
});


// ══════════════════════════════════════════════════════
// ENQUIRY FORM — Formspree AJAX submission
// ══════════════════════════════════════════════════════

const form = document.getElementById('enquiryForm');
const successMsg = document.getElementById('formSuccess');
const errorMsg = document.getElementById('formError');
const submitBtn = document.getElementById('submitBtn');

if (form) {
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Basic validation
        const firstName = document.getElementById('firstName').value.trim();
        const email = document.getElementById('email').value.trim();
        const agreeTerms = document.getElementById('agreeTerms');
        const agreeError = document.getElementById('agreeError');

        if (!firstName || !email) {
            errorMsg.textContent = 'Please fill in your name and email address.';
            errorMsg.style.display = 'block';
            return;
        }

        if (!agreeTerms.checked) {
            agreeError.style.display = 'block';
            agreeTerms.closest('.form-agree').scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        agreeError.style.display = 'none';
        errorMsg.style.display = 'none';

        // Loading state
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.style.display = 'none';
                successMsg.style.display = 'block';
                // Scroll success message into view inside the modal
                const inner = enquiryModal ? enquiryModal.querySelector('.enquiry-modal-inner') : null;
                if (inner) inner.scrollTop = 0;
            } else {
                const data = await response.json();
                const msg = data?.errors?.map(err => err.message).join(', ') || 'Something went wrong.';
                errorMsg.textContent = msg;
                errorMsg.style.display = 'block';
                submitBtn.textContent = 'Send Enquiry';
                submitBtn.disabled = false;
            }
        } catch (err) {
            errorMsg.textContent = 'Network error — please check your connection and try again.';
            errorMsg.style.display = 'block';
            submitBtn.textContent = 'Send Enquiry';
            submitBtn.disabled = false;
        }
    });
}


// ══════════════════════════════════════════════════════
// DELIVERY POSTCODE CHECKER
// ══════════════════════════════════════════════════════

const BASE_POSTCODE = 'BN227LQ';
let baseCoords = null;

async function fetchCoords(postcode) {
    const clean = postcode.replace(/\s+/g, '').toUpperCase();
    const res = await fetch(`https://api.postcodes.io/postcodes/${clean}`);
    const data = await res.json();
    if (data.status !== 200) throw new Error('Invalid postcode');
    return { lat: data.result.latitude, lng: data.result.longitude };
}

function haversine(lat1, lng1, lat2, lng2) {
    const R = 3958.8;
    const toRad = x => x * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2
        + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getDeliveryInfo(miles) {
    if (miles <= 5) return { cost: 'Free', tier: 'free-delivery', note: 'Complimentary delivery included' };
    if (miles <= 15) return { cost: '£10', tier: 'paid-delivery', note: 'Standard delivery charge' };
    if (miles <= 30) return { cost: '£20', tier: 'paid-delivery', note: 'Extended delivery charge' };
    return { cost: 'POA', tier: 'poa-delivery', note: 'Please mention delivery in your message' };
}

async function checkDelivery() {
    const input = document.getElementById('deliveryPostcode');
    const result = document.getElementById('deliveryResult');
    const postcode = input.value.trim();

    if (!postcode) {
        result.className = 'delivery-result active';
        result.innerHTML = '<span class="delivery-error">Please enter a postcode.</span>';
        return;
    }

    result.className = 'delivery-result active';
    result.innerHTML = '<span class="delivery-checking">Looking up postcode…</span>';

    try {
        if (!baseCoords) baseCoords = await fetchCoords(BASE_POSTCODE);
        const userCoords = await fetchCoords(postcode);
        const miles = haversine(baseCoords.lat, baseCoords.lng, userCoords.lat, userCoords.lng);
        const { cost, tier, note } = getDeliveryInfo(miles);
        result.innerHTML = `
            <div class="delivery-card ${tier}">
                <div class="delivery-left">
                    <span class="delivery-distance">${miles.toFixed(1)} miles</span>
                    <span class="delivery-note">${note}</span>
                </div>
                <span class="delivery-cost">${cost}</span>
            </div>`;
    } catch (err) {
        result.innerHTML = '<span class="delivery-error">Postcode not found — please check and try again.</span>';
    }
}

// Allow pressing Enter inside the postcode field
const postcodeInput = document.getElementById('deliveryPostcode');
if (postcodeInput) {
    postcodeInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); checkDelivery(); }
    });
}