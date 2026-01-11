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
                "pickup_house_no, pickup_street, pickup_postcode, pickup_city, pickup_state, image_path, genres) " +
                "VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?, ?, ?, ?)";

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

            // Handle Genres Array
            if (book.getGenres() != null) {
                Array genreArray = conn.createArrayOf("text", book.getGenres());
                ps.setArray(13, genreArray);
            } else {
                ps.setNull(13, java.sql.Types.ARRAY);
            }

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
                books.add(mapRowToDonatedBook(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return books;
    }

    // Helper method to fetch single donation details for transfer
    public DonatedBook getDonatedBookById(int id) {
        DonatedBook book = null;
        String sql = "SELECT * FROM donated_books WHERE donated_book_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                book = mapRowToDonatedBook(rs); // Reuse mapping logic
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return book;
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

    // Helper to map row to object
    private DonatedBook mapRowToDonatedBook(ResultSet rs) throws SQLException {
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

        // Get Genres
        Array genreArray = rs.getArray("genres");
        if (genreArray != null) {
            try {
                String[] genres = (String[]) genreArray.getArray();
                book.setGenres(genres);
            } catch (Exception e) {
                // Fallback for empty/null
                book.setGenres(new String[]{});
            }
        }

        // Joined Info (Try/Catch in case column missing in simple selects)
        try {
            book.setDonorEmail(rs.getString("donor_email"));
            // These might not exist in a simple select * from donated_books, only in the join query
            // We can check metadata or just ignore if missing
            int colIndex = rs.findColumn("donor_name");
            if(colIndex > 0) book.setDonorName(rs.getString("donor_name"));

            colIndex = rs.findColumn("donor_phone");
            if(colIndex > 0) book.setDonorPhone(rs.getString("donor_phone"));
        } catch (SQLException e) {
            // Ignore missing columns
        }

        return book;
    }
}