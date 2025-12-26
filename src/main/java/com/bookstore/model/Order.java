package com.bookstore.model;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class Order {
    private int id;
    private int userId;
    private double totalAmount;
    private String status;
    private String shippingAddress;
    private String paymentMethod;
    private Timestamp createdAt;

    // IMPORTANT: An Order contains a list of items
    private List<OrderItem> items = new ArrayList<>();

    // Default Constructor
    public Order() {}

    // Constructor with main fields
    public Order(int userId, double totalAmount, String shippingAddress, String paymentMethod) {
        this.userId = userId;
        this.totalAmount = totalAmount;
        this.shippingAddress = shippingAddress;
        this.paymentMethod = paymentMethod;
        this.status = "PENDING";
    }

    // --- GETTERS AND SETTERS (Required by Java) ---

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() { // <--- This was missing
        return userId;
    }
    public void setUserId(int userId) {
        this.userId = userId;
    }

    public double getTotalAmount() {
        return totalAmount;
    }
    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }
    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    // List Management
    public List<OrderItem> getItems() {
        return items;
    }
    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    // Helper method to add item easily
    public void addItem(OrderItem item) {
        this.items.add(item);
    }
}