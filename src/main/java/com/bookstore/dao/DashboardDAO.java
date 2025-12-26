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
        private int totalAccessories; // [NEW] Added field for Accessories
        private int activeUsers;
        private double totalEarnings;
        private int lowStockCount;

        // Getters and Setters
        public int getTotalBooks() { return totalBooks; }
        public void setTotalBooks(int totalBooks) { this.totalBooks = totalBooks; }

        public int getTotalAccessories() { return totalAccessories; } // [NEW]
        public void setTotalAccessories(int totalAccessories) { this.totalAccessories = totalAccessories; }

        public int getActiveUsers() { return activeUsers; }
        public void setActiveUsers(int activeUsers) { this.activeUsers = activeUsers; }

        public double getTotalEarnings() { return totalEarnings; }
        public void setTotalEarnings(double totalEarnings) { this.totalEarnings = totalEarnings; }

        public int getLowStockCount() { return lowStockCount; }
        public void setLowStockCount(int lowStockCount) { this.lowStockCount = lowStockCount; }
    }

    // ==========================================
    //  Method 1: Fetch All Dashboard Statistics
    // ==========================================
    public DashboardStats getStats() {
        DashboardStats stats = new DashboardStats();

        try (Connection conn = DBConnection.getConnection()) {

            // 1. Count Total Books (Excluding Accessories to avoid double counting)
            // Note: Ensure your database has a 'category' column.
            // If not, remove the WHERE clause to count everything.
            String sqlBooks = "SELECT COUNT(*) FROM books WHERE category != 'Accessories'";
            try (PreparedStatement ps = conn.prepareStatement(sqlBooks);
                 ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    stats.setTotalBooks(rs.getInt(1));
                }
            }

            // 2. Count Total Accessories (Where category is 'Accessories')
            String sqlAccessories = "SELECT COUNT(*) FROM books WHERE category = 'Accessories'";
            try (PreparedStatement ps = conn.prepareStatement(sqlAccessories);
                 ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    stats.setTotalAccessories(rs.getInt(1));
                }
            }

            // 3. Count Active Users (Exclude Admins)
            String sqlUsers = "SELECT COUNT(*) FROM users WHERE role != 'admin'";
            try (PreparedStatement ps = conn.prepareStatement(sqlUsers);
                 ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    stats.setActiveUsers(rs.getInt(1));
                }
            }

            // 4. Calculate Total Earnings (Sum of total_amount from orders)
            String sqlEarnings = "SELECT SUM(total_amount) FROM orders";
            try (PreparedStatement ps = conn.prepareStatement(sqlEarnings);
                 ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    stats.setTotalEarnings(rs.getDouble(1));
                }
            }

            // 5. Low Stock Alert (Count items with stock < 5)
            String sqlLowStock = "SELECT COUNT(*) FROM books WHERE stock < 5";
            try (PreparedStatement ps = conn.prepareStatement(sqlLowStock);
                 ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    stats.setLowStockCount(rs.getInt(1));
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return stats;
    }

    // ==========================================
    //  Method 2: Fetch Recent Books (Top 5 Newest)
    // ==========================================
    public List<Book> getRecentBooks() {
        List<Book> books = new ArrayList<>();
        String sql = "SELECT * FROM books ORDER BY id DESC LIMIT 5";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Book book = new Book();
                book.setId(rs.getInt("id"));
                book.setTitle(rs.getString("title"));
                book.setAuthor(rs.getString("author"));
                book.setPrice(rs.getDouble("price"));
                book.setStock(rs.getInt("stock"));
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