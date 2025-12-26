package com.bookstore.model;

public class Book {
    private int id;
    private String title;
    private String author;
    private double price;
    private String imagePath;  // Maps to database 'image_path'
    private String status;     // 'Active' or 'Sold'

    // [NEW FIELDS] Added to match updated Database
    private String category;
    private String condition;  // Maps to database 'book_condition'
    private double rating;
    private int stock;

    public Book() {}

    // Getters and Setters for ALL fields
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    // [New Getters/Setters]
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
}