package com.bookstore.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DBConnection {
    private static final String URL = "jdbc:postgresql://db.tuiiesrnwojtavinvjqc.supabase.co:5432/postgres?sslmode=require";
    private static final String USER = "postgres";
    private static final String PASSWORD = "WearefromCAT201";

    public static Connection getConnection() {
        Connection conn = null;
        try {
            Class.forName("org.postgresql.Driver");
            conn = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Database connected successfully!");
        } catch (ClassNotFoundException e) {
            System.err.println("PostgreSQL Driver not found! Make sure to rebuild the project.");
            e.printStackTrace();
        } catch (SQLException e) {
            System.err.println("Database connection failed!");
            e.printStackTrace();
        }
        return conn;
    }

    // 测试入口
    public static void main(String[] args) {
        System.out.println("Testing connection to Supabase PostgreSQL...");
        System.out.println("URL: " + URL);
        System.out.println("User: " + USER);
        
        try (Connection conn = getConnection()) {
            if(conn != null) {
                System.out.println("✓ Connection Success!");
                
                // Test query
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery("SELECT COUNT(*) as count FROM users");
                if (rs.next()) {
                    System.out.println("✓ Found " + rs.getInt("count") + " users in database");
                }
            } else {
                System.out.println("✗ Connection Fail");
            }
        } catch (Exception e) {
            System.out.println("✗ Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
