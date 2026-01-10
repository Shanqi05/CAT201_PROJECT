package com.bookstore.model;

import java.sql.Timestamp;

public class DonatedBook {
    private int donatedBookId;
    private String donorEmail;

    // Display Fields (Fetched from Donors table, not saved to DonatedBooks table)
    private String donorName;
    private String donorPhone;

    private String title;
    private String author;
    private String bookCondition;
    private String category;
    private String imagePath;

    // Address Fields
    private String pickupHouseNo;
    private String pickupStreet;
    private String pickupPostcode;
    private String pickupCity;
    private String pickupState;

    private String message;
    private String approveCollectStatus;
    private boolean storedStatus;
    private Timestamp createdAt;

    public DonatedBook() {}

    // --- GETTERS AND SETTERS ---

    public int getDonatedBookId() { return donatedBookId; }
    public void setDonatedBookId(int donatedBookId) { this.donatedBookId = donatedBookId; }

    public String getDonorEmail() { return donorEmail; }
    public void setDonorEmail(String donorEmail) { this.donorEmail = donorEmail; }

    // Getters/Setters for Join Data
    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }

    public String getDonorPhone() { return donorPhone; }
    public void setDonorPhone(String donorPhone) { this.donorPhone = donorPhone; }

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

    // Address Getters/Setters
    public String getPickupHouseNo() { return pickupHouseNo; }
    public void setPickupHouseNo(String pickupHouseNo) { this.pickupHouseNo = pickupHouseNo; }

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