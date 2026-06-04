# BastuBazaar — Complete Project Memory & Documentation

## 1. Project Vision & Overview
BastuBazaar is a modern, responsive marketplace web application specifically tailored for the Nepal market. It facilitates the **Renting, Selling, and Bartering** of physical assets ranging from agricultural equipment and real estate to event goods and electronics. 

The core mission of BastuBazaar is to empower users to safely and cleanly discover assets, make deals, and manage their listings with an app-like experience on the web.

---

## 2. Technology Stack & Implementation
The project was explicitly built to be lightweight, fast, and easily deployable without a complex backend during the initial hackathon phase.

- **Frontend**: Pure HTML5, CSS3, and Vanilla JavaScript (ES6+).
- **CSS Framework**: Custom CSS (`style.css`) augmented by Bootstrap 5 (loaded via CDN) for responsive grids, flexbox utilities, and modal components.
- **Typography & Icons**: Google Fonts (Inter) and Bootstrap Icons (loaded via CDN).
- **Data Persistence**: Client-side `localStorage` is used to simulate a persistent database. It maintains user sessions, dynamic asset uploads, and deal requests across page reloads.

---

## 3. UI/UX Design System & Spacing
The design philosophy follows the **Uncodixfy** guidelines, prioritizing clean, professional, and content-centric layouts instead of over-decorated "AI-cliches".

**Core CSS Tokens & Variables (style.css):**
- `--pri`: `#4F46E5` (Primary Indigo)
- `--pri-h`: `#4338CA` (Primary Hover)
- `--pri-bg`: `#EEF2FF` (Primary Background)
- `--pri-sub`: `#E0E7FF` (Primary Border/Subtitle)
- `--ok`: `#059669` (Success Green)
- `--warn`: `#D97706` (Warning Amber)
- `--err`: `#DC2626` (Error Red)

**Layout & Alignment Rules:**
- **Border Radii**: Constrained to a standard maximum of `8px` or `12px` (`rounded-2` / `rounded-3`). Pill shapes (`999px` / `rounded-pill`) have been completely replaced with compact rectangular radii.
- **Spacing**: Global vertical section padding is standardized to `5.5rem 0` on desktop and scales dynamically to `3rem 0` on mobile screens. Section headers have a bottom margin of `3.5rem` to avoid text crowding.
- **Shadows & Gradients**: Heavy drop shadows are replaced with a single subtle elevation `0 2px 8px rgba(0, 0, 0, 0.08)`. Gradients are avoided on sections to maintain visual clarity.
- **Animations & Text**: Bouncy scales and hover transforms are disabled. Labels use natural casing instead of forced uppercase characters.
- **Navbar Collapsing**: In dark mode, mobile collapses correctly display with a dark background (`#111827`).

---

## 4. File Architecture
```text
bastubazarsus/
│
├── index.html        # Main landing page with Hero search and asset grid.
├── login.html        # Authentication portal for role selection.
├── buyer.html        # Buyer dashboard (Managing Deal Requests).
├── seller.html       # Seller dashboard (Listing form and Active Listings).
├── admin.html        # Admin portal (Metrics and Moderation).
├── detail.html       # Single asset view and Deal Finalization modal.
├── contact.html      # Responsive Contact Us page.
├── memory.md         # Comprehensive project documentation (this file).
│
├── css/
│   └── style.css     # Global variables, typography, and reusable components.
│
├── js/
│   ├── data.js       # Base hardcoded dataset (`assets`) and fallback data.
│   ├── auth.js       # Session management (`getCurrentUser`, `login`, `logout`).
│   ├── app.js        # Global search filtering and Homepage grid rendering.
│   ├── buyer.js      # Renders user's pending deal requests from localStorage.
│   ├── seller.js     # Form processing for new assets and deletion of listings.
│   ├── detail.js     # URL param parsing, price computation, and deal submission.
│   └── admin.js      # Aggregates localStorage data to display platform metrics.
│
└── images/           # Contains custom SVGs and high-quality generated images 
                      # (tractor, land, camera, excavator, tent, scooter).
```

---

## 5. State Management & Database Schema
Instead of a traditional backend, the app relies on specific `localStorage` keys to persist state.

### `bastubazar_user`
Stores the current active session.
```json
{
  "id": "user-a1",
  "name": "Platform Admin",
  "role": "admin" // Can be 'buyer', 'seller', or 'admin'
}
```

### `bastubazar_custom_assets`
An array of assets dynamically uploaded by sellers via the dashboard.
```json
[
  {
    "id": "custom-1780417257628",
    "title": "Yamaha FZ Bike",
    "description": "2021 model in great condition.",
    "category": "Vehicles",
    "location": "Kathmandu",
    "condition": "Excellent",
    "tags": ["rent", "sell"],
    "price": "NPR 1,500",
    "priceNum": 1500,
    "sellPrice": "NPR 250,000",
    "period": "day",
    "user": { "name": "Seller Name", "initials": "SN", "phone": "+977...", "rating": "4.9" },
    "imageSrc": null,
    "color": "#e0e7ff",
    "emoji": "📦",
    "postedDate": "Just now",
    "views": 0
  }
]
```

### `bastubazar_requests`
An array of deal requests made by buyers on specific items.
```json
[
  {
    "id": "req-1780417257628",
    "assetId": "asset-3",
    "dealType": "Rent",
    "status": "Pending",
    "timestamp": 1780417257628
  }
]
```

---

## 6. Feature Breakdown by Role

### Guest / Unauthenticated
- Browse the homepage, search for items by keywords (title, category, location).
- View asset details (description, condition, specs).
- Must log in to finalize a deal or list an item.

### Buyer
- **Deal Finalization**: Can select a deal type (Rent, Sell, Barter), pick dates, and submit offers.
- **WhatsApp Integration**: Can instantly redirect to a pre-filled WhatsApp chat with the seller.
- **Buyer Dashboard**: Views all pending requests and can cancel offers natively.

### Seller
- **Listing Tool**: Can upload new assets, select available deal types, set custom pricing and descriptions.
- **Smart Pricing**: When selecting "Buy/Sell", the system auto-computes a logical sale price if omitted.
- **Seller Dashboard**: Includes a profile card and allows the seller to instantly delete active custom listings.

### Admin
- **Command Center**: Views live metrics across the platform (Total Listings, Total Deals, Registered Users).
- **Activity Feed**: Monitors live deal requests as they are submitted.
- **Moderation**: Can review the master listings table and securely delete inappropriate custom assets from the platform.

---

## 7. Future Scalability & Next Steps
When moving out of the hackathon phase, the following steps are recommended:
1. **Backend Integration**: Replace `localStorage` with a robust backend (Node.js/Express, Python/Django, or Firebase).
2. **Database Migration**: Move JSON models into PostgreSQL or MongoDB.
3. **Image Hosting**: Replace the local SVG/Static image setup with AWS S3 or Cloudinary for real user image uploads.
4. **Real Authentication**: Implement JWT or OAuth (Google/Facebook login) inside `auth.js`.
