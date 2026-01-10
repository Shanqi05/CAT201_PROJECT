package com.bookstore.model;

public class OrderItem {
    private int orderItemId;
    private int orderId;

    // Can contain EITHER bookId OR accessoryId
    private Integer bookId;
    private Integer accessoryId;

    private int quantity;
    private double priceAtPurchase;
    private String title;
    private String imagePath;

    public OrderItem() {}

    public OrderItem(Integer bookId, Integer accessoryId, int quantity, double priceAtPurchase) {
        this.bookId = bookId;
        this.accessoryId = accessoryId;
        this.quantity = quantity;
        this.priceAtPurchase = priceAtPurchase;
    }

    // Getters and Setters
    public int getOrderItemId() { return orderItemId; }
    public void setOrderItemId(int orderItemId) { this.orderItemId = orderItemId; }

    public int getOrderId() { return orderId; }
    public void setOrderId(int orderId) { this.orderId = orderId; }

    public Integer getBookId() { return bookId; }
    public void setBookId(Integer bookId) { this.bookId = bookId; }

    public Integer getAccessoryId() { return accessoryId; }
    public void setAccessoryId(Integer accessoryId) { this.accessoryId = accessoryId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getPriceAtPurchase() { return priceAtPurchase; }
    public void setPriceAtPurchase(double priceAtPurchase) { this.priceAtPurchase = priceAtPurchase; }

    // Frontend helpers
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }
}