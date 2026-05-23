# TYCREATIONS

# TY Creations — Website

Static marketing website for **TY Creations**, a UK-based home bakery specialising in bespoke cakes, cookies, cupcakes, and desserts. Built with vanilla HTML, CSS, and JavaScript, hosted on GitHub Pages.

---

## Project Structure

```
/
├── index.html          # Homepage
├── default_style_sheet.css    # Global styles
├── default_script.js          # Shared JS (nav, accordion, smooth scroll)
├── bee_script.js              # Animated honeybee scroll effect
│
├── gallery.html               # Full gallery page
├── gallery_style.css
├── gallery_script.js
├── gallery_page_script.js     # Preview grid + lightbox logic
├── gallery_data.js            # Image manifest (all gallery filenames)
│
├── menu_honey_cake.html       # Menu sub-pages
├── menu_occasion_cakes.html
├── menu_all_cakes.html
├── menu_cookies.html
├── menu_cupcakes.html
├── menu_desserts.html
├── menu_page_style.css        # Shared styles for all menu pages
│
├── privacy_policy.html
├── privacy_policy_style.css
├── terms_and_conditions.html
├── terms_and_conditions_style.css
│
├── logo_img.jpg               # Current logo
├── logo_img_old.jpg           # Previous logo (kept for reference)
│
└── images/
    ├── HoneyCakes/            # HoneyCake1.jpeg … HoneyCake38.jpeg
    ├── OccasionCakes/         # OccasionCake1.jpeg … OccasionCake83.jpeg
    ├── OtherCakes/            # OtherCake1.jpeg … OtherCake63.jpeg
    └── SmallBakes/            # SmallBake1.jpeg … SmallBake3.jpeg
```

---

## Features

- **Animated honeybee** — scrolls along the navbar on desktop, down the right edge on mobile (`bee_script.js`)
- **Gallery with lightbox** — category previews with a full-folder lightbox viewer, keyboard navigation, and video support
- **Menu pages** — per-product pages with sizes, pricing, flavours, and presentation details
- **Enquiry form** — Formspree AJAX submission with hCaptcha bot protection
- **Delivery postcode checker** — estimates delivery cost via postcodes.io
- **FAQ accordion** — on the homepage
- **Responsive navigation** — dropdown menu with mobile support

---

## Third-Party Services

| Service | Purpose |
|---|---|
| GitHub Pages | Hosting |
| Google Fonts | Typography (Cormorant Garamond, Playfair Display, Lato) |
| Formspree | Enquiry form submissions |
| hCaptcha | Bot protection on enquiry form |
| postcodes.io | Delivery postcode checker |

---

## Adding Gallery Images

Images follow a strict naming convention. To add new photos:

1. Name files sequentially: `HoneyCake39.jpeg`, `OccasionCake84.jpeg`, etc.
2. Place them in the correct folder under `images/`
3. Update the count in `gallery_data.js`:
   ```js
   HoneyCakes: generateImages('HoneyCakes', 'HoneyCake', 39), // was 38
   ```
4. To feature an image in the preview grid, add its path to the corresponding `Preview` array in `gallery_data.js`

---

## Legal

The site includes a full **Privacy Policy** and **Terms & Conditions** compliant with UK GDPR and PECR. These should be reviewed and updated whenever third-party services or data processing activities change.

---

## Deployment

Push to the `main` branch. GitHub Pages serves `default_page.html` — ensure the repository is configured to serve from the root of `main`.
