/* ============================================
   BastuBazar — Buyer Dashboard Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    requireAuth('buyer');
    const user = getCurrentUser();
    
    document.getElementById('buyer-name').textContent = user.name;
    renderWishlist();
    renderRequests();
});

function renderWishlist() {
    const grid = document.getElementById('wishlist-grid');
    if (!grid) return;
    
    const savedIds = JSON.parse(localStorage.getItem('bastubazar_wishlist') || '[]');
    const custom = JSON.parse(localStorage.getItem('bastubazar_custom_assets') || '[]');
    const allAssets = [...custom, ...assets];
    
    const wishlisted = allAssets.filter(a => savedIds.includes(a.id));
    
    if (wishlisted.length === 0) {
        grid.innerHTML = '<div class="col-12 text-muted">You have no items in your wishlist. Go browse to find something!</div>';
        return;
    }

    grid.innerHTML = wishlisted.map(asset => `
        <div class="col-sm-6 col-lg-3">
            <div class="asset-card" role="button" tabindex="0" onclick="window.location.href='detail.html?id=${asset.id}'">
                <div class="asset-card-img">
                    ${asset.imageSrc ? 
                        `<img src="${asset.imageSrc}" style="width:100%; height:100%; object-fit:cover;">` : 
                        `<div class="img-placeholder" style="background: linear-gradient(135deg, ${asset.color || '#D1FAE5'}, ${adjustColor(asset.color || '#D1FAE5', -10)})">
                            <span>${asset.emoji || '📦'}</span>
                        </div>`
                    }
                    <button class="asset-card-wishlist active" onclick="event.stopPropagation(); toggleWishlist('${asset.id}'); renderWishlist();">
                        <i class="bi bi-heart-fill"></i>
                    </button>
                    <span class="asset-card-category-badge">${asset.category}</span>
                </div>
                <div class="asset-card-body">
                    <div class="asset-card-title">${asset.title}</div>
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

function renderRequests() {
    const tbody = document.getElementById('requests-table-body');
    if (!tbody) return;

    const requests = JSON.parse(localStorage.getItem('bastubazar_requests') || '[]');
    const custom = JSON.parse(localStorage.getItem('bastubazar_custom_assets') || '[]');
    const allAssets = [...custom, ...assets];

    if (requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">You have not made any deal requests yet.</td></tr>';
        return;
    }

    tbody.innerHTML = requests.map(req => {
        const asset = allAssets.find(a => a.id === req.assetId);
        if (!asset) return '';
        
        let typeBadge = '';
        if (req.dealType.includes('Rent')) typeBadge = '<span class="badge bg-success-subtle text-success">Rent</span>';
        else if (req.dealType.includes('Buy')) typeBadge = '<span class="badge bg-info-subtle text-info">Buy</span>';
        else if (req.dealType.includes('Barter')) typeBadge = '<span class="badge bg-secondary-subtle text-secondary">Barter</span>';
        else typeBadge = '<span class="badge bg-success-subtle text-success">Rent</span>';

        return `
            <tr>
                <td class="px-4 py-3">
                    <div class="d-flex align-items-center gap-3">
                        <div style="width: 40px; height: 40px; background: ${asset.color}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">${asset.emoji}</div>
                        <span class="fw-bold">${asset.title}</span>
                    </div>
                </td>
                <td>${asset.user.name}</td>
                <td>${typeBadge}</td>
                <td><span class="badge bg-warning-subtle text-warning">Pending</span></td>
                <td class="px-4 text-end">
                    <button class="btn btn-sm btn-whatsapp text-white rounded-pill me-2" onclick="window.location.href='detail.html?id=${asset.id}'"><i class="bi bi-whatsapp"></i> Chat</button>
                    <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="cancelRequest('${req.id}')"><i class="bi bi-x"></i> Cancel</button>
                </td>
            </tr>
        `;
    }).join('');
}

function cancelRequest(reqId) {
    if (!confirm('Are you sure you want to cancel this request?')) return;
    
    let requests = JSON.parse(localStorage.getItem('bastubazar_requests') || '[]');
    requests = requests.filter(r => r.id !== reqId);
    localStorage.setItem('bastubazar_requests', JSON.stringify(requests));
    
    renderRequests();
}

function toggleWishlist(assetId) {
    let savedIds = JSON.parse(localStorage.getItem('bastubazar_wishlist') || '[]');
    if (savedIds.includes(assetId)) {
        savedIds = savedIds.filter(id => id !== assetId);
    } else {
        savedIds.push(assetId);
    }
    localStorage.setItem('bastubazar_wishlist', JSON.stringify(savedIds));
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
