// gallery-data.js

function generateImages(folder, prefix, count, ext = 'jpeg') {
    return Array.from({ length: count }, (_, i) =>
        `images/${folder}/${prefix}${i + 1}.${ext}`
    );
}

window.galleryData = {
    HoneyCakes: generateImages('HoneyCakes', 'HoneyCake', 38),
    HoneyCakesPreview: [
        'images/HoneyCakes/HoneyCake16.jpeg',
        'images/HoneyCakes/HoneyCake18.jpeg',
        'images/HoneyCakes/HoneyCake8.jpeg',
        'images/HoneyCakes/HoneyCake11.jpeg',
    ],

    OccasionCakes: generateImages('OccasionCakes', 'OccasionCake', 83),
    OccasionCakesPreview: [
        'images/OccasionCakes/OccasionCake1.jpeg',
        'images/OccasionCakes/OccasionCake61.jpeg',
        'images/OccasionCakes/OccasionCake33.jpeg',
        'images/OccasionCakes/OccasionCake6.jpeg',
        'images/OccasionCakes/OccasionCake79.jpeg',
        'images/OccasionCakes/OccasionCake30.jpeg',
        'images/OccasionCakes/OccasionCake16.jpeg',
    ],

    OtherCakes: generateImages('OtherCakes', 'OtherCake', 63),
    OtherCakesPreview: [
        'images/OtherCakes/OtherCake5.jpeg',
        'images/OtherCakes/OtherCake12.jpeg',
        'images/OtherCakes/OtherCake14.jpeg',
        'images/OtherCakes/OtherCake27.jpeg',
        'images/OtherCakes/OtherCake34.jpeg',
        'images/OtherCakes/OtherCake41.jpeg',
        'images/OtherCakes/OtherCake56.jpeg',
        'images/OtherCakes/OtherCake39.jpeg',
        
    ],

    SmallBakes: [
        'images/SmallBakes/SmallBake1.jpeg',
        'images/SmallBakes/SmallBake2.mp4',
        'images/SmallBakes/SmallBake3.mp4',
    ],
};



