

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
});

// ── DELIVERY POSTCODE CHECKER ──
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
    const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
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
    } catch (e) {
        result.innerHTML = '<span class="delivery-error">Postcode not found — please check and try again.</span>';
    }
}

document.getElementById('deliveryPostcode').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); checkDelivery(); }
});
