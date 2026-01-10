package com.bookstore.dao;

import com.bookstore.model.Order;
import com.bookstore.model.OrderItem;
import com.bookstore.util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class OrderDAO {

    // 1. Create Order
    public boolean createOrder(Order order) {
        Connection conn = null;
        PreparedStatement psOrder = null;
        PreparedStatement psItem = null;
        PreparedStatement psUpdateBook = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false); // Transaction Start

            // A. Insert into Orders
            String sqlOrder = "INSERT INTO orders (user_id, total_amount, status, shipping_address_id, payment_method) VALUES (?, ?, ?, ?, ?)";
            psOrder = conn.prepareStatement(sqlOrder, Statement.RETURN_GENERATED_KEYS);
            psOrder.setInt(1, order.getUserId());
            psOrder.setDouble(2, order.getTotalAmount());
            psOrder.setString(3, "PENDING");
            psOrder.setInt(4, order.getShippingAddressId());
            psOrder.setString(5, order.getPaymentMethod());

            if (psOrder.executeUpdate() == 0) throw new SQLException("Order creation failed.");

            int orderId = 0;
            rs = psOrder.getGeneratedKeys();
            if (rs.next()) orderId = rs.getInt(1);

            // B. Insert Items & Update Stock Status
            String sqlItem = "INSERT INTO order_items (order_id, book_id, accessory_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?, ?)";
            String sqlBookUpdate = "UPDATE books SET status = 'Sold' WHERE book_id = ?";

            psItem = conn.prepareStatement(sqlItem);
            psUpdateBook = conn.prepareStatement(sqlBookUpdate);

            for (OrderItem item : order.getItems()) {
                psItem.setInt(1, orderId);

                // Handle Book vs Accessory
                if (item.getBookId() != null) {
                    psItem.setInt(2, item.getBookId());
                    psItem.setNull(3, java.sql.Types.INTEGER); // accessory_id is null

                    // Mark book as sold
                    psUpdateBook.setInt(1, item.getBookId());
                    psUpdateBook.addBatch();
                } else {
                    psItem.setNull(2, java.sql.Types.INTEGER); // book_id is null
                    psItem.setInt(3, item.getAccessoryId());
                }

                psItem.setInt(4, item.getQuantity());
                psItem.setDouble(5, item.getPriceAtPurchase());
                psItem.addBatch();
            }

            psItem.executeBatch();
            psUpdateBook.executeBatch(); // Only affects books

            conn.commit(); // Save All
            return true;

        } catch (SQLException e) {
            e.printStackTrace();
            try { if (conn != null) conn.rollback(); } catch (SQLException ex) { ex.printStackTrace(); }
            return false;
        } finally {
            try {
                if (rs != null) rs.close();
                if (psItem != null) psItem.close();
                if (psOrder != null) psOrder.close();
                if (psUpdateBook != null) psUpdateBook.close();
                if (conn != null) { conn.setAutoCommit(true); conn.close(); }
            } catch (Exception e) {}
        }
    }

    // 2. Get All Orders (With Address Join)
    public List<Map<String, Object>> getAllOrders() {
        Map<Integer, Map<String, Object>> ordersMap = new java.util.LinkedHashMap<>();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();

            // Updated Query: Joins with Address table
            String sql = "SELECT o.order_id, o.created_at, o.total_amount, o.status, " +
                    "u.username AS customer_name, u.email, " +
                    "a.city, a.postcode, a.street, " + // Address columns
                    "b.title AS book_title, b.image_path, b.price " +
                    "FROM orders o " +
                    "LEFT JOIN users u ON o.user_id = u.user_id " +
                    "LEFT JOIN addresses a ON o.shipping_address_id = a.address_id " +
                    "LEFT JOIN order_items oi ON o.order_id = oi.order_id " +
                    "LEFT JOIN books b ON oi.book_id = b.book_id " +
                    "ORDER BY o.created_at DESC";

            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();

            while (rs.next()) {
                int orderId = rs.getInt("order_id");
                Map<String, Object> order = ordersMap.get(orderId);

                if (order == null) {
                    order = new HashMap<>();
                    order.put("id", orderId);
                    order.put("date", rs.getTimestamp("created_at").toString());
                    order.put("total", rs.getDouble("total_amount"));
                    order.put("status", rs.getString("status"));
                    order.put("customerName", rs.getString("customer_name"));
                    order.put("email", rs.getString("email"));

                    // Construct address string
                    String fullAddress = rs.getString("street") + ", " + rs.getString("city") + " " + rs.getString("postcode");
                    order.put("address", fullAddress);

                    order.put("products", new ArrayList<Map<String, Object>>());
                    ordersMap.put(orderId, order);
                }

                if (rs.getString("book_title") != null) {
                    Map<String, Object> product = new HashMap<>();
                    product.put("bookTitle", rs.getString("book_title"));
                    product.put("bookImage", rs.getString("image_path"));
                    product.put("bookPrice", rs.getDouble("price"));
                    ((List<Map<String, Object>>) order.get("products")).add(product);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try { if (conn != null) conn.close(); } catch (SQLException e) {}
        }
        return new ArrayList<>(ordersMap.values());
    }
}