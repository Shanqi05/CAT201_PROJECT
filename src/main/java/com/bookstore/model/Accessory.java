package com.bookstore.model;

public class Accessory {
    private int id;
    private String title;
    private String category;
    private double price;
    private String imagePath;
    private String status;

    public Accessory() {}

    public Accessory(String title, String category, double price, String imagePath) {
        this.title = title;
        this.category = category;
        this.price = price;
        this.imagePath = imagePath;
        this.status = "Active";
    }

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
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
}