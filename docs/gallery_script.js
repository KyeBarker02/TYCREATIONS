// gallery-script.js

const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const closeBtn = document.querySelector('.lightbox-close');
const imageZoom = document.getElementById('imageZoom');
const zoomedImg = document.getElementById('zoomedImg');

let currentImages = [];
let currentIndex = 0;

const leftArrow = document.querySelector('.zoom-arrow.left');
const rightArrow = document.querySelector('.zoom-arrow.right');

function isVideo(src) {
    return src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.webm');
}

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const folder = item.getAttribute('data-folder');
        const files  = window.galleryData[folder] || [];

        // Pull the preview image src from the placeholder's background-image style
        const placeholder = item.querySelector('.gallery-placeholder');
        const bgStyle     = placeholder ? placeholder.style.backgroundImage : '';
        const match       = bgStyle.match(/url\(['"]?([^'"]+)['"]?\)/);
        const previewSrc  = match ? match[1] : '';

        // Find that image's position in the full folder so arrows navigate the whole set
        const startIndex = files.indexOf(previewSrc);

        currentImages = files;
        currentIndex  = startIndex >= 0 ? startIndex : 0;

        // imageZoom is nested inside lightbox, so lightbox must be active for it to show.
        // lightboxContent is left empty so only the zoomed image appears — no grid.
        lightbox.classList.add('active');
        showZoomedMedia();
    });
});

closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
    lightboxContent.innerHTML = '';
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
        lightboxContent.innerHTML = '';
    }
});

imageZoom.addEventListener('click', (e) => {
    if (e.target === imageZoom) {
        closeZoom();
    }
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

function preloadImages(folder) {
    const files = window.galleryData[folder] || [];
    files.forEach(src => {
        if (!isVideo(src)) {
            const img = new Image();
            img.src = src;
        }
    });
}

function openGallery(folder) {
    lightbox.classList.add('active');
    lightboxContent.innerHTML = '';

    const files = window.galleryData[folder] || [];
    currentImages = files;

    files.forEach((src, index) => {
        if (isVideo(src)) {
            // Wrapper so the play button can sit on top
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'position:relative; cursor:pointer; border-radius:10px; overflow:hidden;';

            const vid = document.createElement('video');
            vid.src = src;
            vid.preload = 'metadata';
            vid.muted = true;
            vid.playsInline = true;
            vid.style.cssText = 'width:100%; height:220px; object-fit:cover; display:block; border-radius:10px;';

            // Play button overlay
            const play = document.createElement('div');
            play.innerHTML = `
                <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style="width:56px;height:56px;">
                    <circle cx="40" cy="40" r="38" fill="rgba(255,255,255,0.75)"/>
                    <polygon points="30,20 62,40 30,60" fill="#5a7a5e"/>
                </svg>`;
            play.style.cssText = `
                position:absolute; inset:0;
                display:flex; align-items:center; justify-content:center;
                pointer-events:none;`;

            wrapper.appendChild(vid);
            wrapper.appendChild(play);

            wrapper.addEventListener('click', () => {
                currentIndex = index;
                showZoomedMedia();
            });

            lightboxContent.appendChild(wrapper);
        } else {
            const img = document.createElement('img');
            img.src = src;
            img.style.borderRadius = '10px';

            img.addEventListener('click', () => {
                currentIndex = index;
                showZoomedMedia();
            });

            lightboxContent.appendChild(img);
        }
    });
}

function showZoomedMedia() {
    const src = currentImages[currentIndex];

    // Clean up any previous zoomed video
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

document.addEventListener('keydown', (e) => {
    if (!imageZoom.classList.contains('active')) return;

    if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        showZoomedMedia();
    }
    if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % currentImages.length;
        showZoomedMedia();
    }
    if (e.key === 'Escape') {
        closeZoom();
    }
});

Object.keys(window.galleryData).forEach(folder => {
    preloadImages(folder);
});
