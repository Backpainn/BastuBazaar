/* ============================================
   BastuBazaar — Authentication & Session Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    updateNavbarAuthState();

    // Firebase auth state listener
    if (window.firebase && firebase.auth) {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // Secure Admin Check
                if (user.email === 'sushantabhatta6@gmail.com') {
                    if (window.firebase && db) {
                        db.collection('users').doc(user.uid).set({ role: 'admin' }, { merge: true }).catch(e => console.log(e));
                    }
                    handleSuccessfulLogin(user, 'admin');
                    return;
                }

                db.collection('users').doc(user.uid).get()
                    .then(doc => {
                        if (doc.exists && doc.data().role) {
                            handleSuccessfulLogin(user, doc.data().role);
                        } else {
                            // Trigger Onboarding if on login page
                            if (window.location.pathname.endsWith('login.html')) {
                                document.getElementById('login-card-main').style.display = 'none';
                                document.getElementById('onboarding-container').style.display = 'block';
                            } else {
                                handleSuccessfulLogin(user, 'buyer'); // Fallback
                            }
                        }
                    })
                    .catch(err => {
                        console.error("Firestore read failed.", err);
                        if (window.location.pathname.endsWith('login.html')) {
                            document.getElementById('login-card-main').style.display = 'none';
                            document.getElementById('onboarding-container').style.display = 'block';
                        } else {
                            handleSuccessfulLogin(user, 'buyer');
                        }
                    });

            } else {
                // Firebase says no user is logged in.
                // Check if we have a demo user before wiping localStorage!
                const existingUserStr = localStorage.getItem('bastubazar_user');
                if (existingUserStr) {
                    try {
                        const existingUser = JSON.parse(existingUserStr);
                        if (existingUser && existingUser.id && existingUser.id.startsWith('demo-')) {
                            // It's a demo user, do NOT clear them out
                            updateNavbarAuthState();
                            return;
                        }
                    } catch (e) {
                        console.error("Error parsing user", e);
                    }
                }
                
                localStorage.removeItem('bastubazar_user');
                updateNavbarAuthState();
            }
        });
    }
});


// =========================
// EMAIL LOGIN
// =========================
window.loginWithEmail = function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((cred) => {
            document.getElementById("msg").style.color = "green";
            document.getElementById("msg").innerText = "Login Successful ✅";
            // onAuthStateChanged will handle the redirect/onboarding
        })
        .catch((error) => {
            document.getElementById("msg").style.color = "red";
            document.getElementById("msg").innerText = error.message;
        });
};


// =========================
// GOOGLE LOGIN
// =========================
window.loginWithGoogle = function () {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            document.getElementById("msg").style.color = "green";
            document.getElementById("msg").innerText = "Google Login Success 🚀";
            // onAuthStateChanged will handle the redirect/onboarding
        })
        .catch((error) => {
            document.getElementById("msg").style.color = "red";
            document.getElementById("msg").innerText = error.message;
        });
};

// =========================
// ONBOARDING & LOGIN HANDLER
// =========================
window.handleSuccessfulLogin = function(firebaseUser, role) {
    const userObj = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        role: role
    };
    localStorage.setItem('bastubazar_user', JSON.stringify(userObj));
    updateNavbarAuthState();
    
    // Redirect if on login page
    if (window.location.pathname.endsWith('login.html')) {
        setTimeout(() => {
            if (role === 'admin') window.location.href = "admin.html";
            else if (role === 'seller') window.location.href = "seller.html";
            else window.location.href = "buyer.html";
        }, 500);
    }
}

window.selectRole = function(role) {
    const user = firebase.auth().currentUser;
    if (user) {
        if (window.firebase && db) {
            db.collection('users').doc(user.uid).set({ role: role }, { merge: true }).catch(e => console.log(e));
        }
        handleSuccessfulLogin(user, role);
    }
};


// =========================
// LOGOUT
// =========================
window.logout = function () {
    firebase.auth().signOut()
        .then(() => {
            localStorage.removeItem('bastubazar_user');
            window.location.href = 'index.html';
        });
};


// =========================
// CURRENT USER
// =========================
function getCurrentUser() {
    const userStr = localStorage.getItem('bastubazar_user');
    return userStr ? JSON.parse(userStr) : null;
}


// =========================
// NAVBAR UPDATE
// =========================
function updateNavbarAuthState() {
    const user = getCurrentUser();
    const container = document.getElementById('auth-buttons-container');

    if (container) {
        if (user) {
            let dashboard = 'index.html';

            if (user.role === 'buyer') dashboard = 'buyer.html';
            else if (user.role === 'seller') dashboard = 'seller.html';
            else if (user.role === 'admin') dashboard = 'admin.html';

            container.innerHTML = `
                <a href="${dashboard}" class="btn btn-primary btn-sm rounded-2 px-3">
                    Dashboard
                </a>
                <button class="btn btn-danger btn-sm rounded-2 px-3" onclick="logout()">
                    Logout
                </button>
            `;
        } else {
            container.innerHTML = `
                <a href="login.html" class="btn btn-outline-primary btn-sm rounded-2 px-3">
                    <i class="bi bi-person me-1"></i> Login
                </a>
                <a href="login.html" class="btn btn-primary btn-sm rounded-2 px-3">
                    <i class="bi bi-plus-lg me-1"></i> List an Item
                </a>
            `;
        }
    }
}


// =========================
// PROTECT PAGES
// =========================
window.requireAuth = function (role = null) {
    const user = getCurrentUser();

    if (!user) {
        window.location.href = 'login.html';
    } else if (role && user.role !== role) {
        window.location.href = 'index.html';
    }
};


// =========================
// DEMO LOGIN (HACKATHON)
// =========================
window.demoLogin = function (role) {
    let name = "Guest User";
    if (role === 'buyer') name = "Demo Buyer";
    else if (role === 'seller') name = "Demo Seller";
    else if (role === 'admin') name = "Platform Admin";

    const userObj = {
        id: 'demo-' + Date.now(),
        email: `demo_${role}@bastubazar.com`,
        name: name,
        role: role
    };

    localStorage.setItem('bastubazar_user', JSON.stringify(userObj));
    updateNavbarAuthState();

    if (role === 'buyer') window.location.href = 'buyer.html';
    else if (role === 'seller') window.location.href = 'seller.html';
    else if (role === 'admin') window.location.href = 'admin.html';
};