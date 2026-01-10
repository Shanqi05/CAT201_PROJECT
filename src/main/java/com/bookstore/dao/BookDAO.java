package com.bookstore.dao;

import com.bookstore.model.Book;
import com.bookstore.util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BookDAO {

    // 1. Add New Book
    public boolean addBook(Book book) {
        // [FIX] Added 'genres' column
        String sql = "INSERT INTO books (title, author, price, category, book_condition, image_path, status, genres) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, book.getTitle());
            ps.setString(2, book.getAuthor());
            ps.setDouble(3, book.getPrice());
            ps.setString(4, book.getCategory());
            ps.setString(5, book.getCondition());
            ps.setString(6, book.getImagePath());
            ps.setString(7, "Active");

            // [FIX] Handle Array for Postgres
            if (book.getGenres() != null) {
                Array genreArray = conn.createArrayOf("text", book.getGenres());
                ps.setArray(8, genreArray);
            } else {
                ps.setNull(8, java.sql.Types.ARRAY);
            }

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // 2. Get All Books
    public List<Book> getAllBooks() {
        List<Book> books = new ArrayList<>();
        String sql = "SELECT * FROM books ORDER BY book_id DESC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                books.add(mapRowToBook(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return books;
    }

    // 3. Get Book By ID
    public Book getBookById(int bookId) {
        Book book = null;
        String sql = "SELECT * FROM books WHERE book_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, bookId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    book = mapRowToBook(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return book;
    }

    // 4. Delete Book
    public boolean deleteBook(int bookId) {
        String sql = "DELETE FROM books WHERE book_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, bookId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Helper: Maps SQL Row -> Java Object
    private Book mapRowToBook(ResultSet rs) throws SQLException {
        Book book = new Book();
        book.setBookId(rs.getInt("book_id"));
        book.setTitle(rs.getString("title"));
        book.setAuthor(rs.getString("author"));
        book.setPrice(rs.getDouble("price"));
        book.setImagePath(rs.getString("image_path"));
        book.setStatus(rs.getString("status"));
        book.setCategory(rs.getString("category"));
        book.setCondition(rs.getString("book_condition"));

        // [FIX] Read Array
        Array genreArray = rs.getArray("genres");
        if (genreArray != null) {
            String[] genres = (String[]) genreArray.getArray();
            book.setGenres(genres);
        }
        return book;
    }
}