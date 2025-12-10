package com.bookstore.model;

public class Book {
    private int id;
    private String title;
    private String author;
    private double price;
    private String status;      // "AVAILABLE" or "SOLD"
    private String listingType;
    private String imagePath;
    private int sellerId;


    public Book() {}


    public Book(String title, String author, double price, String listingType, int sellerId) {
        this.title = title;
        this.author = author;
        this.price = price;
        this.listingType = listingType;
        this.sellerId = sellerId;
        this.status = "AVAILABLE"; // 默认就是可购买状态
    }

    // 3. Getters and Setters (用来存取数据)
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getListingType() { return listingType; }
    public void setListingType(String listingType) { this.listingType = listingType; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public int getSellerId() { return sellerId; }
    public void setSellerId(int sellerId) { this.sellerId = sellerId; }
}
