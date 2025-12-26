package com.bookstore.dao;

import com.bookstore.model.User;
import com.bookstore.util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UserDAO {

    // ==========================================
    //  Feature 1: Register New User
    // ==========================================
    public boolean registerUser(User user) {
        // Updated SQL: Removed 'balance' column
        String sql = "INSERT INTO users (username, password, email, role, address) VALUES (?, ?, ?, 'USER', ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, user.getUsername());
            ps.setString(2, user.getPassword());
            ps.setString(3, user.getEmail());
            // Set address (handle null case safely)
            ps.setString(4, user.getAddress() != null ? user.getAddress() : "");

            int rows = ps.executeUpdate();
            return rows > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // ==========================================
    //  Feature 2: Login Validation
    // ==========================================
    public User checkLogin(String username, String password) {
        User user = null;
        String sql = "SELECT * FROM users WHERE username = ? AND password = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, username);
            ps.setString(2, password);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                user = new User();
                user.setId(rs.getInt("id"));
                user.setUsername(rs.getString("username"));
                user.setPassword(rs.getString("password"));
                user.setEmail(rs.getString("email"));
                user.setRole(rs.getString("role"));
                user.setAddress(rs.getString("address"));
                // Note: 'balance' is removed
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return user;
    }

    // ==========================================
    //  Feature 3: Get All Users (For Admin Panel)
    // ==========================================
    public List<User> getAllUsers() {
        List<User> userList = new ArrayList<>();
        String sql = "SELECT * FROM users ORDER BY id DESC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                User user = new User();
                user.setId(rs.getInt("id"));
                user.setUsername(rs.getString("username"));
                user.setEmail(rs.getString("email"));
                user.setRole(rs.getString("role"));
                user.setAddress(rs.getString("address"));
                // We usually don't need password for the list, but setting it doesn't hurt
                user.setPassword(rs.getString("password"));

                userList.add(user);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return userList;
    }

    // ==========================================
    //  Feature 4: Delete User (For Admin Panel)
    // ==========================================
    public boolean deleteUser(int id) {
        // Note: If user has foreign keys (like orders/books), this might fail
        // unless you use ON DELETE CASCADE in DB or delete children first.
        String sql = "DELETE FROM users WHERE id = ?";

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
    //  Main Method for Testing
    // ==========================================
    public static void main(String[] args) {
        UserDAO userDAO = new UserDAO();

        System.out.println("--- Testing Registration ---");
        User newUser = new User();
        newUser.setUsername("testuser");
        newUser.setPassword("12345");
        newUser.setEmail("test@example.com");
        newUser.setAddress("123 Test Street");

        if (userDAO.registerUser(newUser)) {
            System.out.println("User registered successfully!");
        } else {
            System.out.println("Registration failed.");
        }

        System.out.println("\n--- Testing Login ---");
        User loginUser = userDAO.checkLogin("testuser", "12345");
        if (loginUser != null) {
            System.out.println("Login success! Address: " + loginUser.getAddress());
        } else {
            System.out.println("Login failed.");
        }
    }
}