package com.bookstore.model;

import java.sql.Timestamp;

public class Accessory {
    private int accessoryId;
    private String title;
    private String category;
    private double price;
    private String imagePath;
    private String status;
    private Timestamp createdAt;
    private int stock;

    public Accessory() {}

    // Getters and Setters
    public int getAccessoryId() { return accessoryId; }
    public void setAccessoryId(int accessoryId) { this.accessoryId = accessoryId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
}