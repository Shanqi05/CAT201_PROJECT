package com.bookstore.dao;

import com.bookstore.model.DonatedBook;
import com.bookstore.util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DonatedBookDAO {

    // Add a new donated book
    public boolean addDonatedBook(DonatedBook book) {
        String sql = "INSERT INTO donated_books (donor_name, donor_email, donor_phone, book_title, " +
                    "author, book_condition, category, quantity, pickup_address, message, status) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, book.getDonorName());
            ps.setString(2, book.getDonorEmail());
            ps.setString(3, book.getDonorPhone());
            ps.setString(4, book.getBookTitle());
            ps.setString(5, book.getAuthor());
            ps.setString(6, book.getBookCondition());
            ps.setString(7, book.getCategory());
            ps.setInt(8, book.getQuantity());
            ps.setString(9, book.getPickupAddress());
            ps.setString(10, book.getMessage());

            int rows = ps.executeUpdate();
            return rows > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Get all donated books
    public List<DonatedBook> getAllDonatedBooks() {
        List<DonatedBook> books = new ArrayList<>();
        String sql = "SELECT * FROM donated_books ORDER BY created_at DESC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                DonatedBook book = new DonatedBook();
                book.setId(rs.getInt("id"));
                book.setDonorName(rs.getString("donor_name"));
                book.setDonorEmail(rs.getString("donor_email"));
                book.setDonorPhone(rs.getString("donor_phone"));
                book.setBookTitle(rs.getString("book_title"));
                book.setAuthor(rs.getString("author"));
                book.setBookCondition(rs.getString("book_condition"));
                book.setCategory(rs.getString("category"));
                book.setQuantity(rs.getInt("quantity"));
                book.setPickupAddress(rs.getString("pickup_address"));
                book.setMessage(rs.getString("message"));
                book.setStatus(rs.getString("status"));
                book.setCreatedAt(rs.getTimestamp("created_at"));
                books.add(book);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return books;
    }

    // Update donation status
    public boolean updateStatus(int id, String status) {
        String sql = "UPDATE donated_books SET status = ? WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, status);
            ps.setInt(2, id);

            int rows = ps.executeUpdate();
            return rows > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Delete a donated book record
    public boolean deleteDonatedBook(int id) {
        String sql = "DELETE FROM donated_books WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            int rows = ps.executeUpdate();
            return rows > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
