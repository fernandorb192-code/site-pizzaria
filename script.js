// ================================
// Eri Lanches - Script Principal
// ================================

// Estado do Carrinho
let cart = [];
let currentProduct = null;
let currentModalTotal = 0;
let deliveryFee = 0;

// Elementos do DOM
const cartBtn = document.getElementById('cartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const deliveryFeeEl = document.getElementById('deliveryFee');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const productModal = document.getElementById('productModal');
const modalClose = document.getElementById('modalClose');
const themeToggle = document.getElementById('themeToggle');
const toast = document.getElementById('toast');

// Elementos do Modal de Produto
const modalProductImage = document.getElementById('modalProductImage');
const modalProductName = document.getElementById('modalProductName');
const modalProductDescription = document.getElementById('modalProductDescription');
const modalProductPrice = document.getElementById('modalProductPrice');
const halfHalfSection = document.getElementById('halfHalfSection');
const halfHalfCheckbox = document.getElementById('halfHalfCheckbox');
const halfHalfFlavors = document.getElementById('halfHalfFlavors');
const firstHalfSelect = document.getElementById('firstHalf');
const secondHalfSelect = document.getElementById('secondHalf');
const borderOptions = document.getElementById('borderOptions');
const productObservation = document.getElementById('productObservation');
const qtyValue = document.getElementById('qtyValue');
const qtyMinus = document.getElementById('qtyMinus');
const qtyPlus = document.getElementById('qtyPlus');
const modalTotalPrice = document.getElementById('modalTotalPrice');
const confirmAddBtn = document.getElementById('confirmAddBtn');

// Elementos do Modal de Checkout
const checkoutModal = document.getElementById('checkoutModal');
const checkoutClose = document.getElementById('checkoutClose');
const customerName = document.getElementById('customerName');
const customerAddress = document.getElementById('customerAddress');
const customerReference = document.getElementById('customerReference');
const customerDelivery = document.getElementById('customerDelivery');
const customerPayment = document.getElementById('customerPayment');
const customerChange = document.getElementById('customerChange');
const changeGroup = document.getElementById('changeGroup');
const checkoutItems = document.getElementById('checkoutItems');
const checkoutSubtotal = document.getElementById('checkoutSubtotal');
const checkoutDelivery = document.getElementById('checkoutDelivery');
const checkoutTotal = document.getElementById('checkoutTotal');
const confirmCheckoutBtn = document.getElementById('confirmCheckoutBtn');

// Lista de pizzas para opção metade-metade
const pizzaFlavors = [
    { name: 'Mussarela', price: 27.99 },
    { name: 'Calabresa', price: 29.99 },
    { name: 'Frango', price: 29.99 },
    { name: 'Quatro Queijos', price: 29.99 },
    { name: 'Mista', price: 29.99 },
    { name: 'Frango Catupiry', price: 29.99 },
    { name: 'Portuguesa', price: 29.99 },
    { name: 'Frango Bacon', price: 32.00 },
    { name: 'Calamista', price: 32.00 },
    { name: 'Pizzaolo', price: 32.00 },
    { name: 'Calabacon', price: 34.99 },
    { name: 'Mistão', price: 34.99 },
    { name: 'Super Frango', price: 34.99 },
    { name: 'Moda da Casa', price: 37.99 }
];

// ================================
// Inicialização
// ================================

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initCart();
    initProductCards();
    initCategoryTabs();
    initModal();
    initCheckout();
});

// ================================
// Tema (Dark/Light Mode)
// ================================

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// ================================
// Carrinho de Compras
// ================================

function initCart() {
    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    checkoutBtn.addEventListener('click', openCheckoutModal);
}

function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function updateCartCount() {
    const count = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
}

function renderCartItems() {
    if (cart.length === 0) {
        cartEmpty.style.display = 'flex';
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.cursor = 'not-allowed';
    } else {
        cartEmpty.style.display = 'none';
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';
        checkoutBtn.style.cursor = 'pointer';
    }

    // Remove old items (keep empty message)
    const oldItems = cartItems.querySelectorAll('.cart-item');
    oldItems.forEach(function(item) { item.remove(); });

    // Add new items
    cart.forEach(function(item, index) {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = 
            '<div class="cart-item-image">' +
                '<img src="' + item.image + '" alt="' + item.name + '">' +
            '</div>' +
            '<div class="cart-item-info">' +
                '<h4>' + item.name + '</h4>' +
                (item.halfHalf ? '<p class="cart-item-size">' + item.halfHalf + '</p>' : '') +
                (item.border && item.border !== 'Sem borda' ? '<p class="cart-item-border">' + item.border + '</p>' : '') +
                (item.extras && item.extras.length > 0 ? '<p class="cart-item-extras">+ ' + item.extras.join(', ') + '</p>' : '') +
                (item.observation ? '<p class="cart-item-obs"><i class="fas fa-comment"></i> ' + item.observation + '</p>' : '') +
                '<div class="cart-item-bottom">' +
                    '<div class="cart-item-quantity">' +
                        '<button class="qty-cart-btn" onclick="updateItemQuantity(' + index + ', -1)">' +
                            '<i class="fas fa-minus"></i>' +
                        '</button>' +
                        '<span>' + item.quantity + '</span>' +
                        '<button class="qty-cart-btn" onclick="updateItemQuantity(' + index + ', 1)">' +
                            '<i class="fas fa-plus"></i>' +
                        '</button>' +
                    '</div>' +
                    '<span class="cart-item-price">R$ ' + (item.price * item.quantity).toFixed(2).replace('.', ',') + '</span>' +
                '</div>' +
            '</div>' +
            '<button class="cart-item-remove" onclick="removeFromCart(' + index + ')">' +
                '<i class="fas fa-trash"></i>' +
            '</button>';
        cartItems.appendChild(itemElement);
    });

    updateCartTotals();
}

function updateCartTotals() {
    const subtotal = cart.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
    const total = subtotal + deliveryFee;

    cartSubtotal.textContent = 'R$ ' + subtotal.toFixed(2).replace('.', ',');
    deliveryFeeEl.textContent = deliveryFee === 0 ? 'Gratis' : 'R$ ' + deliveryFee.toFixed(2).replace('.', ',');
    cartTotal.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
}

function updateItemQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    renderCartItems();
    updateCartCount();
    showToast('Carrinho atualizado!');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCartItems();
    updateCartCount();
    showToast('Item removido do carrinho!');
}

function addToCart(item) {
    cart.push(item);
    renderCartItems();
    updateCartCount();
    closeCart();
    showToast('Item adicionado ao carrinho! 🎉');
}

// ================================
// Cards de Produtos
// ================================

function initProductCards() {
    const addButtons = document.querySelectorAll('.add-cart-btn');
    addButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = btn.dataset.id;
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);
            const category = btn.dataset.category;
            const image = btn.closest('.product-card').querySelector('.product-image img').src;
            
            openProductModal(id, name, price, category, image);
        });
    });
}

// ================================
// Modal de Produto
// ================================

function initModal() {
    modalClose.addEventListener('click', closeProductModal);
    productModal.addEventListener('click', function(e) {
        if (e.target === productModal) {
            closeProductModal();
        }
    });

    qtyMinus.addEventListener('click', function() {
        let qty = parseInt(qtyValue.textContent);
        if (qty > 1) {
            qtyValue.textContent = qty - 1;
            updateModalTotal();
        }
    });

    qtyPlus.addEventListener('click', function() {
        let qty = parseInt(qtyValue.textContent);
        qtyValue.textContent = qty + 1;
        updateModalTotal();
    });

    // Update total when border changes
    document.querySelectorAll('input[name="border"]').forEach(function(radio) {
        radio.addEventListener('change', updateModalTotal);
    });

    // Toggle half-half
    halfHalfCheckbox.addEventListener('change', function() {
        if (halfHalfCheckbox.checked) {
            halfHalfFlavors.style.display = 'grid';
        } else {
            halfHalfFlavors.style.display = 'none';
        }
        updateModalTotal();
    });

    // Update when first/second half changes
    firstHalfSelect.addEventListener('change', updateModalTotal);
    secondHalfSelect.addEventListener('change', updateModalTotal);

    confirmAddBtn.addEventListener('click', addSelectedProduct);
}

function openProductModal(id, name, price, category, image) {
    currentProduct = {
        id: id,
        name: name,
        basePrice: price,
        category: category,
        image: image,
        quantity: 1
    };

    // Update modal content
    modalProductImage.src = image;
    modalProductName.textContent = name;
    productObservation.value = '';
    qtyValue.textContent = '1';

    // Get description from card
    const description = document.querySelector('.add-cart-btn[data-id="' + id + '"]')
        .closest('.product-card')
        .querySelector('.product-description').textContent;
    modalProductDescription.textContent = description;

    // Show/hide options based on category
    if (category === 'pizzas') {
        halfHalfSection.style.display = 'block';
        borderOptions.style.display = 'block';
        
        // Populate pizza flavors for half-half
        firstHalfSelect.innerHTML = '<option value="">Selecione...</option>';
        secondHalfSelect.innerHTML = '<option value="">Selecione...</option>';
        pizzaFlavors.forEach(function(flavor) {
            firstHalfSelect.innerHTML += '<option value="' + flavor.name + '" data-price="' + flavor.price + '">' + flavor.name + ' - R$ ' + flavor.price.toFixed(2).replace('.', ',') + '</option>';
            secondHalfSelect.innerHTML += '<option value="' + flavor.name + '" data-price="' + flavor.price + '">' + flavor.name + ' - R$ ' + flavor.price.toFixed(2).replace('.', ',') + '</option>';
        });
        
        // Reset half-half
        halfHalfCheckbox.checked = false;
        halfHalfFlavors.style.display = 'none';
        firstHalfSelect.value = '';
        secondHalfSelect.value = '';
        
        // Reset border
        document.querySelector('input[name="border"][value="Sem borda"]').checked = true;
    } else {
        halfHalfSection.style.display = 'none';
        borderOptions.style.display = 'none';
    }

    // Reset delivery and payment in modal (moved to checkout)
    document.querySelector('input[name="delivery"]')?.closest('.modal-options')?.style.setProperty('display', 'none');

    updateModalTotal();
    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    productModal.classList.remove('active');
    document.body.style.overflow = '';
    currentProduct = null;
}

function updateModalTotal() {
    if (!currentProduct) return;

    let total = currentProduct.basePrice;
    let sizeText = '';
    let halfHalfInfo = null;

    // Handle half-half pizza
    if (halfHalfCheckbox.checked && currentProduct.category === 'pizzas') {
        const firstFlavor = firstHalfSelect.options[firstHalfSelect.selectedIndex];
        const secondFlavor = secondHalfSelect.options[secondHalfSelect.selectedIndex];
        
        if (firstFlavor && secondFlavor && firstFlavor.value && secondFlavor.value) {
            const price1 = parseFloat(firstFlavor.dataset.price) || 0;
            const price2 = parseFloat(secondFlavor.dataset.price) || 0;
            
            // Half-half: average price
            const avgPrice = (price1 + price2) / 2;
            
            total = avgPrice;
            
            halfHalfInfo = 'Metade ' + firstFlavor.value + ' / ' + secondFlavor.value;
        }
    }

    // Add border price
    if (currentProduct.category === 'pizzas') {
        const selectedBorder = document.querySelector('input[name="border"]:checked');
        if (selectedBorder && selectedBorder.value !== 'Sem borda') {
            const borderPrice = parseFloat(selectedBorder.dataset.price) || 0;
            total += borderPrice;
            sizeText = selectedBorder.value;
        }
    }

    // Multiply by quantity
    const qty = parseInt(qtyValue.textContent);
    total = total * qty;

    currentModalTotal = total;
    currentProduct.quantity = qty;
    currentProduct.size = sizeText || null;
    currentProduct.halfHalf = halfHalfInfo;
    
    modalTotalPrice.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
    modalProductPrice.textContent = 'A partir de R$ ' + currentProduct.basePrice.toFixed(2).replace('.', ',');
}

function addSelectedProduct() {
    if (!currentProduct) return;

    // Get selected border
    let borderText = '';
    if (currentProduct.category === 'pizzas') {
        const selectedBorder = document.querySelector('input[name="border"]:checked');
        borderText = selectedBorder ? selectedBorder.value : 'Sem borda';
    }

    // Get observation
    const observation = productObservation.value.trim();

    const item = {
        name: currentProduct.name,
        price: currentModalTotal / currentProduct.quantity,
        quantity: currentProduct.quantity,
        image: currentProduct.image,
        halfHalf: currentProduct.halfHalf,
        border: borderText,
        observation: observation || null
    };

    addToCart(item);
    closeProductModal();
}

// ================================
// Checkout Modal
// ================================

function initCheckout() {
    checkoutClose.addEventListener('click', closeCheckoutModal);
    checkoutModal.addEventListener('click', function(e) {
        if (e.target === checkoutModal) {
            closeCheckoutModal();
        }
    });

    // Show/hide change input based on payment method
    customerPayment.addEventListener('change', function() {
        if (customerPayment.value === 'Dinheiro') {
            changeGroup.style.display = 'flex';
        } else {
            changeGroup.style.display = 'none';
            customerChange.value = '';
        }
    });

    // Update delivery fee when location changes
    customerDelivery.addEventListener('change', function() {
        updateCheckoutTotals();
    });

    confirmCheckoutBtn.addEventListener('click', finalizeOrder);
}

function openCheckoutModal() {
    if (cart.length === 0) return;

    // Populate checkout items
    checkoutItems.innerHTML = '';
    cart.forEach(function(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'checkout-item';
        
        let itemDetails = item.name;
        if (item.halfHalf) {
            itemDetails += ' (' + item.halfHalf + ')';
        }
        if (item.border && item.border !== 'Sem borda') {
            itemDetails += ' - ' + item.border;
        }
        itemDetails += ' x' + item.quantity;
        
        itemDiv.innerHTML = 
            '<span class="checkout-item-name">' + itemDetails + '</span>' +
            '<span class="checkout-item-price">R$ ' + (item.price * item.quantity).toFixed(2).replace('.', ',') + '</span>';
        checkoutItems.appendChild(itemDiv);
    });

    // Reset form
    customerName.value = '';
    customerAddress.value = '';
    customerReference.value = '';
    customerPayment.value = 'PIX';
    customerChange.value = '';
    changeGroup.style.display = 'none';

    updateCheckoutTotals();
    
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = '';
}

function updateCheckoutTotals() {
    const subtotal = cart.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
    
    // Get delivery fee from select
    const deliveryValue = customerDelivery.value;
    const deliveryPrices = {
        'São José': 0,
        'Cedro': 5,
        'Risos da Noite': 7,
        'Feijão Bravo': 7,
        'Medeiros': 7,
        'Enego': 5,
        'Macaco': 7,
        'Nova Morada': 7
    };
    
    deliveryFee = deliveryPrices[deliveryValue] || 0;
    const total = subtotal + deliveryFee;

    checkoutSubtotal.textContent = 'R$ ' + subtotal.toFixed(2).replace('.', ',');
    checkoutDelivery.textContent = deliveryFee === 0 ? 'Gratis' : 'R$ ' + deliveryFee.toFixed(2).replace('.', ',');
    checkoutTotal.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
}

function finalizeOrder() {
    if (cart.length === 0) return;

    // Validate form
    if (!customerName.value.trim()) {
        showToast('Por favor, informe seu nome!');
        customerName.focus();
        return;
    }
    if (!customerAddress.value.trim()) {
        showToast('Por favor, informe seu endereço!');
        customerAddress.focus();
        return;
    }

    const phoneNumber = '5588994413681';
    let message = 'Ola! Gostaria de fazer um pedido:\n\n';
    message += 'ITENS DO PEDIDO:\n';

    let subtotal = 0;

    cart.forEach(function(item, index) {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        message += (index + 1) + 'x ' + item.name;
        
        if (item.halfHalf) {
            message += ': ' + item.halfHalf;
        }
        
        if (item.border && item.border !== 'Sem borda') {
            message += ' (C/ Borda ' + item.border + ')';
        }
        
        message += ' - R$ ' + itemTotal.toFixed(2).replace('.', ',') + '\n';
    });

    message += '\n';
    message += 'TOTAL: R$ ' + subtotal.toFixed(2).replace('.', ',') + '\n\n';
    
    // Customer info
    message += 'DADOS DA ENTREGA:\n';
    message += 'Nome: ' + customerName.value.trim().toUpperCase() + '\n';
    message += 'Endereco: ' + customerAddress.value.trim() + ' - ' + customerDelivery.value + '\n';
    if (customerReference.value.trim()) {
        message += 'Referencia: ' + customerReference.value.trim() + '\n';
    }
    message += '\n';
    
    // Payment info
    message += 'PAGAMENTO:\n';
    message += 'Forma: ' + customerPayment.value + '\n';
    if (customerPayment.value === 'Dinheiro' && customerChange.value) {
        message += 'Troco para: ' + parseFloat(customerChange.value).toFixed(2).replace('.', ',') + '\n';
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = 'https://wa.me/' + phoneNumber + '?text=' + encodedMessage;

    closeCheckoutModal();
    closeCart();
    
    window.open(whatsappUrl, '_blank');
}

// ================================
// Abas de Categorias
// ================================

function initCategoryTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const cards = document.querySelectorAll('.product-card');

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            tab.classList.add('active');

            const category = tab.dataset.category;

            cards.forEach(function(card) {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    setTimeout(function() {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(function() {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ================================
// Toast Notifications
// ================================

function showToast(message) {
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    
    toast.classList.add('show');
    
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

// Make functions globally available
window.updateItemQuantity = updateItemQuantity;
window.removeFromCart = removeFromCart;
