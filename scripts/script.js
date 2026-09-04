const toggleButton = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const audioToggle = document.querySelector('.audio-toggle');
const dessertAudio = document.getElementById('dessert-audio');
const cartToggle = document.querySelector('.cart-toggle');
const cartPanel = document.querySelector('.cart-panel');
const cartClose = document.querySelector('.cart-close');
const cartItems = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotal = document.querySelector('.cart-total strong');
const cart = [];

if (toggleButton && navMenu) {
  toggleButton.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    toggleButton.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      toggleButton.setAttribute('aria-expanded', 'false');
    });
  });
}

if (audioToggle && dessertAudio) {
  const setAudioVisualState = (isMuted) => {
    audioToggle.classList.toggle('is-muted', isMuted);
    audioToggle.setAttribute('aria-pressed', String(isMuted));
    const icon = audioToggle.querySelector('.audio-toggle__icon');
    const label = audioToggle.querySelector('.audio-toggle__label');

    if (icon) {
      icon.textContent = isMuted ? '🔇' : '🔊';
    }

    if (label) {
      label.textContent = isMuted ? 'Silenciado' : 'Sonido';
    }
  };

  dessertAudio.muted = true;
  setAudioVisualState(true);

  audioToggle.addEventListener('click', async () => {
    if (dessertAudio.muted) {
      try {
        dessertAudio.muted = false;
        dessertAudio.volume = 0.5;
        await dessertAudio.play();
        setAudioVisualState(false);
      } catch (error) {
        dessertAudio.muted = true;
        setAudioVisualState(true);
      }
      return;
    }

    dessertAudio.muted = true;
    dessertAudio.pause();
    setAudioVisualState(true);
  });
}

if (cartToggle && cartPanel && cartClose && cartItems && cartCount && cartTotal) {
  const formatPrice = (price) => `$${price.toFixed(2)}`;

  const renderCart = () => {
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartCount.textContent = itemCount;
    cartTotal.textContent = formatPrice(total);

    if (!cart.length) {
      cartItems.innerHTML = '<p class="cart-empty">Aún no has agregado postres.</p>';
      return;
    }

    cartItems.innerHTML = cart.map((item) => `
      <div class="cart-item">
        <strong>${item.name}</strong>
        <span>${item.quantity} x ${formatPrice(item.price)}</span>
        <button type="button" data-remove="${item.name}">Quitar</button>
      </div>
    `).join('');
  };

  const setCartOpen = (isOpen) => {
    cartPanel.classList.toggle('is-open', isOpen);
    cartPanel.setAttribute('aria-hidden', String(!isOpen));
    cartToggle.setAttribute('aria-expanded', String(isOpen));
  };

  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.product-card');
      const name = card.dataset.name;
      const price = Number(card.dataset.price);
      const existingItem = cart.find((item) => item.name === name);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      button.classList.add('is-added');
      button.textContent = 'Agregado';
      window.setTimeout(() => {
        button.classList.remove('is-added');
        button.textContent = 'Agregar al carrito';
      }, 900);
      renderCart();
    });
  });

  cartToggle.addEventListener('click', () => setCartOpen(true));
  cartClose.addEventListener('click', () => setCartOpen(false));
  cartItems.addEventListener('click', (event) => {
    const removeButton = event.target.closest('[data-remove]');
    if (!removeButton) return;
    const itemIndex = cart.findIndex((item) => item.name === removeButton.dataset.remove);
    if (itemIndex !== -1) cart.splice(itemIndex, 1);
    renderCart();
  });

  renderCart();
}

const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
