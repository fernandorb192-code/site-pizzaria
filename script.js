/**
 * Eri Lanches - Script do Carrinho de Compras
 * Funcionalidades: Carrinho dinâmico, filtro de categorias,
 * checkout via WhatsApp, Light/Dark Mode, Modal de Produto
 */

// ============================================
// Estado da Aplicação
// ============================================
const appState = {
    cart: [],
    products: [],
    isCartOpen: false,
    currentProduct: null,
    quantity: 1,
    theme: 'light'
};

// ============================================
// Elementos do DOM
// ============================================
const elements = {
    // Header
    cartBtn: document.getElementById('cartBtn'),
    cartCount: document.getElementById('cartCount'),
    themeToggle: document.getElementById('themeToggle'),
    
    // Carrinho Lateral
    cartSidebar: document.getElementById('cartSidebar'),
    cartOverlay: document.getElementById('cartOverlay'),
    closeCartBtn: document.getElementById('closeCartBtn'),
    cartItems: document.getElementById('cartItems'),
    cartEmpty: document.getElementById('cartEmpty'),
    cartSubtotal: document.getElementById('cartSubtotal'),
    cartTotal: document.getElementById('cartTotal'),
    deliveryFee: document.getElementById('deliveryFee'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    
    // Produtos
    productsGrid: document.getElementById('productsGrid'),
    addCartBtns: document.querySelectorAll('.add-cart-btn'),
    
    // Categorias
    categoryTabs: document.querySelectorAll('.tab-btn'),
    
    // Modal de Produto
    productModal: document.getElementById('productModal'),
    modalClose: document.getElementById('modalClose'),
    modalProductImage: document.getElementById('modalProductImage'),
    modalProductName: document.getElementById('modalProductName'),
    modalProductDescription: document.getElementById('modalProductDescription'),
    modalProductPrice: document.getElementById('modalProductPrice'),
    modalTotalPrice: document.getElementById('modalTotalPrice'),
    sizeOptions: document.getElementById('sizeOptions'),
    extrasOptions: document.getElementById('extrasOptions'),
    productObservation: document.getElementById('productObservation'),
    qtyMinus: document.getElementById('qtyMinus'),
    qtyPlus: document.getElementById('qtyPlus'),
    qtyValue: document.getElementById('qtyValue'),
    confirmAddBtn: document.getElementById('confirmAddBtn'),
    
    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage')
};

// ============================================
// Inicialização
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Carregar produtos do DOM
    loadProductsFromDOM();
    
    // Verificar tema salvo
    loadTheme();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Atualizar UI do carrinho
    updateCartUI();
}

/**
 * Carrega os produtos a partir dos elementos do DOM
 */
function loadProductsFromDOM() {
    const productCards = document.querySelectorAll('.product-card');
    
    appState.products = Array.from(productCards).map(card => ({
        id: parseInt(card.dataset.id),
        name: card.querySelector('.product-name').textContent,
        price: parseFloat(card.querySelector('.product-price').textContent.replace('R$ ', '').replace(',', '.')),
        image: card.querySelector('.product-image img').src,
        category: card.dataset.category
    }));
}

// ============================================
// Event Listeners
// ============================================
function setupEventListeners() {
    // Abrir/Fechar carrinho
    elements.cartBtn.addEventListener('click', openCart);
    elements.closeCartBtn.addEventListener('click', closeCart);
    elements.cartOverlay.addEventListener('click', closeCart);
    
    // Theme Toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Adicionar ao carrinho (abrir modal)
    elements.addCartBtns.forEach(btn => {
        btn.addEventListener('click', openProductModal);
    });
    
    // Fechar Modal
    elements.modalClose.addEventListener('click', closeProductModal);
    elements.productModal.addEventListener('click', (e) => {
        if (e.target === elements.productModal) closeProductModal();
    });
    
    // Quantidade no modal
    elements.qtyMinus.addEventListener('click', () => updateModalQuantity(-1));
    elements.qtyPlus.addEventListener('click', () => updateModalQuantity(1));
    
    // Opções do produto
    document.querySelectorAll('input[name="size"]').forEach(radio => {
        radio.addEventListener('change', updateModalPrice);
    });
    document.querySelectorAll('input[name="extra"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateModalPrice);
    });
    
    // Confirmar adição
    elements.confirmAddBtn.addEventListener('click', confirmAddToCart);
    
    // Filtro de categorias
    elements.categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => handleCategoryFilter(tab));
    });
    
    // Finalizar pedido
    elements.checkoutBtn.addEventListener('click', handleCheckout);
}

// ============================================
// Light/Dark Mode
// ============================================

function toggleTheme() {
    appState.theme = appState.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', appState.theme);
    saveTheme();
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = elements.themeToggle.querySelector('i');
    if (appState.theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

function saveTheme() {
    localStorage.setItem('eri-lanches-theme', appState.theme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('eri-lanches-theme');
    if (savedTheme) {
        appState.theme = savedTheme;
        document.documentElement.setAttribute('data-theme', appState.theme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        appState.theme = 'dark';
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    updateThemeIcon();
}

// ============================================
// Modal de Produto
// ============================================

function openProductModal(e) {
    const btn = e.currentTarget;
    const productId = parseInt(btn.dataset.id);
    const productName = btn.dataset.name;
    const productPrice = parseFloat(btn.dataset.price);
    const productCategory = btn.dataset.category;
    
    // Encontrar detalhes do produto
    const productCard = btn.closest('.product-card');
    const productImage = productCard.querySelector('.product-image img').src;
    const productDescription = productCard.querySelector('.product-description').textContent;
    
    appState.currentProduct = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        description: productDescription,
        category: productCategory,
        size: 'medium',
        sizePrice: 8,
        extras: [],
        extrasPrice: 0,
        observation: '',
        quantity: 1
    };
    
    // Configurar modal
    elements.modalProductImage.src = productImage;
    elements.modalProductName.textContent = productName;
    elements.modalProductDescription.textContent = productDescription;
    elements.productObservation.value = '';
    appState.quantity = 1;
    elements.qtyValue.textContent = '1';
    
    // Mostrar opções certas conforme categoria
    if (productCategory === 'pizzas') {
        elements.sizeOptions.style.display = 'block';
        elements.extrasOptions.style.display = 'none';
        // Reset size
        document.querySelectorAll('input[name="size"]').forEach(r => r.checked = false);
        document.querySelector('input[name="size"][value="medium"]').checked = true;
        appState.currentProduct.size = 'medium';
        appState.currentProduct.sizePrice = 8;
    } else if (productCategory === 'hamburgueres') {
        elements.sizeOptions.style.display = 'none';
        elements.extrasOptions.style.display = 'block';
        // Reset extras
        document.querySelectorAll('input[name="extra"]').forEach(c => c.checked = false);
        appState.currentProduct.extras = [];
        appState.currentProduct.extrasPrice = 0;
    } else {
        elements.sizeOptions.style.display = 'none';
        elements.extrasOptions.style.display = 'none';
    }
    
    updateModalPrice();
    
    // Abrir modal
    elements.productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    elements.productModal.classList.remove('active');
    document.body.style.overflow = '';
    appState.currentProduct = null;
}

function updateModalQuantity(change) {
    appState.quantity += change;
    if (appState.quantity < 1) appState.quantity = 1;
    if (appState.quantity > 10) appState.quantity = 10;
    elements.qtyValue.textContent = appState.quantity;
    updateModalPrice();
}

function updateModalPrice() {
    if (!appState.currentProduct) return;
    
    // Atualizar tamanho
    const sizeRadio = document.querySelector('input[name="size"]:checked');
    if (sizeRadio) {
        appState.currentProduct.size = sizeRadio.value;
        appState.currentProduct.sizePrice = parseFloat(sizeRadio.dataset.price) || 0;
    }
    
    // Atualizar extras
    appState.currentProduct.extras = [];
    appState.currentProduct.extrasPrice = 0;
    document.querySelectorAll('input[name="extra"]:checked').forEach(checkbox => {
        appState.currentProduct.extras.push(checkbox.value);
        appState.currentProduct.extrasPrice += parseFloat(checkbox.dataset.price) || 0;
    });
    
    // Calcular total
    const basePrice = appState.currentProduct.price;
    const total = (basePrice + appState.currentProduct.sizePrice + appState.currentProduct.extrasPrice) * appState.quantity;
    
    elements.modalTotalPrice.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function confirmAddToCart() {
    if (!appState.currentProduct) return;
    
    const product = appState.currentProduct;
    const observation = elements.productObservation.value;
    
    // Criar nome completo com opções
    let fullName = product.name;
    let optionsText = '';
    
    if (product.category === 'pizzas') {
        const sizeNames = { small: 'Pequena', medium: 'Média', large: 'Grande' };
        optionsText += ` (${sizeNames[product.size]})`;
    }
    
    if (product.extras.length > 0) {
        optionsText += ` + ${product.extras.join(', ')}`;
    }
    
    // Adicionar ao carrinho
    addToCart({
        id: product.id,
        name: fullName,
        price: product.price + product.sizePrice + product.extrasPrice,
        image: product.image,
        quantity: product.quantity,
        options: optionsText,
        observation: observation,
        basePrice: product.price,
        category: product.category
    });
    
    closeProductModal();
    showToast(`${fullName} adicionado ao carrinho!`);
}

// ============================================
// Funcionalidades do Carrinho
// ============================================

/**
 * Adiciona item ao carrinho ou incrementa quantity
 */
function addToCart(product) {
    const existingItem = appState.cart.find(item => 
        item.id === product.id && 
        item.options === product.options &&
        item.observation === product.observation
    );
    
    if (existingItem) {
        existingItem.quantity += product.quantity;
    } else {
        appState.cart.push({ ...product });
    }
    
    updateCartUI();
}

/**
 * Remove item do carrinho
 */
function removeFromCart(index) {
    appState.cart.splice(index, 1);
    updateCartUI();
}

/**
 * Atualiza a quantidade de um item
 */
function updateQuantity(index, change) {
    const item = appState.cart[index];
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(index);
        } else {
            updateCartUI();
        }
    }
}

/**
 * Calcula o total do carrinho
 */
function calculateTotal() {
    return appState.cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

/**
 * Calcula o subtotal do carrinho
 */
function calculateSubtotal() {
    return appState.cart.reduce((total, item) => {
        return total + (item.basePrice * item.quantity);
    }, 0);
}

// ============================================
// UI do Carrinho
// ============================================

/**
 * Atualiza toda a interface do carrinho
 */
function updateCartUI() {
    updateCartCount();
    renderCartItems();
    updateCartTotals();
    updateCheckoutButton();
}

/**
 * Atualiza o contador no header
 */
function updateCartCount() {
    const totalItems = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
    elements.cartCount.textContent = totalItems;
    
    if (totalItems > 0) {
        elements.cartCount.classList.remove('hidden');
    } else {
        elements.cartCount.classList.add('hidden');
    }
}

/**
 * Renderiza os itens no carrinho lateral
 */
function renderCartItems() {
    if (appState.cart.length === 0) {
        elements.cartEmpty.style.display = 'flex';
        elements.cartItems.innerHTML = '';
        elements.cartItems.appendChild(elements.cartEmpty);
        return;
    }
    
    elements.cartEmpty.style.display = 'none';
    
    const itemsHTML = appState.cart.map((item, index) => `
        <div class="cart-item" data-index="${index}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                ${item.options ? `<span class="cart-item-options">${item.options}</span>` : ''}
                ${item.observation ? `<span class="cart-item-observation"><i class="fas fa-sticky-note"></i> ${item.observation}</span>` : ''}
                <span class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCart(${index})" title="Remover">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    elements.cartItems.innerHTML = itemsHTML;
}

/**
 * Atualiza os totais do carrinho
 */
function updateCartTotals() {
    const subtotal = calculateSubtotal();
    const total = calculateTotal();
    
    elements.cartSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    elements.cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

/**
 * Habilita/desabilita o botão de checkout
 */
function updateCheckoutButton() {
    elements.checkoutBtn.disabled = appState.cart.length === 0;
}

// ============================================
// Abrir/Fechar Carrinho
// ============================================

function openCart() {
    appState.isCartOpen = true;
    elements.cartSidebar.classList.add('active');
    elements.cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    appState.isCartOpen = false;
    elements.cartSidebar.classList.remove('active');
    elements.cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// Filtro de Categorias
// ============================================

function handleCategoryFilter(tabBtn) {
    const category = tabBtn.dataset.category;
    
    elements.categoryTabs.forEach(tab => tab.classList.remove('active'));
    tabBtn.classList.add('active');
    
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// ============================================
// Checkout via WhatsApp
// ============================================

function handleCheckout() {
    if (appState.cart.length === 0) return;
    
    const message = buildOrderMessage();
    const phoneNumber = '5585999999999'; // Substitua pelo número real
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

function buildOrderMessage() {
    const date = new Date().toLocaleDateString('pt-BR');
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    let message = `🍕 *PEDIDO - ERI LANCHES*\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📅 Data: ${date} às ${time}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `*🛒 ITENS DO PEDIDO:*\n\n`;
    
    appState.cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        message += `${index + 1}. ${item.name}\n`;
        if (item.options) message += `   📝 Opções: ${item.options}\n`;
        if (item.observation) message += `   💬 Obs: ${item.observation}\n`;
        message += `   Qtd: ${item.quantity} x R$ ${item.price.toFixed(2).replace('.', ',')}\n`;
        message += `   Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n\n`;
    });
    
    const total = calculateTotal();
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*💰 RESUMO:*\n`;
    message += `   Subtotal: R$ ${calculateSubtotal().toFixed(2).replace('.', ',')}\n`;
    message += `   *TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `📍 *ENDEREÇO DE ENTREGA:*\n`;
    message += `Por favor, informe seu endereço completo (rua, número, bairro, ponto de referência).\n\n`;
    message += `📍 *Região de entrega:* São José e região\n\n`;
    message += `_Obrigado pelo pedido! 🍔🍕_`;
    
    return message;
}

// ============================================
// Toast de Notificação
// ============================================

function showToast(message) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// ============================================
// Funções Globais
// ============================================
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
