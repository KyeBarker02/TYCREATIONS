// gallery-data.js

function generateImages(folder, prefix, count, ext = 'jpeg') {
    return Array.from({ length: count }, (_, i) =>
        `images/${folder}/${prefix}${i + 1}.${ext}`
    );
}

window.galleryData = {
    HoneyCakes: generateImages('HoneyCakes', 'HoneyCake', 38),
    OccasionCakes: generateImages('OccasionCakes', 'OccasionCake', 83),
    OtherCakes: generateImages('OtherCakes', 'OtherCake', 63),
    SmallBakes: [
        'images/SmallBakes/SmallBake1.jpeg',
        'images/SmallBakes/SmallBake2.mp4',
        'images/SmallBakes/SmallBake3.mp4',
    ],
};
