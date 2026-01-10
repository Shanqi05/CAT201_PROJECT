package com.bookstore.dao;

import com.bookstore.model.Book;
import com.bookstore.model.Accessory;
import com.bookstore.util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DashboardDAO {

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

    public DashboardStats getStats() {
        DashboardStats stats = new DashboardStats();

        try (Connection conn = DBConnection.getConnection()) {

            // 1. Count Active Books
            String sqlBooks = "SELECT COUNT(*) FROM books WHERE status = 'Active'";
            try (PreparedStatement ps = conn.prepareStatement(sqlBooks);
                 ResultSet rs = ps.executeQuery()) {
                if (rs.next()) stats.setTotalBooks(rs.getInt(1));
            }

            // 2. Count Total Accessories
            String sqlAccessories = "SELECT COUNT(*) FROM accessories";
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

    public List<Book> getRecentBooks() {
        List<Book> books = new ArrayList<>();
        String sql = "SELECT * FROM books ORDER BY book_id DESC LIMIT 10";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Book book = new Book();
                book.setBookId(rs.getInt("book_id"));
                book.setTitle(rs.getString("title"));
                book.setAuthor(rs.getString("author"));
                book.setPrice(rs.getDouble("price"));
                book.setStatus(rs.getString("status"));
                book.setImagePath(rs.getString("image_path"));
                book.setCategory(rs.getString("category"));
                books.add(book);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return books;
    }

    public List<Accessory> getRecentAccessories() {
        List<Accessory> list = new ArrayList<>();
        String sql = "SELECT * FROM accessories ORDER BY accessory_id DESC LIMIT 5";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Accessory acc = new Accessory();
                acc.setAccessoryId(rs.getInt("accessory_id"));
                acc.setTitle(rs.getString("title"));
                acc.setCategory(rs.getString("category"));
                acc.setPrice(rs.getDouble("price"));
                acc.setImagePath(rs.getString("image_path"));
                acc.setStatus(rs.getString("status"));
                list.add(acc);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
}