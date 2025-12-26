package com.bookstore.dao;

import com.bookstore.model.Accessory;
import com.bookstore.util.DBConnection; // 确保这里指向你真实的 DBConnection 类
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class AccessoryDAO {

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
            if (row > 0) {
                isSuccess = true;
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return isSuccess;
    }
}