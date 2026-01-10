package com.bookstore.dao;

import com.bookstore.model.DonatedBook;
import com.bookstore.util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DonatedBookDAO {

    public boolean addDonatedBook(DonatedBook book) {
        String sql = "INSERT INTO donated_books (donor_email, title, " +
                "author, book_condition, category, message, approve_collect_status, " +
                "pickup_house_no, pickup_street, pickup_postcode, pickup_city, pickup_state, image_path) " +
                "VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, book.getDonorEmail());
            ps.setString(2, book.getTitle());
            ps.setString(3, book.getAuthor());
            ps.setString(4, book.getBookCondition());
            ps.setString(5, book.getCategory());
            ps.setString(6, book.getMessage());

            // Address Fields
            ps.setString(7, book.getPickupHouseNo());
            ps.setString(8, book.getPickupStreet());
            ps.setString(9, book.getPickupPostcode());
            ps.setString(10, book.getPickupCity());
            ps.setString(11, book.getPickupState());

            // Image Path
            ps.setString(12, book.getImagePath());

            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<DonatedBook> getAllDonatedBooks() {
        List<DonatedBook> books = new ArrayList<>();

        String sql = "SELECT b.*, d.donor_name, d.donor_phone " +
                "FROM donated_books b " +
                "JOIN donors d ON b.donor_email = d.donor_email " +
                "ORDER BY b.created_at DESC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                DonatedBook book = new DonatedBook();
                book.setDonatedBookId(rs.getInt("donated_book_id"));

                // Book Info
                book.setTitle(rs.getString("title"));
                book.setAuthor(rs.getString("author"));
                book.setBookCondition(rs.getString("book_condition"));
                book.setCategory(rs.getString("category"));
                book.setMessage(rs.getString("message"));
                book.setApproveCollectStatus(rs.getString("approve_collect_status"));
                book.setCreatedAt(rs.getTimestamp("created_at"));
                book.setImagePath(rs.getString("image_path"));

                // Address
                book.setPickupHouseNo(rs.getString("pickup_house_no"));
                book.setPickupStreet(rs.getString("pickup_street"));
                book.setPickupCity(rs.getString("pickup_city"));
                book.setPickupState(rs.getString("pickup_state"));
                book.setPickupPostcode(rs.getString("pickup_postcode"));

                // Joined Info
                book.setDonorEmail(rs.getString("donor_email"));
                book.setDonorName(rs.getString("donor_name"));
                book.setDonorPhone(rs.getString("donor_phone"));

                books.add(book);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return books;
    }

    public boolean updateStatus(int id, String status) {
        String sql = "UPDATE donated_books SET approve_collect_status = ? WHERE donated_book_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setInt(2, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}