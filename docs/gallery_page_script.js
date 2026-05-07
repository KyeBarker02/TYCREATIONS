// gallery_page_script.js
// Handles the gallery.html preview grids and full-folder lightbox.
// Depends on: gallery_data.js (must load first)

// ── CONFIG ────────────────────────────────────────────────────────
// Number of preview images to show per category
const PREVIEW_COUNTS = {
    HoneyCakes:    5,   // Layout A: 1 tall left + 2×2 right
    OccasionCakes: 6,   // Layout B: 3×2 grid + 1 tall right
    OtherCakes:    5,   // Layout C: 1 wide top-left + 4
    SmallBakes:    3,   // Layout D: only 3 images exist
};

// ── LIGHTBOX STATE ────────────────────────────────────────────────
let currentImages = [];
let currentIndex  = 0;

const lightbox        = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const closeBtn        = document.querySelector('.lightbox-close');
const imageZoom       = document.getElementById('imageZoom');
const zoomedImg       = document.getElementById('zoomedImg');
const leftArrow       = document.querySelector('.zoom-arrow.left');
const rightArrow      = document.querySelector('.zoom-arrow.right');

function isVideo(src) {
    return src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.webm');
}

// ── PREVIEW GRID BUILDER ──────────────────────────────────────────
function buildPreviewGrid(folder) {
    const allImages = window.galleryData[folder] || [];
    const count     = Math.min(PREVIEW_COUNTS[folder] || 5, allImages.length);
    const preview   = allImages.slice(0, count);
    const grid      = document.getElementById('grid-' + folder);
    if (!grid) return;

    // Update count label
    const countEl = document.getElementById('count-' + folder);
    if (countEl) countEl.textContent = allImages.length + ' photos';

    preview.forEach((src, idx) => {
        const cell = document.createElement('div');
        cell.className = 'preview-img';
        cell.title = 'Click to browse all photos';

        if (isVideo(src)) {
            const vid = document.createElement('video');
            vid.src = src;
            vid.preload = 'metadata';
            vid.muted = true;
            vid.playsInline = true;

            const badge = document.createElement('span');
            badge.className = 'play-badge';
            badge.textContent = '▶ Video';

            cell.appendChild(vid);
            cell.appendChild(badge);
        } else {
            const img = document.createElement('img');
            img.src = src;
            img.alt = folder + ' ' + (idx + 1);
            img.loading = 'lazy';
            cell.appendChild(img);
        }

        // Click preview → open lightbox at this image's index
        cell.addEventListener('click', () => openGallery(folder, idx));

        grid.appendChild(cell);
    });
}

// ── LIGHTBOX OPEN ─────────────────────────────────────────────────
function openGallery(folder, startIndex = 0) {
    const files = window.galleryData[folder] || [];
    currentImages = files;
    lightboxContent.innerHTML = '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    files.forEach((src, index) => {
        if (isVideo(src)) {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'position:relative; cursor:pointer; border-radius:10px; overflow:hidden;';

            const vid = document.createElement('video');
            vid.src = src;
            vid.preload = 'metadata';
            vid.muted = true;
            vid.playsInline = true;
            vid.style.cssText = 'width:100%; height:220px; object-fit:cover; display:block; border-radius:10px;';

            const play = document.createElement('div');
            play.innerHTML = `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style="width:56px;height:56px;">
                <circle cx="40" cy="40" r="38" fill="rgba(255,255,255,0.75)"/>
                <polygon points="30,20 62,40 30,60" fill="#5a7a5e"/>
            </svg>`;
            play.style.cssText = 'position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none;';

            wrapper.appendChild(vid);
            wrapper.appendChild(play);
            wrapper.addEventListener('click', () => { currentIndex = index; showZoomedMedia(); });
            lightboxContent.appendChild(wrapper);
        } else {
            const img = document.createElement('img');
            img.src = src;
            img.alt = '';
            img.style.borderRadius = '10px';
            img.loading = 'lazy';
            img.addEventListener('click', () => { currentIndex = index; showZoomedMedia(); });
            lightboxContent.appendChild(img);
        }
    });

    // Jump straight into zoomed view at the clicked image
    requestAnimationFrame(() => {
        const items = lightboxContent.children;
        if (items[startIndex]) {
            items[startIndex].scrollIntoView({ block: 'nearest' });
        }
        currentIndex = startIndex;
        showZoomedMedia();
    });
}

// ── ZOOM ──────────────────────────────────────────────────────────
function showZoomedMedia() {
    const src = currentImages[currentIndex];
    const existingVideo = imageZoom.querySelector('video.zoomed-video');
    if (existingVideo) existingVideo.remove();

    if (isVideo(src)) {
        zoomedImg.style.display = 'none';
        const vid = document.createElement('video');
        vid.src = src;
        vid.controls = true;
        vid.autoplay = true;
        vid.playsInline = true;
        vid.className = 'zoomed-video';
        vid.style.cssText = 'max-width:90%; max-height:90%; border-radius:12px; z-index:1002;';
        rightArrow.insertAdjacentElement('beforebegin', vid);
    } else {
        zoomedImg.style.display = '';
        zoomedImg.src = src;
    }
    imageZoom.classList.add('active');
}

function closeZoom() {
    imageZoom.classList.remove('active');
    const existingVideo = imageZoom.querySelector('video.zoomed-video');
    if (existingVideo) existingVideo.remove();
    zoomedImg.style.display = '';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxContent.innerHTML = '';
    document.body.style.overflow = '';
}

// ── EVENT LISTENERS ───────────────────────────────────────────────
closeBtn.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

imageZoom.addEventListener('click', (e) => {
    if (e.target === imageZoom) closeZoom();
});

leftArrow.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    showZoomedMedia();
});

rightArrow.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % currentImages.length;
    showZoomedMedia();
});

document.addEventListener('keydown', (e) => {
    if (imageZoom.classList.contains('active')) {
        if (e.key === 'ArrowLeft')  { currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length; showZoomedMedia(); }
        if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % currentImages.length; showZoomedMedia(); }
        if (e.key === 'Escape')     { closeZoom(); }
    } else if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape')     { closeLightbox(); }
    }
});

// ── INIT ──────────────────────────────────────────────────────────
['HoneyCakes', 'OccasionCakes', 'OtherCakes', 'SmallBakes'].forEach(buildPreviewGrid);
