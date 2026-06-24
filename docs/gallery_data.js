// gallery-data.js

function generateImages(folder, prefix, count, ext = 'jpeg') {
    return Array.from({ length: count }, (_, i) =>
        `/images/${folder}/${prefix}${i + 1}.${ext}`
    );
}

window.galleryData = {
    HoneyCakes: generateImages('HoneyCakes', 'HoneyCake', 33),
    HoneyCakesPreview: [
        '/images/HoneyCakes/HoneyCake29.jpeg',
        '/images/HoneyCakes/HoneyCake30.jpeg',
        '/images/HoneyCakes/HoneyCake31.jpeg',
        '/images/HoneyCakes/HoneyCake15.jpeg',
    ],

    BirthdayCakes: generateImages('BirthdayCakes', 'BirthdayCake', 30),
    BirthdayCakesPreview: [
        '/images/BirthdayCakes/BirthdayCake2.jpeg',
        '/images/BirthdayCakes/BirthdayCake10.jpeg',
        '/images/BirthdayCakes/BirthdayCake15.jpeg',
        '/images/BirthdayCakes/BirthdayCake1.jpeg',
        '/images/BirthdayCakes/BirthdayCake28.jpeg',
        '/images/BirthdayCakes/BirthdayCake29.jpeg',
        '/images/BirthdayCakes/BirthdayCake30.jpeg',
    ],

    WeddingCakes: generateImages('WeddingCakes', 'WeddingCake', 6),
    WeddingCakesPreview: [
        '/images/WeddingCakes/WeddingCake1.jpeg',
        '/images/WeddingCakes/WeddingCake4.jpeg',
    ],

    OtherCakes: generateImages('OtherCakes', 'OtherCake', 34),
    OtherCakesPreview: [
        '/images/OtherCakes/OtherCake5.jpeg',
        '/images/OtherCakes/OtherCake12.jpeg',
        '/images/OtherCakes/OtherCake14.jpeg',
        '/images/OtherCakes/OtherCake27.jpeg',
        '/images/OtherCakes/OtherCake34.jpeg',
        '/images/OtherCakes/OtherCake10.jpeg',
        '/images/OtherCakes/OtherCake18.jpeg',
        '/images/OtherCakes/OtherCake23.jpeg',
        
    ],

    Cookies: generateImages('Cookies', 'Cookie', 8),
    CookiesPreview: [
        '/images/Cookies/Cookie1.jpeg',
        '/images/Cookies/Cookie3.jpeg',
        '/images/Cookies/Cookie8.jpeg',
        '/images/Cookies/Cookie3.jpeg',
        '/images/Cookies/Cookie7.jpeg',
    ],

    Desserts: generateImages('Desserts', 'Desserts', 19),
    DessertsPreview: [
        '/images/Desserts/Desserts3.jpeg',
        '/images/Desserts/Desserts4.jpeg',
        '/images/Desserts/Desserts7.jpeg',
        '/images/Desserts/Desserts9.jpeg',
        '/images/Desserts/Desserts11.jpeg',
        '/images/Desserts/Desserts17.jpeg',
        '/images/Desserts/Desserts14.jpeg',
        '/images/Desserts/Desserts1.jpeg',
    ]
};



