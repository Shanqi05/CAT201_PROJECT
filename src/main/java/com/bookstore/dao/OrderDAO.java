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

            String sqlOrder = "INSERT INTO orders (user_id, total_amount, status, shipping_address_id, payment_method) VALUES (?, ?, ?, ?, ?)";
            psOrder = conn.prepareStatement(sqlOrder, Statement.RETURN_GENERATED_KEYS);
            psOrder.setInt(1, order.getUserId());
            psOrder.setDouble(2, order.getTotalAmount());
            psOrder.setString(3, "Processing");
            psOrder.setInt(4, order.getShippingAddressId());
            psOrder.setString(5, order.getPaymentMethod());

            int rowAffected = psOrder.executeUpdate();
            if (rowAffected == 0) throw new SQLException("Order creation failed");

            int orderId = 0;
            rs = psOrder.getGeneratedKeys();
            if (rs.next()) orderId = rs.getInt(1);

            String sqlItem = "INSERT INTO order_items (order_id, book_id, accessory_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?, ?)";
            psItem = conn.prepareStatement(sqlItem);

            String sqlUpdateBook = "UPDATE books SET status = 'Sold' WHERE book_id = ?";
            PreparedStatement psUpdateBook = conn.prepareStatement(sqlUpdateBook);

            for (OrderItem item : order.getItems()) {
                psItem.setInt(1, orderId);

                // [FIX] Insert logic for dual IDs
                if (item.getBookId() > 0) {
                    // It's a BOOK
                    psItem.setInt(2, item.getBookId());
                    psItem.setNull(3, java.sql.Types.INTEGER); // Accessory ID is null

                    // Mark Book as Sold
                    psUpdateBook.setInt(1, item.getBookId());
                    psUpdateBook.addBatch();
                } else if (item.getAccessoryId() > 0) {
                    // It's an ACCESSORY
                    psItem.setNull(2, java.sql.Types.INTEGER); // Book ID is null
                    psItem.setInt(3, item.getAccessoryId());
                }

                psItem.setInt(4, item.getQuantity());
                psItem.setDouble(5, item.getPriceAtPurchase());
                psItem.addBatch();
            }

            psItem.executeBatch();
            psUpdateBook.executeBatch();

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

    // [FIXED] Get All Orders (Admin) - Removed u.phone
    public List<Map<String, Object>> getAllOrders() {
        return getOrdersGeneric("SELECT o.order_id, o.created_at, o.total_amount, o.status, o.payment_method, " +
                "u.username AS customer_name, u.email, " + // Removed u.phone
                "a.house_no, a.street, a.city, a.postcode, a.state, " +
                "b.title AS book_title, b.image_path AS book_image, " +
                "acc.title AS acc_title, acc.image_path AS acc_image, " +
                "oi.quantity, oi.price_at_purchase " +
                "FROM orders o " +
                "LEFT JOIN users u ON o.user_id = u.user_id " +
                "LEFT JOIN addresses a ON o.shipping_address_id = a.address_id " +
                "LEFT JOIN order_items oi ON o.order_id = oi.order_id " +
                "LEFT JOIN books b ON oi.book_id = b.book_id " +
                "LEFT JOIN accessories acc ON oi.accessory_id = acc.accessory_id " +
                "ORDER BY o.created_at DESC", -1);
    }

    // [FIXED] Get User Orders - Removed u.phone
    public List<Map<String, Object>> getOrdersByUserId(int userId) {
        return getOrdersGeneric("SELECT o.order_id, o.created_at, o.total_amount, o.status, o.payment_method, " +
                "u.username AS customer_name, u.email, " + // Removed u.phone
                "a.house_no, a.street, a.city, a.postcode, a.state, " +
                "b.title AS book_title, b.image_path AS book_image, " +
                "acc.title AS acc_title, acc.image_path AS acc_image, " +
                "oi.quantity, oi.price_at_purchase " +
                "FROM orders o " +
                "LEFT JOIN users u ON o.user_id = u.user_id " +
                "LEFT JOIN addresses a ON o.shipping_address_id = a.address_id " +
                "LEFT JOIN order_items oi ON o.order_id = oi.order_id " +
                "LEFT JOIN books b ON oi.book_id = b.book_id " +
                "LEFT JOIN accessories acc ON oi.accessory_id = acc.accessory_id " +
                "WHERE o.user_id = ? " +
                "ORDER BY o.created_at DESC", userId);
    }

    // Helper method
    private List<Map<String, Object>> getOrdersGeneric(String sql, int userIdFilter) {
        Map<Integer, Map<String, Object>> ordersMap = new java.util.LinkedHashMap<>();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            if (userIdFilter != -1) {
                ps.setInt(1, userIdFilter);
            }
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
                    order.put("paymentMethod", rs.getString("payment_method"));

                    // Admin specific fields
                    order.put("customerName", rs.getString("customer_name"));
                    order.put("email", rs.getString("email"));
                    // [FIX] Removed phone mapping since column doesn't exist
                    // order.put("phone", rs.getString("u_phone"));

                    String fullAddress = "No address";
                    if (rs.getString("street") != null) {
                        fullAddress = String.format("%s, %s, %s %s, %s",
                                rs.getString("house_no"), rs.getString("street"),
                                rs.getString("postcode"), rs.getString("city"), rs.getString("state"));
                    }
                    order.put("address", fullAddress);
                    order.put("products", new ArrayList<Map<String, Object>>());
                    ordersMap.put(orderId, order);
                }

                List<Map<String, Object>> productList = (List<Map<String, Object>>) order.get("products");
                Map<String, Object> p = new HashMap<>();

                String title = null;
                String image = null;

                if (rs.getString("book_title") != null) {
                    title = rs.getString("book_title");
                    image = rs.getString("book_image");
                } else if (rs.getString("acc_title") != null) {
                    title = rs.getString("acc_title");
                    image = rs.getString("acc_image");
                }

                if (title != null) {
                    p.put("title", title);
                    p.put("price", rs.getDouble("price_at_purchase"));
                    p.put("quantity", rs.getInt("quantity"));
                    // Fix Image Path
                    p.put("image", image != null && !image.startsWith("http") ? "http://localhost:8080/CAT201_project/uploads/" + image : image);
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