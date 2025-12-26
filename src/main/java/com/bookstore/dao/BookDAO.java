package com.bookstore.dao;

import com.bookstore.model.Book;
import com.bookstore.util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BookDAO {

    // ==========================================
    //  1. Add New Book (适配新的数据库列)
    // ==========================================
    public boolean addBook(Book book) {
        // [FIX]: SQL updated to match new table columns (category, book_condition, stock)
        // Removed 'type', added 'category', 'book_condition', 'stock'
        String sql = "INSERT INTO books (title, author, price, category, book_condition, image_path, stock, rating, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, book.getTitle());
            ps.setString(2, book.getAuthor());
            ps.setDouble(3, book.getPrice());

            // [FIX]: Use getCategory() instead of getListingType()
            ps.setString(4, book.getCategory() != null ? book.getCategory() : "General");

            // [FIX]: Use getCondition()
            ps.setString(5, book.getCondition() != null ? book.getCondition() : "Good");

            ps.setString(6, book.getImagePath());

            // [FIX]: Use getStock()
            ps.setInt(7, book.getStock() > 0 ? book.getStock() : 1);

            // Default rating to 0.0 if new
            ps.setDouble(8, book.getRating());

            // Default status
            ps.setString(9, "Active");

            int rows = ps.executeUpdate();
            return rows > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // ==========================================
    //  2. Get All Books (查询所有书)
    // ==========================================
    public List<Book> getAllBooks() {
        List<Book> books = new ArrayList<>();
        String sql = "SELECT * FROM books ORDER BY id DESC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Book book = new Book();
                book.setId(rs.getInt("id"));
                book.setTitle(rs.getString("title"));
                book.setAuthor(rs.getString("author"));
                book.setPrice(rs.getDouble("price"));
                book.setImagePath(rs.getString("image_path"));
                book.setStatus(rs.getString("status"));

                // [FIX]: Map new columns
                book.setCategory(rs.getString("category"));
                book.setCondition(rs.getString("book_condition"));
                book.setRating(rs.getDouble("rating"));
                book.setStock(rs.getInt("stock"));

                books.add(book);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return books;
    }

    // ==========================================
    //  3. Delete Book
    // ==========================================
    public boolean deleteBook(int id) {
        String sql = "DELETE FROM books WHERE id = ?";
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

    // ==========================================
    //  4. Get Book By ID (用于详情页)
    // ==========================================
    public Book getBookById(int id) {
        Book book = null;
        String sql = "SELECT * FROM books WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                book = new Book();
                book.setId(rs.getInt("id"));
                book.setTitle(rs.getString("title"));
                book.setAuthor(rs.getString("author"));
                book.setPrice(rs.getDouble("price"));
                book.setImagePath(rs.getString("image_path"));
                book.setStatus(rs.getString("status"));
                book.setCategory(rs.getString("category"));
                book.setCondition(rs.getString("book_condition"));
                book.setRating(rs.getDouble("rating"));
                book.setStock(rs.getInt("stock"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return book;
    }
}