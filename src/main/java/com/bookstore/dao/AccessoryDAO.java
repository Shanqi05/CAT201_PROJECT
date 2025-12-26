package com.bookstore.dao;

import com.bookstore.model.Accessory;
import com.bookstore.util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AccessoryDAO {

    // 1. 添加 (你原本写的)
    public boolean addAccessory(Accessory accessory) {
        boolean isSuccess = false;
        String sql = "INSERT INTO accessories (title, category, price, image_path, status) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, accessory.getTitle());
            ps.setString(2, accessory.getCategory());
            ps.setDouble(3, accessory.getPrice());
            ps.setString(4, accessory.getImagePath());
            ps.setString(5, "Active");

            int row = ps.executeUpdate();
            if (row > 0) isSuccess = true;

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return isSuccess;
    }

    // 2. >>> 新增: 获取所有配件列表 <<<
    public List<Accessory> getAllAccessories() {
        List<Accessory> list = new ArrayList<>();
        String sql = "SELECT * FROM accessories ORDER BY id DESC"; // 倒序排列，新的在前面

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Accessory acc = new Accessory();
                acc.setId(rs.getInt("id"));
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

    // 3. >>> 新增: 根据ID删除 <<<
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
}