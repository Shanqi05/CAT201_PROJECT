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
        PreparedStatement psUpdateBook = null;
        PreparedStatement psUpdateAccessory = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false); // Start Transaction

            // 1. Insert Order
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

            // 2. Prepare Item Statements
            String sqlItem = "INSERT INTO order_items (order_id, book_id, accessory_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?, ?)";
            psItem = conn.prepareStatement(sqlItem);

            // 3. Prepare Update Statements
            String sqlUpdateBook = "UPDATE books SET status = 'Sold' WHERE book_id = ?";
            psUpdateBook = conn.prepareStatement(sqlUpdateBook);

            String sqlUpdateAccessory = "UPDATE accessories SET stock = stock - ? WHERE accessory_id = ? AND stock >= ?";
            psUpdateAccessory = conn.prepareStatement(sqlUpdateAccessory);

            for (OrderItem item : order.getItems()) {
                psItem.setInt(1, orderId);

                if (item.getBookId() > 0) {
                    // --- HANDLE BOOK ---
                    psItem.setInt(2, item.getBookId());
                    psItem.setNull(3, java.sql.Types.INTEGER);

                    // Mark Book as Sold
                    psUpdateBook.setInt(1, item.getBookId());
                    psUpdateBook.addBatch();

                } else if (item.getAccessoryId() > 0) {
                    // --- HANDLE ACCESSORY ---
                    psItem.setNull(2, java.sql.Types.INTEGER);
                    psItem.setInt(3, item.getAccessoryId());

                    // Deduct Stock
                    psUpdateAccessory.setInt(1, item.getQuantity());
                    psUpdateAccessory.setInt(2, item.getAccessoryId());
                    psUpdateAccessory.setInt(3, item.getQuantity());
                    psUpdateAccessory.addBatch();
                }

                psItem.setInt(4, item.getQuantity());
                psItem.setDouble(5, item.getPriceAtPurchase());
                psItem.addBatch();
            }

            // Execute all batches
            psItem.executeBatch();
            psUpdateBook.executeBatch();
            psUpdateAccessory.executeBatch();

            conn.commit(); // Commit Transaction
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
                if (psUpdateBook != null) psUpdateBook.close();
                if (psUpdateAccessory != null) psUpdateAccessory.close();
                if (conn != null) conn.close();
            } catch (Exception e) {}
        }
    }

    // Method to update status
    public boolean updateOrderStatus(int orderId, String status) {
        String sql = "UPDATE orders SET status = ? WHERE order_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setInt(2, orderId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Cancel Order (Restores Stock & Book Status)
    public boolean cancelOrder(int orderId) {
        Connection conn = null;
        PreparedStatement psGetItems = null;
        PreparedStatement psRestoreBook = null;
        PreparedStatement psRestoreAcc = null;
        PreparedStatement psUpdateOrder = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            // 1. Get Items in Order
            String sqlGetItems = "SELECT book_id, accessory_id, quantity FROM order_items WHERE order_id = ?";
            psGetItems = conn.prepareStatement(sqlGetItems);
            psGetItems.setInt(1, orderId);
            rs = psGetItems.executeQuery();

            // Prepare Restore Queries
            String sqlRestoreBook = "UPDATE books SET status = 'Available' WHERE book_id = ?";
            psRestoreBook = conn.prepareStatement(sqlRestoreBook);

            String sqlRestoreAcc = "UPDATE accessories SET stock = stock + ? WHERE accessory_id = ?";
            psRestoreAcc = conn.prepareStatement(sqlRestoreAcc);

            while (rs.next()) {
                int bookId = rs.getInt("book_id");
                int accId = rs.getInt("accessory_id");
                int qty = rs.getInt("quantity");

                if (bookId > 0) {
                    psRestoreBook.setInt(1, bookId);
                    psRestoreBook.addBatch();
                } else if (accId > 0) {
                    psRestoreAcc.setInt(1, qty);
                    psRestoreAcc.setInt(2, accId);
                    psRestoreAcc.addBatch();
                }
            }

            // 2. Execute Restores
            psRestoreBook.executeBatch();
            psRestoreAcc.executeBatch();

            // 3. Mark Order as Cancelled
            String sqlUpdateOrder = "UPDATE orders SET status = 'Cancelled' WHERE order_id = ?";
            psUpdateOrder = conn.prepareStatement(sqlUpdateOrder);
            psUpdateOrder.setInt(1, orderId);
            psUpdateOrder.executeUpdate();

            conn.commit();
            return true;

        } catch (SQLException e) {
            e.printStackTrace();
            try { if(conn != null) conn.rollback(); } catch(SQLException ex) { ex.printStackTrace(); }
            return false;
        } finally {
            try {
                if (rs != null) rs.close();
                if (psGetItems != null) psGetItems.close();
                if (psRestoreBook != null) psRestoreBook.close();
                if (psRestoreAcc != null) psRestoreAcc.close();
                if (psUpdateOrder != null) psUpdateOrder.close();
                if (conn != null) conn.close();
            } catch (Exception e) {}
        }
    }

    // Get All Orders (Admin)
    public List<Map<String, Object>> getAllOrders() {
        return getOrdersGeneric("SELECT o.order_id, o.created_at, o.total_amount, o.status, o.payment_method, " +
                "u.username AS customer_name, u.email, " +
                "a.house_no, a.street, a.city, a.postcode, a.state, a.phone, " +
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

    // Get User Orders
    public List<Map<String, Object>> getOrdersByUserId(int userId) {
        return getOrdersGeneric("SELECT o.order_id, o.created_at, o.total_amount, o.status, o.payment_method, " +
                "u.username AS customer_name, u.email, " +
                "a.house_no, a.street, a.city, a.postcode, a.state, a.phone, " +
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

                    // User Info
                    order.put("customerName", rs.getString("customer_name"));
                    order.put("email", rs.getString("email"));
                    order.put("phone", rs.getString("phone"));

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