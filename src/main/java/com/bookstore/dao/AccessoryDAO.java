package com.bookstore.dao;

import com.bookstore.model.Accessory;
import com.bookstore.util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AccessoryDAO {

    public boolean addAccessory(Accessory accessory) {
        String sql = "INSERT INTO accessories (title, category, price, image_path, status) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, accessory.getTitle());
            ps.setString(2, accessory.getCategory());
            ps.setDouble(3, accessory.getPrice());
            ps.setString(4, accessory.getImagePath());
            ps.setString(5, "Active");
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
                list.add(acc);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public int getTotalAccessoriesCount() {
        int count = 0;
        String sql = "SELECT COUNT(*) FROM accessories";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                count = rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return count;
    }
}