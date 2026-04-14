/* ═══════════════════════════════════════════════════════════════════════════
   PRODUCT.JS — Product detail page logic
   ═══════════════════════════════════════════════════════════════════════════ */

let currentProduct = null;
let selectedSize = null;
let quantity = 1;

document.addEventListener('DOMContentLoaded', () => {
    loadProduct();
    setupQuantity();
    setupAddToCart();
});

// ── Load Product from URL params ────────────────────────────────────────
function loadProduct() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    currentProduct = PRODUCTS.find(p => p.id === productId);

    if (!currentProduct) {
        // Default to first product
        currentProduct = PRODUCTS[0];
    }

    renderProductDetail();
}

// ── Render Product Detail ───────────────────────────────────────────────
function renderProductDetail() {
    const p = currentProduct;

    // Update page title
    document.title = `${p.name} | Lay's Premium`;

    // Breadcrumb
    const breadcrumb = document.getElementById('pdBreadcrumbName');
    if (breadcrumb) breadcrumb.textContent = p.name;

    // Image
    const img = document.getElementById('pdImage');
    if (img) {
        img.src = getProductSVG(p);
        img.alt = `Lay's ${p.name}`;
    }

    // Glow
    const glow = document.getElementById('pdGlow');
    if (glow) glow.style.background = p.colorHex;

    // Image wrapper
    const wrapper = document.getElementById('pdImageWrapper');
    if (wrapper) wrapper.style.setProperty('--product-color', p.colorHex);

    // Badge
    const badge = document.getElementById('pdBadge');
    if (badge) {
        badge.textContent = p.badge;
        badge.style.background = p.colorHex + '20';
        badge.style.color = p.colorHex;
    }

    // Name & desc
    const name = document.getElementById('pdName');
    if (name) name.textContent = p.name;

    const desc = document.getElementById('pdDesc');
    if (desc) desc.textContent = p.desc;

    // Sizes
    renderSizes();

    // Select default size (Medium)
    selectSize(1);
}

// ── Render Size Buttons ─────────────────────────────────────────────────
function renderSizes() {
    const container = document.getElementById('pdSizes');
    if (!container) return;

    container.innerHTML = '';

    currentProduct.sizes.forEach((size, index) => {
        const btn = document.createElement('button');
        btn.className = 'size-btn';
        btn.dataset.index = index;
        btn.innerHTML = `
            <span class="size-label">${size.label}</span>
            <span class="size-weight">${size.weight}</span>
            <span class="size-price">₹${size.price}</span>
        `;
        btn.addEventListener('click', () => selectSize(index));
        container.appendChild(btn);
    });
}

function selectSize(index) {
    selectedSize = currentProduct.sizes[index];
    quantity = 1;
    updatePrice();

    // Update active state
    const btns = document.querySelectorAll('.size-btn');
    btns.forEach(b => b.classList.remove('active'));
    if (btns[index]) btns[index].classList.add('active');

    // Reset qty display
    const qtyVal = document.getElementById('qtyVal');
    if (qtyVal) qtyVal.textContent = '1';
}

// ── Quantity Controls ───────────────────────────────────────────────────
function setupQuantity() {
    const minus = document.getElementById('qtyMinus');
    const plus = document.getElementById('qtyPlus');

    if (minus) {
        minus.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                updateQtyDisplay();
            }
        });
    }

    if (plus) {
        plus.addEventListener('click', () => {
            if (quantity < 20) {
                quantity++;
                updateQtyDisplay();
            }
        });
    }
}

function updateQtyDisplay() {
    const qtyVal = document.getElementById('qtyVal');
    if (qtyVal) qtyVal.textContent = quantity;
    updatePrice();
}

function updatePrice() {
    const priceEl = document.getElementById('pdPrice');
    if (priceEl && selectedSize) {
        priceEl.textContent = `₹${selectedSize.price * quantity}`;
    }
}

// ── Add to Cart ─────────────────────────────────────────────────────────
function setupAddToCart() {
    const btn = document.getElementById('pdAddBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        if (!currentProduct || !selectedSize) return;
        addToCart(currentProduct.id, selectedSize.label, quantity);

        // Button animation
        btn.classList.add('added');
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Added!</span>
        `;
        setTimeout(() => {
            btn.classList.remove('added');
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span>Add to Bag</span>
            `;
        }, 1500);
    });
}
