// gallery-data.js

function generateImages(folder, prefix, count, ext = 'jpeg') {
    return Array.from({ length: count }, (_, i) =>
        `/images/${folder}/${prefix}${i + 1}.${ext}`
    );
}

window.galleryData = {
    HoneyCakes: generateImages('HoneyCakes', 'HoneyCake', 68),
    HoneyCakesPreview: [
        '/images/HoneyCakes/HoneyCake16.jpeg',
        '/images/HoneyCakes/HoneyCake61.jpeg',
        '/images/HoneyCakes/HoneyCake66.jpeg',
        '/images/HoneyCakes/HoneyCake23.jpeg',
    ],

    BirthdayCakes: generateImages('BirthdayCakes', 'BirthdayCake', 68),
    BirthdayCakesPreview: [
        '/images/BirthdayCakes/BirthdayCake1.jpeg',
        '/images/BirthdayCakes/BirthdayCake60.jpeg',
        '/images/BirthdayCakes/BirthdayCake33.jpeg',
        '/images/BirthdayCakes/BirthdayCake6.jpeg',
        '/images/BirthdayCakes/BirthdayCake21.jpeg',
        '/images/BirthdayCakes/BirthdayCake30.jpeg',
        '/images/BirthdayCakes/BirthdayCake16.jpeg',
    ],

    WeddingCakes: generateImages('WeddingCakes', 'WeddingCake', 6),
    WeddingCakesPreview: [
        '/images/WeddingCakes/WeddingCake1.jpeg',
        '/images/WeddingCakes/WeddingCake4.jpeg',
    ],

    OtherCakes: generateImages('OtherCakes', 'OtherCake', 76),
    OtherCakesPreview: [
        '/images/OtherCakes/OtherCake5.jpeg',
        '/images/OtherCakes/OtherCake12.jpeg',
        '/images/OtherCakes/OtherCake14.jpeg',
        '/images/OtherCakes/OtherCake27.jpeg',
        '/images/OtherCakes/OtherCake34.jpeg',
        '/images/OtherCakes/OtherCake41.jpeg',
        '/images/OtherCakes/OtherCake56.jpeg',
        '/images/OtherCakes/OtherCake39.jpeg',
        
    ],

    Cookies: generateImages('Cookies', 'Cookie', 10),
    CookiesPreview: [
        '/images/Cookies/Cookie1.jpeg',
        '/images/Cookies/Cookie8.jpeg',
        '/images/Cookies/Cookie9.jpeg',
        '/images/Cookies/Cookie3.jpeg',
        '/images/Cookies/Cookie7.jpeg',
    ],

    Desserts: generateImages('Desserts', 'Desserts', 31),
    DessertsPreview: [
        '/images/Desserts/Desserts3.jpeg',
        '/images/Desserts/Desserts4.jpeg',
        '/images/Desserts/Desserts7.jpeg',
        '/images/Desserts/Desserts9.jpeg',
        '/images/Desserts/Desserts11.jpeg',
        '/images/Desserts/Desserts22.jpeg',
        '/images/Desserts/Desserts24.jpeg',
        '/images/Desserts/Desserts23.jpeg',
    ]
};



