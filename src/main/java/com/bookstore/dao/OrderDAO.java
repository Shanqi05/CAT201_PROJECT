package com.bookstore.dao;

import com.bookstore.model.Order;
import com.bookstore.util.DBConnection;
import java.sql.*;

public class OrderDAO {

    // 【Function: Process a Purchase】
    // This method handles the Transaction.
    // Returns: String message (e.g., "SUCCESS", "Insufficient Funds", "Book Sold")
    public String placeOrder(int bookId, int buyerId) {
        Connection conn = null;
        PreparedStatement psCheckBook = null;
        PreparedStatement psCheckBuyer = null;
        PreparedStatement psUpdateBuyer = null;
        PreparedStatement psUpdateSeller = null;
        PreparedStatement psUpdateBook = null;
        PreparedStatement psInsertOrder = null;
        ResultSet rsBook = null;
        ResultSet rsBuyer = null;

        try {
            conn = DBConnection.getConnection();

            // ⚠️ CRITICAL: Turn off auto-commit to start a Transaction
            conn.setAutoCommit(false);

            // 1. Get Book Details (Price & Seller ID)
            String sqlBook = "SELECT price, seller_id, status FROM books WHERE id = ?";
            psCheckBook = conn.prepareStatement(sqlBook);
            psCheckBook.setInt(1, bookId);
            rsBook = psCheckBook.executeQuery();

            if (!rsBook.next()) return "Book Not Found";
            double price = rsBook.getDouble("price");
            int sellerId = rsBook.getInt("seller_id");
            String status = rsBook.getString("status");

            if ("SOLD".equals(status)) return "Book Already Sold";

            // 2. Get Buyer Details (Check Balance)
            String sqlBuyer = "SELECT balance FROM users WHERE id = ?";
            psCheckBuyer = conn.prepareStatement(sqlBuyer);
            psCheckBuyer.setInt(1, buyerId);
            rsBuyer = psCheckBuyer.executeQuery();

            if (!rsBuyer.next()) return "Buyer Not Found";
            double buyerBalance = rsBuyer.getDouble("balance");

            if (buyerBalance < price) return "Insufficient Balance";

            // --- IF WE REACH HERE, EVERYTHING IS OK. START UPDATING DATA ---

            // 3. Deduct Money from Buyer
            String sqlDeduct = "UPDATE users SET balance = balance - ? WHERE id = ?";
            psUpdateBuyer = conn.prepareStatement(sqlDeduct);
            psUpdateBuyer.setDouble(1, price);
            psUpdateBuyer.setInt(2, buyerId);
            psUpdateBuyer.executeUpdate();

            // 4. Add Money to Seller
            String sqlAdd = "UPDATE users SET balance = balance + ? WHERE id = ?";
            psUpdateSeller = conn.prepareStatement(sqlAdd);
            psUpdateSeller.setDouble(1, price);
            psUpdateSeller.setInt(2, sellerId);
            psUpdateSeller.executeUpdate();

            // 5. Update Book Status to 'SOLD'
            String sqlBookStatus = "UPDATE books SET status = 'SOLD' WHERE id = ?";
            psUpdateBook = conn.prepareStatement(sqlBookStatus);
            psUpdateBook.setInt(1, bookId);
            psUpdateBook.executeUpdate();

            // 6. Create Order Record
            String sqlOrder = "INSERT INTO orders (book_id, buyer_id, total_amount) VALUES (?, ?, ?)";
            psInsertOrder = conn.prepareStatement(sqlOrder);
            psInsertOrder.setInt(1, bookId);
            psInsertOrder.setInt(2, buyerId);
            psInsertOrder.setDouble(3, price);
            psInsertOrder.executeUpdate();

            // COMMIT: Save all changes permanently
            conn.commit();
            return "SUCCESS";

        } catch (SQLException e) {
            e.printStackTrace();
            // ROLLBACK: If any error happens, undo everything!
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) { ex.printStackTrace(); }
            }
            return "Database Error: " + e.getMessage();
        } finally {
            // Close all resources (Standard boilerplate)
            try {
                if (rsBook != null) rsBook.close();
                if (rsBuyer != null) rsBuyer.close();
                if (psCheckBook != null) psCheckBook.close();
                if (psCheckBuyer != null) psCheckBuyer.close();
                if (psUpdateBuyer != null) psUpdateBuyer.close();
                if (psUpdateSeller != null) psUpdateSeller.close();
                if (psUpdateBook != null) psUpdateBook.close();
                if (psInsertOrder != null) psInsertOrder.close();
                if (conn != null) conn.close();
            } catch (SQLException e) { e.printStackTrace(); }
        }
    }

    // 【Main Method for Testing】
    public static void main(String[] args) {
        OrderDAO orderDAO = new OrderDAO();

        // Assume database:
        // User ID 1 is a seller (testuser)，balance 100.0
        // Create a User ID 2 as a buyer，load balance for him。
        // or just let user ID 1 buy his own book


        System.out.println("--- Processing Order ---");
        // Seller ID 1 try to by a Book ID 1
        String result = orderDAO.placeOrder(1, 1);
        System.out.println("Result: " + result);
    }
}
