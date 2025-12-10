package com.bookstore.dao;

import com.bookstore.model.User;
import com.bookstore.util.DBConnection;
import java.sql.*;

public class UserDAO {

    // 【Function 1: Register New User】
    // Returns true if successful, false if failed (e.g., username exists)
    public boolean registerUser(User user) {
        String sql = "INSERT INTO users (username, password, email, role, balance) VALUES (?, ?, ?, 'USER', 0.00)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, user.getUsername());
            ps.setString(2, user.getPassword());
            ps.setString(3, user.getEmail());

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
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return user;
    }

    // 【Main Method for Testing】
    public static void main(String[] args) {
        UserDAO userDAO = new UserDAO();

        // Test 1: Register a new user
        System.out.println("--- Testing Registration ---");
        User newUser = new User("tan", "tan1234", "tan@example.com");
        if (userDAO.registerUser(newUser)) {
            System.out.println("User registered successfully!");
        } else {
            System.out.println("Registration failed (User might already exist).");
        }

        // Test 2: Try to login with correct password
        System.out.println("\n--- Testing Login (Correct) ---");
        User loggedInUser = userDAO.checkLogin("tan", "tan1234");
        if (loggedInUser != null) {
            System.out.println("Login Successful! Welcome, " + loggedInUser.getUsername());
        } else {
            System.out.println("Login Failed.");
        }

        // Test 3: Try to login with wrong password
        System.out.println("\n--- Testing Login (Wrong Password) ---");
        User wrongUser = userDAO.checkLogin("tan", "wrong_password");
        if (wrongUser == null) {
            System.out.println("System correctly rejected wrong password.");
        } else {
            System.out.println("Error: System allowed wrong password!");
        }
    }
}
