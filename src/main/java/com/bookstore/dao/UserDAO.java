package com.bookstore.dao;

import com.bookstore.model.User;
import com.bookstore.util.DBConnection;
import java.sql.*;

public class UserDAO {

    // 【Function 1: Register New User】
    // Returns true if successful, false if failed (e.g., username exists)
    public boolean registerUser(User user) {
        // Update SQL to include 'address'
        String sql = "INSERT INTO users (username, password, email, role, balance, address) VALUES (?, ?, ?, 'USER', 0.00, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, user.getUsername());
            ps.setString(2, user.getPassword());
            ps.setString(3, user.getEmail());

            // Set address (handle null case just to be safe)
            ps.setString(4, user.getAddress() != null ? user.getAddress() : "");

            int rows = ps.executeUpdate();
            return rows > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // 【Function 2: Login Validation】
    // If username & password match, return the User object (so Member 4 can put it in Session).
    // If failed, return null.
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
                user.setBalance(rs.getDouble("balance"));
                user.setAddress(rs.getString("address"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return user;
    }

    // [New Function: Get All Users for Admin Panel]
    public java.util.List<User> getAllUsers() {
        java.util.List<User> userList = new java.util.ArrayList<>();
        String sql = "SELECT * FROM users ORDER BY id DESC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                User user = new User();
                user.setId(rs.getInt("id"));
                user.setUsername(rs.getString("username"));
                user.setEmail(rs.getString("email"));
                user.setRole(rs.getString("role")); // DB likely stores "USER" or "ADMIN"
                user.setBalance(rs.getDouble("balance"));
                user.setAddress(rs.getString("address"));
                // We typically don't send passwords to frontend list for security,
                // but setting it is fine if your object requires it.
                user.setPassword(rs.getString("password"));

                userList.add(user);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return userList;
    }

    // [New Function: Delete User by ID]
    public boolean deleteUser(int id) {
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

    // [Main Method for Testing]
    public static void main(String[] args) {
        UserDAO userDAO = new UserDAO();

        // Test 1: Register a new user
        System.out.println("--- Testing Registration ---");
        // Create user with address
        User newUser = new User();
        newUser.setUsername("tan");
        newUser.setPassword("tan1234");
        newUser.setEmail("tan@example.com");
        newUser.setAddress("123 Penang Road, Malaysia"); // Set an address!

        if (userDAO.registerUser(newUser)) {
            System.out.println("User registered successfully!");
        } else {
            System.out.println("Registration failed (User might already exist).");
        }

        // ... 后面的 login 测试代码保持不变 ...
    }
}
