package com.bookstore.model;

import java.sql.Timestamp;

public class Donor {
    private String donorEmail; // PK
    private String donorName;
    private String donorPhone;
    private Timestamp createdAt;

    public Donor() {}

    public Donor(String donorEmail, String donorName, String donorPhone) {
        this.donorEmail = donorEmail;
        this.donorName = donorName;
        this.donorPhone = donorPhone;
    }

    // Getters and Setters
    public String getDonorEmail() { return donorEmail; }
    public void setDonorEmail(String donorEmail) { this.donorEmail = donorEmail; }

    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }

    public String getDonorPhone() { return donorPhone; }
    public void setDonorPhone(String donorPhone) { this.donorPhone = donorPhone; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}