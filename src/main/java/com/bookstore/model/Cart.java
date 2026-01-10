package com.bookstore.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Cart {
    // Key: Book ID, Value: CartItem
    private Map<Integer, CartItem> items;

    public Cart() {
        items = new HashMap<>();
    }

    // Add a book to the cart
    public void addBook(Book book, int quantity) {
        int bookId = book.getId();

        if (items.containsKey(bookId)) {
            // If book already exists, update the quantity
            CartItem existingItem = items.get(bookId);
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            // If new book, add to map
            items.put(bookId, new CartItem(book, quantity));
        }
    }

    // Remove a book from the cart
    public void removeBook(int bookId) {
        items.remove(bookId);
    }

    // Get all items as a list (for displaying in JSP)
    public List<CartItem> getItems() {
        return new ArrayList<>(items.values());
    }

    // Calculate grand total of the cart
    public double getGrandTotal() {
        double total = 0;
        for (CartItem item : items.values()) {
            total += item.getTotalPrice();
        }
        return total;
    }

    // Clear cart (used after checkout)
    public void clear() {
        items.clear();
    }
}