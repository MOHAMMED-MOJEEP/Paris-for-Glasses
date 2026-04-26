// DOM Elements
const navbar = document.querySelector('.navbar');
const mobileMenuBtn = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

// Cart Elements
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElement = document.querySelector('.cart-count');
const totalPriceElement = document.getElementById('total-price');
const addToCartBtns = document.querySelectorAll('.add-to-cart');

// Cart State
let cart = [];

// Initialize
function init() {
    setupEventListeners();
    loadCartFromLocalStorage();
}

// Event Listeners Function
function setupEventListeners() {
    // Scroll Effect for Navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if(navLinks.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
        });
    });

    // Product Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to current
            e.target.classList.add('active');

            const filterValue = e.target.getAttribute('data-filter');

            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Cart Events
    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Add to Cart
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            const image = btn.getAttribute('data-img');

            addToCart({ id, name, price, image, quantity: 1 });
            showToast(`تم إضافة ${name} إلى السلة بنجاح!`);
        });
    });
}

// Open Cart
function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
}

// Close Cart
function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
}

// Add Item to Cart Array
function addToCart(item) {
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push(item);
    }

    updateCartUI();
    saveCartToLocalStorage();
}

// Remove Item from Cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
    saveCartToLocalStorage();
}

// Change Quantity
function changeQuantity(id, action) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        if (action === 'increase') {
            cart[itemIndex].quantity += 1;
        } else if (action === 'decrease') {
            cart[itemIndex].quantity -= 1;
            if (cart[itemIndex].quantity <= 0) {
                removeFromCart(id);
                return; // Stop execution as item is removed
            }
        }
        updateCartUI();
        saveCartToLocalStorage();
    }
}

// Update Cart Display
function updateCartUI() {
    // Clear Container
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">السلة فارغة حالياً</div>';
        cartCountElement.textContent = '0';
        totalPriceElement.textContent = '0$';
        return;
    }

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += (item.price * item.quantity);

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price}$</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQuantity('${item.id}', 'increase')">+</button>
                    <span class="item-qty">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity('${item.id}', 'decrease')">-</button>
                </div>
            </div>
            <i class="fas fa-trash remove-item" onclick="removeFromCart('${item.id}')"></i>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    cartCountElement.textContent = totalItems;
    totalPriceElement.textContent = `${totalPrice}$`;
}

// Local Storage
function saveCartToLocalStorage() {
    localStorage.setItem('parisGlassesCart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('parisGlassesCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Toast Notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Checkout Button (Demo)
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if(cart.length > 0) {
        alert('شكراً لتسوقكم من باريس للنظارات! سيتم تحويلك لصفحة الدفع.');
        cart = [];
        updateCartUI();
        saveCartToLocalStorage();
        closeCart();
    } else {
        alert('السلة فارغة حالياً!');
    }
});

// Run Init
document.addEventListener('DOMContentLoaded', init);
