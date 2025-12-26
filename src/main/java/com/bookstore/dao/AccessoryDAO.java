package com.bookstore.dao;

import com.bookstore.model.Accessory;
import com.bookstore.util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AccessoryDAO {

    // 1. Add a new accessory
    public boolean addAccessory(Accessory accessory) {
        boolean isSuccess = false;
        String sql = "INSERT INTO accessories (title, category, price, image_path, status) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, accessory.getTitle());
            ps.setString(2, accessory.getCategory());
            ps.setDouble(3, accessory.getPrice());
            ps.setString(4, accessory.getImagePath());
            ps.setString(5, "Active"); // Default status

            int row = ps.executeUpdate();
            if (row > 0) isSuccess = true;

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return isSuccess;
    }

    // 2. Retrieve all accessories list
    public List<Accessory> getAllAccessories() {
        List<Accessory> list = new ArrayList<>();
        // Sort by ID descending, so the newest items appear first
        String sql = "SELECT * FROM accessories ORDER BY id DESC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Accessory acc = new Accessory();
                acc.setId(rs.getInt("id"));
                acc.setTitle(rs.getString("title"));
                acc.setCategory(rs.getString("category"));
                acc.setPrice(rs.getDouble("price"));
                // Important: Maps database 'image_path' to Java 'imagePath'
                acc.setImagePath(rs.getString("image_path"));
                acc.setStatus(rs.getString("status"));
                list.add(acc);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    // 3. Delete accessory by ID
    public boolean deleteAccessory(int id) {
        boolean isSuccess = false;
        String sql = "DELETE FROM accessories WHERE id = ?";

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

    // 4. Get total count of accessories (Required for Dashboard display)
    public int getTotalAccessoriesCount() {
        int count = 0;
        String sql = "SELECT COUNT(*) FROM accessories";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                count = rs.getInt(1); // Get the result from the first column
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return count;
    }
}