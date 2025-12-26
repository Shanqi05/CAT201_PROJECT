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

    // ==========================================
    //  方法 1: 创建订单 (用于购买 PurchaseServlet)
    // ==========================================
    public boolean createOrder(Order order) {
        Connection conn = null;
        PreparedStatement psOrder = null;
        PreparedStatement psItem = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            // 1. 开启事务 (Transaction)
            conn.setAutoCommit(false);

            // 2. 插入主表 orders
            String sqlOrder = "INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method) VALUES (?, ?, ?, ?, ?)";
            psOrder = conn.prepareStatement(sqlOrder, Statement.RETURN_GENERATED_KEYS);
            psOrder.setInt(1, order.getUserId());
            psOrder.setDouble(2, order.getTotalAmount());
            psOrder.setString(3, "PENDING");
            psOrder.setString(4, order.getShippingAddress());
            psOrder.setString(5, order.getPaymentMethod());

            int rowAffected = psOrder.executeUpdate();
            if (rowAffected == 0) throw new SQLException("Creating order failed, no rows affected.");

            // 3. 获取生成的 Order ID
            int newOrderId = 0;
            rs = psOrder.getGeneratedKeys();
            if (rs.next()) {
                newOrderId = rs.getInt(1);
            } else {
                throw new SQLException("Creating order failed, no ID obtained.");
            }

            // 4. 插入子表 order_items
            String sqlItem = "INSERT INTO order_items (order_id, book_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)";
            psItem = conn.prepareStatement(sqlItem);

            for (OrderItem item : order.getItems()) {
                psItem.setInt(1, newOrderId);
                psItem.setInt(2, item.getBookId());
                psItem.setInt(3, item.getQuantity());
                psItem.setDouble(4, item.getPriceAtPurchase());
                psItem.addBatch();
            }

            psItem.executeBatch();

            // 5. 提交事务
            conn.commit();
            return true;

        } catch (SQLException e) {
            e.printStackTrace();
            try {
                if (conn != null) conn.rollback();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            return false;
        } finally {
            try {
                if (rs != null) rs.close();
                if (psItem != null) psItem.close();
                if (psOrder != null) psOrder.close();
                if (conn != null) conn.close();
            } catch (Exception e) {
            }
        }
    }

    // ==========================================
    //  方法 2: 获取所有订单 (用于查看 GetOrdersServlet)
    // ==========================================
    // Inside OrderDAO.java

    public List<Map<String, Object>> getAllOrders() {
        // Use LinkedHashMap to preserve the SQL order (ORDER BY date DESC)
        Map<Integer, Map<String, Object>> ordersMap = new java.util.LinkedHashMap<>();

        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();

            // SQL remains the same (LEFT JOINs)
            String sql = "SELECT o.id, o.created_at, o.total_amount, o.status, " +
                    "u.username AS customer_name, u.email, o.shipping_address, " +
                    "b.title AS book_title, b.image_path, b.price " +
                    "FROM orders o " +
                    "LEFT JOIN users u ON o.user_id = u.id " +
                    "LEFT JOIN order_items oi ON o.id = oi.order_id " +
                    "LEFT JOIN books b ON oi.book_id = b.id " +
                    "ORDER BY o.created_at DESC";

            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();

            while (rs.next()) {
                int orderId = rs.getInt("id");

                // 1. Check if this order already exists in our Map
                Map<String, Object> order = ordersMap.get(orderId);

                if (order == null) {
                    // New Order found! Initialize the header info
                    order = new HashMap<>();
                    order.put("id", orderId);
                    order.put("date", rs.getTimestamp("created_at").toString());
                    order.put("total", rs.getDouble("total_amount"));
                    order.put("status", rs.getString("status"));
                    order.put("customerName", rs.getString("customer_name"));
                    order.put("email", rs.getString("email"));
                    order.put("phone", "N/A"); // Hardcoded as per previous fix
                    order.put("address", rs.getString("shipping_address"));

                    // Critical: Initialize the products list
                    order.put("products", new ArrayList<Map<String, Object>>());

                    // Add to Map
                    ordersMap.put(orderId, order);
                }

                // 2. Extract Book Info (if exists)
                String bookTitle = rs.getString("book_title");
                if (bookTitle != null) {
                    Map<String, Object> product = new HashMap<>();
                    product.put("bookTitle", bookTitle);
                    product.put("bookImage", rs.getString("image_path"));
                    product.put("bookPrice", rs.getDouble("price"));

                    // 3. Add this book to the CURRENT order's product list
                    List<Map<String, Object>> productList = (List<Map<String, Object>>) order.get("products");
                    productList.add(product);
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) rs.close();
                if (ps != null) ps.close();
                if (conn != null) conn.close();
            } catch (Exception e) {
            }
        }

        // Convert the Map values back to a List for the frontend
        return new ArrayList<>(ordersMap.values());
    }
}