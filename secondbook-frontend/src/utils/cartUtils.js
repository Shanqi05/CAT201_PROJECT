// src/utils/cartUtils.js

// 1. ADD TO CART LOGIC
export const addToCart = (product) => {
    const existingCartString = localStorage.getItem("shoppingCart");
    const cart = existingCartString ? JSON.parse(existingCartString) : [];

    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
        // If yes, just increase the quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // If no, add new item with quantity 1
        cart.push({ ...product, quantity: 1 });
    }

    // Save back to Local Storage
    localStorage.setItem("shoppingCart", JSON.stringify(cart));

    // Dispatch a custom event so the Header knows to update the count
    window.dispatchEvent(new Event("cartUpdated"));
};

// 2. GET CART COUNT (For Header badge)
export const getCartCount = () => {
    const existingCartString = localStorage.getItem("shoppingCart");
    const cart = existingCartString ? JSON.parse(existingCartString) : [];
    // Sum up all quantities (e.g., 2 books + 1 pencil = 3 items)
    return cart.reduce((total, item) => total + item.quantity, 0);
};

// 3. GET TOTAL PRICE
export const getCartTotal = () => {
    const existingCartString = localStorage.getItem("shoppingCart");
    const cart = existingCartString ? JSON.parse(existingCartString) : [];
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};