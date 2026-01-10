package com.bookstore.model;

public class Book {
    private int bookId;
    private String title;
    private String author;
    private double price;
    private String imagePath;
    private String status;     // 'Active' or 'Sold'

    // Updated Fields
    private String category;
    private String condition;  // book_condition
    private String[] genres;

    public Book() {}

    // Getters and Setters
    public int getBookId() { return bookId; }
    public void setBookId(int bookId) { this.bookId = bookId; }

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

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public String[] getGenres() { return genres; }
    public void setGenres(String[] genres) { this.genres = genres; }
}