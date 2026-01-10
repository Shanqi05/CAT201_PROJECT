// src/utils/cartUtils.js

export const getCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    return cart.reduce((total, item) => total + item.quantity, 0);
};

export const getCartTotal = () => {
    const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const addToCart = (product, quantity = 1, type = 'book', showAlert = true) => {
    const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");

    // [FIX] Check BOTH ID and Type to prevent Book ID 1 conflicting with Accessory ID 1
    const existingItemIndex = cart.findIndex(
        (item) => item.bookId === product.bookId && item.itemType === type
    );

    // Handle Books (Unique Item Logic)
    if (type === 'book') {
        // Use 'bookId' specifically to avoid confusion
        const bookId = product.bookId || product.id;

        // Check if THIS specific book is already in cart
        const isBookInCart = cart.some(item => item.itemType === 'book' && (item.bookId === bookId || item.id === bookId));

        if (isBookInCart) {
            alert("This unique book is already in your cart!");
            return;
        }

        // Add new book
        cart.push({
            ...product,
            id: bookId,        // Standardize ID
            bookId: bookId,    // Keep explicit reference
            quantity: 1,       // Force quantity 1 for books
            itemType: 'book'   // Explicit type
        });
    }
    // Handle Accessories (Multiple Items Allowed)
    else {
        const accId = product.accessoryId || product.id;

        const existingAccIndex = cart.findIndex(
            (item) => item.itemType === 'accessory' && (item.id === accId)
        );

        if (existingAccIndex > -1) {
            // Increment existing accessory
            cart[existingAccIndex].quantity += quantity;
        } else {
            // Add new accessory
            cart.push({
                ...product,
                id: accId,
                quantity: quantity,
                itemType: 'accessory'
            });
        }
    }

    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated")); // Update Header Badge

    if (showAlert) alert(`${product.title} added to cart!`);
};