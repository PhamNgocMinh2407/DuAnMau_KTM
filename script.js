document.addEventListener("DOMContentLoaded", function () {
  /* ============================= */
  /* ===== CLOSE DROPDOWNS ======= */
  /* ============================= */
  document.addEventListener("click", function (e) {
    const cartMenu = document.getElementById("cart-menu");
    const cartIcon = document.querySelector(".cart-icon");
    const profileMenu = document.getElementById("profile-menu");
    const account = document.querySelector(".account");

    if (cartMenu && cartIcon && !cartIcon.contains(e.target)) {
      cartMenu.classList.remove("show");
    }

    if (profileMenu && account && !account.contains(e.target)) {
      profileMenu.style.display = "none";
    }
  });

  /* ============================= */
  /* ===== MAIN BANNER SLIDER ==== */
  /* ============================= */
  let mainIndex = 0;
  const mainSlider = document.querySelector(".main-slider");
  const mainSlides = document.querySelectorAll(".main-slide");
  const mainNext = document.querySelector(".main-next");
  const mainPrev = document.querySelector(".main-prev");

  function updateMainSlider() {
    if (!mainSlider) return;
    mainSlider.style.transform = "translateX(-" + (mainIndex * 100) + "%)";
  }

  if (mainNext) {
    mainNext.addEventListener("click", function () {
      mainIndex++;
      if (mainIndex >= mainSlides.length) mainIndex = 0;
      updateMainSlider();
    });
  }

  if (mainPrev) {
    mainPrev.addEventListener("click", function () {
      mainIndex--;
      if (mainIndex < 0) mainIndex = mainSlides.length - 1;
      updateMainSlider();
    });
  }

  if (mainSlides.length > 0) {
    setInterval(function () {
      mainIndex++;
      if (mainIndex >= mainSlides.length) mainIndex = 0;
      updateMainSlider();
    }, 4000);
  }

  /* ============================= */
  /* ===== SMALL BANNER SLIDER === */
  /* ============================= */
  const smallBanners = document.querySelectorAll(".small-banner");

  smallBanners.forEach(function (banner) {
    let index = 0;
    const slider = banner.querySelector(".small-slider");
    const slides = banner.querySelectorAll(".small-slide");
    const next = banner.querySelector(".small-next");
    const prev = banner.querySelector(".small-prev");

    function updateSmall() {
      if (!slider) return;
      slider.style.transform = "translateX(-" + (index * 100) + "%)";
    }

    if (next) {
      next.addEventListener("click", function () {
        index++;
        if (index >= slides.length) index = 0;
        updateSmall();
      });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        index--;
        if (index < 0) index = slides.length - 1;
        updateSmall();
      });
    }
  });

  /* ============================= */
  /* ===== HIỂN THỊ USER ========= */
  /* ============================= */
  let userData = localStorage.getItem("currentUser");

  if (userData) {
    try {
      const user = JSON.parse(userData);
      const profileName = document.getElementById("profile-name");

      if (profileName && user.name) {
        profileName.innerText = user.name;
      }
    } catch (err) {
      console.error("Lỗi currentUser:", err);
    }
  }

  /* ============================= */
  /* ===== GLOBAL SEARCH ========= */
  /* ============================= */
  setupGlobalSearch();

  /* ============================= */
  /* ===== CART COUNT ============ */
  /* ============================= */
  updateCartCount();
});

/* ============================= */
/* ===== HELPERS =============== */
/* ============================= */
function normalizeText(text) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getItemQty(item) {
  return item.quantity || item.qty || 1;
}

/* ============================= */
/* ===== GLOBAL SEARCH ========= */
/* ============================= */
function setupGlobalSearch() {
  const searchBoxes = document.querySelectorAll(".search-box");

  searchBoxes.forEach(function (box) {
    const input = box.querySelector("input");
    const button = box.querySelector("button");

    if (!input || !button) return;

    box.style.position = "relative";

    let suggestionBox = box.querySelector(".search-suggestions");

    if (!suggestionBox) {
      suggestionBox = document.createElement("div");
      suggestionBox.className = "search-suggestions";
      suggestionBox.style.position = "absolute";
      suggestionBox.style.top = "100%";
      suggestionBox.style.left = "0";
      suggestionBox.style.right = "0";
      suggestionBox.style.background = "#fff";
      suggestionBox.style.border = "1px solid #e5e7eb";
      suggestionBox.style.borderRadius = "12px";
      suggestionBox.style.boxShadow = "0 10px 24px rgba(0,0,0,0.08)";
      suggestionBox.style.marginTop = "8px";
      suggestionBox.style.zIndex = "999";
      suggestionBox.style.overflow = "hidden";
      suggestionBox.style.display = "none";
      box.appendChild(suggestionBox);
    }

    function hideSuggestions() {
      suggestionBox.style.display = "none";
      suggestionBox.innerHTML = "";
    }

    function showSuggestions(keyword) {
      const normalizedKeyword = normalizeText(keyword);

      if (!normalizedKeyword) {
        hideSuggestions();
        return;
      }

      const matched = globalSearchProducts.filter(product => {
        const searchText = normalizeText(
          `${product.name} ${product.brand} ${product.category}`
        );
        return searchText.includes(normalizedKeyword);
      }).slice(0, 6);

      if (matched.length === 0) {
        hideSuggestions();
        return;
      }

      suggestionBox.innerHTML = matched.map(product => `
        <a
          href="2.product-detail.html?id=${product.id}"
          style="
            display:flex;
            flex-direction:column;
            gap:2px;
            padding:12px 14px;
            text-decoration:none;
            color:#111827;
            border-bottom:1px solid #f1f5f9;
          "
          class="search-suggestion-item"
        >
          <span style="font-size:14px; font-weight:700;">${product.name}</span>
          <span style="font-size:12px; color:#64748b;">${product.brand} • ${product.category}</span>
        </a>
      `).join("");

      suggestionBox.style.display = "block";

      const items = suggestionBox.querySelectorAll(".search-suggestion-item");
      items.forEach((item, index) => {
        if (index === items.length - 1) {
          item.style.borderBottom = "none";
        }

        item.addEventListener("mouseenter", function () {
          item.style.background = "#f8fafc";
        });

        item.addEventListener("mouseleave", function () {
          item.style.background = "#fff";
        });
      });
    }

    function doSearch() {
      const keyword = input.value.trim();

      if (!keyword) {
        window.location.href = "2.product.html";
        return;
      }

      window.location.href = "2.product.html?search=" + encodeURIComponent(keyword);
    }

    button.addEventListener("click", doSearch);

    input.addEventListener("input", function () {
      showSuggestions(input.value);
    });

    input.addEventListener("focus", function () {
      showSuggestions(input.value);
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        doSearch();
      }
    });

    document.addEventListener("click", function (e) {
      if (!box.contains(e.target)) {
        hideSuggestions();
      }
    });
  });
}

/* ============================= */
/* ===== SUGGESTED PRODUCTS ==== */
/* ============================= */
const suggestedGrid = document.querySelector(".suggested-grid");
const suggestedNext = document.querySelector(".suggested-next");
const suggestedPrev = document.querySelector(".suggested-prev");
const globalSearchProducts = [
  { id: "ins15", name: "Dell Inspiron 15 (i5)", brand: "Dell", category: "Văn phòng" },
  { id: "vivobook14", name: "ASUS VivoBook 14", brand: "ASUS", category: "Học tập" },
  { id: "pav14", name: "HP Pavilion 14 (16GB)", brand: "HP", category: "Creator" },
  { id: "nitro5", name: "Acer Nitro 5 (RTX)", brand: "Acer", category: "Gaming" },
  { id: "thinkpad-e14", name: "Lenovo ThinkPad E14", brand: "Lenovo", category: "Văn phòng" },
  { id: "mac-air-m1", name: "MacBook Air M1", brand: "Apple", category: "Creator" },
  { id: "msi-modern15", name: "MSI Modern 15", brand: "MSI", category: "Học tập" },
  { id: "asus-tuf-f15", name: "ASUS TUF Gaming F15", brand: "ASUS", category: "Gaming" },
  { id: "rog-zephyrus-ga403wm", name: "ROG Zephyrus GA403WM", brand: "ASUS", category: "Gaming" },
  { id: "tuf-gaming-f16-fx607vu", name: "TUF Gaming F16 FX607VU", brand: "ASUS", category: "Gaming" },
  { id: "asus-gaming-v16-v3607vh", name: "ASUS Gaming V16 V3607VH", brand: "ASUS", category: "Gaming" },
  { id: "lenovo-loq-e-15iax9e", name: "Laptop Lenovo Gaming LOQ E 15IAX9E", brand: "Lenovo", category: "Gaming" },
  { id: "dell-latitude-3450", name: "Dell Latitude 3450", brand: "Dell", category: "Văn phòng" },
  { id: "dell-vostro-3420", name: "Dell Vostro 14 3420", brand: "Dell", category: "Văn phòng" },
  { id: "hp-probook-14-r5-220", name: "HP ProBook 14 R5-220", brand: "HP", category: "Văn phòng" },
  { id: "student-acer-aspire", name: "Acer Aspire 5", brand: "Acer", category: "Học tập" },
  { id: "student-lenovo-ideapad", name: "Lenovo IdeaPad Slim 3", brand: "Lenovo", category: "Học tập" },
  { id: "student-dell-vostro", name: "Dell Vostro 14", brand: "Dell", category: "Học tập" },
  { id: "student-hp-14s", name: "HP 14s", brand: "HP", category: "Học tập" },
  { id: "zenbook14-oled", name: "ASUS ZenBook 14 OLED", brand: "ASUS", category: "Creator" },
  { id: "creator-lenovo-yoga", name: "Lenovo Yoga Slim 7 Pro", brand: "Lenovo", category: "Creator" },
  { id: "creator-msi-prestige", name: "MSI Prestige 14", brand: "MSI", category: "Creator" },
  { id: "creator-acer-swiftx", name: "Acer Swift X", brand: "Acer", category: "Creator" }
];
if (suggestedGrid && suggestedNext && suggestedPrev) {
  const itemWidth = 200;
  let scrollPosition = 0;

  suggestedNext.addEventListener("click", function () {
    scrollPosition += itemWidth;
    suggestedGrid.scrollLeft = scrollPosition;
  });

  suggestedPrev.addEventListener("click", function () {
    scrollPosition -= itemWidth;
    if (scrollPosition < 0) scrollPosition = 0;
    suggestedGrid.scrollLeft = scrollPosition;
  });
}

/* ============================= */
/* ===== CART FUNCTIONS ======== */
/* ============================= */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();

  const total = cart.reduce(function (sum, item) {
    return sum + getItemQty(item);
  }, 0);

  const el = document.getElementById("cart-count");

  if (el) {
    el.innerText = total;
  }
}

function openCart() {
  const cartMenu = document.getElementById("cart-menu");

  if (cartMenu) {
    if (cartMenu.classList.contains("show")) {
      cartMenu.classList.remove("show");
    } else {
      cartMenu.classList.add("show");
      renderCartPreview();
    }
  } else {
    window.location.href = "cart.html";
  }
}

/* ============================= */
/* ===== ACCOUNT CLICK ========= */
/* ============================= */
function handleAccountClick() {
  const user = localStorage.getItem("currentUser");

  if (user) {
    toggleMenu();
  } else {
    window.location.href = "2.login.html";
  }
}

/* ============================= */
/* ===== PROFILE PAGE ========== */
/* ============================= */
function openProfile() {
  const user = localStorage.getItem("currentUser");

  if (user) {
    window.location.href = "profile.html";
  } else {
    window.location.href = "2.login.html";
  }
}

/* ============================= */
/* ===== CART PREVIEW ========== */
/* ============================= */
function renderCartPreview() {
  const cart = getCart();
  const itemsList = document.getElementById("cart-items-list");
  const cartFooter = document.getElementById("cart-footer");

  if (!itemsList || !cartFooter) return;

  if (cart.length === 0) {
    itemsList.innerHTML = '<p style="text-align:center; padding:20px;">Giỏ hàng trống</p>';
    cartFooter.style.display = "none";
    return;
  }

  let total = 0;
  let html = "";

  cart.forEach(function (item) {
    const qty = getItemQty(item);
    const itemTotal = (item.price || 0) * qty;
    total += itemTotal;

    html += `
      <div class="cart-item-row">
        <img src="${item.image || 'imgae/placeholder.png'}" class="cart-item-img" alt="${item.name || "Sản phẩm"}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name || "Sản phẩm"}</div>
          <div class="cart-item-qty">Số lượng: ${qty}</div>
          <div class="cart-item-price">${(item.price || 0).toLocaleString("vi-VN")}đ</div>
        </div>
      </div>
    `;
  });

  itemsList.innerHTML = html;
  cartFooter.style.display = "block";

  const totalEl = document.getElementById("cart-total");
  if (totalEl) {
    totalEl.innerText = total.toLocaleString("vi-VN");
  }
}

/* ============================= */
/* ===== PROFILE MENU ========== */
/* ============================= */
function toggleMenu() {
  const menu = document.getElementById("profile-menu");

  if (!menu) return;

  if (menu.style.display === "block") {
    menu.style.display = "none";
  } else {
    menu.style.display = "block";
  }
}

/* ============================= */
/* ===== LOGOUT ================ */
/* ============================= */
function logout() {
  localStorage.removeItem("currentUser");
  alert("Bạn đã đăng xuất");
  window.location.href = "index.html";
}