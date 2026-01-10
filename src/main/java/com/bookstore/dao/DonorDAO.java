package com.bookstore.dao;

import com.bookstore.model.Donor;
import com.bookstore.util.DBConnection;
import java.sql.*;

public class DonorDAO {

    /**
     * Saves a donor. If the email already exists, it updates the name/phone
     * to the latest info provided. (Upsert logic)
     */
    public boolean saveDonor(Donor donor) {
        String sql = "INSERT INTO donors (donor_email, donor_name, donor_phone) VALUES (?, ?, ?) " +
                "ON CONFLICT (donor_email) DO UPDATE SET donor_name = EXCLUDED.donor_name, donor_phone = EXCLUDED.donor_phone";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, donor.getDonorEmail());
            ps.setString(2, donor.getDonorName());
            ps.setString(3, donor.getDonorPhone());

            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}