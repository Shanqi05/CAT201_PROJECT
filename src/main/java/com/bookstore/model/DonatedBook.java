package com.bookstore.model;

import java.sql.Timestamp;

public class DonatedBook {
    private int donatedBookId;
    private String donorEmail;

    private String title;
    private String author;
    private String bookCondition;
    private String category;
    private String imagePath;

    private String pickupHouseNo;
    private String pickupStreetNo;
    private String pickupStreet;
    private String pickupPostcode;
    private String pickupCity;
    private String pickupState;

    private String message;
    private String approveCollectStatus;
    private boolean storedStatus;
    private Timestamp createdAt;

    public DonatedBook() {}

    // Getters and Setters
    public int getDonatedBookId() { return donatedBookId; }
    public void setDonatedBookId(int donatedBookId) { this.donatedBookId = donatedBookId; }

    public String getDonorEmail() { return donorEmail; }
    public void setDonorEmail(String donorEmail) { this.donorEmail = donorEmail; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getBookCondition() { return bookCondition; }
    public void setBookCondition(String bookCondition) { this.bookCondition = bookCondition; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    // Address Getters
    public String getPickupHouseNo() { return pickupHouseNo; }
    public void setPickupHouseNo(String pickupHouseNo) { this.pickupHouseNo = pickupHouseNo; }

    public String getPickupStreetNo() { return pickupStreetNo; }
    public void setPickupStreetNo(String pickupStreetNo) { this.pickupStreetNo = pickupStreetNo; }

    public String getPickupStreet() { return pickupStreet; }
    public void setPickupStreet(String pickupStreet) { this.pickupStreet = pickupStreet; }

    public String getPickupPostcode() { return pickupPostcode; }
    public void setPickupPostcode(String pickupPostcode) { this.pickupPostcode = pickupPostcode; }

    public String getPickupCity() { return pickupCity; }
    public void setPickupCity(String pickupCity) { this.pickupCity = pickupCity; }

    public String getPickupState() { return pickupState; }
    public void setPickupState(String pickupState) { this.pickupState = pickupState; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getApproveCollectStatus() { return approveCollectStatus; }
    public void setApproveCollectStatus(String approveCollectStatus) { this.approveCollectStatus = approveCollectStatus; }

    public boolean isStoredStatus() { return storedStatus; }
    public void setStoredStatus(boolean storedStatus) { this.storedStatus = storedStatus; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}