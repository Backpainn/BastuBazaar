/* ============================================
   BastuBazar — Admin Dashboard Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    requireAuth('admin');
    const user = getCurrentUser();
    document.getElementById('admin-name').textContent = user.name;

    renderAdminDashboard();
});

function renderAdminDashboard() {
    const customAssets = JSON.parse(localStorage.getItem('bastubazar_custom_assets') || '[]');
    const allAssets = [...customAssets, ...assets];
    const requests = JSON.parse(localStorage.getItem('bastubazar_requests') || '[]');

    // 1. Update Metrics — Only count user-uploaded listings
    document.getElementById('metric-listings').textContent = customAssets.length;
    document.getElementById('metric-deals').textContent = requests.length;
    document.getElementById('metric-users').textContent = '0';

    // 2. Render Listings Table
    renderListingsTable(allAssets);

    // 3. Render Activity Feed
    renderActivityFeed(requests, allAssets);

    // 4. Render Users Tab (empty for now — no real backend)
    renderUsersTab();
}

// ========== LISTINGS TABLE ==========
function renderListingsTable(allAssets) {
    const tbody = document.getElementById('admin-listings-body');
    if (allAssets.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">No listings found on the platform.</td></tr>`;
        return;
    }

    tbody.innerHTML = allAssets.map(asset => {
        const isCustom = asset.id.startsWith('custom-');
        const tagBadges = asset.tags.map(t => {
            const colors = { rent: 'success', sell: 'info', barter: 'secondary' };
            return `<span class="badge bg-${colors[t] || 'dark'}-subtle text-${colors[t] || 'dark'} me-1">${t.charAt(0).toUpperCase() + t.slice(1)}</span>`;
        }).join('');

        return `
            <tr>
                <td>
                    <div class="asset-mini">
                        <div class="asset-mini-img" style="background: linear-gradient(135deg, ${asset.color}, #ffffff);">
                            ${asset.imageSrc ? `<img src="${asset.imageSrc}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" alt="${asset.title}">` : asset.emoji}
                        </div>
                        <div>
                            <div class="fw-bold">${asset.title}</div>
                            <div class="small text-muted"><i class="bi bi-geo-alt me-1"></i>${asset.location}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-light text-dark border">${asset.category}</span>
                    <div class="mt-1">${tagBadges}</div>
                </td>
                <td>
                    ${isCustom
                        ? '<span class="badge bg-warning-subtle text-warning"><i class="bi bi-clock me-1"></i>Pending Review</span>'
                        : '<span class="badge bg-success-subtle text-success"><i class="bi bi-check-circle me-1"></i>Verified</span>'
                    }
                    <div class="small text-muted mt-1">${asset.price} / ${asset.period}</div>
                </td>
                <td class="text-end">
                    <a href="detail.html?id=${asset.id}" target="_blank" class="btn btn-sm btn-outline-primary rounded-pill me-1" title="View Public Page">
                        <i class="bi bi-eye"></i>
                    </a>
                    ${isCustom ? `
                        <button class="btn btn-sm btn-outline-success rounded-pill me-1" onclick="approveListing('${asset.id}')" title="Approve Listing">
                            <i class="bi bi-check-lg"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="deleteListing('${asset.id}')" title="Delete Listing">
                            <i class="bi bi-trash"></i>
                        </button>
                    ` : `
                        <button class="btn btn-sm btn-outline-secondary rounded-pill" disabled title="System listing">
                            <i class="bi bi-lock-fill"></i>
                        </button>
                    `}
                </td>
            </tr>
        `;
    }).join('');
}

// ========== ACTIVITY FEED ==========
function renderActivityFeed(requests, allAssets) {
    const feed = document.getElementById('admin-activity-feed');
    if (requests.length === 0) {
        feed.innerHTML = `<li class="list-group-item text-center text-muted py-4"><i class="bi bi-inbox me-2"></i>No recent activity on the platform.</li>`;
        return;
    }

    feed.innerHTML = requests.slice(0, 8).map(req => {
        const asset = allAssets.find(a => a.id === req.assetId);
        const title = asset ? asset.title : 'Unknown Asset';
        const timeAgo = getTimeAgo(req.timestamp);
        const statusColor = req.status === 'Pending' ? 'warning' : (req.status === 'Approved' ? 'success' : 'secondary');
        return `
            <li class="list-group-item py-3">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <div class="fw-medium mb-1">
                            <span class="badge bg-primary-subtle text-primary me-1">${req.dealType}</span>
                            request on <strong>${title}</strong>
                        </div>
                        <div class="small text-muted"><i class="bi bi-clock me-1"></i>${timeAgo}</div>
                    </div>
                    <span class="badge bg-${statusColor}-subtle text-${statusColor}">${req.status}</span>
                </div>
            </li>
        `;
    }).join('');
}

// ========== USERS TAB ==========
function renderUsersTab() {
    const tbody = document.getElementById('admin-users-body');
    // No real backend — show empty state with helpful message
    tbody.innerHTML = `
        <tr>
            <td colspan="4" class="text-center py-5">
                <i class="bi bi-people text-muted" style="font-size: 3rem;"></i>
                <h5 class="fw-bold mt-3 mb-2">No Registered Users Yet</h5>
                <p class="text-muted mb-0">User registration data will appear here once a backend database is connected.</p>
            </td>
        </tr>
    `;
}

// ========== ADMIN ACTIONS ==========

// Delete a custom listing
window.deleteListing = function(id) {
    if (confirm('Are you sure you want to permanently delete this listing? This action cannot be undone.')) {
        let customAssets = JSON.parse(localStorage.getItem('bastubazar_custom_assets') || '[]');
        customAssets = customAssets.filter(a => a.id !== id);
        localStorage.setItem('bastubazar_custom_assets', JSON.stringify(customAssets));
        renderAdminDashboard();
    }
};

// Approve a custom listing (mock — just shows a success message)
window.approveListing = function(id) {
    alert(`Listing "${id}" has been approved and is now publicly visible.`);
};

// ========== HELPERS ==========
function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}
