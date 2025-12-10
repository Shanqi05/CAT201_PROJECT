package com.bookstore.model;

import java.sql.Timestamp;

public class Order {
    private int id;
    private int bookId;
    private int buyerId;
    private double totalAmount;
    private Timestamp orderDate;

    public Order() {}

    public Order(int bookId, int buyerId, double totalAmount) {
        this.bookId = bookId;
        this.buyerId = buyerId;
        this.totalAmount = totalAmount;
    }

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getBookId() { return bookId; }
    public void setBookId(int bookId) { this.bookId = bookId; }

    public int getBuyerId() { return buyerId; }
    public void setBuyerId(int buyerId) { this.buyerId = buyerId; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public Timestamp getOrderDate() { return orderDate; }
    public void setOrderDate(Timestamp orderDate) { this.orderDate = orderDate; }
}
