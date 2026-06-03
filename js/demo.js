/* ============================================
   BastuBazar — Hackathon Demo Module
   Shows how to rent something & put it on rent
   ============================================ */

(function() {
    'use strict';

    // Wait for DOM + data.js
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initDemoBanner, 1200); // Show after page loads
    });

    // ========== DEMO BANNER ==========

    function initDemoBanner() {
        // Don't show on seller page (they already have listing form)
        if (window.location.pathname.includes('seller.html')) return;

        const banner = document.createElement('div');
        banner.className = 'demo-banner';
        banner.id = 'demo-banner';
        banner.innerHTML = `
            <div class="demo-banner-inner">
                <div class="demo-banner-text">
                    <i class="bi bi-rocket-takeoff-fill"></i>
                    <span>🎯 <strong>Hackathon Demo</strong> — Try the full rental experience!</span>
                </div>
                <div class="demo-banner-actions">
                    <button class="btn-demo" id="demo-btn-rent">
                        <i class="bi bi-key-fill me-1"></i> Rent an Item
                    </button>
                    <button class="btn-demo btn-demo-primary" id="demo-btn-list">
                        <i class="bi bi-plus-circle-fill me-1"></i> Put on Rent
                    </button>
                    <button class="btn-demo-close" id="demo-btn-close" title="Dismiss">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        // Create modal overlay container
        const overlay = document.createElement('div');
        overlay.className = 'demo-modal-overlay';
        overlay.id = 'demo-modal-overlay';
        overlay.innerHTML = `<div class="demo-modal" id="demo-modal"></div>`;
        document.body.appendChild(overlay);

        // Show banner with animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                banner.classList.add('show');
            });
        });

        // Event listeners
        document.getElementById('demo-btn-rent').addEventListener('click', showRentDemo);
        document.getElementById('demo-btn-list').addEventListener('click', showListDemo);
        document.getElementById('demo-btn-close').addEventListener('click', () => {
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 400);
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    }

    // ========== RENT AN ITEM DEMO ==========

    function showRentDemo() {
        // Pick a demo asset (tractor - the star of our demo)
        const demoAsset = (typeof assets !== 'undefined' && assets.length > 0) 
            ? assets[0]  // Mahindra 475 Tractor
            : { title: 'Mahindra 475 Tractor', price: 'NPR 3,500', period: 'day', location: 'Chitwan, Nepal', imageSrc: 'images/tractor_1780417257628.png', category: 'Agriculture' };

        const modal = document.getElementById('demo-modal');
        modal.innerHTML = `
            <div class="demo-modal-header">
                <h3><i class="bi bi-key-fill"></i> Rent This Item</h3>
                <button class="demo-modal-close" onclick="document.getElementById('demo-modal-overlay').classList.remove('show')">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="demo-modal-body">
                <div class="demo-item-preview">
                    <img src="${demoAsset.imageSrc || ''}" alt="${demoAsset.title}">
                    <div class="demo-item-info">
                        <h4>${demoAsset.title}</h4>
                        <p><i class="bi bi-geo-alt-fill text-danger me-1"></i>${demoAsset.location}</p>
                    </div>
                    <div class="demo-item-price">
                        <div class="price-val">${demoAsset.price}</div>
                        <div class="price-per">per ${demoAsset.period}</div>
                    </div>
                </div>

                <div class="demo-form-row">
                    <div class="demo-form-group">
                        <label><i class="bi bi-calendar-event me-1"></i>Start Date</label>
                        <input type="date" id="demo-rent-start" value="${getTodayStr()}">
                    </div>
                    <div class="demo-form-group">
                        <label><i class="bi bi-calendar-check me-1"></i>End Date</label>
                        <input type="date" id="demo-rent-end" value="${getNextDayStr(3)}">
                    </div>
                </div>

                <div class="demo-form-group">
                    <label><i class="bi bi-person me-1"></i>Your Full Name</label>
                    <input type="text" id="demo-rent-name" placeholder="e.g. Aarav Sharma" value="">
                </div>

                <div class="demo-form-row">
                    <div class="demo-form-group">
                        <label><i class="bi bi-phone me-1"></i>Phone Number</label>
                        <input type="tel" id="demo-rent-phone" placeholder="98XXXXXXXX" value="">
                    </div>
                    <div class="demo-form-group">
                        <label><i class="bi bi-chat-dots me-1"></i>Deal Type</label>
                        <select id="demo-rent-type">
                            <option value="rent" selected>Rent</option>
                            <option value="barter">Barter</option>
                        </select>
                    </div>
                </div>

                <div class="demo-form-group">
                    <label><i class="bi bi-chat-left-text me-1"></i>Message to Owner</label>
                    <textarea id="demo-rent-msg" rows="2" placeholder="Hi, I'd like to rent this for my farm work..."></textarea>
                </div>

                <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 0.75rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: #92400e;">
                    <i class="bi bi-info-circle-fill"></i>
                    <span>Estimated total: <strong id="demo-rent-total">NPR 10,500</strong> for <strong id="demo-rent-days">3</strong> days</span>
                </div>

                <button class="demo-submit-btn" id="demo-rent-submit" onclick="window._demoSubmitRent()">
                    <i class="bi bi-check2-circle me-2"></i>Confirm Rental Request
                </button>
            </div>
        `;

        openModal();

        // Calculate total dynamically
        const startInput = document.getElementById('demo-rent-start');
        const endInput = document.getElementById('demo-rent-end');
        
        function updateTotal() {
            const start = new Date(startInput.value);
            const end = new Date(endInput.value);
            const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
            const priceNum = demoAsset.priceNum || parseInt(demoAsset.price.replace(/[^0-9]/g, ''));
            const total = days * priceNum;
            document.getElementById('demo-rent-total').textContent = `NPR ${total.toLocaleString()}`;
            document.getElementById('demo-rent-days').textContent = days;
        }

        startInput.addEventListener('change', updateTotal);
        endInput.addEventListener('change', updateTotal);
        updateTotal();

        // Submit handler
        window._demoSubmitRent = function() {
            const name = document.getElementById('demo-rent-name').value.trim();
            const phone = document.getElementById('demo-rent-phone').value.trim();
            
            if (!name) {
                shakeField('demo-rent-name');
                return;
            }
            if (!phone) {
                shakeField('demo-rent-phone');
                return;
            }

            const start = new Date(startInput.value);
            const end = new Date(endInput.value);
            const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
            const priceNum = demoAsset.priceNum || parseInt(demoAsset.price.replace(/[^0-9]/g, ''));
            const total = days * priceNum;

            // Show processing animation
            const btn = document.getElementById('demo-rent-submit');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';

            setTimeout(() => {
                // Save to localStorage for buyer dashboard
                const request = {
                    id: 'req-demo-' + Date.now(),
                    assetId: demoAsset.id || 'asset-1',
                    dealType: document.getElementById('demo-rent-type').value === 'barter' ? 'Barter' : 'Rent',
                    status: 'Confirmed',
                    timestamp: Date.now(),
                    renterName: name,
                    renterPhone: phone,
                    days: days,
                    total: total
                };
                const requests = JSON.parse(localStorage.getItem('bastubazar_requests') || '[]');
                requests.unshift(request);
                localStorage.setItem('bastubazar_requests', JSON.stringify(requests));

                showRentSuccess(demoAsset, name, days, total);
            }, 1500);
        };
    }

    function showRentSuccess(asset, name, days, total) {
        const modal = document.getElementById('demo-modal');
        modal.innerHTML = `
            <div class="demo-modal-header">
                <h3><i class="bi bi-check-circle-fill text-success"></i> Booking Confirmed!</h3>
                <button class="demo-modal-close" onclick="document.getElementById('demo-modal-overlay').classList.remove('show')">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="demo-modal-body">
                <div class="demo-success">
                    <div class="demo-success-icon">
                        <i class="bi bi-check-lg"></i>
                    </div>
                    <h4>Rental Request Confirmed! 🎉</h4>
                    <p>Your request to rent <strong>${asset.title}</strong> has been sent to the owner. They'll contact you within 24 hours.</p>
                    
                    <div class="demo-receipt">
                        <div class="demo-receipt-row">
                            <span>Item</span>
                            <span>${asset.title}</span>
                        </div>
                        <div class="demo-receipt-row">
                            <span>Renter</span>
                            <span>${name}</span>
                        </div>
                        <div class="demo-receipt-row">
                            <span>Duration</span>
                            <span>${days} day${days > 1 ? 's' : ''}</span>
                        </div>
                        <div class="demo-receipt-row">
                            <span>Rate</span>
                            <span>${asset.price} / ${asset.period}</span>
                        </div>
                        <div class="demo-receipt-row">
                            <span>Owner</span>
                            <span>${asset.user ? asset.user.name : 'Ram Bahadur'}</span>
                        </div>
                        <div class="demo-receipt-row">
                            <span>Booking ID</span>
                            <span>#BB${Date.now().toString().slice(-6)}</span>
                        </div>
                        <div class="demo-receipt-row total">
                            <span>Total Amount</span>
                            <span>NPR ${total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div class="demo-success-actions">
                        <a href="index.html" class="btn btn-outline-primary">
                            <i class="bi bi-arrow-left me-1"></i> Browse More
                        </a>
                        <button class="btn btn-primary" onclick="document.getElementById('demo-modal-overlay').classList.remove('show')">
                            <i class="bi bi-check-lg me-1"></i> Done
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ========== PUT ON RENT DEMO ==========

    function showListDemo() {
        const modal = document.getElementById('demo-modal');
        modal.innerHTML = `
            <div class="demo-modal-header">
                <h3><i class="bi bi-plus-circle-fill"></i> Put an Item on Rent</h3>
                <button class="demo-modal-close" onclick="document.getElementById('demo-modal-overlay').classList.remove('show')">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="demo-modal-body">
                <div style="background: linear-gradient(135deg, #ede9fe, #e0e7ff); border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.75rem;">
                    <i class="bi bi-lightbulb-fill" style="font-size: 1.5rem; color: #7c3aed;"></i>
                    <div style="font-size: 0.85rem; color: #4c1d95;">
                        <strong>Quick listing!</strong> Fill in the details below and your item will appear on BastuBazar for others to rent.
                    </div>
                </div>

                <div class="demo-form-group">
                    <label><i class="bi bi-card-heading me-1"></i>Item Title</label>
                    <input type="text" id="demo-list-title" placeholder="e.g. Honda Generator 3KVA">
                </div>

                <div class="demo-form-row">
                    <div class="demo-form-group">
                        <label><i class="bi bi-grid me-1"></i>Category</label>
                        <select id="demo-list-category">
                            <option value="" disabled selected>Select...</option>
                            <option value="Agriculture">Agriculture</option>
                            <option value="Real Estate">Real Estate</option>
                            <option value="Household">Household</option>
                            <option value="Construction">Construction</option>
                            <option value="Vehicles">Vehicles</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Industrial">Industrial</option>
                            <option value="Event Goods">Event Goods</option>
                        </select>
                    </div>
                    <div class="demo-form-group">
                        <label><i class="bi bi-geo-alt me-1"></i>Location</label>
                        <select id="demo-list-location">
                            <option value="" disabled selected>Select...</option>
                            <option value="Kathmandu, Nepal">Kathmandu</option>
                            <option value="Pokhara, Nepal">Pokhara</option>
                            <option value="Chitwan, Nepal">Chitwan</option>
                            <option value="Biratnagar, Nepal">Biratnagar</option>
                            <option value="Lalitpur, Nepal">Lalitpur</option>
                            <option value="Butwal, Nepal">Butwal</option>
                            <option value="Bharatpur, Nepal">Bharatpur</option>
                            <option value="Dharan, Nepal">Dharan</option>
                        </select>
                    </div>
                </div>

                <div class="demo-form-group">
                    <label><i class="bi bi-text-paragraph me-1"></i>Description</label>
                    <textarea id="demo-list-desc" rows="2" placeholder="Describe your item, condition, and any accessories..."></textarea>
                </div>

                <div class="demo-form-row">
                    <div class="demo-form-group">
                        <label><i class="bi bi-currency-exchange me-1"></i>Rental Price (NPR)</label>
                        <input type="number" id="demo-list-price" placeholder="e.g. 2000">
                    </div>
                    <div class="demo-form-group">
                        <label><i class="bi bi-clock me-1"></i>Per</label>
                        <select id="demo-list-period">
                            <option value="day">Per Day</option>
                            <option value="month">Per Month</option>
                            <option value="event">Per Event</option>
                        </select>
                    </div>
                </div>

                <div class="demo-form-group">
                    <label><i class="bi bi-shield-check me-1"></i>Condition</label>
                    <select id="demo-list-condition">
                        <option value="Excellent">Excellent</option>
                        <option value="Like New">Like New</option>
                        <option value="Good" selected>Good</option>
                        <option value="Fair">Fair</option>
                    </select>
                </div>

                <button class="demo-submit-btn" id="demo-list-submit" onclick="window._demoSubmitList()">
                    <i class="bi bi-send-fill me-2"></i>List Item on BastuBazar
                </button>
            </div>
        `;

        openModal();

        // Submit handler
        window._demoSubmitList = function() {
            const title = document.getElementById('demo-list-title').value.trim();
            const category = document.getElementById('demo-list-category').value;
            const location = document.getElementById('demo-list-location').value;
            const description = document.getElementById('demo-list-desc').value.trim();
            const price = document.getElementById('demo-list-price').value;
            const period = document.getElementById('demo-list-period').value;
            const condition = document.getElementById('demo-list-condition').value;

            if (!title) { shakeField('demo-list-title'); return; }
            if (!category) { shakeField('demo-list-category'); return; }
            if (!location) { shakeField('demo-list-location'); return; }
            if (!price) { shakeField('demo-list-price'); return; }

            // Show processing
            const btn = document.getElementById('demo-list-submit');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Listing your item...';

            const categoryEmojis = {
                'Agriculture': '🚜', 'Real Estate': '🏡', 'Household': '🧺',
                'Construction': '🏗️', 'Vehicles': '🛵', 'Electronics': '📷',
                'Industrial': '⚡', 'Event Goods': '🎪'
            };

            const categoryColors = {
                'Agriculture': '#D1FAE5', 'Real Estate': '#CFFAFE', 'Household': '#E0E7FF',
                'Construction': '#FEF3C7', 'Vehicles': '#DBEAFE', 'Electronics': '#EDE9FE',
                'Industrial': '#FEF9C3', 'Event Goods': '#FCE7F3'
            };

            setTimeout(() => {
                // Create the asset and add to localStorage
                const newAsset = {
                    id: 'custom-demo-' + Date.now(),
                    title: title,
                    category: category,
                    location: location,
                    tags: ['rent'],
                    price: `NPR ${Number(price).toLocaleString()}`,
                    priceNum: Number(price),
                    period: period,
                    emoji: categoryEmojis[category] || '📦',
                    color: categoryColors[category] || '#E0E7FF',
                    imageSrc: null,
                    user: { name: 'Demo User', initials: 'DU', phone: '9779800000000', rating: 4.5, listings: 1, joined: 'Jun 2026' },
                    wishlisted: false,
                    description: description || 'Available for rent. Contact for more details.',
                    condition: condition,
                    postedDate: 'Just now',
                    views: 0
                };

                // Save to localStorage
                const custom = JSON.parse(localStorage.getItem('bastubazar_custom_assets') || '[]');
                custom.unshift(newAsset);
                localStorage.setItem('bastubazar_custom_assets', JSON.stringify(custom));

                showListSuccess(newAsset);
            }, 1800);
        };
    }

    function showListSuccess(asset) {
        const modal = document.getElementById('demo-modal');
        modal.innerHTML = `
            <div class="demo-modal-header">
                <h3><i class="bi bi-check-circle-fill text-success"></i> Item Listed!</h3>
                <button class="demo-modal-close" onclick="document.getElementById('demo-modal-overlay').classList.remove('show')">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="demo-modal-body">
                <div class="demo-success">
                    <div class="demo-success-icon">
                        <i class="bi bi-check-lg"></i>
                    </div>
                    <h4>Your Item is Now Live! 🎉</h4>
                    <p>Your listing "<strong>${asset.title}</strong>" is now visible to all users on BastuBazar. You'll receive notifications when someone is interested.</p>
                    
                    <div class="demo-receipt">
                        <div class="demo-receipt-row">
                            <span>Item</span>
                            <span>${asset.title}</span>
                        </div>
                        <div class="demo-receipt-row">
                            <span>Category</span>
                            <span>${asset.category}</span>
                        </div>
                        <div class="demo-receipt-row">
                            <span>Location</span>
                            <span>${asset.location}</span>
                        </div>
                        <div class="demo-receipt-row">
                            <span>Condition</span>
                            <span>${asset.condition}</span>
                        </div>
                        <div class="demo-receipt-row">
                            <span>Listing ID</span>
                            <span>#${asset.id.slice(-8).toUpperCase()}</span>
                        </div>
                        <div class="demo-receipt-row total">
                            <span>Rental Rate</span>
                            <span>${asset.price} / ${asset.period}</span>
                        </div>
                    </div>

                    <div class="demo-success-actions">
                        <button class="btn btn-outline-primary" onclick="window.location.href='detail.html?id=${asset.id}'">
                            <i class="bi bi-eye me-1"></i> View Listing
                        </button>
                        <button class="btn btn-primary" onclick="window.location.reload()">
                            <i class="bi bi-house me-1"></i> Go to Homepage
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ========== HELPERS ==========

    function openModal() {
        const overlay = document.getElementById('demo-modal-overlay');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const overlay = document.getElementById('demo-modal-overlay');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    function getTodayStr() {
        return new Date().toISOString().split('T')[0];
    }

    function getNextDayStr(days) {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
    }

    function shakeField(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.borderColor = '#ef4444';
        el.style.animation = 'shake 0.4s ease';
        el.focus();
        setTimeout(() => {
            el.style.borderColor = '';
            el.style.animation = '';
        }, 600);
    }

    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            75% { transform: translateX(6px); }
        }
    `;
    document.head.appendChild(style);

})();
