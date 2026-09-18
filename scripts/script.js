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

/* ==========================================================================
   Gestión de Visitante y Saludo (LocalStorage)
   ========================================================================== */
const STORAGE_KEY_USER_NAME = 'dulce_capricho_user_name';
const STORAGE_KEY_MODAL_DISMISSED = 'dulce_capricho_modal_dismissed';

const userGreeting = document.getElementById('user-greeting');
const editNameBtn = document.getElementById('edit-name-btn');
const welcomeModal = document.getElementById('welcome-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalSkipBtn = document.getElementById('modal-skip-btn');
const welcomeForm = document.getElementById('welcome-form');
const userNameInput = document.getElementById('user-name-input');
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');

const updateGreeting = (name) => {
  if (!userGreeting) return;
  if (name && name.trim() !== '') {
    userGreeting.textContent = `¡Hola, ${name.trim()}! Qué gusto tenerte en Dulce Capricho 🍰`;
    if (editNameBtn) editNameBtn.setAttribute('title', `Cambiar nombre (actual: ${name.trim()})`);
  } else {
    userGreeting.textContent = '¡Bienvenido/a a Dulce Capricho! 🧁';
    if (editNameBtn) editNameBtn.setAttribute('title', 'Ingresar tu nombre');
  }
};

const openWelcomeModal = (isEditing = false) => {
  if (!welcomeModal) return;
  const currentName = localStorage.getItem(STORAGE_KEY_USER_NAME) || '';

  if (isEditing) {
    if (modalTitle) modalTitle.textContent = 'Modificar tu nombre';
    if (modalSubtitle) modalSubtitle.textContent = 'Actualiza tu nombre para que podamos saludarte correctamente:';
    if (userNameInput) userNameInput.value = currentName;
  } else {
    if (modalTitle) modalTitle.textContent = '¡Te damos la bienvenida!';
    if (modalSubtitle) modalSubtitle.textContent = 'Queremos personalizar tu experiencia en Dulce Capricho. ¿Cuál es tu nombre?';
    if (userNameInput) userNameInput.value = '';
  }

  welcomeModal.classList.add('is-open');
  welcomeModal.setAttribute('aria-hidden', 'false');
  if (userNameInput) {
    setTimeout(() => userNameInput.focus(), 150);
  }
};

const closeWelcomeModal = () => {
  if (!welcomeModal) return;
  welcomeModal.classList.remove('is-open');
  welcomeModal.setAttribute('aria-hidden', 'true');
};

if (welcomeModal) {
  const savedUserName = localStorage.getItem(STORAGE_KEY_USER_NAME);
  const wasDismissed = localStorage.getItem(STORAGE_KEY_MODAL_DISMISSED) === 'true';

  if (savedUserName) {
    updateGreeting(savedUserName);
  } else {
    updateGreeting('');
    // Si no había nombre guardado y no se ha omitido expresamente, mostrar modal
    if (!wasDismissed) {
      setTimeout(() => openWelcomeModal(false), 500);
    }
  }

  if (welcomeForm && userNameInput) {
    welcomeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const enteredName = userNameInput.value.trim();
      if (enteredName) {
        localStorage.setItem(STORAGE_KEY_USER_NAME, enteredName);
        localStorage.removeItem(STORAGE_KEY_MODAL_DISMISSED);
        updateGreeting(enteredName);
        closeWelcomeModal();
      }
    });
  }

  if (modalSkipBtn) {
    modalSkipBtn.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY_MODAL_DISMISSED, 'true');
      closeWelcomeModal();
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      closeWelcomeModal();
    });
  }

  if (editNameBtn) {
    editNameBtn.addEventListener('click', () => {
      openWelcomeModal(true);
    });
  }

  // Cerrar al hacer clic en el backdrop fuera de la tarjeta
  welcomeModal.addEventListener('click', (event) => {
    if (event.target === welcomeModal) {
      closeWelcomeModal();
    }
  });

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && welcomeModal.classList.contains('is-open')) {
      closeWelcomeModal();
    }
  });
}

/* ==========================================================================
   Contador de Tiempo de Uso en el Sitio (LocalStorage)
   ========================================================================== */
const STORAGE_KEY_TIME_SPENT = 'dulce_capricho_time_spent_seconds';
const timerDisplay = document.getElementById('timer-display');
const resetTimerButton = document.getElementById('reset-timer');

const formatTimeSpent = (totalSeconds) => {
  const seconds = totalSeconds % 60;
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor(totalSeconds / 3600);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

if (timerDisplay) {
  let totalSecondsSpent = Number(localStorage.getItem(STORAGE_KEY_TIME_SPENT) || 0);
  timerDisplay.textContent = formatTimeSpent(totalSecondsSpent);

  const startTimer = () => {
    return window.setInterval(() => {
      totalSecondsSpent += 1;
      timerDisplay.textContent = formatTimeSpent(totalSecondsSpent);
      localStorage.setItem(STORAGE_KEY_TIME_SPENT, String(totalSecondsSpent));
    }, 1000);
  };

  let timerInterval = startTimer();

  const resetTimer = () => {
    window.clearInterval(timerInterval);
    localStorage.removeItem(STORAGE_KEY_TIME_SPENT);
    totalSecondsSpent = 0;
    timerDisplay.textContent = '0s';
    timerInterval = startTimer();
  };

  if (resetTimerButton) {
    resetTimerButton.addEventListener('click', resetTimer);
  }

  const logoutButton = document.getElementById('logout-btn');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      resetTimer();
    });
  }
}

const notificationPermissionButton = document.getElementById('notification-permission-btn');
const STORAGE_KEY_NOTIFICATIONS_ENABLED = 'dulce_capricho_notifications_enabled';
let notificationLoopInterval = null;

const getNotificationPreference = () => {
  const storedValue = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS_ENABLED);
  return storedValue === null ? true : storedValue === 'true';
};

const setNotificationPreference = (isEnabled) => {
  localStorage.setItem(STORAGE_KEY_NOTIFICATIONS_ENABLED, String(isEnabled));
};

const sendPromotionNotification = () => {
  if (!('Notification' in window) || Notification.permission !== 'granted' || !getNotificationPreference()) {
    return;
  }

  new Notification('Dulce Capricho', {
    body: '✨ Promo del minuto: disfruta un sabor especial en tus postres favoritos.',
    icon: 'images/logo.jpg'
  });
};

const startNotificationLoop = () => {
  if (notificationLoopInterval) {
    window.clearInterval(notificationLoopInterval);
  }

  if (!getNotificationPreference()) {
    return;
  }

  sendPromotionNotification();
  notificationLoopInterval = window.setInterval(() => {
    sendPromotionNotification();
  }, 60000);
};

const stopNotificationLoop = () => {
  if (notificationLoopInterval) {
    window.clearInterval(notificationLoopInterval);
    notificationLoopInterval = null;
  }
};

const setNotificationButtonState = (permission) => {
  if (!notificationPermissionButton) return;

  if (permission === 'granted') {
    const notificationsEnabled = getNotificationPreference();

    notificationPermissionButton.textContent = notificationsEnabled
      ? '🔔 Notificaciones activadas'
      : '🔕 Notificaciones desactivadas';

    notificationPermissionButton.classList.toggle('is-enabled', notificationsEnabled);
    notificationPermissionButton.disabled = false;

    if (notificationsEnabled) {
      startNotificationLoop();
    } else {
      stopNotificationLoop();
    }
    return;
  }

  if (permission === 'denied') {
    notificationPermissionButton.textContent = '🔕 Notificaciones bloqueadas';
    notificationPermissionButton.classList.remove('is-enabled');
    notificationPermissionButton.disabled = true;
    stopNotificationLoop();
    return;
  }

  notificationPermissionButton.textContent = '🔔 Notificaciones';
  notificationPermissionButton.classList.remove('is-enabled');
  notificationPermissionButton.disabled = false;
  stopNotificationLoop();
};

const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    if (notificationPermissionButton) {
      notificationPermissionButton.textContent = 'Notificaciones no disponibles';
      notificationPermissionButton.disabled = true;
    }
    return;
  }

  const currentPermission = Notification.permission;

  if (currentPermission === 'granted') {
    const notificationsEnabled = getNotificationPreference();

    if (notificationsEnabled) {
      setNotificationPreference(false);
      setNotificationButtonState('granted');
      return;
    }

    setNotificationPreference(true);
    setNotificationButtonState('granted');
    return;
  }

  if (currentPermission === 'denied') {
    setNotificationButtonState('denied');
    return;
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      setNotificationPreference(true);
      setNotificationButtonState('granted');
      return;
    }

    setNotificationButtonState('denied');
  } catch (error) {
    setNotificationButtonState('denied');
  }
};

if (notificationPermissionButton) {
  if (!('Notification' in window)) {
    notificationPermissionButton.textContent = 'Notificaciones no disponibles';
    notificationPermissionButton.disabled = true;
  } else {
    setNotificationButtonState(Notification.permission);
    notificationPermissionButton.addEventListener('click', requestNotificationPermission);
  }
}

