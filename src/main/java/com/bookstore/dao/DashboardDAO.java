package com.bookstore.dao;

import com.bookstore.model.Book;
import com.bookstore.util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DashboardDAO {

    // ==========================================
    //  Inner Class: Data Structure for Statistics
    // ==========================================
    public static class DashboardStats {
        private int totalBooks;
        private int totalAccessories;
        private int activeUsers;
        private double totalEarnings;
        private int soldBooksCount;

        // Getters and Setters
        public int getTotalBooks() { return totalBooks; }
        public void setTotalBooks(int totalBooks) { this.totalBooks = totalBooks; }

        public int getTotalAccessories() { return totalAccessories; }
        public void setTotalAccessories(int totalAccessories) { this.totalAccessories = totalAccessories; }

        public int getActiveUsers() { return activeUsers; }
        public void setActiveUsers(int activeUsers) { this.activeUsers = activeUsers; }

        public double getTotalEarnings() { return totalEarnings; }
        public void setTotalEarnings(double totalEarnings) { this.totalEarnings = totalEarnings; }

        public int getSoldBooksCount() { return soldBooksCount; }
        public void setSoldBooksCount(int soldBooksCount) { this.soldBooksCount = soldBooksCount; }
    }

    // ==========================================
    //  Method 1: Fetch All Dashboard Statistics
    // ==========================================
    public DashboardStats getStats() {
        DashboardStats stats = new DashboardStats();

        try (Connection conn = DBConnection.getConnection()) {

            // 1. Count Total Active Books
            String sqlBooks = "SELECT COUNT(*) FROM books WHERE status = 'Active' AND category != 'Accessories'";
            try (PreparedStatement ps = conn.prepareStatement(sqlBooks);
                 ResultSet rs = ps.executeQuery()) {
                if (rs.next()) stats.setTotalBooks(rs.getInt(1));
            }

            // 2. Count Total Accessories
            String sqlAccessories = "SELECT COUNT(*) FROM books WHERE category = 'Accessories'";
            try (PreparedStatement ps = conn.prepareStatement(sqlAccessories);
                 ResultSet rs = ps.executeQuery()) {
                if (rs.next()) stats.setTotalAccessories(rs.getInt(1));
            }

            // 3. Count Active Users
            String sqlUsers = "SELECT COUNT(*) FROM users WHERE role != 'admin'";
            try (PreparedStatement ps = conn.prepareStatement(sqlUsers);
                 ResultSet rs = ps.executeQuery()) {
                if (rs.next()) stats.setActiveUsers(rs.getInt(1));
            }

            // 4. Calculate Total Earnings
            String sqlEarnings = "SELECT SUM(total_amount) FROM orders";
            try (PreparedStatement ps = conn.prepareStatement(sqlEarnings);
                 ResultSet rs = ps.executeQuery()) {
                if (rs.next()) stats.setTotalEarnings(rs.getDouble(1));
            }

            // 5. Count SOLD Books
            String sqlSold = "SELECT COUNT(*) FROM books WHERE status = 'Sold'";
            try (PreparedStatement ps = conn.prepareStatement(sqlSold);
                 ResultSet rs = ps.executeQuery()) {
                if (rs.next()) stats.setSoldBooksCount(rs.getInt(1));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return stats;
    }

    // ==========================================
    //  Method 2: Fetch Recent Books
    // ==========================================
    public List<Book> getRecentBooks() {
        List<Book> books = new ArrayList<>();
        String sql = "SELECT * FROM books ORDER BY book_id DESC LIMIT 10";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Book book = new Book();
                // [CHANGE] Map to new Book model fields
                book.setBookId(rs.getInt("book_id"));
                book.setTitle(rs.getString("title"));
                book.setAuthor(rs.getString("author"));
                book.setPrice(rs.getDouble("price"));
                book.setStatus(rs.getString("status")); // Map status instead of stock
                book.setImagePath(rs.getString("image_path"));
                book.setCategory(rs.getString("category"));

                books.add(book);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return books;
    }
}