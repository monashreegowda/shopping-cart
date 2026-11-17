// 1. Define our products (Mock Database)
var products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 4999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
  },
  {
    id: 3,
    name: "Earpods",
    price: 1499,
    image: "https://m.media-amazon.com/images/I/710dy4BFjLL._AC_.jpg"
  },
  {
    id: 4,
    name: "Sunglasses",
    price: 1599,
    image: "https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_2794761_100045_m"
  }
];

// 2. Cart Array (Load from localStorage if it exists)
var cart = JSON.parse(localStorage.getItem("myShoppingCart")) || [];

// ─────────────────────────────────────────
// DISPLAY PRODUCTS ON LOAD
// ─────────────────────────────────────────
function displayProducts() {
  var grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    var card = document.createElement("div");
    card.className = "product-card";
    
    card.innerHTML = 
      '<img src="' + p.image + '" class="product-image" alt="' + p.name + '">' +
      '<h3>' + p.name + '</h3>' +
      '<p class="product-price">₹' + p.price + '</p>' +
      '<button class="add-btn" onclick="addToCart(' + p.id + ')">Add to Cart</button>';
      
    grid.appendChild(card);
  }
}

// ─────────────────────────────────────────
// ADD TO CART
// ─────────────────────────────────────────
function addToCart(productId) {
  // Check if item is already in cart
  var existingItem = cart.find(function(item) {
    return item.id === productId;
  });

  if (existingItem) {
    // If yes, just increase quantity
    existingItem.qty += 1;
  } else {
    // If no, find the product and add it
    var product = products.find(function(p) {
      return p.id === productId;
    });
    
    // Add a new object to cart array with qty = 1
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  updateCartUI();
}

// ─────────────────────────────────────────
// CHANGE QUANTITY (+ / -)
// ─────────────────────────────────────────
function changeQty(productId, change) {
  var item = cart.find(function(i) { return i.id === productId; });
  
  if (item) {
    item.qty += change;
    
    // If qty goes to 0, remove it
    if (item.qty <= 0) {
      removeFromCart(productId);
    } else {
      updateCartUI();
    }
  }
}

// ─────────────────────────────────────────
// REMOVE FROM CART
// ─────────────────────────────────────────
function removeFromCart(productId) {
  var index = cart.findIndex(function(i) { return i.id === productId; });
  
  if (index !== -1) {
    cart.splice(index, 1); // Remove 1 item at that index
  }
  
  updateCartUI();
}

// ─────────────────────────────────────────
// UPDATE UI & TOTAL
// ─────────────────────────────────────────
function updateCartUI() {
  // Save to localStorage
  localStorage.setItem("myShoppingCart", JSON.stringify(cart));

  var cartItemsContainer = document.getElementById("cartItems");
  var cartCount = document.getElementById("cartCount");
  var cartTotal = document.getElementById("cartTotal");

  cartItemsContainer.innerHTML = "";
  var total = 0;
  var totalItems = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
  }

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    
    total += item.price * item.qty;
    totalItems += item.qty;

    var div = document.createElement("div");
    div.className = "cart-item";
    
    div.innerHTML = 
      '<img src="' + item.image + '" alt="' + item.name + '">' +
      '<div class="item-info">' +
        '<h4>' + item.name + '</h4>' +
        '<p>₹' + item.price + '</p>' +
        '<div class="qty-controls">' +
          '<button class="qty-btn" onclick="changeQty(' + item.id + ', -1)">-</button>' +
          '<span>' + item.qty + '</span>' +
          '<button class="qty-btn" onclick="changeQty(' + item.id + ', 1)">+</button>' +
        '</div>' +
      '</div>' +
      '<button class="remove-btn" onclick="removeFromCart(' + item.id + ')"><i class="fa-solid fa-trash"></i></button>';
      
    cartItemsContainer.appendChild(div);
  }

  // Update Totals
  cartCount.innerHTML = totalItems;
  cartTotal.innerHTML = "₹" + total.toFixed(2);
}

// ─────────────────────────────────────────
// TOGGLE CART PANEL (Open / Close)
// ─────────────────────────────────────────
function toggleCart() {
  var panel = document.getElementById("cartPanel");
  var overlay = document.getElementById("cartOverlay");
  
  panel.classList.toggle("active");
  overlay.classList.toggle("active");
}

// ─────────────────────────────────────────
// CHECKOUT
// ─────────────────────────────────────────
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  
  alert("Order placed successfully! Thank you for shopping.");
  cart = []; // Empty the cart
  updateCartUI();
  toggleCart(); // Close panel
}

// ─────────────────────────────────────────
// INITIALIZE APP
// ─────────────────────────────────────────
displayProducts();
updateCartUI();