package com.bookstore.dao;

import com.bookstore.model.Accessory;
import com.bookstore.util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AccessoryDAO {

    public boolean addAccessory(Accessory accessory) {
        String sql = "INSERT INTO accessories (title, category, price, image_path, status, stock) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, accessory.getTitle());
            ps.setString(2, accessory.getCategory());
            ps.setDouble(3, accessory.getPrice());
            ps.setString(4, accessory.getImagePath());
            ps.setString(5, "Active");
            ps.setInt(6, accessory.getStock());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean updateAccessory(Accessory accessory) {
        // Logic: If image_path is provided, update it. If null, keep old value using COALESCE or dynamic SQL.
        // Simplified approach: Update image only if not null.
        String sql;
        if (accessory.getImagePath() != null && !accessory.getImagePath().isEmpty()) {
            sql = "UPDATE accessories SET title=?, category=?, price=?, stock=?, image_path=? WHERE accessory_id=?";
        } else {
            sql = "UPDATE accessories SET title=?, category=?, price=?, stock=? WHERE accessory_id=?";
        }

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, accessory.getTitle());
            ps.setString(2, accessory.getCategory());
            ps.setDouble(3, accessory.getPrice());
            ps.setInt(4, accessory.getStock());

            if (accessory.getImagePath() != null && !accessory.getImagePath().isEmpty()) {
                ps.setString(5, accessory.getImagePath());
                ps.setInt(6, accessory.getAccessoryId());
            } else {
                ps.setInt(5, accessory.getAccessoryId());
            }

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Accessory> getAllAccessories() {
        List<Accessory> list = new ArrayList<>();
        String sql = "SELECT * FROM accessories ORDER BY accessory_id DESC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Accessory acc = new Accessory();
                acc.setAccessoryId(rs.getInt("accessory_id"));
                acc.setTitle(rs.getString("title"));
                acc.setCategory(rs.getString("category"));
                acc.setPrice(rs.getDouble("price"));
                acc.setImagePath(rs.getString("image_path"));
                acc.setStatus(rs.getString("status"));
                acc.setStock(rs.getInt("stock"));
                list.add(acc);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public boolean deleteAccessory(int id) {
        boolean isSuccess = false;
        String sql = "DELETE FROM accessories WHERE accessory_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            int row = ps.executeUpdate();
            if (row > 0) isSuccess = true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return isSuccess;
    }

    public int getTotalAccessoriesCount() {
        int count = 0;
        String sql = "SELECT COUNT(*) FROM accessories";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) count = rs.getInt(1);
        } catch (SQLException e) { e.printStackTrace(); }
        return count;
    }
}