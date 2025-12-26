package com.bookstore.dao;

import com.bookstore.model.Book;
import com.bookstore.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BookDAO {

    // Function 1: Insert a book
    public boolean addBook(Book book) {
        String sql = "INSERT INTO books (title, author, price, listing_type, status, seller_id, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)";

        // Connection closed
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, book.getTitle());
            ps.setString(2, book.getAuthor());
            ps.setDouble(3, book.getPrice());
            ps.setString(4, book.getListingType());
            ps.setString(5, "AVAILABLE");
            ps.setInt(6, book.getSellerId());
            ps.setString(7, book.getImagePath());

            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0; // if > 0, success

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Function 2 : Select all available book for display user
    public java.util.List<Book> getAllBooks() {
        java.util.List<Book> books = new java.util.ArrayList<>();
        String sql = "SELECT * FROM books ORDER BY id DESC"; // 让新书排在前面

        try (java.sql.Connection conn = com.bookstore.util.DBConnection.getConnection();
             java.sql.PreparedStatement ps = conn.prepareStatement(sql);
             java.sql.ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Book book = new Book();
                book.setId(rs.getInt("id"));
                book.setTitle(rs.getString("title"));
                book.setAuthor(rs.getString("author"));
                book.setPrice(rs.getDouble("price"));

                // >>> 这里的名字必须是你数据库里的真实列名 <<<
                book.setListingType(rs.getString("listing_type")); // 数据库列名
                book.setImagePath(rs.getString("image_path"));     // 数据库列名
                // book.setSellerId(rs.getInt("seller_id"));       // 如果需要的话

                books.add(book);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return books;
    }

    // 【Function 3: Search Books by Keyword】
    // For the Search Bar (e.g., user types "Java")
    public List<Book> searchBooks(String keyword) {
        List<Book> bookList = new ArrayList<>();
        String sql = "SELECT * FROM books WHERE status = 'AVAILABLE' AND (title LIKE ? OR author LIKE ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            String searchPattern = "%" + keyword + "%"; // % is for wildcard search
            ps.setString(1, searchPattern);
            ps.setString(2, searchPattern);

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Book b = new Book();
                b.setId(rs.getInt("id"));
                b.setTitle(rs.getString("title"));
                b.setAuthor(rs.getString("author"));
                b.setPrice(rs.getDouble("price"));
                b.setListingType(rs.getString("listing_type"));
                b.setImagePath(rs.getString("image_path"));
                bookList.add(b);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return bookList;
    }

    // 【Function 4: Filter Books】
    // allows users to filter by Type (SELL/DONATE) and Price Range.
    public List<Book> filterBooks(String type, double minPrice, double maxPrice) {
        List<Book> bookList = new ArrayList<>();

        // SQL logic: Select books that match the type AND are within the price range
        String sql = "SELECT * FROM books WHERE status = 'AVAILABLE' AND listing_type = ? AND price >= ? AND price <= ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, type);      // e.g., "SELL" or "DONATE"
            ps.setDouble(2, minPrice);  // e.g., 5.00
            ps.setDouble(3, maxPrice);  // e.g., 50.00

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Book b = new Book();
                b.setId(rs.getInt("id"));
                b.setTitle(rs.getString("title"));
                b.setAuthor(rs.getString("author"));
                b.setPrice(rs.getDouble("price"));
                b.setListingType(rs.getString("listing_type"));
                b.setImagePath(rs.getString("image_path"));
                bookList.add(b);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return bookList;
    }

    // 【Function 5: Get Book by ID】
    // for "Product Details Page" and "Checkout Process"
    public Book getBookById(int id) {
        Book b = null;
        String sql = "SELECT * FROM books WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                b = new Book();
                b.setId(rs.getInt("id"));
                b.setTitle(rs.getString("title"));
                b.setAuthor(rs.getString("author"));
                b.setPrice(rs.getDouble("price"));
                b.setStatus(rs.getString("status"));
                b.setListingType(rs.getString("listing_type"));
                b.setSellerId(rs.getInt("seller_id"));
                b.setImagePath(rs.getString("image_path"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return b;
    }

    public boolean deleteBook(int id) {
        boolean isSuccess = false;
        String sql = "DELETE FROM books WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);

            int row = ps.executeUpdate();
            if (row > 0) {
                isSuccess = true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return isSuccess;
    }

    // For testing use
    public static void main(String[] args) {
        BookDAO dao = new BookDAO();

        // create a book
        Book newBook = new Book("Java Programming", "John Doe", 25.50, "SELL", 1);

        // add book
        if(dao.addBook(newBook)) {
            System.out.println("Book added successfully！");
        } else {
            System.out.println("Failed to add book");
        }

        // search book
        System.out.println("--- Searching ---");
        List<Book> books = dao.getAllBooks();
        for (Book b : books) {
            System.out.println("Book title: " + b.getTitle() + " | Price: " + b.getPrice());
        }
    }
}
