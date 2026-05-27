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
        'images/HoneyCakes/HoneyCake5.jpeg',
        'images/HoneyCakes/HoneyCake11.jpeg',
    ],

    BirthdayCakes: generateImages('BirthdayCakes', 'BirthdayCake', 60),
    BirthdayCakesPreview: [
        'images/BirthdayCakes/BirthdayCake1.jpeg',
        'images/BirthdayCakes/BirthdayCake61.jpeg',
        'images/BirthdayCakes/BirthdayCake33.jpeg',
        'images/BirthdayCakes/BirthdayCake6.jpeg',
        'images/BirthdayCakes/BirthdayCake79.jpeg',
        'images/BirthdayCakes/BirthdayCake30.jpeg',
        'images/BirthdayCakes/BirthdayCake16.jpeg',
    ],

    WeddingCakes: generateImages('WeddingCakes', 'WeddingCake', 3),
    WeddingCakesPreview: [
        'images/WeddingCakes/WeddingCake1.jpeg',
        'images/WeddingCakes/WeddingCake2.jpeg',
        'images/WeddingCakes/WeddingCake3.jpeg',
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



