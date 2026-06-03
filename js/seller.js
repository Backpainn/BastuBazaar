/* ============================================
   BastuBazar — Seller Dashboard Logic
   ============================================ */

let sellerListings = [];

document.addEventListener('DOMContentLoaded', () => {
    requireAuth('seller');
    const user = getCurrentUser();
    
    document.getElementById('seller-name').textContent = user.name;
    
    // Populate Profile Card
    const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    document.getElementById('seller-initials').textContent = initials || 'S';
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-location').textContent = 'Kathmandu, Nepal';
    document.getElementById('profile-rating').textContent = '4.9';
    document.getElementById('profile-phone').textContent = '+977 9812345678';
    document.getElementById('profile-joined').textContent = 'Jan 2026';
    
    // For demo purposes, we will assign random existing assets to this seller,
    // plus any dynamically added ones from localStorage.
    initSellerData();
    renderSellerListings();
    initUploadForm();
});

function initSellerData() {
    // Load custom assets from local storage
    const custom = JSON.parse(localStorage.getItem('bastubazar_custom_assets') || '[]');
    
    // Assign custom assets to the seller for demo
    sellerListings = [...custom];
}

function renderSellerListings() {
    const grid = document.getElementById('seller-listings-grid');
    if (!grid) return;
    
    if (sellerListings.length === 0) {
        grid.innerHTML = '<div class="col-12 text-muted">You have no active listings.</div>';
        return;
    }

    grid.innerHTML = sellerListings.map(asset => `
        <div class="col-sm-6">
            <div class="asset-card" role="button" tabindex="0" onclick="window.location.href='detail.html?id=${asset.id}'">
                <div class="asset-card-img">
                    ${asset.imageSrc ? 
                        `<img src="${asset.imageSrc}" style="width:100%; height:100%; object-fit:cover;">` : 
                        `<div class="img-placeholder" style="background: linear-gradient(135deg, ${asset.color || '#D1FAE5'}, ${adjustColor(asset.color || '#D1FAE5', -10)})">
                            <span>${asset.emoji || '📦'}</span>
                        </div>`
                    }
                    <span class="asset-card-category-badge">${asset.category}</span>
                </div>
                <div class="asset-card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="asset-card-title">${asset.title}</div>
                        ${asset.id.startsWith('custom-') ? `<button class="btn btn-sm btn-link text-danger p-0" onclick="event.stopPropagation(); deleteSellerListing('${asset.id}');"><i class="bi bi-trash"></i></button>` : ''}
                    </div>
                    <div class="asset-card-location">
                        <i class="bi bi-geo-alt-fill"></i> ${asset.location}
                    </div>
                    <div class="mb-2 text-warning d-flex align-items-center gap-1" style="font-size: 0.8rem;">
                        <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                        <span class="text-muted ms-1 fw-medium">(5)</span>
                    </div>
                    <div class="asset-card-footer mt-auto pt-3 border-top">
                        <div class="asset-price">
                            ${asset.price} <span>/ ${asset.period}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function initUploadForm() {
    const uploadBox = document.getElementById('img-upload-box');
    const fileInput = document.getElementById('asset-img-input');
    const preview = document.getElementById('img-preview');
    let currentImageSrc = null;

    // Trigger file input click
    uploadBox.addEventListener('click', () => fileInput.click());

    // Handle file selection (Mock image upload via FileReader)
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                currentImageSrc = e.target.result;
                uploadBox.style.display = 'none';
                preview.src = currentImageSrc;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    document.getElementById('add-asset-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('asset-title').value;
        const description = document.getElementById('asset-description').value;
        const category = document.getElementById('asset-category').value;
        const location = document.getElementById('asset-location').value;
        const condition = document.getElementById('asset-condition').value;
        const priceNum = document.getElementById('asset-price').value;
        const period = document.getElementById('asset-period').value;
        
        // Get checked tags
        const tags = [];
        if (document.getElementById('tag-rent').checked) tags.push('rent');
        if (document.getElementById('tag-sell').checked) tags.push('sell');
        if (document.getElementById('tag-barter').checked) tags.push('barter');

        if (tags.length === 0) {
            alert('Please select at least one deal type.');
            return;
        }

        const newAsset = {
            id: 'custom-' + Date.now(),
            title: title,
            category: category,
            location: location,
            tags: tags,
            price: `NPR ${Number(priceNum).toLocaleString()}`,
            priceNum: Number(priceNum),
            sellPrice: tags.includes('sell') ? `NPR ${Number(priceNum * (period === 'month' ? 12 : (period === 'day' ? 30 : 1))).toLocaleString()}` : null,
            period: period,
            emoji: '📦', // Default emoji if no image
            color: '#E0E7FF',
            imageSrc: currentImageSrc,
            user: getCurrentUser(),
            wishlisted: false,
            description: description,
            condition: condition,
            postedDate: 'Just now',
            views: 0
        };

        // Save to local storage mock array
        const custom = JSON.parse(localStorage.getItem('bastubazar_custom_assets') || '[]');
        custom.push(newAsset);
        localStorage.setItem('bastubazar_custom_assets', JSON.stringify(custom));

        // Note: For a real app we'd push to main 'assets' array or DB.
        // For this hackathon, we're just rendering it directly to the seller's dashboard.
        sellerListings.unshift(newAsset);
        renderSellerListings();

        // Reset form
        e.target.reset();
        uploadBox.style.display = 'block';
        preview.style.display = 'none';
        currentImageSrc = null;

        alert('Asset listed successfully!');
    });
}

function deleteSellerListing(assetId) {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    // Remove from localStorage
    let custom = JSON.parse(localStorage.getItem('bastubazar_custom_assets') || '[]');
    custom = custom.filter(a => a.id !== assetId);
    localStorage.setItem('bastubazar_custom_assets', JSON.stringify(custom));
    
    // Remove from UI
    sellerListings = sellerListings.filter(a => a.id !== assetId);
    renderSellerListings();
}

function adjustColor(hex, amount) {
    let color = hex.replace('#', '');
    if (color.length === 3) color = color.split('').map(c => c + c).join('');
    const num = parseInt(color, 16);
    let r = Math.min(255, Math.max(0, (num >> 16) + amount));
    let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    let b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}
