// src/utils/cartUtils.js

// 1. ADD TO CART LOGIC
export const addToCart = (product, quantity = 1) => {
    const existingCartString = localStorage.getItem("shoppingCart");
    const cart = existingCartString ? JSON.parse(existingCartString) : [];

    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
        // For secondhand single-copy items, do not increase quantity if already in cart
        // Keep quantity as-is (prevent duplicates)
        // No-op: avoid adding more than one copy
        return;
    } else {
        // If no, add new item with specified quantity
        cart.push({ ...product, quantity: quantity });
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