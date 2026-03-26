document.addEventListener("DOMContentLoaded", function(){

/* Close dropdowns when clicking outside */
document.addEventListener("click", function(e){

const cartMenu = document.getElementById("cart-menu");
const cartIcon = document.querySelector(".cart-icon");
const profileMenu = document.getElementById("profile-menu");
const account = document.querySelector(".account");

if(cartMenu && cartIcon && !cartIcon.contains(e.target)){
cartMenu.classList.remove("show");
}

if(profileMenu && account && !account.contains(e.target)){
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

function updateMainSlider(){

if(!mainSlider) return;

mainSlider.style.transform = "translateX(-" + (mainIndex * 100) + "%)";

}

/* next */

if(mainNext){

mainNext.addEventListener("click",function(){

mainIndex++;

if(mainIndex >= mainSlides.length){
mainIndex = 0;
}

updateMainSlider();

});

}

/* prev */

if(mainPrev){

mainPrev.addEventListener("click",function(){

mainIndex--;

if(mainIndex < 0){
mainIndex = mainSlides.length - 1;
}

updateMainSlider();

});

}

/* auto slider */

if(mainSlides.length > 0){

setInterval(function(){

mainIndex++;

if(mainIndex >= mainSlides.length){
mainIndex = 0;
}

updateMainSlider();

},4000);

}


/* ============================= */
/* ===== SMALL BANNER SLIDER === */
/* ============================= */

const smallBanners = document.querySelectorAll(".small-banner");

smallBanners.forEach(function(banner){

let index = 0;

const slider = banner.querySelector(".small-slider");
const slides = banner.querySelectorAll(".small-slide");

const next = banner.querySelector(".small-next");
const prev = banner.querySelector(".small-prev");

function updateSmall(){

slider.style.transform = "translateX(-" + (index * 100) + "%)";

}

/* next */

if(next){

next.addEventListener("click",function(){

index++;

if(index >= slides.length){
index = 0;
}

updateSmall();

});

}

/* prev */

if(prev){

prev.addEventListener("click",function(){

index--;

if(index < 0){
index = slides.length - 1;
}

updateSmall();

});

}

});


/* ============================= */
/* ===== HIỂN THỊ USER ========= */
/* ============================= */

let userData = localStorage.getItem("currentUser");

if(userData){

const user = JSON.parse(userData);
const profileName = document.getElementById("profile-name");

if(profileName){
profileName.innerText = user.name;
}

}


/* ============================= */
/* ===== CART COUNT ============ */
/* ============================= */

updateCartCount();

});


/* ============================= */
/* ===== SUGGESTED PRODUCTS ==== */
/* ============================= */

const suggestedGrid = document.querySelector(".suggested-grid");
const suggestedNext = document.querySelector(".suggested-next");
const suggestedPrev = document.querySelector(".suggested-prev");

if(suggestedGrid && suggestedNext && suggestedPrev){

const itemWidth = 200;
let scrollPosition = 0;

suggestedNext.addEventListener("click", function(){
scrollPosition += itemWidth;
suggestedGrid.scrollLeft = scrollPosition;
});

suggestedPrev.addEventListener("click", function(){
scrollPosition -= itemWidth;
suggestedGrid.scrollLeft = scrollPosition;
});

}


/* ============================= */
/* ===== CART FUNCTIONS ======== */
/* ============================= */

function getCart(){

try{
return JSON.parse(localStorage.getItem("cart")) || [];
}catch{
return [];
}

}

function updateCartCount(){

const cart = getCart();

const total = cart.reduce(function(sum,item){
return sum + (item.qty || 1);
},0);

const el = document.getElementById("cart-count");

if(el){
el.innerText = total;
}

}

function openCart(){

const cartMenu = document.getElementById("cart-menu");

if(!cartMenu) return;

if(cartMenu.classList.contains("show")){
cartMenu.classList.remove("show");
}else{
cartMenu.classList.add("show");
renderCartPreview();
}

}


/* ============================= */
/* ===== ACCOUNT CLICK ========= */
/* ============================= */

function handleAccountClick(){

const user = localStorage.getItem("currentUser");

if(user){
toggleMenu();
}else{
window.location.href = "2.login.html";
}

}


/* ============================= */
/* ===== PROFILE PAGE ========== */
/* ============================= */

function openProfile(){

const user = localStorage.getItem("currentUser");

if(user){
window.location.href = "profile.html";
}else{
window.location.href = "2.login.html";
}

}


/* ============================= */
/* ===== CART PREVIEW ========== */
/* ============================= */

function renderCartPreview(){

const cart = getCart();
const itemsList = document.getElementById("cart-items-list");
const cartFooter = document.getElementById("cart-footer");

if(!itemsList || !cartFooter) return;

if(cart.length === 0){
itemsList.innerHTML = '<p style="text-align:center; padding:20px;">Giỏ hàng trống</p>';
cartFooter.style.display = "none";
return;
}

let total = 0;
let html = '';

cart.forEach(function(item){
const itemTotal = (item.price || 0) * (item.qty || 1);
total += itemTotal;

html += `
<div class="cart-item-row">
<img src="${item.image || 'imgae/placeholder.png'}" class="cart-item-img" alt="${item.name}">
<div class="cart-item-info">
<div class="cart-item-name">${item.name || 'Sản phẩm'}</div>
<div class="cart-item-qty">Số lượng: ${item.qty || 1}</div>
<div class="cart-item-price">${(item.price || 0).toLocaleString('vi-VN')}đ</div>
</div>
</div>
`;
});

itemsList.innerHTML = html;
cartFooter.style.display = "block";

const totalEl = document.getElementById("cart-total");
if(totalEl){
totalEl.innerText = total.toLocaleString('vi-VN');
}

}


/* ============================= */
/* ===== PROFILE MENU ========== */
/* ============================= */

function toggleMenu(){

const menu = document.getElementById("profile-menu");

if(!menu) return;

if(menu.style.display === "block"){
menu.style.display = "none";
}else{
menu.style.display = "block";
}

}


/* ============================= */
/* ===== LOGOUT ================ */
/* ============================= */

function logout(){

localStorage.removeItem("currentUser");

alert("Bạn đã đăng xuất");

window.location.href = "index.html";

}