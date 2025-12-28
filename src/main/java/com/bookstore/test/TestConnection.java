package com.bookstore.test;

import com.bookstore.util.DBConnection;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class TestConnection {
    public static void main(String[] args) {
        System.out.println("Testing PostgreSQL Supabase Connection...");
        
        try (Connection conn = DBConnection.getConnection()) {
            if (conn != null) {
                System.out.println("✓ Connection successful!");
                
                // Test if tables exist
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery("SELECT COUNT(*) as count FROM users");
                
                if (rs.next()) {
                    int userCount = rs.getInt("count");
                    System.out.println("✓ Found " + userCount + " users in database");
                    
                    // Try to fetch a user
                    rs = stmt.executeQuery("SELECT username, role FROM users LIMIT 3");
                    System.out.println("\nSample users:");
                    while (rs.next()) {
                        System.out.println("  - " + rs.getString("username") + " (" + rs.getString("role") + ")");
                    }
                }
            } else {
                System.out.println("✗ Connection failed!");
            }
        } catch (Exception e) {
            System.out.println("✗ Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
