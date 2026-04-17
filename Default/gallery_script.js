// JavaScript source code
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

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const folder = item.getAttribute('data-folder');
        openGallery(folder);
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
        imageZoom.classList.remove('active');
    }
});

leftArrow.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    showZoomedImage();
});

rightArrow.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % currentImages.length;
    showZoomedImage();
});

function preloadImages(folder) {
    const images = window.galleryData[folder] || [];

    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}
function openGallery(folder) {
    lightbox.classList.add('active');
    lightboxContent.innerHTML = '';

    const images = window.galleryData[folder] || [];

    currentImages = images;

    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;

        img.addEventListener('click', () => {
            currentIndex = index;
            showZoomedImage();
        });

        lightboxContent.appendChild(img);
    });
}
function showZoomedImage() {
    zoomedImg.src = currentImages[currentIndex];
    imageZoom.classList.add('active');
}

document.addEventListener('keydown', (e) => {
    if (!imageZoom.classList.contains('active')) return;

    if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        showZoomedImage();
    }

    if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % currentImages.length;
        showZoomedImage();
    }

    if (e.key === 'Escape') {
        imageZoom.classList.remove('active');
    }
});

Object.keys(window.galleryData).forEach(folder => {
    preloadImages(folder);
});

