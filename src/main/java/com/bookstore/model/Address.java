package com.bookstore.model;

import java.sql.Timestamp;

public class Address {
    private int addressId;
    private int userId;
    private String houseNo;
    private String street;
    private String postcode;
    private String city;
    private String state;
    private Timestamp createdAt;

    public Address() {}

    // Getters and Setters
    public int getAddressId() { return addressId; }
    public void setAddressId(int addressId) { this.addressId = addressId; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getHouseNo() { return houseNo; }
    public void setHouseNo(String houseNo) { this.houseNo = houseNo; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getPostcode() { return postcode; }
    public void setPostcode(String postcode) { this.postcode = postcode; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    // Helper to print full address
    public String toString() {
        return houseNo + " " + street + ", " + postcode + " " + city + ", " + state;
    }
}