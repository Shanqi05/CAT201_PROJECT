package com.bookstore.controller;

import com.bookstore.dao.AccessoryDAO;
import com.bookstore.dao.DashboardDAO;
import com.bookstore.model.Book;
import com.bookstore.model.Accessory;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/dashboard-stats")
public class DashboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            DashboardDAO dashboardDao = new DashboardDAO();
            AccessoryDAO accessoryDao = new AccessoryDAO();

            // 1. Fetch Stats & Books
            DashboardDAO.DashboardStats stats = dashboardDao.getStats();
            List<Book> recentBooks = dashboardDao.getRecentBooks();

            // [NEW] 2. Fetch Recent Accessories
            List<Accessory> recentAccessories = dashboardDao.getRecentAccessories();

            // 3. Get total accessory count (for stats card)
            int totalAccessories = accessoryDao.getTotalAccessoriesCount();
            stats.setTotalAccessories(totalAccessories); // Ensure stats object has this count

            // 4. Combine data
            Map<String, Object> result = new HashMap<>();
            result.put("stats", stats);
            result.put("recentBooks", recentBooks);
            result.put("recentAccessories", recentAccessories); // [NEW] Send to frontend

            // 5. Send JSON
            Gson gson = new Gson();
            response.getWriter().write(gson.toJson(result));

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Error fetching dashboard data\"}");
        }
    }
}