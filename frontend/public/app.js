const API_URL = 'https://techshop.punnohoang.me';

async function loadProducts() {
  const productsList = document.getElementById('products-list');
  productsList.innerHTML = '<p>Đang tải sản phẩm...</p>';
  const response = await fetch(`${API_URL}/products`);
  const products = await response.json();
  if (!productsList) return;
  productsList.innerHTML = products.map(product => `
  <div>
    <img src="${product.image_url}" />
    <h3>${product.name}</h3>
    <p>${product.price}</p>
    <button onclick="addToCart(${product.id})">Thêm vào giỏ</button>
  </div>
`).join('');
}
document.addEventListener('DOMContentLoaded', loadProducts);

async function addToCart(productId) {
  const response = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: 1,
      product_id: productId,
      quantity: 1
    })
  });
  if (response.ok) {
    alert('Đã thêm vào giỏ hàng!');
  } else {
    alert('Lỗi khi thêm vào giỏ hàng.');
  }
}

async function showCart() {
  const cartList = document.getElementById('cart-items');
  cartList.innerHTML = '<p>Đang tải giỏ hàng...</p>';
  const response = await fetch(`${API_URL}/cart/1`);
  const cartData = await response.json();
  if (!cartList) return;
  cartList.innerHTML = cartData.items.map(item => `
    <div>
      <img src="${item.image_url}" />
      <h3>${item.name}</h3>
      <p>${item.price} x ${item.quantity}</p>
    </div>
  `).join('');
  document.getElementById('cart-section').style.display = 'block';
}

async function checkout() {
  const address = prompt('Nhập địa chỉ giao hàng:');
  if (!address) return;
  const cartResponse = await fetch(`${API_URL}/cart/1`);
  const cartData = await cartResponse.json();
  const cart_id = cartData.items[0].cart_id;
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: 1, cart_id, address })
  });
  if (response.ok) {
    alert('Đặt hàng thành công!');
    document.getElementById('cart-section').style.display = 'none';
  } else {
    alert('Lỗi khi đặt hàng.');
  }
}