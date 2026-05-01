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

// Elementos do Modal de Produto - Kit Popular
const kitPizzaSection = document.getElementById('kitPizzaSection');
const kitPizzaSelect = document.getElementById('kitPizzaSelect');
const kitHalfHalfSection = document.getElementById('kitHalfHalfSection');
const kitHalfHalfCheckbox = document.getElementById('kitHalfHalfCheckbox');
const kitHalfHalfFlavors = document.getElementById('kitHalfHalfFlavors');
const kitFirstHalf = document.getElementById('kitFirstHalf');
const kitSecondHalf = document.getElementById('kitSecondHalf');
const kitSodaSection = document.getElementById('kitSodaSection');

// Elementos do Modal de Produto - Kit Família
const kitFamiliaSection = document.getElementById('kitFamiliaSection');
const kitPizza1Select = document.getElementById('kitPizza1Select');
const kitPizza2Select = document.getElementById('kitPizza2Select');
const kitPizza1HalfHalf = document.getElementById('kitPizza1HalfHalf');
const kitPizza1HalfHalfFlavors = document.getElementById('kitPizza1HalfHalfFlavors');
const kitPizza1FirstHalf = document.getElementById('kitPizza1FirstHalf');
const kitPizza1SecondHalf = document.getElementById('kitPizza1SecondHalf');
const kitPizza2HalfHalf = document.getElementById('kitPizza2HalfHalf');
const kitPizza2HalfHalfFlavors = document.getElementById('kitPizza2HalfHalfFlavors');
const kitPizza2FirstHalf = document.getElementById('kitPizza2FirstHalf');
const kitPizza2SecondHalf = document.getElementById('kitPizza2SecondHalf');

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
    { name: 'Pizza Mussarela', price: 28.00, baseName: 'Mussarela' },
    { name: 'Pizza Calabresa', price: 30.00, baseName: 'Calabresa' },
    { name: 'Pizza Frango', price: 30.00, baseName: 'Frango' },
    { name: 'Pizza Quatro Queijos', price: 30.00, baseName: 'Quatro Queijos' },
    { name: 'Pizza Mista', price: 30.00, baseName: 'Mista' },
    { name: 'Pizza Frango Catupiry', price: 30.00, baseName: 'Frango Catupiry' },
    { name: 'Pizza Portuguesa', price: 30.00, baseName: 'Portuguesa' },
    { name: 'Pizza Frango Bacon', price: 32.00, baseName: 'Frango Bacon' },
    { name: 'Pizza Calamista', price: 32.00, baseName: 'Calamista' },
    { name: 'Pizza Pizzaolo', price: 32.00, baseName: 'Pizzaolo' },
    { name: 'Pizza Calabacon', price: 35.00, baseName: 'Calabacon' },
    { name: 'Pizza Mistão', price: 35.00, baseName: 'Mistão' },
    { name: 'Pizza Super Frango', price: 35.00, baseName: 'Super Frango' },
    { name: 'Pizza Moda da Casa', price: 38.00, baseName: 'Moda da Casa' }
];

// Função para encontrar o preço de uma pizza pelo nome
function getPizzaPrice(pizzaName) {
    const normalizedName = pizzaName.toLowerCase().trim();
    for (var i = 0; i < pizzaFlavors.length; i++) {
        if (pizzaFlavors[i].name.toLowerCase().trim() === normalizedName) {
            return pizzaFlavors[i].price;
        }
    }
    return 28.00; // Default price if not found
}

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
        
        // Build item display name
        let displayName = item.name;
        
        // Handle Kit Família and Kit Explosão display
        if (item.kitNamePrefix === 'KIT FAMÍLIA' || item.kitNamePrefix === 'KIT EXPLOSÃO') {
            let pizza1Info = item.kitPizza1Name || '';
            let pizza2Info = item.kitPizza2Name || '';
            
            if (item.kitPizza1HalfHalf) {
                pizza1Info = item.kitPizza1HalfHalf.replace(/Metade\s+/g, '');
            }
            if (item.kitPizza2HalfHalf) {
                pizza2Info = item.kitPizza2HalfHalf.replace(/Metade\s+/g, '');
            }
            
            if (pizza1Info && pizza2Info) {
                displayName = item.kitNamePrefix + ' (' + pizza1Info + ' + ' + pizza2Info + ')';
            } else if (pizza1Info) {
                displayName = item.kitNamePrefix + ' (' + pizza1Info + ')';
            } else if (pizza2Info) {
                displayName = item.kitNamePrefix + ' (' + pizza2Info + ')';
            }
        } else {
            // Get kit prefix for display
            const kitPrefix = item.kitNamePrefix || (item.kitPizza ? 'KIT POPULAR' : null);
            
            if (kitPrefix && item.kitPizza) {
                // Extract pizza name from "KIT POPULAR (Pizza Name)" or "KIT SHOW (Pizza Name)"
                const pizzaMatch = item.name.match(/\(.*\)/);
                if (pizzaMatch) {
                    displayName = kitPrefix + ' ' + pizzaMatch[0];
                }
            }
        }
        
        // Build item details for display
        let itemDetails = '';
        if (item.halfHalf) {
            itemDetails += '<p class="cart-item-size">' + item.halfHalf.replace(/Metade\s+/g, '') + '</p>';
        }
        if (item.border && item.border !== 'Sem borda') {
            itemDetails += '<p class="cart-item-border">Borda: ' + item.border + '</p>';
        }
        if (item.kitSoda) {
            itemDetails += '<p class="cart-item-soda">🥤 Refrigerante: ' + item.kitSoda + '</p>';
        }
        if (item.extras && item.extras.length > 0) {
            itemDetails += '<p class="cart-item-extras">+ ' + item.extras.join(', ') + '</p>';
        }
        if (item.observation) {
            itemDetails += '<p class="cart-item-obs"><i class="fas fa-comment"></i> ' + item.observation + '</p>';
        }
        
        itemElement.innerHTML = 
            '<div class="cart-item-image">' +
                '<img src="' + item.image + '" alt="' + item.name + '">' +
            '</div>' +
            '<div class="cart-item-info">' +
                '<h4>' + item.quantity + 'x ' + displayName + '</h4>' +
                itemDetails +
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

    // Cart shows only total (delivery fee is shown at checkout)
    cartTotal.textContent = 'R$ ' + subtotal.toFixed(2).replace('.', ',');
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
            
            // Bebidas vão direto para o carrinho sem abrir o modal
            if (category === 'bebidas') {
                const item = {
                    name: name,
                    price: price,
                    quantity: 1,
                    image: image
                };
                addToCart(item);
            } else {
                openProductModal(id, name, price, category, image);
            }
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
    
    // Kit Popular event listeners
    kitPizzaSelect.addEventListener('change', function() {
        // When pizza flavor is selected, show half-half option
        if (kitPizzaSelect.value) {
            kitHalfHalfSection.style.display = 'block';
            // Auto-fill first half with selected pizza
            const selectedPizzaName = kitPizzaSelect.options[kitPizzaSelect.selectedIndex].text.split(' - ')[0];
            kitFirstHalf.innerHTML = '<option value="' + selectedPizzaName + '">' + selectedPizzaName + '</option>';
            // Reset half-half checkbox
            kitHalfHalfCheckbox.checked = false;
            kitHalfHalfFlavors.style.display = 'none';
            kitSecondHalf.value = '';
            
            // Populate second flavor dropdown - pizzas até R$ 30,00
            kitSecondHalf.innerHTML = '<option value="">Selecione...</option>';
            const cheapPizzas = pizzaFlavors.filter(f => f.price <= 30.00);
            cheapPizzas.forEach(function(flavor) {
                kitSecondHalf.innerHTML += '<option value="' + flavor.baseName + '" data-price="' + flavor.price + '">' + flavor.baseName + ' - R$ ' + flavor.price.toFixed(2).replace('.', ',') + '</option>';
            });
        } else {
            kitHalfHalfSection.style.display = 'none';
        }
        updateModalTotal();
    });
    
    // Toggle kit half-half
    kitHalfHalfCheckbox.addEventListener('change', function() {
        if (kitHalfHalfCheckbox.checked) {
            kitHalfHalfFlavors.style.display = 'grid';
            // First half is already set from selected pizza
        } else {
            kitHalfHalfFlavors.style.display = 'none';
        }
        updateModalTotal();
    });
    
    // Kit Família event listeners
    kitPizza1Select.addEventListener('change', function() {
        // Auto-fill first half with selected pizza when half-half is checked
        if (kitPizza1Select.value && kitPizza1HalfHalf.checked) {
            const selectedPizzaName = kitPizza1Select.options[kitPizza1Select.selectedIndex].text.split(' - ')[0];
            kitPizza1FirstHalf.innerHTML = '<option value="' + selectedPizzaName + '">' + selectedPizzaName + '</option>';
        }
        updateModalTotal();
    });
    
    kitPizza2Select.addEventListener('change', function() {
        // Auto-fill first half with selected pizza when half-half is checked
        if (kitPizza2Select.value && kitPizza2HalfHalf.checked) {
            const selectedPizzaName = kitPizza2Select.options[kitPizza2Select.selectedIndex].text.split(' - ')[0];
            kitPizza2FirstHalf.innerHTML = '<option value="' + selectedPizzaName + '">' + selectedPizzaName + '</option>';
        }
        updateModalTotal();
    });
    
    // Toggle Kit Família half-half for pizza 1
    kitPizza1HalfHalf.addEventListener('change', function() {
        if (kitPizza1HalfHalf.checked) {
            kitPizza1HalfHalfFlavors.style.display = 'grid';
            // Auto-fill first half with selected pizza 1
            if (kitPizza1Select.value) {
                const selectedPizzaName = kitPizza1Select.options[kitPizza1Select.selectedIndex].text.split(' - ')[0];
                kitPizza1FirstHalf.innerHTML = '<option value="' + selectedPizzaName + '">' + selectedPizzaName + '</option>';
            }
        } else {
            kitPizza1HalfHalfFlavors.style.display = 'none';
        }
        updateModalTotal();
    });
    
    // Toggle Kit Família half-half for pizza 2
    kitPizza2HalfHalf.addEventListener('change', function() {
        if (kitPizza2HalfHalf.checked) {
            kitPizza2HalfHalfFlavors.style.display = 'grid';
            // Auto-fill first half with selected pizza 2
            if (kitPizza2Select.value) {
                const selectedPizzaName = kitPizza2Select.options[kitPizza2Select.selectedIndex].text.split(' - ')[0];
                kitPizza2FirstHalf.innerHTML = '<option value="' + selectedPizzaName + '">' + selectedPizzaName + '</option>';
            }
        } else {
            kitPizza2HalfHalfFlavors.style.display = 'none';
        }
        updateModalTotal();
    });
    
    kitPizza1FirstHalf.addEventListener('change', updateModalTotal);
    kitPizza1SecondHalf.addEventListener('change', updateModalTotal);
    kitPizza2FirstHalf.addEventListener('change', updateModalTotal);
    kitPizza2SecondHalf.addEventListener('change', updateModalTotal);
    
    // Update when kit first/second half changes
    kitFirstHalf.addEventListener('change', updateModalTotal);
    kitSecondHalf.addEventListener('change', updateModalTotal);

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
        kitPizzaSection.style.display = 'none';
        kitHalfHalfSection.style.display = 'none';
        kitSodaSection.style.display = 'none';
        
        // Set first flavor to current pizza (fixed/disabled)
        firstHalfSelect.innerHTML = '<option value="' + name + '" data-price="' + price + '">' + name + ' - R$ ' + price.toFixed(2).replace('.', ',') + '</option>';
        
        // Populate second flavor dropdown (all pizzas except current)
        secondHalfSelect.innerHTML = '<option value="">Selecione o segundo sabor...</option>';
        pizzaFlavors.forEach(function(flavor) {
            if (flavor.name !== name) {
                secondHalfSelect.innerHTML += '<option value="' + flavor.baseName + '" data-price="' + flavor.price + '">' + flavor.baseName + ' - R$ ' + flavor.price.toFixed(2).replace('.', ',') + '</option>';
            }
        });
        
        // Reset half-half
        halfHalfCheckbox.checked = false;
        halfHalfFlavors.style.display = 'none';
        secondHalfSelect.value = '';
        
        // Reset border
        document.querySelector('input[name="border"][value="Sem borda"]').checked = true;
    } else if (category === 'kits') {
        halfHalfSection.style.display = 'none';
        
        // Check if it's Kit Família or Kit Explosão
        if (name.toLowerCase().includes('família') || name.toLowerCase().includes('familia') || name.toLowerCase().includes('explosão') || name.toLowerCase().includes('explosao')) {
            // Kit Família or Kit Explosão - show 2 pizza selection
            kitPizzaSection.style.display = 'none';
            kitFamiliaSection.style.display = 'block';
            kitHalfHalfSection.style.display = 'none';
            kitSodaSection.style.display = 'block';
            
            // For Kit Explosão, show border options but pre-select one (included in price)
            if (name.toLowerCase().includes('explosão') || name.toLowerCase().includes('explosao')) {
                borderOptions.style.display = 'block';
                // Pre-select Catupiry for Kit Explosão (included in price)
                document.querySelector('input[name="border"][value="Catupiry"]').checked = true;
            } else {
                borderOptions.style.display = 'block';
                document.querySelector('input[name="border"][value="Sem borda"]').checked = true;
            }
            
            // Populate pizza 1 dropdown
            kitPizza1Select.innerHTML = '<option value="">Selecione o sabor...</option>';
            pizzaFlavors.forEach(function(flavor) {
                kitPizza1Select.innerHTML += '<option value="' + flavor.name + '" data-price="' + flavor.price + '">' + flavor.name + ' - R$ ' + flavor.price.toFixed(2).replace('.', ',') + '</option>';
            });
            
            // Populate pizza 2 dropdown
            kitPizza2Select.innerHTML = '<option value="">Selecione o sabor...</option>';
            pizzaFlavors.forEach(function(flavor) {
                kitPizza2Select.innerHTML += '<option value="' + flavor.name + '" data-price="' + flavor.price + '">' + flavor.name + ' - R$ ' + flavor.price.toFixed(2).replace('.', ',') + '</option>';
            });
            
            // Populate half-half dropdowns for pizza 1
            kitPizza1FirstHalf.innerHTML = '<option value="">Selecione...</option>';
            kitPizza1SecondHalf.innerHTML = '<option value="">Selecione...</option>';
            pizzaFlavors.forEach(function(flavor) {
                kitPizza1FirstHalf.innerHTML += '<option value="' + flavor.baseName + '" data-price="' + flavor.price + '">' + flavor.baseName + ' - R$ ' + flavor.price.toFixed(2).replace('.', ',') + '</option>';
                kitPizza1SecondHalf.innerHTML += '<option value="' + flavor.baseName + '" data-price="' + flavor.price + '">' + flavor.baseName + ' - R$ ' + flavor.price.toFixed(2).replace('.', ',') + '</option>';
            });
            
            // Populate half-half dropdowns for pizza 2
            kitPizza2FirstHalf.innerHTML = '<option value="">Selecione...</option>';
            kitPizza2SecondHalf.innerHTML = '<option value="">Selecione...</option>';
            pizzaFlavors.forEach(function(flavor) {
                kitPizza2FirstHalf.innerHTML += '<option value="' + flavor.baseName + '" data-price="' + flavor.price + '">' + flavor.baseName + ' - R$ ' + flavor.price.toFixed(2).replace('.', ',') + '</option>';
                kitPizza2SecondHalf.innerHTML += '<option value="' + flavor.baseName + '" data-price="' + flavor.price + '">' + flavor.baseName + ' - R$ ' + flavor.price.toFixed(2).replace('.', ',') + '</option>';
            });
            
            // Reset Kit Família options
            kitPizza1Select.value = '';
            kitPizza2Select.value = '';
            kitPizza1HalfHalf.checked = false;
            kitPizza1HalfHalfFlavors.style.display = 'none';
            kitPizza1FirstHalf.value = '';
            kitPizza1SecondHalf.value = '';
            kitPizza2HalfHalf.checked = false;
            kitPizza2HalfHalfFlavors.style.display = 'none';
            kitPizza2FirstHalf.value = '';
            kitPizza2SecondHalf.value = '';
            document.querySelector('input[name="kitSoda"][value="Pepsi"]').checked = true;
            
        } else {
            // Kit Popular or Kit Show - show single pizza selection
            kitPizzaSection.style.display = 'block';
            kitFamiliaSection.style.display = 'none';
            kitHalfHalfSection.style.display = 'none'; // Initially hidden until pizza is selected
            kitSodaSection.style.display = 'block';
            borderOptions.style.display = 'block';
            
            // Populate kit pizza dropdown
            kitPizzaSelect.innerHTML = '<option value="">Selecione o sabor...</option>';
            pizzaFlavors.forEach(function(flavor) {
                kitPizzaSelect.innerHTML += '<option value="' + flavor.name + '" data-price="' + flavor.price + '">' + flavor.name + ' - R$ ' + flavor.price.toFixed(2).replace('.', ',') + '</option>';
            });
            
            // Populate kit half-half first flavor dropdown (will be filled when pizza is selected)
            kitFirstHalf.innerHTML = '<option value="">Selecione...</option>';
            
            // Populate kit half-half second flavor dropdown - pizzas até R$ 30,00
            kitSecondHalf.innerHTML = '<option value="">Selecione...</option>';
            const cheapPizzas = pizzaFlavors.filter(f => f.price <= 30.00);
            cheapPizzas.forEach(function(flavor) {
                kitSecondHalf.innerHTML += '<option value="' + flavor.baseName + '" data-price="' + flavor.price + '">' + flavor.baseName + ' - R$ ' + flavor.price.toFixed(2).replace('.', ',') + '</option>';
            });
            
            // Reset kit options
            kitPizzaSelect.value = '';
            kitHalfHalfCheckbox.checked = false;
            kitHalfHalfFlavors.style.display = 'none';
            kitFirstHalf.value = '';
            kitSecondHalf.value = '';
            document.querySelector('input[name="kitSoda"][value="Pepsi"]').checked = true;
            document.querySelector('input[name="border"][value="Sem borda"]').checked = true;
        }
    } else {
        halfHalfSection.style.display = 'none';
        borderOptions.style.display = 'none';
        kitPizzaSection.style.display = 'none';
        kitHalfHalfSection.style.display = 'none';
        kitSodaSection.style.display = 'none';
    }

    currentModalTotal = currentProduct.basePrice * currentProduct.quantity; updateModalTotal(); productModal.classList.add('active');
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
    let kitPizzaName = '';
    let kitPizzaPrice = 0;
    let kitSoda = '';

    // Handle half-half pizza
    if (halfHalfCheckbox.checked && currentProduct.category === 'pizzas') {
        // First flavor is automatically set to current pizza (from disabled select)
        const firstFlavor = firstHalfSelect.options[firstHalfSelect.selectedIndex];
        const firstFlavorName = firstFlavor ? firstFlavor.value : currentProduct.name;
        const firstFlavorPrice = parseFloat(firstFlavor?.dataset.price) || getPizzaPrice(currentProduct.name);
        
        // Second flavor is selected by user
        const secondFlavor = secondHalfSelect.options[secondHalfSelect.selectedIndex];
        
        if (secondFlavor && secondFlavor.value) {
            const price2 = parseFloat(secondFlavor.dataset.price) || 0;
            
            // Half-half: average of both flavors
            const avgPrice = (firstFlavorPrice + price2) / 2;
            
            total = avgPrice;
            
            halfHalfInfo = 'Metade ' + firstFlavorName + ' / Metade ' + secondFlavor.value;
        } else {
            // If no second flavor selected, show pending selection
            halfHalfInfo = 'Metade ' + firstFlavorName + ' / ?';
        }
    }

    // Handle Kit Popular / Kit Show (single pizza)
    if (currentProduct.category === 'kits' && !currentProduct.name.toLowerCase().includes('família') && !currentProduct.name.toLowerCase().includes('familia') && !currentProduct.name.toLowerCase().includes('explosão') && !currentProduct.name.toLowerCase().includes('explosao')) {
        // Determine base price based on kit type
        let kitBasePrice = 40.00; // Kit Popular
        let kitNamePrefix = 'KIT POPULAR';
        
        if (currentProduct.name.toLowerCase().includes('show')) {
            kitBasePrice = 50.00; // Kit Show
            kitNamePrefix = 'KIT SHOW';
        }
        
        // Get selected pizza flavor for display and pricing
        const selectedPizza = kitPizzaSelect.options[kitPizzaSelect.selectedIndex];
        let kitPizzaPriceValue = 0;
        
        if (selectedPizza && selectedPizza.value) {
            kitPizzaName = selectedPizza.value;
            // Get the pizza price from the dataset
            kitPizzaPriceValue = parseFloat(selectedPizza.dataset.price) || 0;
        }
        
        // Calculate kit price:
        // Base: R$ 39,99 or R$ 49,99 for pizzas up to R$ 30
        // If pizza > R$ 30, add the difference
        let totalKitPrice = kitBasePrice;
        if (kitPizzaPriceValue > 30) {
            totalKitPrice = kitBasePrice + (kitPizzaPriceValue - 30);
        }
        
        // Handle kit half-half - recalculate based on average price
        if (kitHalfHalfCheckbox.checked) {
            const firstKitFlavor = kitFirstHalf.options[kitFirstHalf.selectedIndex];
            const secondKitFlavor = kitSecondHalf.options[kitSecondHalf.selectedIndex];
            
            if (firstKitFlavor && firstKitFlavor.value && secondKitFlavor && secondKitFlavor.value) {
                // Get prices for both flavors
                const price1 = parseFloat(firstKitFlavor.dataset.price) || 0;
                const price2 = parseFloat(secondKitFlavor.dataset.price) || 0;
                
                // Calculate average price
                const avgPrice = (price1 + price2) / 2;
                
                // If average > 30, add difference
                if (avgPrice > 30) {
                    totalKitPrice = kitBasePrice + (avgPrice - 30);
                } else {
                    totalKitPrice = kitBasePrice;
                }
                
                kitHalfHalfDisplay = 'Metade ' + firstKitFlavor.value + ' / Metade ' + secondKitFlavor.value;
            } else if (firstKitFlavor && firstKitFlavor.value) {
                kitHalfHalfDisplay = 'Metade ' + firstKitFlavor.value + ' / ?';
            }
        }
        
        total = totalKitPrice;
        
        // Store kit name prefix for WhatsApp message
        currentProduct.kitNamePrefix = kitNamePrefix;
        
        // Get selected soda
        const selectedSoda = document.querySelector('input[name="kitSoda"]:checked');
        if (selectedSoda) {
            kitSoda = selectedSoda.value;
        }
        
        // Add border price for kits (+R$ 2,00)
        const selectedBorder = document.querySelector('input[name="border"]:checked');
        if (selectedBorder && selectedBorder.value !== 'Sem borda') {
            total += 2.00; // Fixed R$ 2,00 for border
            sizeText = selectedBorder.value;
        }
    }
    // Handle Kit Família - 2 pizzas
    else if (currentProduct.category === 'kits' && (currentProduct.name.toLowerCase().includes('família') || currentProduct.name.toLowerCase().includes('familia'))) {
        const kitBasePrice = 80.00; // Kit Família base
        let kitTotalPrice = kitBasePrice;
        
        // Get Pizza 1
        const pizza1Select = kitPizza1Select.options[kitPizza1Select.selectedIndex];
        let pizza1Price = 0;
        let pizza1Name = '';
        let pizza1HalfHalfInfo = '';
        
        if (pizza1Select && pizza1Select.value) {
            pizza1Name = pizza1Select.value;
            pizza1Price = parseFloat(pizza1Select.dataset.price) || 0;
            
            // Check half-half for pizza 1
            if (kitPizza1HalfHalf.checked) {
                const p1First = kitPizza1FirstHalf.options[kitPizza1FirstHalf.selectedIndex];
                const p1Second = kitPizza1SecondHalf.options[kitPizza1SecondHalf.selectedIndex];
                if (p1First && p1First.value && p1Second && p1Second.value) {
                    const p1Price1 = parseFloat(p1First.dataset.price) || 0;
                    const p1Price2 = parseFloat(p1Second.dataset.price) || 0;
                    pizza1Price = (p1Price1 + p1Price2) / 2;
                    pizza1HalfHalfInfo = 'Metade ' + p1First.value + ' / Metade ' + p1Second.value;
                }
            }
            
            // Add difference if pizza > R$ 30
            if (pizza1Price > 30) {
                kitTotalPrice += (pizza1Price - 30);
            }
        }
        
        // Get Pizza 2
        const pizza2Select = kitPizza2Select.options[kitPizza2Select.selectedIndex];
        let pizza2Price = 0;
        let pizza2Name = '';
        let pizza2HalfHalfInfo = '';
        
        if (pizza2Select && pizza2Select.value) {
            pizza2Name = pizza2Select.value;
            pizza2Price = parseFloat(pizza2Select.dataset.price) || 0;
            
            // Check half-half for pizza 2
            if (kitPizza2HalfHalf.checked) {
                const p2First = kitPizza2FirstHalf.options[kitPizza2FirstHalf.selectedIndex];
                const p2Second = kitPizza2SecondHalf.options[kitPizza2SecondHalf.selectedIndex];
                if (p2First && p2First.value && p2Second && p2Second.value) {
                    const p2Price1 = parseFloat(p2First.dataset.price) || 0;
                    const p2Price2 = parseFloat(p2Second.dataset.price) || 0;
                    pizza2Price = (p2Price1 + p2Price2) / 2;
                    pizza2HalfHalfInfo = 'Metade ' + p2First.value + ' / Metade ' + p2Second.value;
                }
            }
            
            // Add difference if pizza > R$ 30
            if (pizza2Price > 30) {
                kitTotalPrice += (pizza2Price - 30);
            }
        }
        
        total = kitTotalPrice;
        
        // Store kit info for display
        currentProduct.kitNamePrefix = 'KIT FAMÍLIA';
        currentProduct.kitPizza1Name = pizza1Name;
        currentProduct.kitPizza2Name = pizza2Name;
        currentProduct.kitPizza1HalfHalf = pizza1HalfHalfInfo;
        currentProduct.kitPizza2HalfHalf = pizza2HalfHalfInfo;
        
        // Get selected soda
        const selectedSoda = document.querySelector('input[name="kitSoda"]:checked');
        if (selectedSoda) {
            kitSoda = selectedSoda.value;
        }
        
        // Add border price for kit família
        const selectedBorder = document.querySelector('input[name="border"]:checked');
        if (selectedBorder && selectedBorder.value !== 'Sem borda') {
            total += 2.00;
            sizeText = selectedBorder.value;
        }
    }
    
    // Handle Kit Explosão - 2 pizzas (border already included in price)
    if (currentProduct.category === 'kits' && (currentProduct.name.toLowerCase().includes('explosão') || currentProduct.name.toLowerCase().includes('explosao'))) {
        const kitBasePrice = 100.00; // Kit Explosão base
        let kitTotalPrice = kitBasePrice;
        
        // Get Pizza 1
        const pizza1Select = kitPizza1Select.options[kitPizza1Select.selectedIndex];
        let pizza1Price = 0;
        let pizza1Name = '';
        let pizza1HalfHalfInfo = '';
        
        if (pizza1Select && pizza1Select.value) {
            pizza1Name = pizza1Select.value;
            pizza1Price = parseFloat(pizza1Select.dataset.price) || 0;
            
            // Check half-half for pizza 1
            if (kitPizza1HalfHalf.checked) {
                const p1First = kitPizza1FirstHalf.options[kitPizza1FirstHalf.selectedIndex];
                const p1Second = kitPizza1SecondHalf.options[kitPizza1SecondHalf.selectedIndex];
                if (p1First && p1First.value && p1Second && p1Second.value) {
                    const p1Price1 = parseFloat(p1First.dataset.price) || 0;
                    const p1Price2 = parseFloat(p1Second.dataset.price) || 0;
                    pizza1Price = (p1Price1 + p1Price2) / 2;
                    pizza1HalfHalfInfo = 'Metade ' + p1First.value + ' / Metade ' + p1Second.value;
                }
            }
            
            // Add difference if pizza > R$ 30
            if (pizza1Price > 30) {
                kitTotalPrice += (pizza1Price - 30);
            }
        }
        
        // Get Pizza 2
        const pizza2Select = kitPizza2Select.options[kitPizza2Select.selectedIndex];
        let pizza2Price = 0;
        let pizza2Name = '';
        let pizza2HalfHalfInfo = '';
        
        if (pizza2Select && pizza2Select.value) {
            pizza2Name = pizza2Select.value;
            pizza2Price = parseFloat(pizza2Select.dataset.price) || 0;
            
            // Check half-half for pizza 2
            if (kitPizza2HalfHalf.checked) {
                const p2First = kitPizza2FirstHalf.options[kitPizza2FirstHalf.selectedIndex];
                const p2Second = kitPizza2SecondHalf.options[kitPizza2SecondHalf.selectedIndex];
                if (p2First && p2First.value && p2Second && p2Second.value) {
                    const p2Price1 = parseFloat(p2First.dataset.price) || 0;
                    const p2Price2 = parseFloat(p2Second.dataset.price) || 0;
                    pizza2Price = (p2Price1 + p2Price2) / 2;
                    pizza2HalfHalfInfo = 'Metade ' + p2First.value + ' / Metade ' + p2Second.value;
                }
            }
            
            // Add difference if pizza > R$ 30
            if (pizza2Price > 30) {
                kitTotalPrice += (pizza2Price - 30);
            }
        }
        
        total = kitTotalPrice;
        
        // Store kit info for display
        currentProduct.kitNamePrefix = 'KIT EXPLOSÃO';
        currentProduct.kitPizza1Name = pizza1Name;
        currentProduct.kitPizza2Name = pizza2Name;
        currentProduct.kitPizza1HalfHalf = pizza1HalfHalfInfo;
        currentProduct.kitPizza2HalfHalf = pizza2HalfHalfInfo;
        
        // Get selected soda
        const selectedSoda = document.querySelector('input[name="kitSoda"]:checked');
        if (selectedSoda) {
            kitSoda = selectedSoda.value;
        }
        
        // Get border (already included in price - no extra charge)
        const selectedBorder = document.querySelector('input[name="border"]:checked');
        if (selectedBorder && selectedBorder.value !== 'Sem borda') {
            sizeText = 'Borda ' + selectedBorder.value + ' (incl.)';
        }
    }

    // Add border price for pizzas
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
    currentProduct.kitPizza = kitPizzaName || null;
    currentProduct.kitSoda = kitSoda || null;
    
    modalTotalPrice.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
    
    // Show appropriate base price text
    if (currentProduct.category === 'kits') {
        // Check if it's Kit Família or Kit Explosão
        if (currentProduct.name.toLowerCase().includes('família') || currentProduct.name.toLowerCase().includes('familia')) {
            modalProductPrice.textContent = 'Kit Família: R$ 79,99 (2 pizzas até R$ 30 cada, borda +R$ 2,00)';
        } else if (currentProduct.name.toLowerCase().includes('explosão') || currentProduct.name.toLowerCase().includes('explosao')) {
            modalProductPrice.textContent = 'Kit Explosão: R$ 100,00 (2 pizzas até R$ 30 cada, borda já inclusa)';
        } else {
            // Kit Popular or Kit Show
            const selectedPizza = kitPizzaSelect.options[kitPizzaSelect.selectedIndex];
            let pizzaPrice = 0;
            if (selectedPizza && selectedPizza.value) {
                pizzaPrice = parseFloat(selectedPizza.dataset.price) || 0;
            }
            
            // Determine base price based on kit type
            let baseKitPrice = 39.99; // Kit Popular
            if (currentProduct.name.toLowerCase().includes('show')) {
                baseKitPrice = 49.99; // Kit Show
            }
            
            let displayPrice = baseKitPrice;
            if (pizzaPrice > 30) {
                displayPrice += (pizzaPrice - 30);
            }
            
            let priceNote = '(pizza até R$ 30 incl.)';
            if (pizzaPrice > 30) {
                priceNote = '(pizza > R$ 30: +R$ ' + (pizzaPrice - 30).toFixed(2).replace('.', ',') + ')';
            }
            
            modalProductPrice.textContent = 'Kit: R$ ' + displayPrice.toFixed(2).replace('.', ',') + ' ' + priceNote + ' (borda +R$ 2,00)';
        }
    } else {
        modalProductPrice.textContent = 'A partir de R$ ' + currentProduct.basePrice.toFixed(2).replace('.', ',');
    }
}

function addSelectedProduct() {
    if (!currentProduct) return;

    // Initialize itemName with the base product name
    let itemName = currentProduct.name;
    let kitNamePrefix = null;
    
    // Get selected border
    let borderText = '';
    if (currentProduct.category === 'pizzas' || currentProduct.category === 'kits') {
        const selectedBorder = document.querySelector('input[name="border"]:checked');
        borderText = selectedBorder ? selectedBorder.value : 'Sem borda';
    }

    // Get observation
    const observation = productObservation.value.trim();

    // Use the price already calculated in updateModalTotal (which includes half-half + border + quantity)
    // We need the unit price (without quantity) for the cart item
    let unitPrice = currentModalTotal / currentProduct.quantity;
    
    // Handle half-half for display
    let halfHalfDisplay = null;
    if (halfHalfCheckbox.checked && currentProduct.category === 'pizzas') {
        const firstFlavor = firstHalfSelect.options[firstHalfSelect.selectedIndex];
        const firstFlavorName = firstFlavor ? firstFlavor.value : currentProduct.name;
        const secondFlavor = secondHalfSelect.options[secondHalfSelect.selectedIndex];
        
        if (secondFlavor && secondFlavor.value) {
            halfHalfDisplay = 'Metade ' + firstFlavorName + ' / Metade ' + secondFlavor.value;
        } else {
            halfHalfDisplay = 'Metade ' + firstFlavorName + ' / ?';
        }
    }
    
    // Handle kit options for Kit Popular/Kit Show (single pizza)
    let kitPizzaDisplay = null;
    let kitSodaDisplay = null;
    let kitHalfHalfDisplay = null;
    
    // Handle Kit Família - 2 pizzas
    if (currentProduct.category === 'kits' && (currentProduct.name.toLowerCase().includes('família') || currentProduct.name.toLowerCase().includes('familia'))) {
        const pizza1Select = kitPizza1Select.options[kitPizza1Select.selectedIndex];
        const pizza2Select = kitPizza2Select.options[kitPizza2Select.selectedIndex];
        
        let pizza1Name = pizza1Select?.value || '';
        let pizza2Name = pizza2Select?.value || '';
        
        // Handle half-half for pizza 1
        let pizza1HalfDisplay = null;
        if (kitPizza1HalfHalf.checked) {
            const p1First = kitPizza1FirstHalf.options[kitPizza1FirstHalf.selectedIndex];
            const p1Second = kitPizza1SecondHalf.options[kitPizza1SecondHalf.selectedIndex];
            if (p1First && p1First.value && p1Second && p1Second.value) {
                pizza1HalfDisplay = 'Metade ' + p1First.value + ' / Metade ' + p1Second.value;
            }
        }
        
        // Handle half-half for pizza 2
        let pizza2HalfDisplay = null;
        if (kitPizza2HalfHalf.checked) {
            const p2First = kitPizza2FirstHalf.options[kitPizza2FirstHalf.selectedIndex];
            const p2Second = kitPizza2SecondHalf.options[kitPizza2SecondHalf.selectedIndex];
            if (p2First && p2First.value && p2Second && p2Second.value) {
                pizza2HalfDisplay = 'Metade ' + p2First.value + ' / Metade ' + p2Second.value;
            }
        }
        
        // Build the name
        kitNamePrefix = 'KIT FAMÍLIA';
        let displayPizza1 = pizza1HalfDisplay ? pizza1HalfDisplay.replace(/Metade\s+/g, '') : pizza1Name;
        let displayPizza2 = pizza2HalfDisplay ? pizza2HalfDisplay.replace(/Metade\s+/g, '') : pizza2Name;
        
        if (pizza1Name && pizza2Name) {
            itemName = 'KIT FAMÍLIA (' + displayPizza1 + ' + ' + displayPizza2 + ')';
        } else if (pizza1Name) {
            itemName = 'KIT FAMÍLIA (' + displayPizza1 + ')';
        } else if (pizza2Name) {
            itemName = 'KIT FAMÍLIA (' + displayPizza2 + ')';
        }
        
        // Store kit Família info
        currentProduct.kitNamePrefix = 'KIT FAMÍLIA';
        currentProduct.kitPizza1Name = pizza1Name;
        currentProduct.kitPizza2Name = pizza2Name;
        currentProduct.kitPizza1HalfHalf = pizza1HalfDisplay;
        currentProduct.kitPizza2HalfHalf = pizza2HalfDisplay;
    }
    // Handle Kit Explosão - 2 pizzas (border included)
    else if (currentProduct.category === 'kits' && (currentProduct.name.toLowerCase().includes('explosão') || currentProduct.name.toLowerCase().includes('explosao'))) {
        // Get selected soda
        const selectedSoda = document.querySelector('input[name="kitSoda"]:checked');
        if (selectedSoda) {
            kitSodaDisplay = selectedSoda.value;
        }
        
        const pizza1Select = kitPizza1Select.options[kitPizza1Select.selectedIndex];
        const pizza2Select = kitPizza2Select.options[kitPizza2Select.selectedIndex];
        
        let pizza1Name = pizza1Select?.value || '';
        let pizza2Name = pizza2Select?.value || '';
        
        // Handle half-half for pizza 1
        let pizza1HalfDisplay = null;
        if (kitPizza1HalfHalf.checked) {
            const p1First = kitPizza1FirstHalf.options[kitPizza1FirstHalf.selectedIndex];
            const p1Second = kitPizza1SecondHalf.options[kitPizza1SecondHalf.selectedIndex];
            if (p1First && p1First.value && p1Second && p1Second.value) {
                pizza1HalfDisplay = 'Metade ' + p1First.value + ' / Metade ' + p1Second.value;
            }
        }
        
        // Handle half-half for pizza 2
        let pizza2HalfDisplay = null;
        if (kitPizza2HalfHalf.checked) {
            const p2First = kitPizza2FirstHalf.options[kitPizza2FirstHalf.selectedIndex];
            const p2Second = kitPizza2SecondHalf.options[kitPizza2SecondHalf.selectedIndex];
            if (p2First && p2First.value && p2Second && p2Second.value) {
                pizza2HalfDisplay = 'Metade ' + p2First.value + ' / Metade ' + p2Second.value;
            }
        }
        
        // Build the name
        kitNamePrefix = 'KIT EXPLOSÃO';
        let displayPizza1 = pizza1HalfDisplay ? pizza1HalfDisplay.replace(/Metade\s+/g, '') : pizza1Name;
        let displayPizza2 = pizza2HalfDisplay ? pizza2HalfDisplay.replace(/Metade\s+/g, '') : pizza2Name;
        
        if (pizza1Name && pizza2Name) {
            itemName = 'KIT EXPLOSÃO (' + displayPizza1 + ' + ' + displayPizza2 + ')';
        } else if (pizza1Name) {
            itemName = 'KIT EXPLOSÃO (' + displayPizza1 + ')';
        } else if (pizza2Name) {
            itemName = 'KIT EXPLOSÃO (' + displayPizza2 + ')';
        }
        
        // Store kit Explosão info
        currentProduct.kitNamePrefix = 'KIT EXPLOSÃO';
        currentProduct.kitPizza1Name = pizza1Name;
        currentProduct.kitPizza2Name = pizza2Name;
        currentProduct.kitPizza1HalfHalf = pizza1HalfDisplay;
        currentProduct.kitPizza2HalfHalf = pizza2HalfDisplay;
    }
    // Handle Kit Popular / Kit Show (single pizza)
    else if (currentProduct.category === 'kits' && !currentProduct.name.toLowerCase().includes('família') && !currentProduct.name.toLowerCase().includes('familia') && !currentProduct.name.toLowerCase().includes('explosão') && !currentProduct.name.toLowerCase().includes('explosao')) {
        // Get selected pizza flavor
        const selectedPizza = kitPizzaSelect.options[kitPizzaSelect.selectedIndex];
        if (selectedPizza && selectedPizza.value) {
            kitPizzaDisplay = selectedPizza.value;
        }
        
        // Get selected soda
        const selectedSoda = document.querySelector('input[name="kitSoda"]:checked');
        if (selectedSoda) {
            kitSodaDisplay = selectedSoda.value;
        }
        
        // Handle kit half-half
        if (kitHalfHalfCheckbox.checked) {
            // First flavor is auto-filled with selected pizza
            const firstKitFlavorValue = kitFirstHalf.options[kitFirstHalf.selectedIndex]?.value;
            const secondKitFlavor = kitSecondHalf.options[kitSecondHalf.selectedIndex];
            
            if (firstKitFlavorValue && secondKitFlavor && secondKitFlavor.value) {
                kitHalfHalfDisplay = 'Metade ' + firstKitFlavorValue + ' / Metade ' + secondKitFlavor.value;
            } else if (firstKitFlavorValue) {
                kitHalfHalfDisplay = 'Metade ' + firstKitFlavorValue + ' / ?';
            }
        }
        
        // Determine kit prefix based on kit type
        if (currentProduct.name.toLowerCase().includes('show')) {
            kitNamePrefix = 'KIT SHOW';
        } else {
            kitNamePrefix = 'KIT POPULAR';
        }
        if (kitPizzaDisplay) {
            itemName = kitNamePrefix + ' (' + kitPizzaDisplay + ')';
        }
    }
    
    // Regular products (pizzas, hamburgers) don't need kit-specific handling

    const item = {
        name: itemName,
        price: unitPrice,
        quantity: currentProduct.quantity,
        image: currentProduct.image,
        halfHalf: halfHalfDisplay || kitHalfHalfDisplay,
        border: borderText,
        observation: observation || null,
        kitSoda: kitSodaDisplay,
        kitPizza: kitPizzaDisplay,
        kitNamePrefix: kitNamePrefix,
        // Kit Família properties
        kitPizza1Name: currentProduct.kitPizza1Name || null,
        kitPizza2Name: currentProduct.kitPizza2Name || null,
        kitPizza1HalfHalf: currentProduct.kitPizza1HalfHalf || null,
        kitPizza2HalfHalf: currentProduct.kitPizza2HalfHalf || null
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
        
        // Build item description (same format as WhatsApp message)
        let itemDetails = item.quantity + 'x ' + item.name;
        if (item.halfHalf) {
            let halfHalfText = item.halfHalf.replace(/Metade\s+/g, '');
            itemDetails = item.quantity + 'x ' + halfHalfText;
        }
        if (item.border && item.border !== 'Sem borda') {
            itemDetails += ' (C/ Borda ' + item.border + ')';
        }
        
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
        
        // Build item description
        let itemDesc = '';
        
        // Check if it's Kit Família or Kit Explosão
        if (item.kitNamePrefix === 'KIT FAMÍLIA' || item.kitNamePrefix === 'KIT EXPLOSÃO') {
            // Kit Família or Kit Explosão format: KIT FAMÍLIA/KIT EXPLOSÃO (Pizza1 + Pizza2)
            let pizza1Info = item.kitPizza1Name || '';
            let pizza2Info = item.kitPizza2Name || '';
            
            // Apply half-half formatting
            if (item.kitPizza1HalfHalf) {
                pizza1Info = item.kitPizza1HalfHalf.replace(/Metade\s+/g, '');
            }
            if (item.kitPizza2HalfHalf) {
                pizza2Info = item.kitPizza2HalfHalf.replace(/Metade\s+/g, '');
            }
            
            if (pizza1Info && pizza2Info) {
                itemDesc = item.quantity + 'x ' + item.kitNamePrefix + ' (' + pizza1Info + ' + ' + pizza2Info + ')';
            } else if (pizza1Info) {
                itemDesc = item.quantity + 'x ' + item.kitNamePrefix + ' (' + pizza1Info + ')';
            } else if (pizza2Info) {
                itemDesc = item.quantity + 'x ' + item.kitNamePrefix + ' (' + pizza2Info + ')';
            } else {
                itemDesc = item.quantity + 'x ' + item.name;
            }
        } else {
            // Get kit prefix (KIT POPULAR or KIT SHOW)
            const kitPrefix = item.kitNamePrefix || (item.kitPizza ? 'KIT POPULAR' : null);
            
            // Add kit prefix for kits
            if (kitPrefix) {
                itemDesc = item.quantity + 'x ' + kitPrefix + ' (';
            } else {
                itemDesc = item.quantity + 'x ' + item.name;
            }
            
            if (item.halfHalf) {
                // Replace "Metade Pizza X / Metade Y" with just "Pizza X / Metade Y"
                let halfHalfText = item.halfHalf.replace(/Metade\s+/g, '');
                if (kitPrefix) {
                    itemDesc = item.quantity + 'x ' + kitPrefix + ' (' + halfHalfText;
                } else {
                    itemDesc = item.quantity + 'x ' + halfHalfText;
                }
            }
            
            // For kits, we need to get the pizza name without the prefix
            if (kitPrefix && !item.halfHalf) {
                // Extract pizza name from "KIT POPULAR (Pizza Name)" or "KIT SHOW (Pizza Name)"
                const pizzaMatch = item.name.match(/\(.*\)/);
                if (pizzaMatch) {
                    itemDesc = item.quantity + 'x ' + kitPrefix + ' ' + pizzaMatch[0];
                }
            }
        }
        
        if (item.border && item.border !== 'Sem borda') {
            itemDesc += ' (C/ Borda ' + item.border + ')';
        }
        
        // Add soda for kits
        if (item.kitSoda) {
            itemDesc += ' [Refri: ' + item.kitSoda + ']';
        }
        
        // Close parenthesis for kits
        if (item.kitPizza || item.kitNamePrefix === 'KIT FAMÍLIA' || item.kitNamePrefix === 'KIT EXPLOSÃO') {
            if (item.kitNamePrefix !== 'KIT FAMÍLIA' && item.kitNamePrefix !== 'KIT EXPLOSÃO') {
                itemDesc += ')';
            }
        } else if (item.kitPizza) {
            itemDesc += ')';
        }
        
        message += itemDesc + ' - R$ ' + itemTotal.toFixed(2).replace('.', ',') + '\n';
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
        // Ensure proper decimal format
        let changeVal = customerChange.value.replace(',', '.');
        changeVal = parseFloat(changeVal) || 0;
        message += 'Troco para: ' + changeVal.toFixed(2).replace('.', ',') + '\n';
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
