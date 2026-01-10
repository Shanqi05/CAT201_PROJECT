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

    public boolean createOrder(Order order) {
        Connection conn = null;
        PreparedStatement psOrder = null;
        PreparedStatement psItem = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            // [FIX] Use shipping_address_id (Integer)
            String sqlOrder = "INSERT INTO orders (user_id, total_amount, status, shipping_address_id, payment_method) VALUES (?, ?, ?, ?, ?)";
            psOrder = conn.prepareStatement(sqlOrder, Statement.RETURN_GENERATED_KEYS);
            psOrder.setInt(1, order.getUserId());
            psOrder.setDouble(2, order.getTotalAmount());
            psOrder.setString(3, "PENDING");
            psOrder.setInt(4, order.getShippingAddressId()); // Expects Int
            psOrder.setString(5, order.getPaymentMethod());

            int rowAffected = psOrder.executeUpdate();
            if (rowAffected == 0) throw new SQLException("Order creation failed");

            int orderId = 0;
            rs = psOrder.getGeneratedKeys();
            if (rs.next()) orderId = rs.getInt(1);

            // [FIX] Insert Order Items (Handle Book vs Accessory)
            String sqlItem = "INSERT INTO order_items (order_id, book_id, accessory_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?, ?)";
            psItem = conn.prepareStatement(sqlItem);

            // Optional: Update Book Status to 'Sold'
            String sqlUpdateBook = "UPDATE books SET status = 'Sold' WHERE book_id = ?";
            PreparedStatement psUpdateBook = conn.prepareStatement(sqlUpdateBook);

            for (OrderItem item : order.getItems()) {
                psItem.setInt(1, orderId);

                // Determine if it's a Book or Accessory based on IDs
                if (item.getBookId() > 0) {
                    psItem.setInt(2, item.getBookId());
                    psItem.setNull(3, java.sql.Types.INTEGER);
                    // Mark unique book as sold
                    psUpdateBook.setInt(1, item.getBookId());
                    psUpdateBook.addBatch();
                } else {
                    psItem.setNull(2, java.sql.Types.INTEGER);
                    psItem.setInt(3, item.getAccessoryId());
                }

                psItem.setInt(4, item.getQuantity());
                psItem.setDouble(5, item.getPriceAtPurchase());
                psItem.addBatch();
            }

            psItem.executeBatch();
            psUpdateBook.executeBatch(); // Execute book status updates

            conn.commit();
            return true;

        } catch (SQLException e) {
            e.printStackTrace();
            try { if (conn != null) conn.rollback(); } catch (SQLException ex) { ex.printStackTrace(); }
            return false;
        } finally {
            try {
                if (rs != null) rs.close();
                if (psOrder != null) psOrder.close();
                if (psItem != null) psItem.close();
                if (conn != null) conn.close();
            } catch (Exception e) {}
        }
    }

    public List<Map<String, Object>> getAllOrders() {
        Map<Integer, Map<String, Object>> ordersMap = new java.util.LinkedHashMap<>();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();

            // [FIX] JOIN addresses table to get the text address
            // [FIX] JOIN order_items to get books/accessories
            String sql = "SELECT o.order_id, o.created_at, o.total_amount, o.status, " +
                    "u.username AS customer_name, u.email, " +
                    "a.house_no, a.street, a.city, a.postcode, a.state, " + // Address columns
                    "b.title AS book_title, b.image_path AS book_image, b.price AS book_price, " +
                    "acc.title AS acc_title, acc.image_path AS acc_image, acc.price AS acc_price " +
                    "FROM orders o " +
                    "LEFT JOIN users u ON o.user_id = u.user_id " +
                    "LEFT JOIN addresses a ON o.shipping_address_id = a.address_id " +
                    "LEFT JOIN order_items oi ON o.order_id = oi.order_id " +
                    "LEFT JOIN books b ON oi.book_id = b.book_id " +
                    "LEFT JOIN accessories acc ON oi.accessory_id = acc.accessory_id " +
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

                    // Construct Address String
                    String fullAddress = String.format("%s, %s, %s %s, %s",
                            rs.getString("house_no"), rs.getString("street"),
                            rs.getString("postcode"), rs.getString("city"), rs.getString("state"));
                    order.put("address", fullAddress);

                    order.put("products", new ArrayList<Map<String, Object>>());
                    ordersMap.put(orderId, order);
                }

                // Add Products (Book OR Accessory)
                List<Map<String, Object>> productList = (List<Map<String, Object>>) order.get("products");

                if (rs.getString("book_title") != null) {
                    Map<String, Object> p = new HashMap<>();
                    p.put("name", rs.getString("book_title")); // Frontend expects 'name'
                    p.put("img", rs.getString("book_image"));
                    p.put("price", rs.getDouble("book_price"));
                    productList.add(p);
                } else if (rs.getString("acc_title") != null) {
                    Map<String, Object> p = new HashMap<>();
                    p.put("name", rs.getString("acc_title"));
                    p.put("img", rs.getString("acc_image"));
                    p.put("price", rs.getDouble("acc_price"));
                    productList.add(p);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try { if (conn != null) conn.close(); } catch (Exception e) {}
        }
        return new ArrayList<>(ordersMap.values());
    }
}