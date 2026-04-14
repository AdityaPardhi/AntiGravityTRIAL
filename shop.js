/* ═══════════════════════════════════════════════════════════════════════════
   SHOP.JS — Shop page logic (filter, search, sort, product grid)
   ═══════════════════════════════════════════════════════════════════════════ */

let allShopProducts = [];
let activeFilter = 'all';
let searchQuery = '';
let sortBy = 'featured';

document.addEventListener('DOMContentLoaded', () => {
    buildShopProducts();
    renderShopGrid();
    setupFilters();
    setupSearch();
    setupSort();
});

// ── Build all products with sizes as separate items ──────────────────────
function buildShopProducts() {
    allShopProducts = [];
    PRODUCTS.forEach(product => {
        product.sizes.forEach(size => {
            allShopProducts.push({
                ...product,
                sizeLabel: size.label,
                weight: size.weight,
                price: size.price,
                uniqueId: `${product.id}_${size.label}`
            });
        });
    });
}

// ── Filter + Search + Sort Logic ─────────────────────────────────────────
function getFilteredProducts() {
    let filtered = [...allShopProducts];

    // Filter by flavor
    if (activeFilter !== 'all') {
        filtered = filtered.filter(p => p.id === activeFilter);
    }

    // Search
    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.sizeLabel.toLowerCase().includes(q) ||
            p.tagline.toLowerCase().includes(q)
        );
    }

    // Sort
    switch (sortBy) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default: // featured — keep original order
            break;
    }

    return filtered;
}

// ── Render Shop Grid ────────────────────────────────────────────────────
function renderShopGrid() {
    const grid = document.getElementById('shopProductGrid');
    if (!grid) return;

    const products = getFilteredProducts();
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <p>No products found</p>
                <button class="btn-outline" onclick="clearFilters()">Clear Filters</button>
            </div>`;
        return;
    }

    products.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'shop-card fade-in-up';
        card.style.setProperty('--product-color', product.colorHex);
        card.style.animationDelay = `${index * 0.05}s`;

        const imgSrc = getProductSVG(product);

        card.innerHTML = `
            <div class="shop-card-img">
                <div class="product-img-glow"></div>
                <img src="${imgSrc}" alt="Lay's ${product.name} ${product.sizeLabel}">
                <span class="shop-badge" style="background:${product.colorHex}">${product.badge}</span>
            </div>
            <div class="shop-card-body">
                <h3>${product.name}</h3>
                <span class="shop-card-size">${product.sizeLabel} · ${product.weight}</span>
                <p>${product.tagline}</p>
                <div class="shop-card-footer">
                    <span class="price">₹${product.price}</span>
                    <button class="btn-gradient btn-sm" onclick="event.stopPropagation(); addToCart('${product.id}','${product.sizeLabel}')">
                        Add to Bag
                    </button>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `product.html?id=${product.id}`;
        });
        card.style.cursor = 'pointer';

        grid.appendChild(card);
    });
}

// ── Filter Chips ────────────────────────────────────────────────────────
function setupFilters() {
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeFilter = chip.dataset.filter;
            renderShopGrid();
        });
    });
}

// ── Search ──────────────────────────────────────────────────────────────
function setupSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    let debounceTimer;
    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            searchQuery = input.value;
            renderShopGrid();
        }, 250);
    });
}

// ── Sort ────────────────────────────────────────────────────────────────
function setupSort() {
    const select = document.getElementById('sortSelect');
    if (!select) return;

    select.addEventListener('change', () => {
        sortBy = select.value;
        renderShopGrid();
    });
}

// ── Clear filters (used by no-results button) ───────────────────────────
function clearFilters() {
    activeFilter = 'all';
    searchQuery = '';
    sortBy = 'featured';

    const input = document.getElementById('searchInput');
    if (input) input.value = '';

    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(c => c.classList.remove('active'));
    if (chips[0]) chips[0].classList.add('active');

    const select = document.getElementById('sortSelect');
    if (select) select.value = 'featured';

    renderShopGrid();
}
