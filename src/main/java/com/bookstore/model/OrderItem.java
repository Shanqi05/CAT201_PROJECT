package com.bookstore.model;

public class OrderItem {
    private int id;
    private int orderId;
    private int bookId;
    private int quantity;
    private double priceAtPurchase;

    // Optional: for frontend display
    private String bookTitle;
    private String bookImage;

    public OrderItem() {}

    public OrderItem(int bookId, int quantity, double priceAtPurchase) {
        this.bookId = bookId;
        this.quantity = quantity;
        this.priceAtPurchase = priceAtPurchase;
    }

    // --- GETTERS AND SETTERS ---

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getOrderId() { return orderId; }
    public void setOrderId(int orderId) { this.orderId = orderId; }

    public int getBookId() { return bookId; }
    public void setBookId(int bookId) { this.bookId = bookId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getPriceAtPurchase() { return priceAtPurchase; }
    public void setPriceAtPurchase(double priceAtPurchase) { this.priceAtPurchase = priceAtPurchase; }

    public String getBookTitle() { return bookTitle; }
    public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }

    public String getBookImage() { return bookImage; }
    public void setBookImage(String bookImage) { this.bookImage = bookImage; }
}