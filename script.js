// Phase 1 Data
const products = [
    {
        id: 'p1',
        name: 'Classic Salted',
        desc: 'The original, perfectly salted potato chip.',
        price: '₹50',
        colorHex: '#F1B11B', // Yellow
        packColor: 'yellow',
        img: 'classic_salted_lays.webp'
    },
    {
        id: 'p2',
        name: 'Magic Masala',
        desc: 'India\'s favorite spicy and tangy chatpata flavor.',
        price: '₹50',
        colorHex: '#005BBB', // Blue
        packColor: 'blue',
        img: 'magic_masala_lays.webp' // Will be generated
    },
    {
        id: 'p3',
        name: 'American Style Cream & Onion',
        desc: 'Smooth, creamy, and savory onion taste.',
        price: '₹50',
        colorHex: '#00A651', // Teal/Green
        packColor: 'green',
        img: 'cream_onion_lays.webp' // Will be generated
    },
    {
        id: 'p4',
        name: 'Spanish Tomato Tango',
        desc: 'Sweet, tangy, and dangerously irresistible tomato flavor.',
        price: '₹50',
        colorHex: '#EF1C24', // Red
        packColor: 'red',
        img: 'tomato_tango_lays.webp' // Will be generated
    }
];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartBtn = document.getElementById('cart-btn');
const closeCart = document.getElementById('closeCart');
const cartOverlay = document.getElementById('cartOverlay');

// Initialize Homepage
function init() {
    renderProducts();
    setupEventListeners();
    animateHero();
}

function renderProducts() {
    productGrid.innerHTML = '';
    products.forEach((product, index) => {
        // Add staggered animation delay
        const delay = index * 0.1;
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.setProperty('--product-color', product.colorHex);
        card.style.animationDelay = `${delay}s`;
        
        // Wait till images exist, fallback to gradient circles for layout tests
        const imgSrc = product.img ? product.img : `https://via.placeholder.com/300x400/${product.colorHex.replace('#','')}/ffffff?text=${product.name}`;
        
        card.innerHTML = `
            <div class="product-img-wrap">
                <div class="product-img-glow"></div>
                <img src="${imgSrc}" alt="Lay's ${product.name}" onerror="this.src='https://placehold.co/300x400/111/fff?text=${product.name.split(' ').join('+')}';">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.desc}</p>
                <div class="product-actions">
                    <span class="price">${product.price}</span>
                    <button class="add-cart-btn" aria-label="Add to cart">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

function setupEventListeners() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
            nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.8)';
            nav.style.boxShadow = 'none';
        }
    });

    // Cart Toggle
    cartBtn.addEventListener('click', () => {
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeCart.addEventListener('click', () => {
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Simple hero text stagger
function animateHero() {
    const reveals = document.querySelectorAll('.reveal-text');
    reveals.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 300 + (index * 200));
    });
}

// Run init
document.addEventListener('DOMContentLoaded', init);
