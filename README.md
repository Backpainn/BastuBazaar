# BastuBazaar

**BastuBazar** is Nepal's trusted platform for renting, selling, and bartering everyday assets. From tractors and cameras to land and event supplies, BastuBazar empowers users to trade smarter and maximize the utility of their belongings.

This project was designed with a heavy focus on high-quality UI/UX, fast client-side performance, and a fully interactive mock backend for hackathon demonstrations.

## 🚀 Key Features

- **Smart Search & Autocomplete**: Real-time search that filters through categories and asset listings instantly. Pressing enter on an exact match takes you directly to the product page.
- **Interactive Hackathon Demo Flow**: Features a floating demo banner that walks judges/users through a simulated "Rent an Item" and "Put on Rent" flow complete with dynamic receipts and animations—no backend database required!
- **Mock Database (Local Storage)**: All custom listings and rental requests are saved to your browser's local storage so they instantly persist across page reloads during a demo.
- **Role-Based Dashboards**: Tailored views for Buyers, Sellers, and Admins.
- **Firebase Authentication**: Integrated secure login system supporting both Email/Password and Google OAuth.
- **Dark Mode**: A clean, modern dark mode toggle that persists across sessions.
- **AI Chatbot**: Integrated Chatling AI widget to serve as a 24/7 automated support assistant.

## 🛠️ Tech Stack

This project uses a fast, lightweight serverless architecture (JAMstack approach):

* **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6)
* **Styling**: Bootstrap 5.3 (Grid & Utilities), Bootstrap Icons, Custom CSS with CSS variables
* **Backend / Auth**: Firebase Authentication & Firestore
* **Data Management**: JavaScript objects (`data.js`) and Browser `localStorage`
* **Typography**: Google Fonts (Inter)

## 📁 Directory Structure

```text
bastubazarsus/
│
├── index.html        # Main landing & search page
├── detail.html       # Individual asset detail & rental page
├── seller.html       # Seller dashboard (list items)
├── buyer.html        # Buyer dashboard
├── admin.html        # Admin management portal
├── login.html        # Authentication page
├── contact.html      # Contact & support page
│
├── css/
│   └── style.css     # Master stylesheet (includes dark mode, demo, and autocomplete styles)
│
├── js/
│   ├── app.js             # Core logic for homepage and search
│   ├── data.js            # Mock dataset containing standard assets
│   ├── demo.js            # Interactive Hackathon demo flow logic
│   ├── auth.js            # Firebase authentication & session management
│   ├── detail.js          # Logic for the individual asset pages
│   ├── theme.js           # Dark mode toggler
│   └── firebase-config.js # Firebase initialization keys
│
└── images/           # High-quality PNG assets and icons
```

## 💻 How to Run Locally

You do not need NodeJS, NPM, or a complex local server to run this project!

1. Clone or download this repository to your local machine.
2. Open the `bastubazarsus` folder.
3. Simply double-click `index.html` to open it in your default web browser.
4. **Hackathon Demo**: Once the page loads, wait 1 second for the purple "Hackathon Demo" banner to slide up from the bottom of the screen to try out the core features!

## 🌐 Deployment (GitHub Pages)

To host this project for free on GitHub Pages:
1. Ensure all files (`index.html`, `css/`, `js/`, `images/`) are in the **root directory** of your GitHub repository. (Do not upload them inside a subfolder unless you want that subfolder to be part of your URL).
2. Go to your repository **Settings** > **Pages**.
3. Under "Build and deployment", select **Deploy from a branch**.
4. Select your `main` branch and `/ (root)` folder, then click **Save**.
5. Your site will be live at `https://[your-username].github.io/[repository-name]/` in a few minutes!

