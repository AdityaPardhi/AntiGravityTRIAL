/* ═══════════════════════════════════════════════════════════════════════════
   SCRIPT.JS — Homepage logic (hero animations, featured product grid)
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    renderFeaturedProducts();
    animateHero();
    createParticles();
    setupScrollAnimations();

    // Newsletter form
    const form = document.getElementById('newsletterForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('🎉 Subscribed successfully!');
            form.reset();
        });
    }
});

// ── Render Featured Products (Homepage Card Grid) ─────────────────────────
function renderFeaturedProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    grid.innerHTML = '';

    PRODUCTS.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card fade-in-up';
        card.style.setProperty('--product-color', product.colorHex);
        card.style.animationDelay = `${index * 0.15}s`;

        const imgSrc = getProductSVG(product);
        const defaultSize = product.sizes[1]; // Medium

        card.innerHTML = `
            <div class="product-img-wrap">
                <div class="product-img-glow"></div>
                <img src="${imgSrc}" alt="Lay's ${product.name}">
            </div>
            <div class="product-info">
                <span class="product-badge" style="background:${product.colorHex}20;color:${product.colorHex}">${product.badge}</span>
                <h3>${product.name}</h3>
                <p>${product.tagline}</p>
                <div class="product-actions">
                    <span class="price">₹${defaultSize.price} <small class="price-size">${defaultSize.weight}</small></span>
                    <button class="add-cart-btn" aria-label="Add ${product.name} to cart" onclick="addToCart('${product.id}','${defaultSize.label}')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                </div>
            </div>
        `;

        // Click card to go to product page
        card.addEventListener('click', (e) => {
            if (e.target.closest('.add-cart-btn')) return;
            window.location.href = `product.html?id=${product.id}`;
        });
        card.style.cursor = 'pointer';

        grid.appendChild(card);
    });
}

// ── Hero Animations ─────────────────────────────────────────────────────
function animateHero() {
    const reveals = document.querySelectorAll('.reveal-text');
    reveals.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';

        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 400 + (index * 250));
    });

    // Animate hero badge, subtitle, buttons, stats
    const fadeEls = ['.hero-badge', '.hero-subtitle', '.hero-buttons', '.hero-stats'];
    fadeEls.forEach((sel, i) => {
        const el = document.querySelector(sel);
        if (!el) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 1200 + (i * 200));
    });
}

// ── Floating Particles ──────────────────────────────────────────────────
function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (5 + Math.random() * 10) + 's';
        particle.style.width = particle.style.height = (2 + Math.random() * 4) + 'px';
        container.appendChild(particle);
    }
}

// ── Scroll-triggered fade-in ────────────────────────────────────────────
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-header, .product-card, .story-content, .story-visual, .testimonial-card, .newsletter-container, .feature').forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}
