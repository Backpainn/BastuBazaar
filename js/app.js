/* ============================================
   BastuBazaar — Home Page Logic
   Requires: data.js loaded before this file
   ============================================ */

// ========== DOM READY ==========

// Global combined array (base assets + custom ones)
let allAssets = [];

document.addEventListener('DOMContentLoaded', () => {
    // Merge custom assets from localStorage
    const custom = JSON.parse(localStorage.getItem('bastubazar_custom_assets') || '[]');
    allAssets = [...custom, ...assets]; // Custom first so they appear at top

    renderCategories();
    renderAssets('all');
    
    // Bind enhanced search functionality
    initSearchAutocomplete();

    initFilterBar();
    initNavbarScroll();
    initScrollReveal();

    // Wire up Load More button
    const loadMoreBtn = document.getElementById('btn-load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Loading...';
            setTimeout(() => {
                loadMoreBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i> All listings loaded';
                loadMoreBtn.disabled = true;
                setTimeout(() => {
                    loadMoreBtn.style.display = 'none';
                }, 2000);
            }, 800);
        });
    }
});

// ========== ENHANCED SEARCH WITH AUTOCOMPLETE ==========

function initSearchAutocomplete() {
    const searchInput = document.getElementById('hero-search-input');
    const searchBtn = document.getElementById('hero-search-btn');
    if (!searchInput || !searchBtn) return;

    // Create autocomplete dropdown
    const searchBox = searchInput.closest('.hero-search-box');
    let dropdown = document.createElement('div');
    dropdown.className = 'search-autocomplete-dropdown';
    dropdown.id = 'search-autocomplete';
    searchBox.style.position = 'relative';
    searchBox.appendChild(dropdown);

    let debounceTimer = null;
    let selectedIndex = -1;

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = searchInput.value.toLowerCase().trim();
            if (query.length < 1) {
                hideDropdown();
                return;
            }
            showSuggestions(query);
        }, 150);
    });

    searchInput.addEventListener('keydown', (e) => {
        const items = dropdown.querySelectorAll('.search-suggestion-item');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
            updateSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, -1);
            updateSelection(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && items[selectedIndex]) {
                items[selectedIndex].click();
            } else {
                performSearch(searchInput.value);
                hideDropdown();
            }
        } else if (e.key === 'Escape') {
            hideDropdown();
        }
    });

    searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
        hideDropdown();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchBox.contains(e.target)) {
            hideDropdown();
        }
    });

    function showSuggestions(query) {
        selectedIndex = -1;
        
        // Search through all assets
        const results = allAssets.filter(a =>
            a.title.toLowerCase().includes(query) ||
            a.category.toLowerCase().includes(query) ||
            a.location.toLowerCase().includes(query) ||
            (a.description && a.description.toLowerCase().includes(query))
        ).slice(0, 6); // Limit to 6 suggestions

        // Also get matching categories
        const matchingCats = categories.filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.desc.toLowerCase().includes(query)
        );

        if (results.length === 0 && matchingCats.length === 0) {
            dropdown.innerHTML = `
                <div class="search-no-results">
                    <i class="bi bi-search"></i>
                    <span>No results for "<strong>${query}</strong>"</span>
                </div>
            `;
            dropdown.classList.add('show');
            return;
        }

        let html = '';

        // Category suggestions
        if (matchingCats.length > 0) {
            html += `<div class="search-section-label">Categories</div>`;
            matchingCats.forEach(cat => {
                html += `
                    <div class="search-suggestion-item search-category-item" data-type="category" data-value="${cat.name}">
                        <div class="search-suggestion-icon">
                            <img src="${cat.image}" alt="${cat.name}" style="width:32px;height:32px;border-radius:6px;object-fit:cover;">
                        </div>
                        <div class="search-suggestion-info">
                            <div class="search-suggestion-title">${highlightMatch(cat.name, query)}</div>
                            <div class="search-suggestion-sub">${cat.desc}</div>
                        </div>
                        <i class="bi bi-arrow-right text-muted"></i>
                    </div>
                `;
            });
        }

        // Asset suggestions
        if (results.length > 0) {
            html += `<div class="search-section-label">Listings</div>`;
            results.forEach(asset => {
                html += `
                    <div class="search-suggestion-item" data-type="asset" data-id="${asset.id}">
                        <div class="search-suggestion-icon">
                            ${asset.imageSrc ?
                                `<img src="${asset.imageSrc}" alt="${asset.title}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;">` :
                                `<div style="width:40px;height:40px;border-radius:8px;background:${asset.color || '#E0E7FF'};display:flex;align-items:center;justify-content:center;font-size:1.2rem;">${asset.emoji || '📦'}</div>`
                            }
                        </div>
                        <div class="search-suggestion-info">
                            <div class="search-suggestion-title">${highlightMatch(asset.title, query)}</div>
                            <div class="search-suggestion-sub">
                                <span>${asset.category}</span>
                                <span class="mx-1">·</span>
                                <span>${asset.price}/${asset.period}</span>
                                <span class="mx-1">·</span>
                                <span>${asset.location}</span>
                            </div>
                        </div>
                        <i class="bi bi-arrow-right text-muted"></i>
                    </div>
                `;
            });
        }

        // "View all results" button
        const totalMatches = allAssets.filter(a =>
            a.title.toLowerCase().includes(query) ||
            a.category.toLowerCase().includes(query) ||
            a.location.toLowerCase().includes(query) ||
            (a.description && a.description.toLowerCase().includes(query))
        ).length;
        
        if (totalMatches > 0) {
            html += `
                <div class="search-suggestion-item search-view-all" data-type="viewall" data-query="${query}">
                    <i class="bi bi-search me-2"></i>
                    View all ${totalMatches} result${totalMatches > 1 ? 's' : ''} for "<strong>${query}</strong>"
                </div>
            `;
        }

        dropdown.innerHTML = html;
        dropdown.classList.add('show');

        // Bind click handlers
        dropdown.querySelectorAll('.search-suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.dataset.type;
                if (type === 'asset') {
                    // Navigate directly to the asset
                    window.location.href = `detail.html?id=${item.dataset.id}`;
                } else if (type === 'category') {
                    searchInput.value = item.dataset.value;
                    performSearch(item.dataset.value);
                    hideDropdown();
                } else if (type === 'viewall') {
                    performSearch(item.dataset.query);
                    hideDropdown();
                }
            });
        });
    }

    function hideDropdown() {
        dropdown.classList.remove('show');
        dropdown.innerHTML = '';
        selectedIndex = -1;
    }

    function updateSelection(items) {
        items.forEach((item, i) => {
            item.classList.toggle('highlighted', i === selectedIndex);
        });
    }

    function highlightMatch(text, query) {
        const idx = text.toLowerCase().indexOf(query.toLowerCase());
        if (idx === -1) return text;
        return text.substring(0, idx) + '<mark>' + text.substring(idx, idx + query.length) + '</mark>' + text.substring(idx + query.length);
    }
}

// ========== RENDER CATEGORIES ==========

function renderCategories() {
    const grid = document.getElementById('category-grid');
    if (!grid) return;

    grid.innerHTML = categories.map((cat, index) => `
        <div class="col-6 col-md-3 reveal" style="transition-delay: ${index * 0.07}s">
            <div class="category-card" id="${cat.id}" role="button" tabindex="0">
                <div class="category-img-wrapper">
                    <img src="${cat.image}" alt="${cat.name}" class="category-img" loading="lazy">
                </div>
                <div class="category-name">${cat.name}</div>
                <div class="category-desc">${cat.desc}</div>
            </div>
        </div>
    `).join('');

    // Add click handler
    grid.querySelectorAll('.category-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            const catName = categories[index].name;
            performSearch(catName);
            document.getElementById('featured-section').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ========== RENDER ASSETS ==========

function renderAssets(filter) {
    const grid = document.getElementById('asset-grid');
    if (!grid) return;

    let displayAssets = filter === 'all'
        ? allAssets
        : allAssets.filter(a => a.tags.includes(filter));

    const savedIds = JSON.parse(localStorage.getItem('bastubazar_wishlist') || '[]');

    grid.innerHTML = displayAssets.map(asset => {
        const isWishlisted = savedIds.includes(asset.id);
        return `
        <div class="col-sm-6 col-md-4 col-lg-3 reveal">
            <div class="asset-card" role="button" tabindex="0" onclick="goToDetail('${asset.id}')">
                <div class="asset-card-img">
                    ${asset.imageSrc ? 
                        `<img src="${asset.imageSrc}" style="width:100%; height:100%; object-fit:cover;">` : 
                        `<div class="img-placeholder" style="background: linear-gradient(135deg, ${asset.color || '#D1FAE5'}, ${adjustColor(asset.color || '#D1FAE5', -10)})">
                            <span>${asset.emoji || '📦'}</span>
                        </div>`
                    }
                    <button class="asset-card-wishlist ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlistHome(this, '${asset.id}')">
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
                    <div class="asset-card-tags">
                        ${asset.tags.map(tag => `<span class="tag tag-${tag}">${capitalize(tag)}</span>`).join('')}
                    </div>
                    <div class="asset-card-footer">
                        <div class="asset-price">
                            ${asset.price} <span>/ ${asset.period}</span>
                        </div>
                        <div class="asset-card-user">
                            <span class="user-avatar">${asset.user.initials}</span>
                            ${asset.user.name.split(' ')[0]}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `}).join('');

    // Re-trigger scroll reveal
    initScrollReveal();
}

// ========== NAVIGATE TO DETAIL ==========

function goToDetail(assetId) {
    window.location.href = `detail.html?id=${assetId}`;
}

// ========== FILTER BAR ==========

function initFilterBar() {
    const pills = document.querySelectorAll('.filter-pill');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const filter = pill.getAttribute('data-filter');
            renderAssets(filter);
        });
    });
}

// ========== NAVBAR SCROLL ==========

function initNavbarScroll() {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

// ========== FILTERS & SEARCH ==========

function performSearch(query) {
    query = query.toLowerCase().trim();
    if (!query) {
        renderAssets('all');
        return;
    }
    
    // Switch filter pills to 'all' visually
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    document.getElementById('filter-all').classList.add('active');

    const grid = document.getElementById('asset-grid');
    if (!grid) return;

    const searchResults = allAssets.filter(a => 
        a.title.toLowerCase().includes(query) || 
        a.category.toLowerCase().includes(query) ||
        a.location.toLowerCase().includes(query) ||
        (a.description && a.description.toLowerCase().includes(query))
    );



    const savedIds = JSON.parse(localStorage.getItem('bastubazar_wishlist') || '[]');

    if (searchResults.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center text-muted py-5"><i class="bi bi-search fs-1 mb-3 d-block"></i>No listings found matching your search.</div>';
        return;
    }

    // Show search results count banner
    grid.innerHTML = `
        <div class="col-12 mb-2">
            <div class="search-results-banner">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-search"></i>
                    <span>Showing <strong>${searchResults.length}</strong> result${searchResults.length > 1 ? 's' : ''} for "<strong>${query}</strong>"</span>
                </div>
                <button class="btn btn-sm btn-outline-secondary rounded-pill" onclick="clearSearch()">
                    <i class="bi bi-x-lg me-1"></i>Clear
                </button>
            </div>
        </div>
    ` + searchResults.map(asset => {
        const isWishlisted = savedIds.includes(asset.id);
        return `
        <div class="col-sm-6 col-md-4 col-lg-3 reveal">
            <div class="asset-card" role="button" tabindex="0" onclick="goToDetail('${asset.id}')">
                <div class="asset-card-img">
                    ${asset.imageSrc ? 
                        `<img src="${asset.imageSrc}" style="width:100%; height:100%; object-fit:cover;">` : 
                        `<div class="img-placeholder" style="background: linear-gradient(135deg, ${asset.color || '#D1FAE5'}, ${adjustColor(asset.color || '#D1FAE5', -10)})">
                            <span>${asset.emoji || '📦'}</span>
                        </div>`
                    }
                    <button class="asset-card-wishlist ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlistHome(this, '${asset.id}')">
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
                    <div class="asset-card-tags">
                        ${asset.tags.map(tag => `<span class="tag tag-${tag}">${capitalize(tag)}</span>`).join('')}
                    </div>
                    <div class="asset-card-footer">
                        <div class="asset-price">
                            ${asset.price} <span>/ ${asset.period}</span>
                        </div>
                        <div class="asset-card-user">
                            <span class="user-avatar">${asset.user.initials}</span>
                            ${asset.user.name.split(' ')[0]}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `}).join('');
    
    // Scroll down to results
    document.getElementById('featured-section').scrollIntoView({ behavior: 'smooth' });
    initScrollReveal();
}

function clearSearch() {
    const searchInput = document.getElementById('hero-search-input');
    if (searchInput) searchInput.value = '';
    renderAssets('all');
    document.getElementById('featured-section').scrollIntoView({ behavior: 'smooth' });
}

// ========== SCROLL REVEAL ==========

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

// ========== HELPERS ==========

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
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

function toggleWishlistHome(btn, assetId) {
    btn.classList.toggle('active');
    let savedIds = JSON.parse(localStorage.getItem('bastubazar_wishlist') || '[]');
    if (savedIds.includes(assetId)) {
        savedIds = savedIds.filter(id => id !== assetId);
    } else {
        savedIds.push(assetId);
    }
    localStorage.setItem('bastubazar_wishlist', JSON.stringify(savedIds));
}
