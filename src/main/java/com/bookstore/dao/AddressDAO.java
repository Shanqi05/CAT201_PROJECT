package com.bookstore.dao;

import com.bookstore.model.Address;
import com.bookstore.util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AddressDAO {

    // 1. Add new address
    public boolean addAddress(Address address) {
        String sql = "INSERT INTO addresses (user_id, house_no, street, postcode, city, state) VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, address.getUserId());
            ps.setString(2, address.getHouseNo());
            ps.setString(3, address.getStreet());
            ps.setString(4, address.getPostcode());
            ps.setString(5, address.getCity());
            ps.setString(6, address.getState());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // 2. Get all addresses for a specific user
    public List<Address> getAddressesByUserId(int userId) {
        List<Address> list = new ArrayList<>();
        String sql = "SELECT * FROM addresses WHERE user_id = ? ORDER BY created_at DESC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Address addr = new Address();
                    addr.setAddressId(rs.getInt("address_id"));
                    addr.setUserId(rs.getInt("user_id"));
                    addr.setHouseNo(rs.getString("house_no"));
                    addr.setStreet(rs.getString("street"));
                    addr.setPostcode(rs.getString("postcode"));
                    addr.setCity(rs.getString("city"));
                    addr.setState(rs.getString("state"));
                    addr.setCreatedAt(rs.getTimestamp("created_at"));
                    list.add(addr);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
}