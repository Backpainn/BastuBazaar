// js/firebase-config.js

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCqSoat1NoHt1x3opHot5avOKrv1EaelFg",
    authDomain: "login-c97e6.firebaseapp.com",
    projectId: "login-c97e6",
    storageBucket: "login-c97e6.firebasestorage.app",
    messagingSenderId: "228656688220",
    appId: "1:228656688220:web:64b1f68bdbe89d89a80a99"
};

// Initialize Firebase only if the config is partially valid (avoids crashing if placeholders)
if (firebaseConfig.apiKey !== "YOUR_API_KEY" && firebaseConfig.apiKey !== "[GCP_API_KEY]") {
    firebase.initializeApp(firebaseConfig);
} else {
    console.warn("Firebase is not initialized. Please provide valid configuration in js/firebase-config.js");
    // Mock for UI to not crash completely
    window.firebase = {
        auth: () => ({
            onAuthStateChanged: (cb) => {
                // If there's a mocked user in localStorage, return it so UI works
                const user = localStorage.getItem('bastubazar_user');
                if (user) cb(JSON.parse(user));
                else cb(null);
            },
            signInWithEmailAndPassword: () => Promise.reject("Firebase not configured"),
            createUserWithEmailAndPassword: () => Promise.reject("Firebase not configured"),
            signInWithPopup: () => Promise.reject("Firebase not configured"),
            signOut: () => {
                localStorage.removeItem('bastubazar_user');
                return Promise.resolve();
            }
        }),
        firestore: () => ({
            collection: () => ({
                doc: () => ({
                    get: () => Promise.resolve({ exists: true, data: () => ({ role: 'buyer' }) }),
                    set: () => Promise.resolve()
                }),
                add: () => Promise.resolve()
            })
        })
    };
}

const auth = firebase.auth();
const db = firebase.firestore();

// Get a list of cities from your database
async function getCities(dbInstance = db) {
    const citiesCol = dbInstance.collection('cities');
    const citySnapshot = await citiesCol.get();
    const cityList = citySnapshot.docs.map(doc => doc.data());
    return cityList;
}
