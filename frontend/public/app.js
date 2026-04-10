async function loadProducts() {
  const productsList = document.getElementById('products-list');
  productsList.innerHTML = '<p>Đang tải sản phẩm...</p>';
  const response = await fetch('/api/products');
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
  const response = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: 1,        // tạm thời hardcode
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
  const response = await fetch('/api/cart/1'); // tạm thời hardcode user_id
  const cartItems = await response.json();

  if (!cartList) return;

  cartList.innerHTML = cartItems.items.map(item => `
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

  // Lấy cart_id trước
  const cartResponse = await fetch('/api/cart/1');
  const cartData = await cartResponse.json();
  const cart_id = cartData.items[0].cart_id;

  // Đặt hàng
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: 1,
      cart_id,
      address
    })
  });

  if (response.ok) {
    alert('Đặt hàng thành công!');
    document.getElementById('cart-section').style.display = 'none';
  } else {
    alert('Lỗi khi đặt hàng.');
  }
}
